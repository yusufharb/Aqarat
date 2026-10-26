'use client';

import { useState } from 'react';
import { submitBuyerInquiryAction } from './actions';
import Link from 'next/link';

interface InquiryFormProps {
  caseId: string;
}

export function InquiryForm({ caseId }: InquiryFormProps) {
  const [budgetCash, setBudgetCash] = useState<string>('');
  const [comfortableInstallment, setComfortableInstallment] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requireAuth, setRequireAuth] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setRequireAuth(false);

    try {
      const res = await submitBuyerInquiryAction({
        caseId,
        budgetCash: budgetCash ? Number(budgetCash) : null,
        comfortableInstallment: comfortableInstallment ? Number(comfortableInstallment) : null,
        message: message || null,
      });

      if (!res.success) {
        if (res.requireAuth) {
          setRequireAuth(true);
        }
        setErrorMsg(res.error || 'فشل إرسال الطلب.');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ في الاتصال.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
          ✓
        </div>
        <h4 className="text-base font-bold text-emerald-950 mb-1">
          تم استلام طلب اهتمامك بنجاح!
        </h4>
        <p className="text-xs text-emerald-800 leading-relaxed mb-4">
          تم توثيق طلبك وإدراجه في لوحة تحكم المشتري. سيقوم فريق المراجعة بالتواصل معك للتنسيق وحجز موعد التنازل بمقر المطور.
        </p>
        <Link
          href="/buyer/dashboard"
          className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          متابعة الطلب في لوحة المشتري ←
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs sticky top-28">
      <h3 className="text-lg font-bold text-surface-900 mb-2">
        هل هذه الفرصة مناسبة لك؟
      </h3>
      <p className="text-xs text-surface-500 mb-6 leading-relaxed">
        سجل اهتمامك الآن للتواصل معك وترتيب استكمال الاستفسارات ومرافقتك في إجراءات التنازل بمقر المطور.
      </p>

      {errorMsg && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium">
          {errorMsg}
          {requireAuth && (
            <div className="mt-2">
              <Link
                href={`/auth/login?returnUrl=/units/${caseId}`}
                className="inline-block bg-brand-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-brand-800"
              >
                تسجيل الدخول كـ مشتري
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-surface-700 mb-1">
            الميزانية النقدية المتاحة (كاش بالجنيه)
          </label>
          <input
            type="number"
            value={budgetCash}
            onChange={(e) => setBudgetCash(e.target.value)}
            placeholder="مثال: 2000000"
            className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-700 mb-1">
            أقصى قسط مريح دورياً (بالجنيه)
          </label>
          <input
            type="number"
            value={comfortableInstallment}
            onChange={(e) => setComfortableInstallment(e.target.value)}
            placeholder="مثال: 200000"
            className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-700 mb-1">
            ملاحظات أو استفسارات خاصة
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="أي تفاصيل ترغب في التأكد منها قبل المقابلة..."
            className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold py-3.5 rounded-xl shadow-sm transition-colors mt-2 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب اهتمام بالوحدة (مجاناً)'}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-surface-100 text-[11px] text-surface-400 text-center">
        🔒 بياناتك مشفرة ولا يتم مشاركتها إلا مع فريق المراجعة والتشغيل.
      </div>
    </div>
  );
}
