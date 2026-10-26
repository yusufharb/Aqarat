import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-10 sm:p-14 text-center max-w-lg mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-3xl mx-auto mb-4 border border-surface-200/80">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-surface-900 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-surface-500 leading-relaxed mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="md">
            {actionText}
          </Button>
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
