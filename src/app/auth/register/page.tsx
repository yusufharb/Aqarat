'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Phone, Mail, Lock, CheckCircle2, AlertCircle, Building2, ArrowLeft } from 'lucide-react';
import { registerAction } from './actions';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'seller' as 'seller' | 'buyer',
    password: '',
    passwordConfirm: '',
    acceptTerms: true,
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await registerAction(formData);
      if (!result.success) {
        setError(result.error || 'حدث خطأ غير متوقع أثناء التسجيل.');
      } else if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white font-black text-2xl shadow-xs group-hover:scale-105 transition-transform">
            ع
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-surface-900 block leading-none">عقار سواب</span>
            <span className="text-[11px] text-surface-500 font-bold block mt-1">Aqar Swap • التنازل العقاري المعتمد</span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
          إنشاء حساب جديد
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-surface-600">
          انضم لمنصة التنازل عن وحدات التقسيط العقاري بدون أوفر وبإشراف المطورين.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-surface-200 rounded-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-surface-800 mb-2">
                اختر نوع الحساب:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                    formData.role === 'seller'
                      ? 'border-brand-700 bg-brand-50/70 text-brand-950 font-bold shadow-2xs'
                      : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300'
                  }`}
                >
                  <span className="text-sm font-black flex items-center gap-1.5">
                    <span>مالك / بائع</span>
                    {formData.role === 'seller' && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
                  </span>
                  <span className="text-[11px] text-surface-500 font-normal">
                    أرغب في عرض وحدتي للتنازل واسترداد مدخراتي
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                    formData.role === 'buyer'
                      ? 'border-brand-700 bg-brand-50/70 text-brand-950 font-bold shadow-2xs'
                      : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300'
                  }`}
                >
                  <span className="text-sm font-black flex items-center gap-1.5">
                    <span>مشتري</span>
                    {formData.role === 'buyer' && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
                  </span>
                  <span className="text-[11px] text-surface-500 font-normal">
                    أبحث عن وحدة مميزة بسعر التعاقد القديم
                  </span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-surface-800 mb-1.5">
                الاسم بالكامل (ثلاثي أو رباعي) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمد علي"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-surface-800 mb-1.5">
                رقم الهاتف المحمول (مصر) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="01012345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700 font-mono"
                />
              </div>
              <span className="text-[11px] text-surface-400 mt-1 block">
                يقبل شبكات فودافون، أورنج، إي آند، أو وي (010, 011, 012, 015)
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-surface-800 mb-1.5">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  dir="ltr"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700 font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-surface-800 mb-1.5">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="8 خانات على الأقل"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-800 mb-1.5">
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-brand-700 rounded border-surface-300 focus:ring-brand-600"
              />
              <label htmlFor="terms" className="text-xs text-surface-600 leading-relaxed">
                أوافق على{' '}
                <Link href="/faq" className="text-brand-700 font-bold hover:underline">
                  شروط الاستخدام
                </Link>{' '}
                و{' '}
                <Link href="/faq" className="text-brand-700 font-bold hover:underline">
                  سياسة الخصوصية
                </Link>{' '}
                وحفظ البيانات وسرية المستندات.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-black py-3 rounded-2xl shadow-xs transition-colors text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب ومتابعة الدخول'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-100 text-center text-xs text-surface-500">
            لديك حساب مسجل بالفعل؟{' '}
            <Link href="/auth/login" className="text-brand-700 font-bold hover:underline">
              تسجيل الدخول من هنا ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
