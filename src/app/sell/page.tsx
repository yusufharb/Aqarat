'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { submitSellerRequestAction } from './actions';
import {
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function SellPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ referenceCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [cityDistrict, setCityDistrict] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [unitType, setUnitType] = useState('apartment');
  const [areaSqm, setAreaSqm] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('under_construction');

  const [totalPrice, setTotalPrice] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [remainingBalance, setRemainingBalance] = useState('');
  const [installmentValue, setInstallmentValue] = useState('');
  const [installmentFrequency, setInstallmentFrequency] = useState('quarterly');

  const [hasOverdue, setHasOverdue] = useState(false);
  const [overdueAmount, setOverdueAmount] = useState('');
  const [requestedCash, setRequestedCash] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeRules, setAgreeRules] = useState(false);

  // Auto calculate remaining balance when total and paid change
  const handlePaidChange = (val: string) => {
    setPaidAmount(val);
    if (!requestedCash) {
      setRequestedCash(val);
    }
    const tot = Number(totalPrice);
    const pd = Number(val);
    if (tot && pd && tot >= pd) {
      setRemainingBalance(String(tot - pd));
    }
  };

  const handleTotalChange = (val: string) => {
    setTotalPrice(val);
    const tot = Number(val);
    const pd = Number(paidAmount);
    if (tot && pd && tot >= pd) {
      setRemainingBalance(String(tot - pd));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreeRules) {
      setErrorMsg('يرجى الموافقة على تعهد صحة البيانات وسياسة التنازل بدون أوفر للمتابعة.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('governorate', governorate);
    formData.append('cityDistrict', cityDistrict);
    formData.append('developerName', developerName);
    formData.append('projectName', projectName);
    formData.append('unitType', unitType);
    formData.append('areaSqm', areaSqm);
    formData.append('floorNumber', floorNumber);
    formData.append('deliveryStatus', deliveryStatus);
    formData.append('totalPrice', totalPrice);
    formData.append('paidAmount', paidAmount);
    formData.append('remainingBalance', remainingBalance);
    formData.append('installmentValue', installmentValue);
    formData.append('installmentFrequency', installmentFrequency);
    formData.append('hasOverdue', hasOverdue ? 'true' : 'false');
    formData.append('overdueAmount', overdueAmount);
    formData.append('requestedCashAmount', requestedCash || paidAmount);
    formData.append('notes', notes);

    try {
      const res = await submitSellerRequestAction(null, formData);
      if (res.success && res.referenceCode) {
        setSuccessData({ referenceCode: res.referenceCode });
      } else {
        setErrorMsg(res.error || 'فشل إرسال الطلب، يرجى المحاولة مرة أخرى.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'حدث خطأ في الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!successData?.referenceCode) return;
    navigator.clipboard.writeText(successData.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 font-sans" dir="rtl">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Screen */}
          {successData ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-surface-200 shadow-md text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                تم استلام طلب التنازل بنجاح
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 mb-3">
                شكراً لك، تم تسجيل طلبك في عقار سواب
              </h1>
              <p className="text-sm sm:text-base text-surface-600 max-w-xl mx-auto mb-8">
                سيتولى فريق المراجعة والتدقيق فحص بيانات الوحدة والمطور والتواصل معك هاتفياً في غضون 24 ساعة لاستكمال الخطوات الرسمية.
              </p>

              {/* Reference Code Card */}
              <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 max-w-md mx-auto mb-8 text-center">
                <p className="text-xs font-bold text-surface-500 mb-1">الرقم المرجعي للطلب الخاص بك</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-brand-700 tracking-wider font-mono">
                    {successData.referenceCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-xl bg-white border border-surface-200 text-surface-600 hover:text-brand-700 hover:border-brand-300 transition-colors"
                    title="نسخ الرقم المرجعي"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copied && <p className="text-xs text-emerald-600 font-bold mt-2">تم نسخ الرقم المرجعي بنجاح!</p>}
              </div>

              {/* What Happens Next Timeline */}
              <div className="border-t border-surface-200 pt-8 mb-8 text-right max-w-2xl mx-auto">
                <h3 className="text-base font-black text-surface-900 mb-4">ما هي الخطوات التالية؟</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-surface-800">مراجعة بيانات المطور والمشروع</h4>
                      <p className="text-xs text-surface-500">
                        يقوم فريق العمل بالتحقق من سياسات المطور ولائحة التنازلات المعتمدة للمشروع.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-surface-800">المطابقة والتنسيق مع المشترين المؤهلين</h4>
                      <p className="text-xs text-surface-500">
                        نقوم بمطابقة وحدتك مع طلبات الشراء ذات الميزانية الكاش والقدرة على استكمال الأقساط.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-surface-800">إجراءات التنازل بمقر المطور</h4>
                      <p className="text-xs text-surface-500">
                        توقيع التنازل واستلام أموالك الكاش ونقل العقد رسمياً للمشتري بمقر شركة التطوير العقاري.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  العودة للرئيسية
                </Link>
                <Link
                  href="/seller/dashboard"
                  className="px-6 py-3 bg-surface-100 hover:bg-surface-200 text-surface-800 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  الانتقال إلى لوحة البائع
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Header Banner */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>خدمة التنازل العقاري المعتمد • 0% عمولة</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-surface-900 tracking-tight mb-3">
                  بيع وحدتك وتنازل عن أقساطها بأمان
                </h1>
                <p className="text-xs sm:text-sm text-surface-600 max-w-2xl mx-auto leading-relaxed">
                  استرد مدفوعاتك كاش دون الحاجة لإلغاء التعاقد مع المطور أو التعرض لغرامات التأخير. التنازل يتم بسعر التعاقد القديم بدون أوفر برايس وبحضور الطرفين بمقر المطور.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-surface-200 shadow-xs">
                {errorMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Contact Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100">
                      <User className="w-5 h-5 text-brand-700" />
                      <h2 className="text-base font-black text-surface-900">1. بيانات المالك والتواصل</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">الاسم ثلاثي كما بالعقد *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثال: أحمد محمد علي"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">رقم الهاتف (واتساب) *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="010XXXXXXXX"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden text-left"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">البريد الإلكتروني (اختياري)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Property Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100">
                      <Building2 className="w-5 h-5 text-brand-700" />
                      <h2 className="text-base font-black text-surface-900">2. بيانات الوحدة العقارية</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">المحافظة *</label>
                        <select
                          value={governorate}
                          onChange={(e) => setGovernorate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden bg-white"
                        >
                          <option value="القاهرة">القاهرة</option>
                          <option value="الجيزة">الجيزة</option>
                          <option value="العاصمة الإدارية">العاصمة الإدارية</option>
                          <option value="مطروح (الساحل الشمالي)">الساحل الشمالي</option>
                          <option value="البحر الأحمر">البحر الأحمر</option>
                          <option value="الإسكندرية">الإسكندرية</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">الحي / المنطقة *</label>
                        <input
                          type="text"
                          required
                          value={cityDistrict}
                          onChange={(e) => setCityDistrict(e.target.value)}
                          placeholder="مثال: التجمع الخامس، زايد"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">اسم المطور العقاري *</label>
                        <input
                          type="text"
                          required
                          value={developerName}
                          onChange={(e) => setDeveloperName(e.target.value)}
                          placeholder="مثال: سوديك، إعمار، بالم هيلز"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">اسم المشروع (الكمبوند) *</label>
                        <input
                          type="text"
                          required
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="مثال: فيليت، إيست تاون"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">نوع الوحدة *</label>
                        <select
                          value={unitType}
                          onChange={(e) => setUnitType(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden bg-white"
                        >
                          <option value="apartment">شقة سكنية</option>
                          <option value="duplex">دوبلكس</option>
                          <option value="villa">فيلا مستقلة</option>
                          <option value="townhouse">تاون هاوس</option>
                          <option value="penthouse">بنتهاوس</option>
                          <option value="commercial">تجاري / إداري</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">المساحة (م²)</label>
                        <input
                          type="number"
                          value={areaSqm}
                          onChange={(e) => setAreaSqm(e.target.value)}
                          placeholder="مثال: 165"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">رقم الدور (اختياري)</label>
                        <input
                          type="number"
                          value={floorNumber}
                          onChange={(e) => setFloorNumber(e.target.value)}
                          placeholder="مثال: 3"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">حالة الاستلام *</label>
                        <select
                          value={deliveryStatus}
                          onChange={(e) => setDeliveryStatus(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden bg-white"
                        >
                          <option value="under_construction">تحت الإنشاء</option>
                          <option value="finishing">مرحلة التشطيب</option>
                          <option value="delivered">استلام فوري</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Financial Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100">
                      <DollarSign className="w-5 h-5 text-brand-700" />
                      <h2 className="text-base font-black text-surface-900">3. الموقف المالي للتعاقد</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">إجمالي سعر التعاقد (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={totalPrice}
                          onChange={(e) => handleTotalChange(e.target.value)}
                          placeholder="مثال: 6500000"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">المبلغ المدفوع للمطور حتى الآن (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={paidAmount}
                          onChange={(e) => handlePaidChange(e.target.value)}
                          placeholder="مثال: 2200000"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">المبلغ المتبقي بالأقساط (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={remainingBalance}
                          onChange={(e) => setRemainingBalance(e.target.value)}
                          placeholder="مثال: 4300000"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">قيمة القسط الدوري (ج.م)</label>
                        <input
                          type="number"
                          value={installmentValue}
                          onChange={(e) => setInstallmentValue(e.target.value)}
                          placeholder="مثال: 150000"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">دورية سداد القسط</label>
                        <select
                          value={installmentFrequency}
                          onChange={(e) => setInstallmentFrequency(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden bg-white"
                        >
                          <option value="quarterly">ربع سنوي (كل 3 أشهر)</option>
                          <option value="monthly">شهري</option>
                          <option value="semi_annual">نصف سنوي (كل 6 أشهر)</option>
                          <option value="annual">سنوي</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">الكاش المطلوب للتنازل (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={requestedCash}
                          onChange={(e) => setRequestedCash(e.target.value)}
                          placeholder="المبلغ المراد استرداده (بدون أوفر)"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                        <span className="text-[11px] text-surface-500 mt-1 block">يساوي أو يقل عن المدفوع الفعلي</span>
                      </div>
                    </div>

                    {/* Overdue Checkbox */}
                    <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasOverdue}
                          onChange={(e) => setHasOverdue(e.target.checked)}
                          className="w-4 h-4 rounded text-brand-700 focus:ring-brand-500"
                        />
                        <span className="text-xs sm:text-sm font-bold text-surface-800">
                          توجد أقساط أو شيكات متأخرة أو مستحقة السداد حالياً للمطور
                        </span>
                      </label>

                      {hasOverdue && (
                        <div className="mt-3 pt-3 border-t border-surface-200 max-w-sm">
                          <label className="block text-xs font-bold text-surface-700 mb-1.5">قيمة المبالغ المتأخرة (ج.م)</label>
                          <input
                            type="number"
                            value={overdueAmount}
                            onChange={(e) => setOverdueAmount(e.target.value)}
                            placeholder="مثال: 250000"
                            className="w-full px-4 py-2 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:outline-hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 4: Notes & Declaration */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">ملاحظات إضافية أو شروط خاصة (اختياري)</label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="أي تفاصيل خاصة بوديعة الصيانة، موقف الجراج، أو أسباب التنازل..."
                        className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                      />
                    </div>

                    {/* Strict No-Over Declaration */}
                    <div className="p-4 bg-brand-50/50 border border-brand-200 rounded-2xl mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreeRules}
                          onChange={(e) => setAgreeRules(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded text-brand-700 focus:ring-brand-500"
                        />
                        <div className="text-xs text-surface-700 leading-relaxed">
                          <strong className="text-surface-900 block mb-0.5">تعهد المالك وميثاق العمل بدون أوفر برايس:</strong>
                          أقر بأن جميع البيانات المالية والتعاقدية المدخلة صحيحة ومطابقة للعقد وإيصالات السداد الرسمية الصادرة من المطور العقاري، وأوافق على أن التنازل يتم بمقر المطور وبسعر التعاقد القديم بدون المطالبة بأي أوفر برايس إضافي.
                        </div>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-700 hover:bg-brand-800 disabled:bg-surface-300 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري تسجيل طلب التنازل...</span>
                        </>
                      ) : (
                        <>
                          <span>إرسال طلب التنازل للمراجعة (مجاناً)</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
