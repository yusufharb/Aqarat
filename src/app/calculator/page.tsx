'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatEGP } from '@/lib/utils';
import Link from 'next/link';

export default function CalculatorPage() {
  const [totalPrice, setTotalPrice] = useState<number>(6000000);
  const [paidAmount, setPaidAmount] = useState<number>(2000000);
  const [penaltyPercent, setPenaltyPercent] = useState<number>(10);

  // Cancellation calculations
  const penaltyAmount = (totalPrice * penaltyPercent) / 100;
  const netRefundAfterCancellation = Math.max(0, paidAmount - penaltyAmount);
  const percentageLossOfPaid = paidAmount > 0 ? (penaltyAmount / paidAmount) * 100 : 0;

  // Assignment calculations
  const assignmentPlatformCommission = 0; // 0% free launch
  const assignmentCashRecovery = paidAmount;

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
              أداة تفاعلية مجانية
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-surface-900 mb-3">
              حاسبة مقارنة: فسخ التعاقد مقابل التنازل المنظم
            </h1>
            <p className="text-surface-600 text-sm max-w-xl mx-auto">
              قارن بالأرقام بين الخسائر المالية الناتجة عن إلغاء العقد مع المطور العقاري، وبين استرداد مدفوعاتك كاش عبر التنازل لمشترٍ جديد.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs mb-10">
            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-surface-200">
              <div>
                <label className="block text-xs font-bold text-surface-700 mb-2">
                  إجمالي سعر الوحدة الأصلي بالعقد (ج.م)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(Number(e.target.value) || 0)}
                  className="w-full text-sm font-bold p-3.5 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600 text-surface-900"
                />
                <span className="text-[11px] text-surface-400 mt-1 block">
                  {formatEGP(totalPrice)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 mb-2">
                  المبالغ المسددة حتى الآن (مقدم + أقساط)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  className="w-full text-sm font-bold p-3.5 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600 text-surface-900"
                />
                <span className="text-[11px] text-surface-400 mt-1 block">
                  {formatEGP(paidAmount)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 mb-2">
                  نسبة غرامة الإلغاء لدى المطور (%)
                </label>
                <select
                  value={penaltyPercent}
                  onChange={(e) => setPenaltyPercent(Number(e.target.value))}
                  className="w-full text-sm font-bold p-3.5 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600 text-surface-900 bg-white"
                >
                  <option value={7}>7% (حالات نادرة)</option>
                  <option value={10}>10% (الشائع لدى معظم المطورين)</option>
                  <option value={12.5}>12.5%</option>
                  <option value={15}>15% (الحد الأقصى الشائع)</option>
                </select>
                <span className="text-[11px] text-surface-400 mt-1 block">
                  تُحسب كنسبة من إجمالي سعر الوحدة
                </span>
              </div>
            </div>

            {/* Side by Side Result Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Cancellation */}
              <div className="bg-red-50/60 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-red-900 text-base">في حالة فسخ التعاقد مع المطور</h3>
                  <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full">
                    خسارة مالية فادحة
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between py-1.5 border-b border-red-100">
                    <span className="text-red-700">غرامة الإلغاء المخصومة ({penaltyPercent}%):</span>
                    <span className="font-bold text-red-900">{formatEGP(penaltyAmount)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-red-100">
                    <span className="text-red-700">نسبة الخسارة من مدخراتك:</span>
                    <span className="font-bold text-red-900">{percentageLossOfPaid.toFixed(1)}%</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-red-100">
                    <span className="text-red-700">المبلغ المتبقي الصافي لك:</span>
                    <span className="font-bold text-red-900">{formatEGP(netRefundAfterCancellation)}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-red-700">موعد استلام الشيكات:</span>
                    <span className="font-semibold text-red-900">على أقساط مؤجلة تمتد لسنوات</span>
                  </div>
                </div>

                <div className="p-3 bg-red-100/70 rounded-xl text-[11px] text-red-800 leading-relaxed">
                  ⚠️ المطور يخصم الغرامة من إجمالي ثمن الوحدة كاملاً وليس من المبلغ الذي دفعته، مما قد يبتلع جزءاً ضخماً من مدخراتك!
                </div>
              </div>

              {/* Option B: Aqar Exit Assignment */}
              <div className="bg-emerald-50/60 rounded-2xl p-6 border-2 border-brand-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-brand-900 text-base">في حالة التنازل عبر عقار إكزت</h3>
                  <span className="text-xs bg-brand-100 text-brand-800 font-bold px-2.5 py-0.5 rounded-full">
                    الخيار الأفضل
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between py-1.5 border-b border-brand-100">
                    <span className="text-brand-800">عمولة المنصة للبائع:</span>
                    <span className="font-bold text-brand-900">0% (مجاناً تماماً)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-brand-100">
                    <span className="text-brand-800">غرامات فسخ مخصومة:</span>
                    <span className="font-bold text-brand-900">0 ج.م</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-brand-100">
                    <span className="text-brand-800">المبلغ المسترد المتوقع كاش:</span>
                    <span className="font-black text-brand-900 text-sm">{formatEGP(assignmentCashRecovery)}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-brand-800">طريقة وتوقيت الصرف:</span>
                    <span className="font-semibold text-brand-900">كاش فوراً بمقر المطور عند التنازل</span>
                  </div>
                </div>

                <div className="p-3 bg-brand-100/70 rounded-xl text-[11px] text-brand-900 leading-relaxed font-medium">
                  ✓ من خلال التنازل لمشترٍ جاد، يسترد البائع مدخراته بالكامل، ويستفيد المشتري بالحصول على سعر التعاقد القديم بدون أي أوفر.
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-surface-200 text-center">
              <Link
                href="/seller/new-case"
                className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md transition-all"
              >
                <span>ابدأ الآن بطلب التنازل والتخارج الآمن</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
