import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-100 border border-brand-300 text-brand-900 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span>🛡️ الإطلاق الأول مجاني بالكامل</span>
            <span className="text-brand-400">•</span>
            <span>بدون أي عمولات على البائع أو المشتري</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-900 tracking-tight leading-[1.15] mb-6">
            تخارج آمن من وحدتك العقارية..{' '}
            <span className="text-brand-700 underline decoration-brand-300 decoration-wavy underline-offset-8">
              بدون أوفر وبأعلى شفافية
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-surface-600 leading-relaxed mb-10">
            البديل القانوني المنظم لفسخ التعاقد وغرامات المطورين. نساعد البائع الراغب في التخارج على استرداد مدفوعاته كاش، ونمنح المشتري فرصة اقتناص وحدات بأسعار التعاقد القديمة مع استكمال جدول الأقساط.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/seller/new-case"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-base font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>اعرض وحدتك للتخارج الآن</span>
              <span>←</span>
            </Link>
            <Link
              href="/units"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-surface-50 text-surface-800 border-2 border-surface-300 text-base font-bold px-8 py-4 rounded-2xl hover:border-surface-400 transition-all"
            >
              <span>تصفح الفرص المعتمدة للمشترين</span>
            </Link>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-surface-200 text-right">
            <div className="p-3 bg-white rounded-xl border border-surface-200/80 shadow-xs">
              <div className="text-xl mb-1">0%</div>
              <div className="text-xs font-bold text-surface-800">عمولة المنصة</div>
              <div className="text-[11px] text-surface-500">مجاناً طوال فترة الإطلاق</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-surface-200/80 shadow-xs">
              <div className="text-xl mb-1">100%</div>
              <div className="text-xs font-bold text-surface-800">سعر العقد القديم</div>
              <div className="text-[11px] text-surface-500">بدون أوفر أو مبالغات</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-surface-200/80 shadow-xs">
              <div className="text-xl mb-1">9</div>
              <div className="text-xs font-bold text-surface-800">بوابات تحقق إلزامية</div>
              <div className="text-[11px] text-surface-500">مراجعة قانونية ومالية</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-surface-200/80 shadow-xs">
              <div className="text-xl mb-1">🏢</div>
              <div className="text-xs font-bold text-surface-800">بمقر المطور الرسمي</div>
              <div className="text-[11px] text-surface-500">نقل التعاقد بحضور الطرفين</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
