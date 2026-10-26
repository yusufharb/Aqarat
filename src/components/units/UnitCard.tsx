import Link from 'next/link';
import { PublicListing } from '@/lib/types';
import { formatEGP, formatDate } from '@/lib/utils';

export function UnitCard({ listing }: { listing: PublicListing }) {
  const { property, total_paid, remaining_balance, total_contract_price } = listing;

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
    <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
      {/* Top Banner with Developer and Project */}
      <div className="p-5 pb-4 border-b border-surface-100 flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md inline-block mb-1.5">
            {property.developer_name}
          </span>
          <h3 className="text-lg font-black text-surface-900 leading-tight">
            {property.project_name}
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">
            {property.governorate} • {property.city_district}
          </p>
        </div>

        <div className="shrink-0 text-left">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span>✓</span>
            <span>مراجعة معتمدة</span>
          </span>
        </div>
      </div>

      {/* Property Specs */}
      <div className="px-5 py-3 bg-surface-50/60 border-b border-surface-100 flex items-center justify-between text-xs text-surface-600 font-medium">
        <div>{unitTypeLabels[property.unit_type] || property.unit_type}</div>
        <div>{property.area_sqm ? `${property.area_sqm} م²` : 'المساحة بالعقد'}</div>
        <div>
          {property.delivery_status === 'delivered' ? 'مستلمة' : property.expected_delivery_date || 'تحت الإنشاء'}
        </div>
      </div>

      {/* Financial Breakdown Table */}
      <div className="p-5 space-y-3 flex-1 text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-surface-100">
          <span className="text-surface-600">إجمالي سعر التعاقد الأصلي:</span>
          <span className="font-bold text-surface-800">
            {formatEGP(total_contract_price.amount)}
          </span>
        </div>

        <div className="flex justify-between items-center bg-brand-50/70 p-2.5 rounded-xl border border-brand-200/50">
          <div>
            <span className="font-black text-brand-900 block">المبلغ المطلوب للبائع (كاش):</span>
            <span className="text-[10px] text-brand-700">المدفوع من مقدم وأقساط سابقة</span>
          </div>
          <span className="text-sm font-black text-brand-900">
            {formatEGP(total_paid.amount)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-surface-600">الأقساط المتبقية للمطور:</span>
          <span className="font-bold text-surface-800">
            {formatEGP(remaining_balance.amount)}
          </span>
        </div>

        {listing.installment_value && (
          <div className="flex justify-between items-center text-[11px] text-surface-500">
            <span>قيمة القسط الدوري:</span>
            <span>
              {formatEGP(listing.installment_value)} ({listing.installment_frequency === 'monthly' ? 'شهري' : 'ربع سنوي'})
            </span>
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="p-5 pt-3 border-t border-surface-100 bg-surface-50/40 flex items-center justify-between">
        <div className="text-[10px] text-surface-400">
          آخر تحقق: {listing.last_verified_at ? formatDate(listing.last_verified_at) : 'حديثاً'}
        </div>

        <Link
          href={`/units/${listing.id}`}
          className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <span>تفاصيل الفرصة</span>
          <span>←</span>
        </Link>
      </div>
    </div>
  );
}
