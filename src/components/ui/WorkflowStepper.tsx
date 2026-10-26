import React from 'react';
import { CaseStatus } from '@/lib/types';

export function WorkflowStepper({ currentStatus }: { currentStatus: CaseStatus }) {
  const steps = [
    { key: 'draft', label: 'المسودة' },
    { key: 'submitted', label: 'الإرسال' },
    { key: 'screening', label: 'الفرز والوثائق' },
    { key: 'in_review', label: 'المراجعة والتدقيق' },
    { key: 'approved', label: 'الاعتماد' },
    { key: 'published', label: 'النشر بالكتالوج' },
  ];

  // Map case statuses to step index (0 to 5)
  const statusRank: Record<CaseStatus, number> = {
    draft: 0,
    submitted: 1,
    screening: 2,
    documents_pending: 2,
    in_review: 3,
    ready_for_approval: 3,
    approved: 4,
    published: 5,
    paused: 5,
    closed: 5,
    rejected: -1,
  };

  const currentIndex = statusRank[currentStatus] ?? 0;
  const isRejected = currentStatus === 'rejected';

  if (isRejected) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2">
        <span>❌</span>
        <span>تم رفض الطلب لعدم استيفاء الشروط القانونية أو شروط المطور.</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-surface-200 -z-0" />
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 -z-0"
          style={{ width: `${(Math.min(currentIndex, steps.length - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border-2 ${
                  isCurrent
                    ? 'bg-brand-700 text-white border-brand-800 ring-4 ring-brand-100'
                    : isCompleted
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-surface-400 border-surface-300'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                  isCurrent ? 'text-brand-900 font-bold' : isCompleted ? 'text-surface-700' : 'text-surface-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
