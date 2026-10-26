'use server';

import { getCurrentSession } from '@/lib/auth/session';
import { getDataRepository } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export interface SubmitInquiryInput {
  caseId: string;
  budgetCash?: number | null;
  comfortableInstallment?: number | null;
  message?: string | null;
}

export async function submitBuyerInquiryAction(data: SubmitInquiryInput) {
  const session = await getCurrentSession();

  if (!session) {
    return {
      success: false,
      requireAuth: true,
      error: 'يرجى تسجيل الدخول أو إنشاء حساب مشتري للتمكن من تسجيل الاهتمام بالوحدة.',
    };
  }

  if (session.isSuspended) {
    return {
      success: false,
      error: 'هذا الحساب مجمد حالياً. يرجى التواصل مع الدعم الفني.',
    };
  }

  try {
    const repo = getDataRepository();
    const c = await repo.getCaseById(data.caseId);

    if (!c) {
      return {
        success: false,
        error: 'لم يتم العثور على الوحدة المحددة.',
      };
    }

    // 1. Create Lead
    const lead = await repo.createLead({
      case_id: data.caseId,
      buyer_id: session.userId,
      budget_cash: data.budgetCash ? Number(data.budgetCash) : null,
      comfortable_installment: data.comfortableInstallment ? Number(data.comfortableInstallment) : null,
      buyer_message: data.message || null,
    });

    // 2. Create Deal in 'lead' status for the Control Room pipeline
    await repo.createDeal({
      case_id: c.id,
      lead_id: lead.id,
      seller_id: c.seller_id,
      buyer_id: session.userId,
      status: 'lead',
      agreed_cash_amount: data.budgetCash ? Number(data.budgetCash) : null,
      notes: `طلب اهتمام جديد من المشتري ${session.fullName}. رسالة: ${data.message || 'لا توجد ملاحظات إضافية'}`,
    });

    // 3. Log Audit Event
    await repo.logAuditEvent({
      entity_name: 'leads',
      entity_id: lead.id,
      action: 'inquiry_submitted',
      actor_id: session.userId,
      new_values: {
        case_id: data.caseId,
        buyer_id: session.userId,
        budget_cash: data.budgetCash,
      },
    });

    revalidatePath(`/units/${data.caseId}`);
    revalidatePath('/buyer/dashboard');
    revalidatePath('/control-room/deals');

    return {
      success: true,
      leadId: lead.id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'حدث خطأ غير متوقع أثناء إرسال طلب الاهتمام.',
    };
  }
}

export async function toggleSavedListingAction(caseId: string) {
  const session = await getCurrentSession();

  if (!session) {
    return {
      success: false,
      requireAuth: true,
      error: 'يرجى تسجيل الدخول لحفظ هذه الفرصة في قائمتك المفضلة.',
    };
  }

  try {
    const repo = getDataRepository();
    const result = await repo.toggleSavedListing(session.userId, caseId);
    const isSaved = typeof result === 'object' && result !== null && 'saved' in result ? result.saved : Boolean(result);

    revalidatePath(`/units/${caseId}`);
    revalidatePath('/buyer/dashboard');

    return {
      success: true,
      isSaved,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'حدث خطأ أثناء تعديل قائمة المحفوظات.',
    };
  }
}

export async function checkSavedStatusAction(caseId: string) {
  const session = await getCurrentSession();
  if (!session) {
    return { isSaved: false };
  }
  const repo = getDataRepository();
  const isSaved = await repo.isListingSaved(session.userId, caseId);
  return { isSaved };
}
