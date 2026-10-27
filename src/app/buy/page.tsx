'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { submitBuyerRequestAction } from './actions';
import {
  User,
  Phone,
  Mail,
  DollarSign,
  Building,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
} from 'lucide-react';
import type { UnitType } from '@/lib/types';

const POPULAR_GOVERNORATES = ['القاهرة', 'الجيزة', 'العاصمة الإدارية', 'مطروح (الساحل الشمالي)', 'البحر الأحمر', 'الإسكندرية'];

const POPULAR_DISTRICTS = [
  'التجمع الخامس - القاهرة الجديدة',
  'الشيخ زايد',
  'مدينة المستقبل',
  'مدينة 6 أكتوبر',
  'منطقة R7 - العاصمة',
  'حي المال والأعمال',
  'سيدي عبد الرحمن',
];

const UNIT_TYPES: { label: string; value: UnitType }[] = [
  { label: 'شقة سكنية', value: 'apartment' },
  { label: 'دوبلكس', value: 'duplex' },
  { label: 'تاون هاوس', value: 'townhouse' },
  { label: 'فيلا مستقلة', value: 'villa' },
  { label: 'بنتهاوس', value: 'penthouse' },
  { label: 'تجاري / إداري', value: 'commercial' },
];

const POPULAR_DEVELOPERS = [
  'SODIC',
  'Palm Hills Developments',
  'Emaar Misr',
  'Mountain View',
  'Tatweer Misr',
  'Misr Italia Properties',
  'Ora Developers',
  'City Edge',
];

