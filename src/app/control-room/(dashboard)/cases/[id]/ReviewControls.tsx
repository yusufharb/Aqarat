'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  FileCheck,
  DollarSign,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import {
  verifyDocumentAction,
  saveFinancialReviewAction,
  saveLegalReviewAction,
  evaluateAndPublishAction,
  transitionCaseAction,
} from './actions';
import type { CaseStatus, FeeBearerType, LegalVerdict, DeveloperAssignmentStatus } from '@/lib/types';

interface ReviewControlsProps {
  caseId: string;
  currentStatus: CaseStatus;
  allGatesPassed: boolean;
  documents: { id: string; file_name: string; doc_type: string; verification_status: string }[];
  contractDepositPlusInstallments: number;
  contractRemaining: number;
}

export function ReviewControls({
  caseId,
  currentStatus,
  allGatesPassed,
  documents,
  contractDepositPlusInstallments,
  contractRemaining,
}: ReviewControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / drawer state for quick forms
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changesReason, setChangesReason] = useState('');

  // Financial form
  const [finData, setFinData] = useState({
    verifiedPaidAmount: contractDepositPlusInstallments,
    verifiedRemainingAmount: contractRemaining,
    verifiedOverdueAmount: 0,
    developerTransferFee: 0,
    feeBearer: 'seller' as FeeBearerType,
    sourceDescription: 'مطابقة العقد وإيصالات السداد البنكية الصادرة عن المطور',
    notes: 'تمت مطابقة جدول الأقساط الأصلي مع إيصالات السداد وكشف الحساب البنكي.',
  });

  // Legal form
  const [legalData, setLegalData] = useState({
    legalVerdict: 'eligible' as LegalVerdict,
    developerStatus: 'confirmed' as DeveloperAssignmentStatus,
    conditions: ['حضور الطرفين بمقر المطور', 'سداد رسوم التنازل إن وجدت'],
    notes: 'العقد الأصلي سليم ومطابق للشروط ولا توجد موانع قانونية لنقل الملكية.',
  });

  const handleVerifyDoc = (docId: string, status: 'verified' | 'rejected') => {
    startTransition(async () => {
      const res = await verifyDocumentAction(caseId, docId, status);
      if (res.success) {
        setMsg({ type: 'success', text: 'تم تحديث حالة المستند بنجاح.' });
        router.refresh();
      }
    });
  };

  const handleSaveFinance = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveFinancialReviewAction(caseId, finData);
      if (res.success) {
        setShowFinanceModal(false);
        setMsg({ type: 'success', text: 'تم اعتماد وتوثيق المراجعة المالية بنجاح.' });
        router.refresh();
      }
    });
  };

  const handleSaveLegal = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveLegalReviewAction(caseId, legalData);
      if (res.success) {
        setShowLegalModal(false);
        setMsg({ type: 'success', text: 'تم اعتماد وتوثيق المراجعة القانونية بنجاح.' });
        router.refresh();
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      const res = await evaluateAndPublishAction(caseId);
      if (res.success) {
        setMsg({ type: 'success', text: 'تم اجتياز جميع البوابات ونشر الوحدة بالكتالوج العام بنجاح!' });
        router.refresh();
      } else {
        setMsg({
          type: 'error',
          text: `فشل استيفاء بوابات النشر: ${res.failures.join(' | ')}`,
        });
      }
    });
  };

  const handleRequestChanges = () => {
    if (!changesReason.trim()) return;
    startTransition(async () => {
      const res = await transitionCaseAction(caseId, 'documents_pending', changesReason);
      if (res.success) {
        setShowRequestChangesModal(false);
        setMsg({ type: 'success', text: 'تم إرجاع الطلب للبائع لاستكمال المستندات المطلوبة.' });
        router.refresh();
      } else {
        setMsg({ type: 'error', text: res.error || 'فشل تغيير الحالة.' });
      }
    });
  };

  const handleReject = () => {
    if (!confirm('هل أنت متأكد من رفض هذا الطلب نهائياً؟')) return;
    startTransition(async () => {
      const res = await transitionCaseAction(caseId, 'rejected', 'الطلب غير مطابق لشروط التنازل.');
      if (res.success) {
        setMsg({ type: 'success', text: 'تم رفض الطلب وتسجيل السبب بسجل التدقيق.' });
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="text-surface-400 hover:text-surface-700">
            ✕
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-surface-700 block">إجراءات المراجعة والاعتماد:</span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowFinanceModal(true)}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span>تسجيل المراجعة المالية</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLegalModal(true)}
            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span>تسجيل المراجعة القانونية</span>
          </button>
        </div>

        {/* Publish Button */}
        {currentStatus !== 'published' ? (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending || !allGatesPassed}
            className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-black py-3 rounded-2xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isPending ? 'جاري التحقق والنشر...' : 'مصادقة ونشر بالكتالوج العام (Publish)'}</span>
          </button>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-emerald-800">
            ✓ هذا الطلب معتمد ومنشور بالكتالوج العام
          </div>
        )}

        {/* Secondary Actions */}
        {currentStatus !== 'closed' && currentStatus !== 'rejected' && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100">
            <button
              type="button"
              onClick={() => setShowRequestChangesModal(true)}
              className="p-2 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-xl text-xs font-bold transition-colors"
            >
              طلب تعديلات ومستندات
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
            >
              رفض الطلب
            </button>
          </div>
        )}
      </div>

      {/* Quick Document Status Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-surface-700 block">تدقيق سريع للمستندات:</span>
        <div className="space-y-2">
          {documents.map((d) => (
            <div key={d.id} className="p-2.5 bg-surface-50 rounded-xl border border-surface-200 text-xs flex items-center justify-between">
              <span className="font-semibold text-surface-800 truncate max-w-[140px]">{d.file_name}</span>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleVerifyDoc(d.id, 'verified')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    d.verification_status === 'verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  ✓ اعتماد
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyDoc(d.id, 'rejected')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    d.verification_status === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  ✕ رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Financial Review */}
      {showFinanceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-surface-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              <span>تسجيل المراجعة المالية المعتمدة</span>
            </h3>

            <form onSubmit={handleSaveFinance} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-surface-700 mb-1">المبلغ المدفوع المؤكد (ج.م)</label>
                <input
                  type="number"
                  required
                  value={finData.verifiedPaidAmount}
                  onChange={(e) => setFinData({ ...finData, verifiedPaidAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-surface-700 mb-1">المبلغ المتبقي المؤكد (ج.م)</label>
                <input
                  type="number"
                  required
                  value={finData.verifiedRemainingAmount}
                  onChange={(e) => setFinData({ ...finData, verifiedRemainingAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-surface-700 mb-1">رسوم تنازل المطور المقررة (إن وجدت)</label>
                <input
                  type="number"
                  value={finData.developerTransferFee}
                  onChange={(e) => setFinData({ ...finData, developerTransferFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-surface-700 mb-1">مصدر التدقيق والمطابقة</label>
                <input
                  type="text"
                  required
                  value={finData.sourceDescription}
                  onChange={(e) => setFinData({ ...finData, sourceDescription: e.target.value })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-100">
                <button
                  type="button"
                  onClick={() => setShowFinanceModal(false)}
                  className="px-4 py-2 bg-surface-100 text-surface-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-brand-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {isPending ? 'جاري الحفظ...' : 'حفظ واعتماد المراجعة المالية'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Legal Review */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-surface-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-700" />
              <span>تسجيل المراجعة القانونية المعتمدة</span>
            </h3>

            <form onSubmit={handleSaveLegal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-surface-700 mb-1">القرار القانوني النهائي</label>
                <select
                  value={legalData.legalVerdict}
                  onChange={(e) => setLegalData({ ...legalData, legalVerdict: e.target.value as LegalVerdict })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs"
                >
                  <option value="eligible">مؤهل للتنازل بدون قيود (Eligible)</option>
                  <option value="eligible_with_conditions">مؤهل بشروط محددة (Eligible with conditions)</option>
                  <option value="not_eligible">غير مؤهل للتنازل (Not eligible)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-surface-700 mb-1">موقف المطور العقاري من التنازل</label>
                <select
                  value={legalData.developerStatus}
                  onChange={(e) => setLegalData({ ...legalData, developerStatus: e.target.value as DeveloperAssignmentStatus })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs"
                >
                  <option value="confirmed">موافق ومؤكد رسمياً (Confirmed)</option>
                  <option value="pending_letter">بانتظار خطاب عدم الممانعة (Pending letter)</option>
                  <option value="forbidden_until_full_payment">محظور حتى تمام سداد الأقساط</option>
                  <option value="unknown">غير محدد</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-surface-700 mb-1">ملاحظات المستشار القانوني</label>
                <textarea
                  rows={3}
                  value={legalData.notes}
                  onChange={(e) => setLegalData({ ...legalData, notes: e.target.value })}
                  className="w-full p-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-100">
                <button
                  type="button"
                  onClick={() => setShowLegalModal(false)}
                  className="px-4 py-2 bg-surface-100 text-surface-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-brand-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {isPending ? 'جاري الحفظ...' : 'حفظ واعتماد المراجعة القانونية'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Changes */}
      {showRequestChangesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-surface-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>طلب تعديل بيانات أو استكمال مستندات</span>
            </h3>

            <p className="text-xs text-surface-500">
              سيتم إشعار البائع في لوحة تحكمه بالمستندات أو التصحيحات المطلوبة لاستئناف المراجعة.
            </p>

            <textarea
              rows={4}
              required
              placeholder="اكتب التوجيهات للبائع، مثلاً: يرجى رفع صورة أوضح لإيصال سداد القسط الأخير أو كشف حساب حديث..."
              value={changesReason}
              onChange={(e) => setChangesReason(e.target.value)}
              className="w-full p-3 bg-surface-50 border border-surface-200 rounded-xl text-xs"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRequestChangesModal(false)}
                className="px-4 py-2 bg-surface-100 text-surface-700 rounded-xl font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleRequestChanges}
                disabled={isPending || !changesReason.trim()}
                className="px-5 py-2 bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                {isPending ? 'جاري الإرسال...' : 'إرسال التوجيه للبائع'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
