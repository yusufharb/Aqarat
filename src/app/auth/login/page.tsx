'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, AlertCircle, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { loginAction } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginAction({ identifier, password });
      if (!result.success) {
        setError(result.error || 'فشل تسجيل الدخول.');
      } else if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  };

  const fillDemoAccount = (demoId: string, demoPass: string) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setError(null);
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
          تسجيل الدخول
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-surface-600">
          مرحباً بك مجدداً. أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-surface-200 rounded-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-800 mb-1.5">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="name@example.com أو 010XXXXXXXX"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-surface-800">
                  كلمة المرور
                </label>
                <Link href="/faq" className="text-[11px] font-bold text-brand-700 hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-brand-700 hover:bg-brand-800 text-white font-black py-3 rounded-2xl shadow-xs transition-colors text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? 'جاري التحقق...' : 'دخول'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="mt-6 pt-5 border-t border-surface-100">
            <span className="text-[11px] font-bold text-surface-400 block mb-2 text-center">
              حسابات تجريبية سريعة للمعاينة والاختبار (كلمة المرور: Password123):
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('seller.ahmed@example.com', 'Password123')}
                className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 border border-surface-200 text-surface-700 font-bold transition-colors text-center"
              >
                👤 بائع: أحمد
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('buyer.omar@example.com', 'Password123')}
                className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 border border-surface-200 text-surface-700 font-bold transition-colors text-center"
              >
                👤 مشتري: عمر
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@aqarswap.com', 'Password123')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold transition-colors text-center"
              >
                🛡️ مشرف: يوسف
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-surface-500">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-brand-700 font-bold hover:underline">
              أنشئ حساباً جديداً مجاناً ←
            </Link>
          </div>
        </div>

        {/* Staff / Admin Dedicated Entry Notice */}
        <div className="mt-4 text-center">
          <Link
            href="/control-room/login"
            className="inline-flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-800 font-bold"
          >
            <KeyRound className="w-3.5 h-3.5 text-surface-400" />
            <span>بوابة المشرفين وفريق التدقيق (غرفة التحكم المركزية) ←</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
