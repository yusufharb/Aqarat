'use server';

import { revalidatePath } from 'next/cache';
import { getDataRepository } from '@/lib/data';
import { requireRole } from '@/lib/auth/session';
import type { UserRole } from '@/lib/types';

export async function toggleUserSuspensionAction(userId: string, currentSuspended: boolean) {
  const session = await requireRole(['admin', 'system_admin']);
  const repo = getDataRepository();

  const newStatus = !currentSuspended;
  const updated = await repo.updateUserStatus(userId, newStatus);

  await repo.logAuditEvent({
    entity_name: 'profiles',
    entity_id: userId,
    action: newStatus ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
    actor_id: session.userId,
    old_values: { is_suspended: currentSuspended },
    new_values: { is_suspended: newStatus },
    ip_address: '127.0.0.1',
  });

  revalidatePath('/control-room/users');
  return { success: true, updated };
}

export async function assignRoleAction(userId: string, role: UserRole) {
  const session = await requireRole(['admin', 'system_admin']);
  const repo = getDataRepository();

  const assignment = await repo.assignUserRole(userId, role, session.userId);

  await repo.logAuditEvent({
    entity_name: 'user_roles',
    entity_id: userId,
    action: 'ROLE_ASSIGNED',
    actor_id: session.userId,
    old_values: null,
    new_values: { role, assigned_by: session.userId },
    ip_address: '127.0.0.1',
  });

  revalidatePath('/control-room/users');
  return { success: true, assignment };
}

export async function revokeRoleAction(userId: string, role: UserRole) {
  const session = await requireRole(['admin', 'system_admin']);
  const repo = getDataRepository();

  const res = await repo.revokeUserRole(userId, role);

  await repo.logAuditEvent({
    entity_name: 'user_roles',
    entity_id: userId,
    action: 'ROLE_REVOKED',
    actor_id: session.userId,
    old_values: { role },
    new_values: null,
    ip_address: '127.0.0.1',
  });

  revalidatePath('/control-room/users');
  return { success: res };
}

export async function resolveRoleRequestAction(requestId: string, status: 'approved' | 'rejected') {
  const session = await requireRole(['admin', 'system_admin']);
  const repo = getDataRepository();

  const resolved = await repo.resolveRoleRequest(requestId, status, session.userId);

  await repo.logAuditEvent({
    entity_name: 'role_requests',
    entity_id: requestId,
    action: `ROLE_REQUEST_${status.toUpperCase()}`,
    actor_id: session.userId,
    old_values: { status: 'pending' },
    new_values: { status, reviewer_id: session.userId },
    ip_address: '127.0.0.1',
  });

  revalidatePath('/control-room/users');
  return { success: true, resolved };
}
