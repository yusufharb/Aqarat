'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatEGP } from '@/lib/utils';
import Link from 'next/link';
import { createSellerCaseAction } from './actions';

export default function NewCaseWizardPage() {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [createdCaseNumber, setCreatedCaseNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Property
    governorate: 'القاهرة',
    cityDistrict: 'التجمع الخامس',
    developerName: 'شركة سوديك (SODIC)',
    projectName: 'إيست تاون',
    unitType: 'apartment',
    areaSqm: 185,
    floorNumber: 3,
    deliveryStatus: 'delivered',
    expectedDeliveryDate: '',

    // Step 2: Financials
    totalContractPrice: 8500000,
    depositPaid: 1500000,
    installmentsPaid: 2500000,
    remainingBalance: 4500000,
    installmentValue: 250000,
    installmentFrequency: 'quarterly',

    // Step 3: Case Nature
    caseNature: 'standard_assignment',
    hasOverdue: false,
    overdueAmount: 0,
    hasLegalNotices: false,
    legalNoticeDetails: '',
    isPrivateListing: false,

    // Step 4: Documents (Simulated file uploads)
    hasContractDoc: true,
    hasReceiptsDoc: true,
    hasNationalIdDoc: true,

    // Step 5: Confirmation
    acknowledgedTruth: false,
  });

  const totalPaid = formData.depositPaid + formData.installmentsPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acknowledgedTruth) {
      alert('يرجى تأكيد التعهد بصحة البيانات للمتابعة.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await createSellerCaseAction({
        governorate: formData.governorate,
        cityDistrict: formData.cityDistrict,
        developerName: formData.developerName,
        projectName: formData.projectName,
        unitType: formData.unitType as any,
        areaSqm: Number(formData.areaSqm) || null,
        floorNumber: Number(formData.floorNumber) || null,
        deliveryStatus: formData.deliveryStatus as any,
        expectedDeliveryDate: formData.expectedDeliveryDate || null,

        totalContractPrice: Number(formData.totalContractPrice),
        depositPaid: Number(formData.depositPaid),
        installmentsPaid: Number(formData.installmentsPaid),
        remainingBalance: Number(formData.remainingBalance),
        installmentValue: Number(formData.installmentValue) || null,
        installmentFrequency: formData.installmentFrequency as any,

        caseNature: formData.caseNature as any,
        hasOverdue: formData.hasOverdue,
        overdueAmount: Number(formData.overdueAmount) || 0,
        hasLegalNotices: formData.hasLegalNotices,
        legalNoticeDetails: formData.legalNoticeDetails,
        isPrivateListing: formData.isPrivateListing,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'فشل حفظ الطلب.');
      } else {
        setCreatedCaseNumber(res.caseNumber || '');
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3 py-1 rounded-full inline-block mb-2">
              طلب تخارج جديد
            </span>
            <h1 className="text-3xl font-black text-surface-900 mb-2">
              معالج تسجيل طلب التنازل
            </h1>
            <p className="text-xs sm:text-sm text-surface-500">
              أكمل الخطوات التالية لإدخال بيانات وحدتك ورفع المستندات لمراجعتها قبل اعتماد النشر.
            </p>
          </div>

          {/* Stepper Progress */}
          {!submitted && (
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-surface-200 text-xs font-bold">
              {[
                { num: 1, title: 'الوحدة' },
                { num: 2, title: 'الماليات' },
                { num: 3, title: 'نوع الحالة' },
                { num: 4, title: 'المستندات' },
                { num: 5, title: 'المراجعة' },
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                    step === s.num
                      ? 'bg-brand-700 text-white'
                      : step > s.num
                      ? 'bg-brand-50 text-brand-800 cursor-pointer'
                      : 'text-surface-400 cursor-not-allowed'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Success Screen */}
          {submitted ? (
            <div className="bg-white rounded-3xl p-10 border border-surface-200 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-3xl font-black flex items-center justify-center mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-2xl font-black text-surface-900 mb-2">
                تم إرسال طلب التنازل بنجاح للمراجعة!
              </h2>
              <div className="inline-block bg-surface-100 font-mono font-bold text-surface-700 text-sm px-4 py-1.5 rounded-lg mb-4">
                رقم القيد: {createdCaseNumber || 'CAS-2026-PENDING'}
              </div>
              <p className="text-xs sm:text-sm text-surface-600 max-w-md mx-auto leading-relaxed mb-8">
                طلبك الآن بحالة <strong className="text-brand-800">قيد الفرز الأولي (Screening)</strong>. سيقوم الفريق المالي والقانوني بمراجعة مطابقة الأرقام والعقد تمهيداً لاعتماد النشر.
              </p>

              <div className="flex justify-center gap-4">
                <Link
                  href="/seller/dashboard"
                  className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  الذهاب إلى لوحة تحكم البائع
                </Link>
                <Link
                  href="/units"
                  className="bg-surface-100 hover:bg-surface-200 text-surface-800 text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  تصفح الوحدات المعتمدة
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs">
              {/* STEP 1: Property */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-black text-surface-900 pb-3 border-b border-surface-100">
                    الخطوة 1: بيانات الوحدة والمشروع
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">المحافظة</label>
                      <select
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      >
                        <option value="القاهرة">القاهرة</option>
                        <option value="الجيزة">الجيزة</option>
                        <option value="مطروح (الساحل الشمالي)">مطروح (الساحل الشمالي)</option>
                        <option value="البحر الأحمر">البحر الأحمر</option>
                        <option value="الإسكندرية">الإسكندرية</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">المنطقة / الحي</label>
                      <input
                        type="text"
                        value={formData.cityDistrict}
                        onChange={(e) => setFormData({ ...formData, cityDistrict: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">اسم المطور العقاري</label>
                      <input
                        type="text"
                        value={formData.developerName}
                        onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">اسم المشروع / الكمبوند</label>
                      <input
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">نوع الوحدة</label>
                      <select
                        value={formData.unitType}
                        onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      >
                        <option value="apartment">شقة سكنية</option>
                        <option value="duplex">دوبلكس</option>
                        <option value="villa">فيلا مستقلة</option>
                        <option value="townhouse">تاون هاوس</option>
                        <option value="penthouse">بنتهاوس</option>
                        <option value="commercial">تجاري</option>
                        <option value="administrative">إداري</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">المساحة التعاقدية (م²)</label>
                      <input
                        type="number"
                        value={formData.areaSqm}
                        onChange={(e) => setFormData({ ...formData, areaSqm: Number(e.target.value) })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-surface-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      التالي: البيانات المالية ←
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Financials */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-black text-surface-900 pb-3 border-b border-surface-100">
                    الخطوة 2: الأرقام والبيانات المالية للعقد
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">
                        إجمالي سعر التعاقد الأصلي (ج.م)
                      </label>
                      <input
                        type="number"
                        value={formData.totalContractPrice}
                        onChange={(e) => setFormData({ ...formData, totalContractPrice: Number(e.target.value) })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">
                        دفعة المقدم المسددة (ج.م)
                      </label>
                      <input
                        type="number"
                        value={formData.depositPaid}
                        onChange={(e) => setFormData({ ...formData, depositPaid: Number(e.target.value) })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">
                        مجموع الأقساط المسددة حتى الآن (ج.م)
                      </label>
                      <input
                        type="number"
                        value={formData.installmentsPaid}
                        onChange={(e) => setFormData({ ...formData, installmentsPaid: Number(e.target.value) })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1">
                        إجمالي الأقساط المتبقية للمطور (ج.م)
                      </label>
                      <input
                        type="number"
                        value={formData.remainingBalance}
                        onChange={(e) => setFormData({ ...formData, remainingBalance: Number(e.target.value) })}
                        className="w-full text-xs p-3 rounded-xl border border-surface-300"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-brand-50 p-4 rounded-2xl border border-brand-200 text-xs">
                    <span className="text-brand-800 font-bold block mb-1">المبلغ المطلوب للبائع (كاش):</span>
                    <span className="text-xl font-black text-brand-900">{formatEGP(totalPaid)}</span>
                    <span className="text-[11px] text-brand-700 block mt-1">
                      (إجمالي المقدم المسدد + الأقساط السابقة)
                    </span>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-surface-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-surface-100 text-surface-700 text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      → السابق
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      التالي: نوع الحالة ←
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Case Nature */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-black text-surface-900 pb-3 border-b border-surface-100">
                    الخطوة 3: تصنيف الحالة وسرية البيانات
                  </h3>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-700">ما هو سبب التنازل الرئيسي؟</label>

                    <label className="flex items-start gap-3 p-4 rounded-2xl border border-surface-200 cursor-pointer hover:bg-surface-50">
                      <input
                        type="radio"
                        name="caseNature"
                        value="standard_assignment"
                        checked={formData.caseNature === 'standard_assignment'}
                        onChange={() => setFormData({ ...formData, caseNature: 'standard_assignment' })}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-bold text-surface-900 text-xs block">تنازل عادي / استثماري</span>
                        <span className="text-surface-500 text-[11px]">
                          أرغب في التنازل وإعادة توجيه استثماري دون وجود تعثر في سداد الأقساط.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-2xl border border-surface-200 cursor-pointer hover:bg-surface-50">
                      <input
                        type="radio"
                        name="caseNature"
                        value="distress_exit"
                        checked={formData.caseNature === 'distress_exit'}
                        onChange={() => setFormData({ ...formData, caseNature: 'distress_exit' })}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-bold text-surface-900 text-xs block">
                          تخارج لظروف مالية أو تعثر في الأقساط
                        </span>
                        <span className="text-surface-500 text-[11px]">
                          أواجه صعوبة في استكمال الأقساط وأرغب في مخرج آمن وسريع لاسترداد أموالي.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Private distress questions */}
                  {formData.caseNature === 'distress_exit' && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-4 text-xs">
                      <div className="font-bold text-amber-900">
                        🔒 أسئلة خاصة بالمراجعة الداخلية (سرية تماماً ولا تظهر للمشترين):
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasOverdue}
                          onChange={(e) => setFormData({ ...formData, hasOverdue: e.target.checked })}
                        />
                        <span>هل توجد أقساط متأخرة حالياً لم يتم سدادها؟</span>
                      </label>

                      {formData.hasOverdue && (
                        <div>
                          <label className="block text-[11px] font-bold text-amber-800 mb-1">
                            قيمة الأقساط المتأخرة التقريبية (ج.م)
                          </label>
                          <input
                            type="number"
                            value={formData.overdueAmount}
                            onChange={(e) => setFormData({ ...formData, overdueAmount: Number(e.target.value) })}
                            className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-white"
                          />
                        </div>
                      )}

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasLegalNotices}
                          onChange={(e) => setFormData({ ...formData, hasLegalNotices: e.target.checked })}
                        />
                        <span>هل استلمت أي إنذارات قضائية أو إخطارات فسخ من المطور؟</span>
                      </label>
                    </div>
                  )}

                  {/* Private Listing Option */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 p-4 bg-surface-50 rounded-2xl border border-surface-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPrivateListing}
                        onChange={(e) => setFormData({ ...formData, isPrivateListing: e.target.checked })}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-bold text-surface-900 text-xs block">
                          تفعيل خاصية "العرض الخاص السري" (Private Listing)
                        </span>
                        <span className="text-surface-500 text-[11px]">
                          عدم نشر الوحدة في الكتالوج العام، وعرضها فقط سراً وبشكل مباشر على المشترين المعتمدين والمطابقين للميزانية.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-surface-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-surface-100 text-surface-700 text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      → السابق
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      التالي: المستندات ←
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents */}
              {step === 4 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-black text-surface-900 pb-3 border-b border-surface-100">
                    الخطوة 4: رفع المستندات الخاصة بالوحدة
                  </h3>

                  <p className="text-xs text-surface-600">
                    جميع الملفات يتم حفظها في خزينة خاصة مشفرة (Private Storage) ولا تظهر إطلاقاً للعامة.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-surface-800 block">صورة العقد الأصلي مع المطور (مطلوب)</span>
                        <span className="text-surface-400 text-[11px]">PDF أو صور عالية الوضوح</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full text-[11px]">
                        ✓ جاهز للمراجعة
                      </span>
                    </div>

                    <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-surface-800 block">إيصالات السداد أو كشف حساب المطور (مطلوب)</span>
                        <span className="text-surface-400 text-[11px]">لإثبات المبالغ المسددة فعلياً</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full text-[11px]">
                        ✓ جاهز للمراجعة
                      </span>
                    </div>

                    <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-surface-800 block">صورة بطاقة الرقم القومي سارية (مطلوب)</span>
                        <span className="text-surface-400 text-[11px]">للتأكد من هوية وصفة البائع</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full text-[11px]">
                        ✓ جاهز للمراجعة
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-surface-100">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-surface-100 text-surface-700 text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      → السابق
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-6 py-3 rounded-xl"
                    >
                      التالي: مراجعة الطلب والإرسال ←
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Review & Submit */}
              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-surface-900 pb-3 border-b border-surface-100">
                    الخطوة 5: مراجعة الطلب والتعهد
                  </h3>

                  <div className="bg-surface-50 p-5 rounded-2xl border border-surface-200 space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-surface-200/60">
                      <span className="text-surface-500">المشروع والمطور:</span>
                      <span className="font-bold text-surface-800">{formData.developerName} - {formData.projectName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-surface-200/60">
                      <span className="text-surface-500">الموقع:</span>
                      <span className="font-bold text-surface-800">{formData.governorate} • {formData.cityDistrict}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-surface-200/60">
                      <span className="text-surface-500">المبلغ المطلوب للبائع (كاش):</span>
                      <span className="font-black text-brand-900">{formatEGP(totalPaid)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-surface-500">طريقة العرض:</span>
                      <span className="font-bold text-surface-800">
                        {formData.isPrivateListing ? 'عرض خاص سري' : 'نشر عام بالكتالوج المعتمد'}
                      </span>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acknowledgedTruth}
                      onChange={(e) => setFormData({ ...formData, acknowledgedTruth: e.target.checked })}
                      className="mt-1"
                    />
                    <div className="text-xs text-brand-900 leading-relaxed">
                      <strong>إقرار وتعهد:</strong> أتعهد بصفتي مالك الوحدة أو وكيله الرسمي بأن كافة البيانات والمبالغ المدخلة صحيحة ومطابقة لكشوف الحساب الأصلية، وأوافق على خضوع الطلب لمراجعة بوابات النشر الـ 9 قبل الاعتماد، وأن التنازل الرسمي يتم بمقر المطور العقاري.
                    </div>
                  </label>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-surface-100">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setStep(4)}
                      className="bg-surface-100 text-surface-700 text-xs font-bold px-6 py-3 rounded-xl disabled:opacity-50"
                    >
                      → السابق
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.acknowledgedTruth || isSubmitting}
                      className={`text-xs font-bold px-8 py-3.5 rounded-xl transition-all ${
                        formData.acknowledgedTruth && !isSubmitting
                          ? 'bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-md'
                          : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب للمراجعة الرسمية'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
