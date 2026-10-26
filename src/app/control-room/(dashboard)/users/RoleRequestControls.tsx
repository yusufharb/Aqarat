'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resolveRoleRequestAction } from './actions';
import { Check, X } from 'lucide-react';

interface RoleRequestControlsProps {
  requestId: string;
}

export function RoleRequestControls({ requestId }: RoleRequestControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleResolve = (status: 'approved' | 'rejected') => {
    startTransition(async () => {
      await resolveRoleRequestAction(requestId, status);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1.5 justify-center">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleResolve('approved')}
        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
      >
        <Check className="w-3.5 h-3.5" />
        <span>موافقة</span>
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleResolve('rejected')}
        className="px-2.5 py-1 bg-surface-200 hover:bg-surface-300 text-surface-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
      >
        <X className="w-3.5 h-3.5" />
        <span>رفض</span>
      </button>
    </div>
  );
}
