import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getDataRepository } from '@/lib/data';
import { formatDate, formatEGP } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminCasesPage() {
  const repo = getDataRepository();
  // Using demo seller ID to get sample cases
  const cases = await repo.getCasesBySeller('11111111-1111-4111-8111-111111111111');

  const statusBadges: Record<string, string> = {
    draft: 'bg-surface-100 text-surface-700',
    submitted: 'bg-blue-100 text-blue-800',
    screening: 'bg-indigo-100 text-indigo-800',
    documents_pending: 'bg-amber-100 text-amber-800',
    in_review: 'bg-purple-100 text-purple-800',
    ready_for_approval: 'bg-cyan-100 text-cyan-800',
    approved: 'bg-emerald-100 text-emerald-800',
    published: 'bg-emerald-600 text-white',
    paused: 'bg-amber-600 text-white',
    closed: 'bg-surface-800 text-white',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-surface-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-900 bg-brand-100 px-3 py-0.5 rounded-full">
                  إدارة العمليات والتدقيق (Backoffice)
                </span>
                <span className="text-xs text-surface-400">صلاحيات: العمليات، التدقيق المالي، الفحص القانوني، النشر</span>
              </div>
              <h1 className="text-3xl font-black text-surface-900">
                لوحة فرز ومتابعة الحالات
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/deals"
                className="text-xs font-bold text-surface-700 bg-white border border-surface-300 px-4 py-2.5 rounded-xl hover:bg-surface-50"
              >
                متابعة الصفقات (Deals)
              </Link>
              <Link
                href="/admin/audit-logs"
                className="text-xs font-bold text-surface-700 bg-white border border-surface-300 px-4 py-2.5 rounded-xl hover:bg-surface-50"
              >
                سجل التدقيق (Audit Logs)
              </Link>
            </div>
          </div>

          {/* Cases Master Table */}
          <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-surface-100 border-b border-surface-200 font-bold text-surface-700">
                    <th className="p-4">رقم القيد</th>
                    <th className="p-4">المشروع والمطور</th>
                    <th className="p-4">الموقع</th>
                    <th className="p-4">نوع الحالة</th>
                    <th className="p-4">حالة الطلب</th>
                    <th className="p-4">المبلغ المطلوب</th>
                    <th className="p-4">تاريخ الإرسال</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {cases.map(async (c) => {
                    const property = await repo.getPropertyById(c.property_id);
                    const contract = property ? await repo.getContractByPropertyId(property.id) : null;
                    const badgeClass = statusBadges[c.status] || 'bg-surface-100 text-surface-700';

                    return (
                      <tr key={c.id} className="hover:bg-surface-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-brand-900">{c.case_number}</td>
                        <td className="p-4 font-bold text-surface-800">
                          {property ? `${property.developer_name} - ${property.project_name}` : '—'}
                        </td>
                        <td className="p-4 text-surface-600">
                          {property ? `${property.governorate} • ${property.city_district}` : '—'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            c.case_nature === 'distress_exit' ? 'bg-amber-100 text-amber-800' : 'bg-surface-100 text-surface-700'
                          }`}>
                            {c.case_nature === 'distress_exit' ? 'تخارج وتعثر' : 'عادي'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-surface-900">
                          {contract ? formatEGP(contract.deposit_paid + contract.installments_paid) : '—'}
                        </td>
                        <td className="p-4 text-surface-500">{formatDate(c.created_at)}</td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/admin/cases/${c.id}`}
                            className="inline-block bg-brand-700 hover:bg-brand-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            فحص واعتماد
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
