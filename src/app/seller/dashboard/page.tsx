import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getDataRepository } from '@/lib/data';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function SellerDashboardPage() {
  const repo = getDataRepository();
  // Using demo seller ID for preview
  const sellerId = '11111111-1111-4111-8111-111111111111';
  const cases = await repo.getCasesBySeller(sellerId);

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'مسودة قيد الإكمال', color: 'bg-surface-100 text-surface-700' },
    submitted: { label: 'تم الإرسال للمراجعة', color: 'bg-blue-100 text-blue-800' },
    screening: { label: 'قيد الفرز الأولي', color: 'bg-indigo-100 text-indigo-800' },
    documents_pending: { label: 'بانتظار استكمال مستندات', color: 'bg-amber-100 text-amber-800' },
    in_review: { label: 'قيد المراجعة المالية والقانونية', color: 'bg-purple-100 text-purple-800' },
    ready_for_approval: { label: 'مكتملة ومستعدة للاعتماد', color: 'bg-cyan-100 text-cyan-800' },
    approved: { label: 'معتمدة للنشر', color: 'bg-emerald-100 text-emerald-800' },
    published: { label: 'منشورة بالكتالوج العام', color: 'bg-emerald-600 text-white' },
    paused: { label: 'متوقفة مؤقتاً', color: 'bg-amber-600 text-white' },
    closed: { label: 'مغلقة / تمت الصفقة', color: 'bg-surface-700 text-white' },
    rejected: { label: 'مرفوضة لعدم الأهلية', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-surface-200 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3 py-1 rounded-full inline-block mb-2">
                لوحة تحكم البائع
              </span>
              <h1 className="text-3xl font-black text-surface-900">
                طلبات التنازل الخاصة بك
              </h1>
              <p className="text-xs sm:text-sm text-surface-500 mt-1">
                تابع حالة طلباتك، وملاحظات فريق المراجعة القانونية والمالية خطوة بخطوة.
              </p>
            </div>

            <Link
              href="/seller/new-case"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors"
            >
              <span>+ إضافة طلب تنازل جديد</span>
            </Link>
          </div>

          {/* Cases List */}
          {cases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-surface-200">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-base font-bold text-surface-800 mb-1">
                لا توجد لديك أي طلبات تنازل حالياً
              </h3>
              <p className="text-xs text-surface-500 mb-6">
                ابدأ بإنشاء مسودة طلب تنازل لرفع بيانات وحدتك واسترداد أموالك كاش.
              </p>
              <Link
                href="/seller/new-case"
                className="inline-block bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                إنشاء أول طلب تنازل
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map(async (c) => {
                const property = await repo.getPropertyById(c.property_id);
                const contract = property ? await repo.getContractByPropertyId(property.id) : null;
                const statusInfo = statusLabels[c.status] || { label: c.status, color: 'bg-surface-100 text-surface-700' };

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl p-6 border border-surface-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-surface-600 bg-surface-100 px-2.5 py-1 rounded-md">
                          {c.case_number}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {c.is_private_listing && (
                          <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            عرض خاص سري
                          </span>
                        )}
                        <span className="text-xs text-surface-400">
                          {c.case_nature === 'distress_exit' ? 'حالة تعثر وتخارج' : 'تنازل عادي'}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-surface-900">
                        {property ? `${property.developer_name} - ${property.project_name}` : 'بيانات الوحدة'}
                      </h3>

                      <p className="text-xs text-surface-500">
                        {property ? `${property.governorate} • ${property.city_district}` : ''} • تم الإنشاء:{' '}
                        {formatDate(c.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 text-xs">
                      {contract && (
                        <div className="text-right">
                          <span className="text-surface-500 block">المبلغ المطلوب للبائع:</span>
                          <span className="text-base font-black text-brand-900">
                            {formatEGP(contract.deposit_paid + contract.installments_paid)}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-2">
                        {c.status === 'draft' ? (
                          <Link
                            href="/seller/new-case"
                            className="bg-brand-700 hover:bg-brand-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
                          >
                            استكمال المسودة والإرسال
                          </Link>
                        ) : (
                          <span className="text-xs text-surface-500 font-medium py-1">
                            قيد المتابعة لدى الإدارة
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
