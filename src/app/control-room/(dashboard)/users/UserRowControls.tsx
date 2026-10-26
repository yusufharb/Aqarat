'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserSuspensionAction, assignRoleAction, revokeRoleAction } from './actions';
import type { UserRole } from '@/lib/types';
import { Shield, ShieldAlert, UserCheck, UserX, Plus } from 'lucide-react';

interface UserRowControlsProps {
  userId: string;
  isSuspended: boolean;
  currentRoles: UserRole[];
}

export function UserRowControls({ userId, isSuspended, currentRoles }: UserRowControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggleSuspend = () => {
    const actionText = isSuspended ? 'تفعيل الحساب' : 'تعليق الحساب مؤقتاً';
    if (!confirm(`هل أنت متأكد من ${actionText}؟`)) return;

    startTransition(async () => {
      await toggleUserSuspensionAction(userId, isSuspended);
      router.refresh();
    });
  };

  const handleAddRole = (role: UserRole) => {
    startTransition(async () => {
      await assignRoleAction(userId, role);
      router.refresh();
    });
  };

  const handleRemoveRole = (role: UserRole) => {
    if (currentRoles.length <= 1) {
      alert('يجب أن يمتلك المستخدم دوراً واحداً على الأقل.');
      return;
    }
    startTransition(async () => {
      await revokeRoleAction(userId, role);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Suspension toggle button */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggleSuspend}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
          isSuspended
            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
            : 'bg-red-100 hover:bg-red-200 text-red-800'
        }`}
      >
        {isSuspended ? (
          <>
            <UserCheck className="w-3.5 h-3.5" />
            <span>إلغاء التعليق</span>
          </>
        ) : (
          <>
            <UserX className="w-3.5 h-3.5" />
            <span>تعليق الحساب</span>
          </>
        )}
      </button>

      {/* Role Manager dropdown/buttons */}
      {!currentRoles.includes('buyer') && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAddRole('buyer')}
          className="px-2 py-1 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-lg text-[11px] font-bold"
          title="إضافة دور مشتري"
        >
          + مشتري
        </button>
      )}

      {!currentRoles.includes('seller') && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAddRole('seller')}
          className="px-2 py-1 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-lg text-[11px] font-bold"
          title="إضافة دور بائع"
        >
          + بائع
        </button>
      )}
    </div>
  );
}
