import { CaseStatus, UserRole, ALLOWED_STATUS_TRANSITIONS } from '../types';

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
}

// Maps which roles are authorized to execute transitions to a target status
const ROLE_PERMISSIONS_FOR_STATUS: Record<CaseStatus, UserRole[]> = {
  draft: ['seller', 'admin'],
  submitted: ['seller', 'admin'],
  screening: ['operations', 'admin', 'system_admin'],
  documents_pending: ['operations', 'admin', 'system_admin'],
  in_review: ['operations', 'finance_reviewer', 'legal_reviewer', 'admin', 'system_admin'],
  ready_for_approval: ['operations', 'finance_reviewer', 'legal_reviewer', 'admin', 'system_admin'],
  approved: ['publisher', 'admin', 'system_admin'],
  published: ['publisher', 'admin', 'system_admin'],
  paused: ['seller', 'operations', 'publisher', 'admin', 'system_admin'],
  closed: ['operations', 'publisher', 'admin', 'system_admin'],
  rejected: ['operations', 'finance_reviewer', 'legal_reviewer', 'admin', 'system_admin'],
};

export function validateCaseTransition(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus,
  userRoles: UserRole[]
): TransitionValidationResult {
  // 1. Check if the transition is in the allowed state machine map
  const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowedNextStatuses.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `انتقال غير مسموح من حالة "${currentStatus}" إلى "${targetStatus}".`,
    };
  }

  // 2. Check if user has one of the authorized roles for the target status
  const requiredRoles = ROLE_PERMISSIONS_FOR_STATUS[targetStatus] || [];
  const hasAuthorizedRole = userRoles.some((role) => requiredRoles.includes(role));

  if (!hasAuthorizedRole) {
    return {
      allowed: false,
      reason: `ليس لديك الصلاحية لتغيير الحالة إلى "${targetStatus}". الأدوار المطلوبة: ${requiredRoles.join(', ')}.`,
    };
  }

  return { allowed: true };
}
