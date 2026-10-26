import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ComparisonTable } from '@/components/home/ComparisonTable';
import { HowItWorksTimeline } from '@/components/home/HowItWorksTimeline';
import { UnitCard } from '@/components/units/UnitCard';
import { getDataRepository } from '@/lib/data';

export default async function HomePage() {
  const repo = getDataRepository();
  const featuredListings = await repo.getPublicListings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Opportunities Section */}
        <section className="py-20 bg-surface-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3 py-1 rounded-full inline-block mb-3">
                  فرص موثقة بأسعار التعاقد القديمة
                </span>
                <h2 className="text-3xl font-black text-surface-900 tracking-tight">
                  أحدث الوحدات المعتمدة للتنازل
                </h2>
                <p className="text-surface-600 text-sm mt-1">
                  جميع الوحدات تم تدقيق عقودها وإيصالات سدادها ومطابقتها مع سياسة المطور.
                </p>
              </div>

              <Link
                href="/units"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-800 hover:text-brand-900"
              >
                <span>عرض كافة الوحدات في مصر ({featuredListings.length})</span>
                <span>←</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <UnitCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* How It Works Timeline */}
        <HowItWorksTimeline />

        {/* Quick CTA Banner */}
        <section className="py-16 bg-surface-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-900 rounded-3xl p-8 sm:p-12 text-white text-center border border-brand-800 shadow-sm relative overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-black mb-3">
                هل تواجه صعوبة في استكمال أقساط وحدتك العقارية؟
              </h2>
              <p className="text-brand-100 text-xs sm:text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                لا تلجأ لفسخ العقد وخسارة 15% من ثمن الوحدة وانتظار سنوات. استرد مدفوعاتك كاش فوراً عبر التنازل المنظم لمشترٍ جاد بدون أي عمولات.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/seller/new-case"
                  className="w-full sm:w-auto bg-white hover:bg-surface-100 text-surface-900 font-bold px-7 py-3 rounded-xl shadow-xs transition-colors text-xs sm:text-sm"
                >
                  ابدأ مسودة طلب التخارج مجاناً
                </Link>
                <Link
                  href="/calculator"
                  className="w-full sm:w-auto bg-brand-800 hover:bg-brand-700 text-white border border-brand-700 font-bold px-7 py-3 rounded-xl transition-colors text-xs sm:text-sm"
                >
                  احسب خسائر الإلغاء مقابل التنازل
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
