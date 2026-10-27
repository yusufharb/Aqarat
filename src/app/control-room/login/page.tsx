'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { adminLoginAction } from './actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await adminLoginAction({ identifier, password });
      if (!result.success) {
        setError(result.error || 'فشل تسجيل دخول المشرف.');
      } else if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  };

  const fillAdminAccount = (email: string) => {
    setIdentifier(email);
    setPassword('Password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-surface-100" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-700/20 border border-brand-500/30 text-brand-400 mb-4 shadow-lg">
          <KeyRound className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          غرفة التحكم المركزية
        </h2>
        <span className="inline-block mt-2 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
          منطقة المشرفين وفرق التدقيق المعتمدة
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface-800/90 py-8 px-6 sm:px-10 shadow-2xl border border-surface-700 rounded-3xl backdrop-blur-md">
          {/* Strict Security Notice */}
          <div className="mb-6 p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-start gap-2.5 text-amber-300 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              جميع محاولات الدخول والإجراءات مسجلة وموثقة بصورة غير قابلة للتعديل أو الحذف (Immutable Audit Log).
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-2xl flex items-center gap-3 text-red-200 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-200 mb-1.5">
                البريد الإلكتروني الإداري أو معرف المشرف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-surface-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin@aqarswap.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-900/80 border border-surface-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-200 mb-1.5">
                كلمة المرور المشفرة
              </label>
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
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs bg-surface-900/80 border border-surface-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-3 bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-2xl shadow-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? 'جاري التحقق من الصلاحيات...' : 'دخول غرفة التحكم'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Admin Testing Pill */}
          <div className="mt-6 pt-5 border-t border-surface-700/60">
            <span className="text-[11px] font-bold text-surface-400 block mb-2 text-center">
              حسابات تجريبية سريعة لفريق الإدارة والتدقيق (كلمة المرور: Password123):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillAdminAccount('admin@aqarswap.com')}
                className="p-2.5 rounded-xl bg-surface-700/60 hover:bg-surface-700 border border-brand-500/40 text-brand-300 font-bold transition-colors text-right flex items-center justify-between"
              >
                <span>🛡️ يوسف رمزي (المشرف العام)</span>
                <span className="text-[10px] bg-brand-900/60 px-2 py-0.5 rounded text-brand-300 font-mono">admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillAdminAccount('ops@aqarswap.com')}
                className="p-2.5 rounded-xl bg-surface-700/50 hover:bg-surface-700 border border-surface-600 text-surface-200 font-bold transition-colors text-right flex items-center justify-between"
              >
                <span>⚙️ كريم مصطفى (التشغيل)</span>
                <span className="text-[10px] bg-surface-900/60 px-2 py-0.5 rounded text-blue-300 font-mono">ops</span>
              </button>
              <button
                type="button"
                onClick={() => fillAdminAccount('finance@aqarswap.com')}
                className="p-2.5 rounded-xl bg-surface-700/50 hover:bg-surface-700 border border-surface-600 text-surface-200 font-bold transition-colors text-right flex items-center justify-between"
              >
                <span>💰 طارق كمال (مراجعة مالية)</span>
                <span className="text-[10px] bg-surface-900/60 px-2 py-0.5 rounded text-emerald-300 font-mono">finance</span>
              </button>
              <button
                type="button"
                onClick={() => fillAdminAccount('legal@aqarswap.com')}
                className="p-2.5 rounded-xl bg-surface-700/50 hover:bg-surface-700 border border-surface-600 text-surface-200 font-bold transition-colors text-right flex items-center justify-between"
              >
                <span>⚖️ محمود النجار (مراجعة قانونية)</span>
                <span className="text-[10px] bg-surface-900/60 px-2 py-0.5 rounded text-amber-300 font-mono">legal</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-surface-400 hover:text-white transition-colors">
            ← العودة للموقع الرئيسي (عقار سواب)
          </Link>
        </div>
      </div>
    </div>
  );
}
