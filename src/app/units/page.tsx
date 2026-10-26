import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UnitCard } from '@/components/units/UnitCard';
import { getDataRepository } from '@/lib/data';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

interface UnitsPageProps {
  searchParams: Promise<{
    governorate?: string;
    developer?: string;
    type?: string;
    maxPrice?: string;
  }>;
}

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
  const params = await searchParams;
  const repo = getDataRepository();

  const [listings, governorates, developers] = await Promise.all([
    repo.getPublicListings({
      governorate: params.governorate,
      developer_name: params.developer,
      unit_type: params.type,
      max_price: params.maxPrice ? Number(params.maxPrice) : undefined,
    }),
    repo.getGovernorates(),
    repo.getDevelopers(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-surface-900 mb-2">
              الوحدات المعتمدة للتنازل
            </h1>
            <p className="text-surface-600 text-sm">
              استعرض وحدات التقسيط المتاحة بأسعار التعاقد القديمة وبدون أي أوفر في مختلف محافظات مصر.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-xs mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-surface-700 ml-2">تصفية سريعة:</span>

              <Link
                href="/units"
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                  !params.governorate && !params.developer
                    ? 'bg-brand-700 text-white border-brand-700 font-bold'
                    : 'bg-surface-50 text-surface-600 border-surface-200 hover:border-surface-300'
                }`}
              >
                الكل ({listings.length})
              </Link>

              {governorates.map((gov) => (
                <Link
                  key={gov}
                  href={`/units?governorate=${encodeURIComponent(gov)}`}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                    params.governorate === gov
                      ? 'bg-brand-700 text-white border-brand-700 font-bold'
                      : 'bg-surface-50 text-surface-600 border-surface-200 hover:border-surface-300'
                  }`}
                >
                  {gov}
                </Link>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {listings.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon="🔍"
                title="لا توجد وحدات تطابق معايير البحث الحالية"
                description="جرب تعديل الفلاتر أو إزالة شروط البحث للاطلاع على كافة الفرص المعتمدة المتاحة."
                actionText="إعادة ضبط الفلاتر وعرض الكل"
                actionHref="/units"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <UnitCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
