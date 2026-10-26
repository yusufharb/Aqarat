import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatEGP } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDealsPage() {
  const deals = [
    {
      id: 'deal-1',
      case_number: 'CAS-2026-001',
      developer_project: 'إعمار مصر - ميفيدا',
      buyer_name: 'عمر فاروق الشناوي',
      seller_name: 'أحمد محمد محمود',
      status: 'transfer_in_progress',
      status_label: 'جاري التنازل بمقر المطور',
      agreed_amount: 3200000,
      meeting_date: '2026-03-05',
    },
    {
      id: 'deal-2',
      case_number: 'CAS-2026-002',
      developer_project: 'سودIC - إيست تاون',
      buyer_name: 'منى إبراهيم حسن',
      seller_name: 'سارة عبدالله إبراهيم',
      status: 'offer_accepted',
      status_label: 'تم قبول العرض / بانتظار موعد المطور',
      agreed_amount: 4000000,
      meeting_date: '2026-03-10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-surface-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-900 bg-brand-100 px-3 py-0.5 rounded-full">
                  إدارة الصفقات (Deals Pipeline)
                </span>
              </div>
              <h1 className="text-3xl font-black text-surface-900">
                متابعة صفقات التنازل الجارية
              </h1>
            </div>

            <Link
              href="/admin/cases"
              className="text-xs font-bold text-surface-700 bg-white border border-surface-300 px-4 py-2.5 rounded-xl hover:bg-surface-50"
            >
              ← العودة لجدول الحالات
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs space-y-4 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-brand-900 text-sm block">
                      {deal.case_number}
                    </span>
                    <span className="font-black text-base text-surface-900">
                      {deal.developer_project}
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px]">
                    {deal.status_label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-surface-100">
                  <div>
                    <span className="text-surface-500 block">البائع:</span>
                    <span className="font-bold text-surface-800">{deal.seller_name}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">المشتري:</span>
                    <span className="font-bold text-surface-800">{deal.buyer_name}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">المبلغ المتفق عليه كاش:</span>
                    <span className="font-black text-brand-900 text-sm">
                      {formatEGP(deal.agreed_amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">موعد مقر المطور:</span>
                    <span className="font-bold text-surface-800">{deal.meeting_date}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-surface-400">
                    العمولة في الإطلاق: 0 ج.م (مجاناً)
                  </span>
                  <button
                    type="button"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    تحديث مرحلة الصفقة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
