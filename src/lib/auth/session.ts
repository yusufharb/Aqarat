import { cookies } from 'next/headers';
import { getEnvConfig } from '../env';
import { getDataRepository } from '../data';
import { createServerSupabaseClient } from '../supabase/server';
import { createAdminClient } from '../supabase/admin';
import { normalizeEgyptianPhone, validateEmail, validatePassword } from './validation';
import { hashPassword, verifyPassword } from './passwords';
import type { Profile, UserRole, UserRoleAssignment } from '../types';

export interface AuthSession {
  userId: string;
  email: string | null;
  phone: string;
  fullName: string;
  roles: UserRole[];
  isSuspended: boolean;
}

export interface RegisterInput {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: 'buyer' | 'seller';
  acceptTerms: boolean;
}

export interface LoginInput {
  identifier: string; // Email or Egyptian Phone
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AuthSession;
  redirectTo?: string;
}

const SESSION_COOKIE_NAME = 'aqar_auth_session';

// Demo mode credentials store (stored in-memory on server, hashed)
const DEMO_CREDENTIALS: Map<string, { userId: string; passwordHash: string }> = new Map();

// Helper to seed default demo credentials
function initDemoCredentials() {
  if (DEMO_CREDENTIALS.size > 0) return;

  const defaultHash = hashPassword('Password123');

  // Ahmed (Seller)
  DEMO_CREDENTIALS.set('seller.ahmed@example.com', {
    userId: '11111111-1111-4111-8111-111111111111',
    passwordHash: defaultHash,
  });
  DEMO_CREDENTIALS.set('+201000000001', {
    userId: '11111111-1111-4111-8111-111111111111',
    passwordHash: defaultHash,
  });

  // Omar (Buyer)
  DEMO_CREDENTIALS.set('buyer.omar@example.com', {
    userId: '22222222-2222-4222-8222-222222222221',
    passwordHash: defaultHash,
  });
  DEMO_CREDENTIALS.set('+201100000001', {
    userId: '22222222-2222-4222-8222-222222222221',
    passwordHash: defaultHash,
  });

  // Youssef (Admin)
  DEMO_CREDENTIALS.set('admin.youssef@aqarexit.internal', {
    userId: '99999999-9999-4999-8999-999999999995',
    passwordHash: defaultHash,
  });
  DEMO_CREDENTIALS.set('admin@aqarswap.com', {
    userId: '99999999-9999-4999-8999-999999999995',
    passwordHash: defaultHash,
  });
  DEMO_CREDENTIALS.set('+201099999995', {
    userId: '99999999-9999-4999-8999-999999999995',
    passwordHash: defaultHash,
  });
}

