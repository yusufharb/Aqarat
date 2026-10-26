import React from 'react';
import Link from 'next/link';

export interface AlertBannerProps {
  title: string;
  description?: string;
  badgeText?: string;
  actionText?: string;
  actionHref?: string;
  variant?: 'brand' | 'amber' | 'blue';
  icon?: React.ReactNode;
}

export function AlertBanner({
  title,
  description,
  badgeText,
  actionText,
  actionHref,
  variant = 'brand',
  icon,
}: AlertBannerProps) {
  const styles = {
    brand: 'bg-brand-900 text-white border-brand-800',
    amber: 'bg-amber-50 text-amber-950 border-amber-200',
    blue: 'bg-surface-900 text-white border-surface-800',
  };

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${styles[variant]}`}
    >
      <div className="flex items-start sm:items-center gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-xl">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            {badgeText && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {badgeText}
              </span>
            )}
            <h4 className="font-bold text-sm sm:text-base leading-tight">{title}</h4>
          </div>
          {description && (
            <p className="text-xs opacity-80 leading-relaxed max-w-2xl">{description}</p>
          )}
        </div>
      </div>

      {actionText && actionHref && (
        <div className="shrink-0 self-end md:self-center">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 bg-white text-surface-900 hover:bg-surface-100 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>{actionText}</span>
            <span>←</span>
          </Link>
        </div>
      )}
    </div>
  );
}
