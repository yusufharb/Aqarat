import React from 'react';
import Link from 'next/link';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  actionLink?: {
    label: string;
    href: string;
  };
  highlightColor?: 'brand' | 'blue' | 'amber' | 'purple';
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  actionLink,
  highlightColor = 'brand',
}: StatCardProps) {
  const iconBg = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200/60',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-surface-200 shadow-xs hover:border-surface-300 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-surface-500 block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
            {value}
          </div>
        </div>

        {icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${iconBg[highlightColor]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between text-xs border-t border-surface-100">
        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                trend.isPositive !== false
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              <span>{trend.isPositive !== false ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </span>
          )}
          {subtitle && <span className="text-surface-400 text-[11px]">{subtitle}</span>}
        </div>

        {actionLink && (
          <Link
            href={actionLink.href}
            className="text-[11px] font-bold text-brand-700 hover:text-brand-800 transition-colors"
          >
            {actionLink.label} ←
          </Link>
        )}
      </div>
    </div>
  );
}