export default function BuyPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ referenceCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [budgetCash, setBudgetCash] = useState('');
  const [maxInstallment, setMaxInstallment] = useState('');
  const [installmentFrequency, setInstallmentFrequency] = useState('quarterly');
  const [isBudgetFlexible, setIsBudgetFlexible] = useState(false);

  const [selectedGovs, setSelectedGovs] = useState<string[]>(['القاهرة']);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<UnitType[]>(['apartment']);
  const [selectedDevs, setSelectedDevs] = useState<string[]>([]);
  const [deliveryPreference, setDeliveryPreference] = useState<'immediate' | 'within_1_year' | 'within_2_years' | 'any'>('any');
  const [bedrooms, setBedrooms] = useState('3');
  const [notes, setNotes] = useState('');

  const toggleGov = (gov: string) => {
    setSelectedGovs((prev) => (prev.includes(gov) ? prev.filter((g) => g !== gov) : [...prev, gov]));
  };

  const toggleDistrict = (d: string) => {
    setSelectedDistricts((prev) => (prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]));
  };

  const toggleType = (t: UnitType) => {
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]));
  };

  const toggleDev = (dev: string) => {
    setSelectedDevs((prev) => (prev.includes(dev) ? prev.filter((d) => d !== dev) : [...prev, dev]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedGovs.length === 0) {
      setErrorMsg('يرجى اختيار محافظة واحدة على الأقل.');
      return;
    }

    if (selectedTypes.length === 0) {
      setErrorMsg('يرجى اختيار نوع وحدة واحد على الأقل.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('budgetCash', budgetCash);
    formData.append('maxInstallment', maxInstallment);
    formData.append('installmentFrequency', installmentFrequency);
    formData.append('isBudgetFlexible', isBudgetFlexible ? 'true' : 'false');
    formData.append('preferredGovernorates', selectedGovs.join(','));
    formData.append('preferredDistricts', selectedDistricts.join(','));
    formData.append('preferredUnitTypes', selectedTypes.join(','));
    formData.append('preferredDevelopers', selectedDevs.join(','));
    formData.append('deliveryPreference', deliveryPreference);
    formData.append('bedrooms', bedrooms);
    formData.append('notes', notes);

    try {
      const res = await submitBuyerRequestAction(null, formData);
      if (res.success && res.referenceCode) {
        setSuccessData({ referenceCode: res.referenceCode });
      } else {
        setErrorMsg(res.error || 'حدث خطأ أثناء حفظ الطلب.');
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
              <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10" />
              </div>

              <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-800 border border-brand-200 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم تفعيل طلب الشراء والمطابقة الذكية
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 mb-3">
                تم تسجيل متطلباتك وميزانيتك بنجاح
              </h1>
              <p className="text-sm sm:text-base text-surface-600 max-w-xl mx-auto mb-8">
                يقوم محرك المطابقة في عقار سواب بفحص كافة الوحدات المعتمدة المعروضة للتنازل بسعر التعاقد القديم، وسنتواصل معك فور توفر أفضل فرصة مطابقة لميزانيتك.
              </p>

              {/* Reference Code Card */}
              <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 max-w-md mx-auto mb-8 text-center">
                <p className="text-xs font-bold text-surface-500 mb-1">الرقم المرجعي لطلب الشراء</p>
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

              {/* What Happens Next */}
              <div className="border-t border-surface-200 pt-8 mb-8 text-right max-w-2xl mx-auto">
                <h3 className="text-base font-black text-surface-900 mb-4">ماذا يحدث الآن؟</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-surface-800">مطابقة فورية مع الوحدات المعتمدة</h4>
                      <p className="text-xs text-surface-500">
                        يقارن النظام ميزانيتك النقدية وقدرتك على الأقساط مع شقق وفيلات تم فحص أوراقها قانونياً ومالياً.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-surface-800">التواصل وتزويدك بالتفاصيل الكاملة</h4>
                      <p className="text-xs text-surface-500">
                        يتواصل معك مستشار التنازل لتزويدك بجدول الأقساط المتبقية وتاريخ الاستحقاقات ورسوم المطور.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-surface-800">التنازل الرسمي بمقر المطور بدون عمولة</h4>
                      <p className="text-xs text-surface-500">
                        حضور جلسة التنازل بمقر المطور العقاري، سداد الكاش للمالك ونقل العقد باسمك مباشرة (0% عمولة).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/units"
                  className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  تصفح الوحدات المتاحة حالياً
                </Link>
                <Link
                  href="/buyer/dashboard"
                  className="px-6 py-3 bg-surface-100 hover:bg-surface-200 text-surface-800 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  الانتقال إلى لوحة المشتري
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-800 border border-brand-200 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>اقتنص فرصة تنازل بسعر العقد القديم • 0% عمولة</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-surface-900 tracking-tight mb-3">
                  اشتري وحدة بدون أوفر وبنظام الأقساط
                </h1>
                <p className="text-xs sm:text-sm text-surface-600 max-w-2xl mx-auto leading-relaxed">
                  سجل ميزانيتك النقدية وقسطك المريح، وسيقوم محرك عقار سواب بمطابقة طلبك مع وحدات أصحابها يرغبون في التخارج واسترداد مدفوعاتهم فقط بسعر التعاقد الأصلي.
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
                      <h2 className="text-base font-black text-surface-900">1. بيانات المشتري</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">الاسم ثلاثياً *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثال: عمر فاروق الشناوي"
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
                          placeholder="011XXXXXXXX"
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
                          placeholder="buyer@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Budget & Installment Capacity */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100">
                      <DollarSign className="w-5 h-5 text-brand-700" />
                      <h2 className="text-base font-black text-surface-900">2. القدرة المالية والميزانية المتاحة</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">الكاش الجاهز للدفع للبائع (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={budgetCash}
                          onChange={(e) => setBudgetCash(e.target.value)}
                          placeholder="مثال: 2500000"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                        <span className="text-[11px] text-surface-500 mt-1 block">مقدم التنازل الفعلي للمالك</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">أقصى قسط دوري مريح لك (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={maxInstallment}
                          onChange={(e) => setMaxInstallment(e.target.value)}
                          placeholder="مثال: 120000"
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">دورية القسط المفضلة</label>
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
                    </div>

                    <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBudgetFlexible}
                          onChange={(e) => setIsBudgetFlexible(e.target.checked)}
                          className="w-4 h-4 rounded text-brand-700 focus:ring-brand-500"
                        />
                        <span className="text-xs sm:text-sm font-bold text-surface-800">
                          أمتلك مرونة في الميزانية بمقدار (10% - 15%) في حال توفر فرصة مميزة جداً
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Section 3: Property Preferences */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100">
                      <Building className="w-5 h-5 text-brand-700" />
                      <h2 className="text-base font-black text-surface-900">3. مواصفات وموقع الوحدة المفضلة</h2>
                    </div>

                    {/* Governorates Tags */}
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-surface-700 mb-2">المحافظات المفضلة (اختر ما يناسبك) *</label>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_GOVERNORATES.map((gov) => {
                          const isSelected = selectedGovs.includes(gov);
                          return (
                            <button
                              type="button"
                              key={gov}
                              onClick={() => toggleGov(gov)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-700 border-brand-700 text-white'
                                  : 'bg-white border-surface-200 text-surface-700 hover:border-surface-300'
                              }`}
                            >
                              {gov}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Districts Tags */}
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-surface-700 mb-2">المناطق والأحياء المفضلة</label>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_DISTRICTS.map((district) => {
                          const isSelected = selectedDistricts.includes(district);
                          return (
                            <button
                              type="button"
                              key={district}
                              onClick={() => toggleDistrict(district)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-700 border-brand-700 text-white'
                                  : 'bg-white border-surface-200 text-surface-700 hover:border-surface-300'
                              }`}
                            >
                              {district}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Unit Types Tags */}
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-surface-700 mb-2">أنواع الوحدات المقبولة *</label>
                      <div className="flex flex-wrap gap-2">
                        {UNIT_TYPES.map((t) => {
                          const isSelected = selectedTypes.includes(t.value);
                          return (
                            <button
                              type="button"
                              key={t.value}
                              onClick={() => toggleType(t.value)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-700 border-brand-700 text-white'
                                  : 'bg-white border-surface-200 text-surface-700 hover:border-surface-300'
                              }`}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Developers Tags */}
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-surface-700 mb-2">المطورين المفضلين (اختياري)</label>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_DEVELOPERS.map((dev) => {
                          const isSelected = selectedDevs.includes(dev);
                          return (
                            <button
                              type="button"
                              key={dev}
                              onClick={() => toggleDev(dev)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-surface-800 border-surface-800 text-white'
                                  : 'bg-white border-surface-200 text-surface-700 hover:border-surface-300'
                              }`}
                            >
                              {dev}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery & Bedrooms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">موعد الاستلام المطلوب</label>
                        <select
                          value={deliveryPreference}
                          onChange={(e) => setDeliveryPreference(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden bg-white"
                        >
                          <option value="any">أي موعد استلام</option>
                          <option value="immediate">استلام فوري (جاهز للسكن)</option>
                          <option value="within_1_year">خلال سنة واحدة</option>
                          <option value="within_2_years">خلال سنتين</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-surface-700 mb-1.5">عدد الغرف المفضل</label>
                        <select
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden bg-white"
                        >
                          <option value="any">أي عدد</option>
                          <option value="2">2 غرف نوم</option>
                          <option value="3">3 غرف نوم</option>
                          <option value="4+">4 غرف فأكثر</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Notes */}
                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1.5">ملاحظات أو رغبات خاصة (اختياري)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: يفضل كمبوند به نادي وخدمات متكاملة، أو بالقرب من الجامعة الأمريكية..."
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-xs sm:text-sm focus:border-brand-600 focus:outline-hidden mb-6"
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-700 hover:bg-brand-800 disabled:bg-surface-300 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري تفعيل طلب الشراء والمطابقة...</span>
                        </>
                      ) : (
                        <>
                          <span>تسجيل طلب الشراء والمطابقة الذكية (مجاناً)</span>
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
