import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                ع
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-brand-900 tracking-tight">عقار إكزت</span>
                <span className="text-xs text-surface-500 font-medium">منصة التنازل العقاري بدون أوفر</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-surface-700">
            <Link href="/" className="hover:text-brand-700 transition-colors">
              الرئيسية
            </Link>
            <Link href="/units" className="hover:text-brand-700 transition-colors">
              تصفح الوحدات
            </Link>
            <Link href="/calculator" className="hover:text-brand-700 transition-colors">
              حاسبة التنازل
            </Link>
            <Link href="/how-it-works" className="hover:text-brand-700 transition-colors">
              كيف تعمل المنصة
            </Link>
            <Link href="/faq" className="hover:text-brand-700 transition-colors">
              الأسئلة الشائعة
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/cases"
              className="hidden lg:inline-flex text-xs font-semibold text-surface-600 hover:text-brand-700 border border-surface-300 rounded-lg px-3 py-2 transition-colors"
            >
              لوحة العمليات
            </Link>
            <Link
              href="/seller/dashboard"
              className="text-sm font-semibold text-surface-700 hover:text-brand-800 px-3 py-2 transition-colors"
            >
              حساب البائع
            </Link>
            <Link
              href="/seller/new-case"
              className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
            >
              اعرض وحدتك للتخارج
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
