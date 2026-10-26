'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Building, MapPin, DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [governorate, setGovernorate] = useState('');
  const [unitType, setUnitType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (governorate) query.set('governorate', governorate);
    if (unitType) query.set('type', unitType);
    if (maxPrice) query.set('maxPrice', maxPrice);
    router.push(`/units?${query.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-surface-50 to-surface-50 pt-12 pb-20 border-b border-surface-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0% عمولة طوال فترة الإطلاق الأولي</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-surface-100 text-surface-700 border border-surface-200 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
            <span>سعر التعاقد القديم بدون أي أوفر</span>
          </span>
        </div>

        {/* Hero Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-black text-surface-900 tracking-tight leading-[1.2] mb-4">
            منصة التنازل عن وحدات التقسيط العقاري{' '}
            <span className="text-brand-700">بدون أوفر</span>
          </h1>
          <p className="text-sm sm:text-base text-surface-600 leading-relaxed max-w-2xl mx-auto">
            البديل الآمن والمنظم لفسخ التعاقد وغرامات المطورين في مصر. نوفر للبائع فرصة استرداد مدفوعاته كاش، وللمشتري اقتناص وحدات بأسعار التعاقد القديمة مع استكمال جدول الأقساط بمقر المطور.
          </p>
        </div>

        {/* Multi-segment Search Box (Inspired by Image 1 NUZEL) */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-5 border border-surface-200 shadow-sm mb-12">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Filter 1: City/Governorate */}
            <div className="p-3 bg-surface-50 rounded-2xl border border-surface-200/70">
              <label className="block text-[11px] font-bold text-surface-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-700" />
                <span>المدينة / المحافظة</span>
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full text-xs font-bold text-surface-800 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="">كافة محافظات مصر</option>
                <option value="القاهرة">القاهرة (التجمع والعاصمة)</option>
                <option value="الجيزة">الجيزة (زايد وأكتوبر)</option>
                <option value="مطروح (الساحل الشمالي)">الساحل الشمالي</option>
                <option value="البحر الأحمر">البحر الأحمر (الجونة)</option>
                <option value="الإسكندرية">الإسكندرية</option>
              </select>
            </div>

            {/* Filter 2: Unit Type */}
            <div className="p-3 bg-surface-50 rounded-2xl border border-surface-200/70">
              <label className="block text-[11px] font-bold text-surface-500 mb-1 flex items-center gap-1">
                <Building className="w-3 h-3 text-brand-700" />
                <span>نوع الوحدة</span>
              </label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="w-full text-xs font-bold text-surface-800 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="">جميع الأنواع</option>
                <option value="apartment">شقة سكنية</option>
                <option value="duplex">دوبلكس</option>
                <option value="villa">فيلا مستقلة</option>
                <option value="townhouse">تاون هاوس</option>
                <option value="penthouse">بنتهاوس</option>
                <option value="commercial">تجاري / إداري</option>
              </select>
            </div>

            {/* Filter 3: Max Cash for Seller */}
            <div className="p-3 bg-surface-50 rounded-2xl border border-surface-200/70">
              <label className="block text-[11px] font-bold text-surface-500 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-brand-700" />
                <span>أقصى كاش للبائع</span>
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs font-bold text-surface-800 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="">أي ميزانية</option>
                <option value="3000000">حتى 3 مليون ج.م</option>
                <option value="5000000">حتى 5 مليون ج.م</option>
                <option value="8000000">حتى 8 مليون ج.م</option>
                <option value="12000000">حتى 12 مليون ج.م</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="h-full flex items-end">
              <button
                type="submit"
                className="w-full h-12 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>بحث في الفرص المعتمدة</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Regional Pills (Matching Image 1) */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-bold text-surface-500 ml-2">المناطق الأكثر طلباً:</span>
          {[
            { label: 'التجمع الخامس', gov: 'القاهرة' },
            { label: 'الشيخ زايد', gov: 'الجيزة' },
            { label: 'العاصمة الإدارية', gov: 'القاهرة' },
            { label: 'المستقبل سيتي', gov: 'القاهرة' },
            { label: 'مدينة 6 أكتوبر', gov: 'الجيزة' },
            { label: 'الساحل الشمالي', gov: 'مطروح (الساحل الشمالي)' },
          ].map((region) => (
            <Link
              key={region.label}
              href={`/units?governorate=${encodeURIComponent(region.gov)}`}
              className="bg-white hover:bg-surface-100 text-surface-700 font-bold px-3 py-1.5 rounded-full border border-surface-200 transition-colors shadow-2xs"
            >
              {region.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
