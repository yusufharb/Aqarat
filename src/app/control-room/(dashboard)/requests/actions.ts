'use server';

import { revalidatePath } from 'next/cache';
import { getDataRepository } from '@/lib/data';
import { getCurrentSession } from '@/lib/auth/session';
import type {
  SellerRequestStatus,
  BuyerRequestStatus,
  BuyerMatchedListing,
} from '@/lib/types';

async function checkStaffAuth() {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('غير مصرح لك بالوصول: يرجى تسجيل الدخول أولاً.');
  }
  const staffRoles = [
    'admin',
    'system_admin',
    'operations',
    'finance_reviewer',
    'legal_reviewer',
    'publisher',
  ];
  const isStaff = session.roles.some((r) => staffRoles.includes(r));
  if (!isStaff) {
    throw new Error('غير مصرح لك بالوصول: يتطلب صلاحيات طاقم العمل أو الإدارة.');
  }
  return session;
}

export async function updateSellerRequestStatusAction(
  id: string,
  status: SellerRequestStatus,
  adminNotes?: string,
  rejectionReason?: string
) {
  try {
    const session = await checkStaffAuth();
    const repo = getDataRepository();
    const updated = await repo.updateSellerRequestStatus(
      id,
      status,
      adminNotes,
      rejectionReason,
      session.userId
    );
    revalidatePath('/control-room/requests');
    return { success: true, request: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث حالة طلب البائع.';
    return { success: false, error: message };
  }
}

export async function convertSellerRequestToCaseAction(requestId: string) {
  try {
    const session = await checkStaffAuth();
    const repo = getDataRepository();
    const result = await repo.convertSellerRequestToCase(requestId, session.userId);
    revalidatePath('/control-room/requests');
    revalidatePath('/control-room/cases');
    return { success: true, caseId: result.caseId, request: result.request };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تحويل الطلب إلى ملف دراسة.';
    return { success: false, error: message };
  }
}

export async function updateBuyerRequestStatusAction(
  id: string,
  status: BuyerRequestStatus,
  adminNotes?: string,
  rejectionReason?: string
) {
  try {
    const session = await checkStaffAuth();
    const repo = getDataRepository();
    const updated = await repo.updateBuyerRequestStatus(
      id,
      status,
      adminNotes,
      rejectionReason,
      session.userId
    );
    revalidatePath('/control-room/requests');
    return { success: true, request: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث حالة طلب المشتري.';
    return { success: false, error: message };
  }
}

export async function convertBuyerRequestToDealAction(
  requestId: string,
  targetCaseId: string
) {
  try {
    const session = await checkStaffAuth();
    const repo = getDataRepository();
    const result = await repo.convertBuyerRequestToDeal(
      requestId,
      targetCaseId,
      session.userId
    );
    revalidatePath('/control-room/requests');
    revalidatePath('/control-room/deals');
    return { success: true, dealId: result.dealId, request: result.request };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تحويل طلب المشتري إلى صفقة.';
    return { success: false, error: message };
  }
}

export async function getSmartMatchesForBuyerAction(
  requestId: string
): Promise<{ success: boolean; matches?: BuyerMatchedListing[]; error?: string }> {
  try {
    await checkStaffAuth();
    const repo = getDataRepository();
    const matches = await repo.matchListingsForBuyerRequest(requestId);
    return { success: true, matches };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء فحص المطابقات الذكية.';
    return { success: false, error: message };
  }
}
