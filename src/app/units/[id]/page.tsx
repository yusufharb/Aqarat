import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getDataRepository } from '@/lib/data';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface UnitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { id } = await params;
  const repo = getDataRepository();
  const listing = await repo.getPublicListingById(id);

  if (!listing) {
    notFound();
  }

  const { property, total_contract_price, total_paid, remaining_balance, developer_transfer_fee } = listing;

  const unitTypeLabels: Record<string, string> = {
    apartment: 'شقة سكنية',
    duplex: 'دوبلكس',
    villa: 'فيلا مستقلة',
    townhouse: 'تاون هاوس',
    penthouse: 'بنتهاوس',
    studio: 'استوديو',
    commercial: 'تجاري',
    administrative: 'إداري',
    medical: 'طبي',
    other: 'وحدة عقارية',
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-surface-500 mb-6">
            <Link href="/" className="hover:text-brand-800">الرئيسية</Link>
            <span>/</span>
            <Link href="/units" className="hover:text-brand-800">الوحدات المعتمدة</Link>
            <span>/</span>
            <span className="text-surface-800 font-bold">{listing.case_number}</span>
          </nav>

          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-100">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-brand-900 bg-brand-100 px-3 py-1 rounded-full">
                    {property.developer_name}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    ✓ اجتازت بوابات النشر الـ 9
                  </span>
                </div>
                <h1 className="text-3xl font-black text-surface-900">
                  {property.project_name} - {unitTypeLabels[property.unit_type] || property.unit_type}
                </h1>
                <p className="text-sm text-surface-500 mt-1">
                  {property.governorate} • {property.city_district} • رقم القيد: {listing.case_number}
                </p>
              </div>

              <div className="text-left bg-brand-50 p-4 rounded-2xl border border-brand-200/60">
                <span className="text-xs text-brand-800 block">المبلغ المطلوب للبائع (كاش):</span>
                <span className="text-2xl font-black text-brand-900">
                  {formatEGP(total_paid.amount)}
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center text-xs">
              <div className="p-3 bg-surface-50 rounded-xl">
                <div className="text-surface-500 mb-1">المساحة التعاقدية</div>
                <div className="font-bold text-surface-800">{property.area_sqm ? `${property.area_sqm} م²` : 'مدونة بالعقد'}</div>
              </div>
              <div className="p-3 bg-surface-50 rounded-xl">
                <div className="text-surface-500 mb-1">الدور</div>
                <div className="font-bold text-surface-800">{property.floor_number ? `الدور ${property.floor_number}` : 'وفق المخطط'}</div>
              </div>
              <div className="p-3 bg-surface-50 rounded-xl">
                <div className="text-surface-500 mb-1">حالة التسليم</div>
                <div className="font-bold text-surface-800">
                  {property.delivery_status === 'delivered' ? 'مستلمة بالفعل' : 'تحت الإنشاء'}
                </div>
              </div>
              <div className="p-3 bg-surface-50 rounded-xl">
                <div className="text-surface-500 mb-1">موعد الاستلام</div>
                <div className="font-bold text-surface-800">
                  {property.expected_delivery_date || 'موضح بملف الوحدة'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Financial Breakdown (2 Cols) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs">
                <h3 className="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
                  <span>📊 التفصيل المالي المعتمد</span>
                  <span className="text-xs font-normal text-surface-500">(بناءً على كشوف حساب المطور الرسمية)</span>
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-surface-100">
                    <div>
                      <span className="font-bold text-surface-800 block">إجمالي سعر التعاقد الأصلي:</span>
                      <span className="text-xs text-surface-500">سعر الوحدة القديم المثبت بالعقد بدون زيادات</span>
                    </div>
                    <span className="font-bold text-surface-900">
                      {formatEGP(total_contract_price.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-surface-100 bg-brand-50/60 p-3 rounded-xl">
                    <div>
                      <span className="font-bold text-brand-900 block">المبلغ المطلوب للبائع (كاش):</span>
                      <span className="text-xs text-brand-700">مجموع الدفعة المقدمة والأقساط المسددة للمطور</span>
                    </div>
                    <span className="text-base font-black text-brand-900">
                      {formatEGP(total_paid.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-surface-100">
                    <div>
                      <span className="font-bold text-surface-800 block">الأقساط المتبقية للمطور:</span>
                      <span className="text-xs text-surface-500">يستكملها المشتري مباشرة مع المطور العقاري</span>
                    </div>
                    <span className="font-bold text-surface-900">
                      {formatEGP(remaining_balance.amount)}
                    </span>
                  </div>

                  {listing.installment_value && (
                    <div className="flex justify-between items-center pb-3 border-b border-surface-100">
                      <div>
                        <span className="font-bold text-surface-800 block">قيمة القسط الدوري:</span>
                        <span className="text-xs text-surface-500">تكرار السداد: {listing.installment_frequency === 'monthly' ? 'شهري' : 'ربع سنوي'}</span>
                      </div>
                      <span className="font-bold text-surface-900">
                        {formatEGP(listing.installment_value)}
                      </span>
                    </div>
                  )}

                  {developer_transfer_fee && (
                    <div className="flex justify-between items-center pt-1 text-surface-700">
                      <div>
                        <span className="font-bold block">رسوم التنازل المقررة للمطور:</span>
                        <span className="text-xs text-surface-500">وفق لائحة خدمة عملاء المطور</span>
                      </div>
                      <span className="font-bold">
                        {formatEGP(developer_transfer_fee.amount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-surface-100 text-xs text-surface-500 flex justify-between items-center">
                  <span>تاريخ آخر تدقيق مالي:</span>
                  <span className="font-semibold text-surface-700">
                    {listing.last_verified_at ? formatDate(listing.last_verified_at) : 'حديثاً'}
                  </span>
                </div>
              </div>

              {/* Legal Checklist Box */}
              <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs">
                <h3 className="text-lg font-bold text-surface-900 mb-4">
                  🛡️ الضمانات القانونية والتشغيلية لهذه الوحدة
                </h3>
                <ul className="space-y-3 text-xs text-surface-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>تم فحص العقد الأصلي وإيصالات السداد وكشف حساب الأقساط من قِبل الفريق القانوني.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>تم التحقق من مطابقة شروط التنازل مع سياسة المطور العقاري ({property.developer_name}).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>يتم نقل الملكية وتوقيع ملحق التنازل بحضور الطرفين بمقر خدمة عملاء المطور المعتمد.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>عمولة المنصة مجانية 100% خلال فترة الإطلاق لكلا الطرفين (0% عمولة).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interest CTA Box (1 Col) */}
            <div>
              <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs sticky top-28">
                <h3 className="text-lg font-bold text-surface-900 mb-2">
                  هل هذه الفرصة مناسبة لك؟
                </h3>
                <p className="text-xs text-surface-500 mb-6 leading-relaxed">
                  سجل اهتمامك الآن للتواصل معك وترتيب استكمال الاستفسارات ومرافقتك في إجراءات التنازل بمقر المطور.
                </p>

                <form className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1">الاسم بالكامل</label>
                    <input
                      type="text"
                      placeholder="أدخل اسمك الكريم"
                      className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1">رقم الهاتف (واتساب)</label>
                    <input
                      type="tel"
                      placeholder="010xxxxxxxx"
                      className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1">الميزانية النقدية المتاحة (كاش)</label>
                    <input
                      type="number"
                      placeholder="مثال: 2000000"
                      className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1">أقصى قسط مريح دورياً</label>
                    <input
                      type="number"
                      placeholder="مثال: 200000"
                      className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold py-3.5 rounded-xl shadow-sm transition-colors mt-2"
                  >
                    إرسال طلب اهتمام بالوحدة (مجاناً)
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-surface-100 text-[11px] text-surface-400 text-center">
                  🔒 بياناتك مشفرة ولا يتم مشاركتها إلا مع فريق المراجعة والتشغيل.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
