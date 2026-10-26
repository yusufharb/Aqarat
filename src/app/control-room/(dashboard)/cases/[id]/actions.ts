'use server';

import { revalidatePath } from 'next/cache';
import { getDataRepository } from '@/lib/data';
import { getCurrentSession, requireRole } from '@/lib/auth/session';
import { validateCaseTransition } from '@/lib/workflow/transitions';
import { evaluatePublicationGates } from '@/lib/workflow/publishing-gates';
import type {
  CaseStatus,
  LegalVerdict,
  DeveloperAssignmentStatus,
  VerificationStatus,
  FeeBearerType,
} from '@/lib/types';

export async function verifyDocumentAction(
  caseId: string,
  docId: string,
  status: VerificationStatus,
  rejectionReason?: string
) {
  const session = await requireRole([
    'admin',
    'system_admin',
    'operations',
    'finance_reviewer',
    'legal_reviewer',
  ]);
  const repo = getDataRepository();

  const doc = await repo.updateDocumentStatus(docId, status, session.userId, rejectionReason);

  await repo.logAuditEvent({
    entity_name: 'case_documents',
    entity_id: docId,
    action: `DOCUMENT_${status.toUpperCase()}`,
    actor_id: session.userId,
    old_values: null,
    new_values: { status, rejectionReason },
    ip_address: '127.0.0.1',
  });

  revalidatePath(`/control-room/cases/${caseId}`);
  return { success: true, doc };
}

export async function saveFinancialReviewAction(
  caseId: string,
  data: {
    verifiedPaidAmount: number;
    verifiedRemainingAmount: number;
    verifiedOverdueAmount: number;
    developerTransferFee: number;
    feeBearer: FeeBearerType;
    sourceDescription: string;
    notes?: string;
  }
) {
  const session = await requireRole(['admin', 'system_admin', 'finance_reviewer', 'operations']);
  const repo = getDataRepository();

  const review = await repo.saveFinancialReview({
    case_id: caseId,
    verified_paid_amount: {
      amount: data.verifiedPaidAmount,
      confidence: 'confirmed_by_documents',
      source_description: data.sourceDescription || 'كشف حساب معتمد من المطور',
      verified_at: new Date().toISOString(),
      verified_by: session.userId,
    },
    verified_remaining_amount: {
      amount: data.verifiedRemainingAmount,
      confidence: 'confirmed_by_documents',
      source_description: 'جدول أقساط المطور المتبقية',
      verified_at: new Date().toISOString(),
      verified_by: session.userId,
    },
    verified_overdue_amount: data.verifiedOverdueAmount > 0
      ? {
          amount: data.verifiedOverdueAmount,
          confidence: 'confirmed_by_documents',
          source_description: 'متأخرات وغرامات مسجلة',
          verified_at: new Date().toISOString(),
          verified_by: session.userId,
        }
      : null,
    developer_transfer_fee: data.developerTransferFee > 0
      ? {
          amount: data.developerTransferFee,
          confidence: 'confirmed_by_documents',
          source_description: 'رسوم تنازل الشركة المطورة',
          verified_at: new Date().toISOString(),
          verified_by: session.userId,
        }
      : null,
    fee_bearer: data.feeBearer,
    reviewer_id: session.userId,
    reviewer_notes: data.notes || null,
    reviewed_at: new Date().toISOString(),
  });

  await repo.logAuditEvent({
    entity_name: 'financial_reviews',
    entity_id: caseId,
    action: 'FINANCIAL_REVIEW_SAVED',
    actor_id: session.userId,
    old_values: null,
    new_values: data,
    ip_address: '127.0.0.1',
  });

  revalidatePath(`/control-room/cases/${caseId}`);
  return { success: true, review };
}

