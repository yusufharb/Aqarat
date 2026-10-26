'use server';

import { loginUser, AuthResult } from '@/lib/auth/session';

export async function adminLoginAction(input: { identifier: string; password: string }): Promise<AuthResult> {
  const result = await loginUser(input);
  if (!result.success) {
    return result;
  }

  // Double check on server that user actually possesses an administrative or reviewer role
  const staffRoles = [
    'admin',
    'system_admin',
    'operations',
    'finance_reviewer',
    'legal_reviewer',
    'publisher',
  ];

  const hasStaffRole = result.user?.roles.some((r) => staffRoles.includes(r));
  if (!hasStaffRole) {
    return {
      success: false,
      error: 'غير مصرح: هذا الحساب لا يمتلك أي صلاحيات إدارية أو رقابية للوصول إلى غرفة التحكم.',
    };
  }

  return {
    success: true,
    redirectTo: '/control-room',
  };
}
