import React from 'react';
import { CaseStatus, DealStatus } from '@/lib/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'outline' | 'purple';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-surface-100 text-surface-800 border-surface-200',
    brand: 'bg-brand-50 text-brand-800 border-brand-200/80',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    outline: 'bg-white text-surface-700 border-surface-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const map: Record<CaseStatus, { label: string; variant: BadgeProps['variant'] }> = {
    draft: { label: 'مسودة قيد الإكمال', variant: 'neutral' },
    submitted: { label: 'تم الإرسال للمراجعة', variant: 'brand' },
    screening: { label: 'قيد الفرز الأولي', variant: 'brand' },
    documents_pending: { label: 'مستندات مطلوبة', variant: 'warning' },
    in_review: { label: 'قيد المراجعة الشاملة', variant: 'warning' },
    ready_for_approval: { label: 'جاهز للاعتماد', variant: 'brand' },
    approved: { label: 'معتمد للنشر', variant: 'success' },
    published: { label: 'منشور بالكتالوج', variant: 'success' },
    paused: { label: 'متوقف مؤقتاً', variant: 'warning' },
    closed: { label: 'مغلق / منتهي', variant: 'neutral' },
    rejected: { label: 'مرفوض', variant: 'error' },
  };

  const current = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={current.variant}>{current.label}</Badge>;
}

export function DealStatusBadge({ status }: { status: DealStatus }) {
  const map: Record<DealStatus, { label: string; variant: BadgeProps['variant'] }> = {
    lead: { label: 'اهتمام جديد', variant: 'brand' },
    buyer_qualified: { label: 'مشتري مؤهل', variant: 'brand' },
    viewing_or_discussion: { label: 'معاينة ومناقشة', variant: 'purple' },
    offer_made: { label: 'تم تقديم عرض', variant: 'purple' },
    offer_accepted: { label: 'تم قبول العرض', variant: 'success' },
    developer_approval_pending: { label: 'بانتظار موافقة المطور', variant: 'warning' },
    transfer_in_progress: { label: 'جاري التنازل بالمقر', variant: 'brand' },
    completed: { label: 'تم التنازل بنجاح', variant: 'success' },
    cancelled: { label: 'ملغاة', variant: 'neutral' },
    failed: { label: 'تعثرت', variant: 'error' },
  };

  const current = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={current.variant}>{current.label}</Badge>;
}