export async function saveLegalReviewAction(
  caseId: string,
  data: {
    legalVerdict: LegalVerdict;
    developerStatus: DeveloperAssignmentStatus;
    conditions: string[];
    notes?: string;
  }
) {
  const session = await requireRole(['admin', 'system_admin', 'legal_reviewer', 'operations']);
  const repo = getDataRepository();

  const review = await repo.saveLegalReview({
    case_id: caseId,
    legal_verdict: data.legalVerdict,
    developer_assignment_status: data.developerStatus,
    conditions_checklist: data.conditions,
    legal_notes: data.notes || null,
    reviewer_id: session.userId,
    reviewed_at: new Date().toISOString(),
  });

  await repo.logAuditEvent({
    entity_name: 'legal_reviews',
    entity_id: caseId,
    action: 'LEGAL_REVIEW_SAVED',
    actor_id: session.userId,
    old_values: null,
    new_values: data,
    ip_address: '127.0.0.1',
  });

  revalidatePath(`/control-room/cases/${caseId}`);
  return { success: true, review };
}

export async function evaluateAndPublishAction(caseId: string) {
  const session = await requireRole(['admin', 'system_admin', 'publisher']);
  const repo = getDataRepository();

  const c = await repo.getCaseById(caseId);
  if (!c) throw new Error('Case not found');

  const property = await repo.getPropertyById(c.property_id);
  if (!property) throw new Error('Property not found');

  const contract = await repo.getContractByPropertyId(property.id);
  if (!contract) throw new Error('Contract not found');

  const documents = await repo.getDocumentsByCaseId(c.id);
  const financialReview = await repo.getFinancialReview(c.id);
  const legalReview = await repo.getLegalReview(c.id);

  const evaluation = evaluatePublicationGates({
    assignmentCase: c,
    property,
    contract,
    documents,
    financialReview,
    legalReview,
    isPublisherRole: session.roles.some((r) => ['publisher', 'admin', 'system_admin'].includes(r)),
  });

  await repo.savePublicationGates({
    case_id: c.id,
    ...evaluation.gates,
    published_by: evaluation.allPassed ? session.userId : null,
    published_at: evaluation.allPassed ? new Date().toISOString() : null,
  });

  if (!evaluation.allPassed) {
    return {
      success: false,
      failures: evaluation.failures,
      gates: evaluation.gates,
    };
  }

  // Transition to published
  await repo.updateCase(c.id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });

  await repo.logAuditEvent({
    entity_name: 'assignment_cases',
    entity_id: c.id,
    action: 'CASE_PUBLISHED',
    actor_id: session.userId,
    old_values: { status: c.status },
    new_values: { status: 'published', gatesPassed: 9 },
    ip_address: '127.0.0.1',
  });

  revalidatePath(`/control-room/cases/${caseId}`);
  revalidatePath('/units');
  return { success: true, failures: [] };
}

export async function transitionCaseAction(
  caseId: string,
  targetStatus: CaseStatus,
  reason?: string
) {
  const session = await getCurrentSession();
  if (!session) throw new Error('UNAUTHORIZED');

  const repo = getDataRepository();
  const c = await repo.getCaseById(caseId);
  if (!c) throw new Error('Case not found');

  const validation = validateCaseTransition(c.status, targetStatus, session.roles);
  if (!validation.allowed) {
    return { success: false, error: validation.reason };
  }

  const updated = await repo.updateCase(c.id, {
    status: targetStatus,
    seller_notes: reason ? `${c.seller_notes || ''} [ملاحظة الإدارة: ${reason}]` : c.seller_notes,
  });

  await repo.logAuditEvent({
    entity_name: 'assignment_cases',
    entity_id: c.id,
    action: `STATUS_TRANSITION_TO_${targetStatus.toUpperCase()}`,
    actor_id: session.userId,
    old_values: { status: c.status },
    new_values: { status: targetStatus, reason },
    ip_address: '127.0.0.1',
  });

  revalidatePath(`/control-room/cases/${caseId}`);
  return { success: true, updated };
}