/**
 * Retrieves the currently authenticated session on the server.
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  const env = getEnvConfig();
  const repo = getDataRepository();
  const cookieStore = await cookies();

  if (env.isDemo) {
    initDemoCredentials();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;

    try {
      const parsed = JSON.parse(sessionCookie);
      if (!parsed.userId) return null;

      const profile = await repo.getProfile(parsed.userId);
      if (!profile) return null;

      if (profile.is_suspended) {
        return null;
      }

      const roleAssignments = await repo.getUserRoles(parsed.userId);
      const roles = roleAssignments.map((r) => r.role);

      return {
        userId: profile.id,
        email: profile.email,
        phone: profile.phone,
        fullName: profile.full_name,
        roles,
        isSuspended: Boolean(profile.is_suspended),
      };
    } catch {
      return null;
    }
  }

  // Supabase Auth (development & production)
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    const profile = await repo.getProfile(user.id);
    if (!profile) return null;

    if (profile.is_suspended) {
      return null;
    }

    const roleAssignments = await repo.getUserRoles(user.id);
    const roles = roleAssignments.map((r) => r.role);

    return {
      userId: profile.id,
      email: profile.email,
      phone: profile.phone,
      fullName: profile.full_name,
      roles,
      isSuspended: Boolean(profile.is_suspended),
    };
  } catch {
    return null;
  }
}

/**
 * Requires an authenticated user or throws/redirects.
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('UNAUTHORIZED: يجب تسجيل الدخول للوصول إلى هذه الصفحة.');
  }
  return session;
}

/**
 * Requires specific role(s) or throws an authorization error.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthSession> {
  const session = await requireAuth();
  const hasRole = session.roles.some((r) => allowedRoles.includes(r));
  if (!hasRole) {
    throw new Error(`FORBIDDEN: لا تملك الصلاحيات الكافية. الصلاحيات المطلوبة: ${allowedRoles.join(', ')}.`);
  }
  return session;
}

/**
 * Handles User Registration with strict server-side validation.
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const repo = getDataRepository();
  const env = getEnvConfig();
  const cookieStore = await cookies();

  // 1. Validate full name
  const fullName = input.fullName?.trim();
  if (!fullName || fullName.length < 3) {
    return { success: false, error: 'الاسم بالكامل مطلوب (3 أحرف على الأقل).' };
  }

  // 2. Normalize and validate phone
  const normalizedPhone = normalizeEgyptianPhone(input.phone);
  if (!normalizedPhone) {
    return {
      success: false,
      error: 'رقم الهاتف المحمول غير صحيح. يجب إدخال رقم مصري صحيح (010, 011, 012, 015).',
    };
  }

  // 3. Validate email
  const email = input.email?.trim().toLowerCase();
  if (!validateEmail(email)) {
    return { success: false, error: 'البريد الإلكتروني غير صحيح.' };
  }

  // 4. Validate password
  if (input.password !== input.passwordConfirm) {
    return { success: false, error: 'كلمتا المرور غير متطابقتين.' };
  }
  const passwordCheck = validatePassword(input.password);
  if (!passwordCheck.valid) {
    return { success: false, error: passwordCheck.error };
  }

  // 5. Terms acceptance
  if (!input.acceptTerms) {
    return { success: false, error: 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.' };
  }

  // 6. Enforce allowed self-registration roles (strictly buyer or seller)
  if (input.role !== 'buyer' && input.role !== 'seller') {
    return {
      success: false,
      error: 'نوع الحساب غير مسموح به. التسجيل المتاح هو بائع أو مشتري فقط.',
    };
  }

  // 7. Check for duplicate phone or email
  const allUsers = await repo.getAllUsers();
  const existingEmail = allUsers.find((u) => u.email?.toLowerCase() === email);
  if (existingEmail) {
    return { success: false, error: 'البريد الإلكتروني مسجل بالفعل.' };
  }
  const existingPhone = allUsers.find(
    (u) => normalizeEgyptianPhone(u.phone) === normalizedPhone
  );
  if (existingPhone) {
    return { success: false, error: 'رقم الهاتف المحمول مسجل بالفعل.' };
  }

  if (env.isDemo) {
    initDemoCredentials();
    const newUserId = crypto.randomUUID();
    const newProfile: Profile = {
      id: newUserId,
      full_name: fullName,
      phone: normalizedPhone,
      email,
      phone_verified: false,
      email_verified: false,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await repo.saveProfile(newProfile);
    await repo.assignUserRole(newUserId, input.role, 'SYSTEM_REGISTER');

    // Store password hash in demo credentials store
    const hash = hashPassword(input.password);
    DEMO_CREDENTIALS.set(email, { userId: newUserId, passwordHash: hash });
    DEMO_CREDENTIALS.set(normalizedPhone, { userId: newUserId, passwordHash: hash });

    // Set HTTP-only session cookie
    cookieStore.set(
      SESSION_COOKIE_NAME,
      JSON.stringify({ userId: newUserId, email, phone: normalizedPhone }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    );

    await repo.logAuditEvent({
      entity_name: 'profiles',
      entity_id: newUserId,
      action: 'USER_REGISTERED',
      actor_id: newUserId,
      old_values: null,
      new_values: { fullName, email, phone: normalizedPhone, role: input.role },
      ip_address: '127.0.0.1',
    });

    return {
      success: true,
      redirectTo: input.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard',
    };
  }

  // Supabase Auth Mode
  try {
    const adminClient = createAdminClient();
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      phone: normalizedPhone,
      password: input.password,
      email_confirm: false,
      phone_confirm: false,
      user_metadata: { full_name: fullName, role: input.role },
    });

    if (authError || !authData.user) {
      return { success: false, error: `فشل التسجيل في قاعدة البيانات: ${authError?.message}` };
    }

    const userId = authData.user.id;
    await repo.saveProfile({
      id: userId,
      full_name: fullName,
      phone: normalizedPhone,
      email,
      phone_verified: false,
      email_verified: false,
      is_suspended: false,
    });
    await repo.assignUserRole(userId, input.role, 'SYSTEM_REGISTER');

    // Sign in user
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

    return {
      success: true,
      redirectTo: input.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `خطأ في الخادم: ${msg}` };
  }
}

/**
 * Handles User Login with identifier (email or phone).
 */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const repo = getDataRepository();
  const env = getEnvConfig();
  const cookieStore = await cookies();

  const identifier = input.identifier?.trim();
  if (!identifier || !input.password) {
    return { success: false, error: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور.' };
  }

  if (env.isDemo) {
    initDemoCredentials();
    const normalized = normalizeEgyptianPhone(identifier) || identifier.toLowerCase();
    const creds = DEMO_CREDENTIALS.get(normalized);

    if (!creds || !verifyPassword(input.password, creds.passwordHash)) {
      return { success: false, error: 'بيانات الدخول غير صحيحة. يرجى التأكد والمحاولة مرة أخرى.' };
    }

    const profile = await repo.getProfile(creds.userId);
    if (!profile) {
      return { success: false, error: 'الملف الشخصي غير موجود.' };
    }

    if (profile.is_suspended) {
      return { success: false, error: 'تم تعليق هذا الحساب مؤقتاً من قبل الإدارة. يرجى التواصل مع الدعم.' };
    }

    const roleAssignments = await repo.getUserRoles(creds.userId);
    const roles = roleAssignments.map((r) => r.role);

    cookieStore.set(
      SESSION_COOKIE_NAME,
      JSON.stringify({ userId: profile.id, email: profile.email, phone: profile.phone }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    // Default redirect based on role
    let redirectTo = '/units';
    if (roles.includes('admin') || roles.includes('system_admin')) {
      redirectTo = '/control-room';
    } else if (roles.includes('seller')) {
      redirectTo = '/seller/dashboard';
    } else if (roles.includes('buyer')) {
      redirectTo = '/buyer/dashboard';
    }

    return { success: true, redirectTo };
  }

  // Supabase Auth Mode
  try {
    const supabase = await createServerSupabaseClient();
    const isEmail = identifier.includes('@');
    const { data, error } = isEmail
      ? await supabase.auth.signInWithPassword({
          email: identifier.toLowerCase(),
          password: input.password,
        })
      : await supabase.auth.signInWithPassword({
          phone: normalizeEgyptianPhone(identifier) || identifier,
          password: input.password,
        });

    if (error || !data.user) {
      return { success: false, error: 'بيانات الاعتماد غير مطابقة أو الحساب غير مفعل.' };
    }

    const profile = await repo.getProfile(data.user.id);
    if (profile?.is_suspended) {
      await supabase.auth.signOut();
      return { success: false, error: 'تم تعليق هذا الحساب. يرجى مراجعة إدارة المنصة.' };
    }

    const roles = (await repo.getUserRoles(data.user.id)).map((r) => r.role);
    let redirectTo = '/units';
    if (roles.includes('admin') || roles.includes('system_admin')) {
      redirectTo = '/control-room';
    } else if (roles.includes('seller')) {
      redirectTo = '/seller/dashboard';
    } else if (roles.includes('buyer')) {
      redirectTo = '/buyer/dashboard';
    }

    return { success: true, redirectTo };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `خطأ في الاتصال: ${msg}` };
  }
}

/**
 * Handles Logout.
 */
export async function logoutUser(): Promise<void> {
  const env = getEnvConfig();
  const cookieStore = await cookies();

  if (env.isDemo) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return;
  }

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error
  }
}
