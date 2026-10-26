import React from 'react';
import Link from 'next/link';
import { PublicListing } from '@/lib/types';
import { formatEGP } from '@/lib/utils';
import { Building, MapPin, Calendar, CheckCircle2, ArrowLeft, ArrowUpRight } from 'lucide-react';

export function UnitCard({ listing }: { listing: PublicListing }) {
  const { property, total_paid, remaining_balance, total_contract_price } = listing;

  const unitTypeLabels: Record<string, string> = {
    apartment: 'شقة سكنية',
    duplex: 'دوبلكس فاخر',
    villa: 'فيلا مستقلة',
    townhouse: 'تاون هاوس',
    penthouse: 'بنتهاوس',
    studio: 'استوديو',
    commercial: 'محل تجاري',
    administrative: 'مكتب إداري',
    medical: 'عيادة طبية',
    other: 'وحدة عقارية',
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-200 shadow-xs hover:shadow-md hover:border-surface-300 transition-all flex flex-col overflow-hidden group">
      {/* Card Header & Developer Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-lg">
            {property.developer_name}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>مراجعة معتمدة</span>
          </span>
        </div>

        <h3 className="text-base font-black text-surface-900 group-hover:text-brand-800 transition-colors leading-snug">
          {property.project_name} • {unitTypeLabels[property.unit_type] || property.unit_type}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-surface-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-surface-400 shrink-0" />
          <span>{property.governorate}، {property.city_district}</span>
        </div>
      </div>

      {/* Property Specs Pill Row */}
      <div className="px-5 py-2.5 bg-surface-50/70 border-y border-surface-100 flex items-center justify-between text-xs text-surface-600 font-semibold">
        <div className="flex items-center gap-1">
          <Building className="w-3.5 h-3.5 text-surface-400" />
          <span>{property.area_sqm ? `${property.area_sqm} م²` : 'المساحة بالعقد'}</span>
        </div>
        <div>
          {property.floor_number ? `الدور ${property.floor_number}` : 'وفق المخطط'}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-surface-400" />
          <span>{property.delivery_status === 'delivered' ? 'مستلمة' : property.expected_delivery_date || 'تحت الإنشاء'}</span>
        </div>
      </div>

      {/* Financial Numbers Card Content */}
      <div className="p-5 flex-1 space-y-2.5 text-xs">
        <div className="bg-brand-50/70 p-3 rounded-2xl border border-brand-200/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-brand-900 block leading-tight">
              المطلوب كاش للبائع:
            </span>
            <span className="text-[10px] text-brand-700">المدفوع من مقدم وأقساط سابقة</span>
          </div>
          <span className="text-sm sm:text-base font-black text-brand-900">
            {formatEGP(total_paid.amount)}
          </span>
        </div>

        <div className="flex items-center justify-between text-surface-600 pt-1 px-1">
          <span>إجمالي العقد القديم:</span>
          <span className="font-bold text-surface-800">{formatEGP(total_contract_price.amount)}</span>
        </div>

        <div className="flex items-center justify-between text-surface-600 px-1">
          <span>المتبقي للمطور:</span>
          <span className="font-bold text-surface-800">{formatEGP(remaining_balance.amount)}</span>
        </div>

        {listing.installment_value && (
          <div className="flex items-center justify-between text-surface-500 text-[11px] px-1">
            <span>القسط الدوري:</span>
            <span>
              {formatEGP(listing.installment_value)} ({listing.installment_frequency === 'monthly' ? 'شهري' : 'ربع سنوي'})
            </span>
          </div>
        )}
      </div>

      {/* Card Footer Action */}
      <div className="p-5 pt-3 border-t border-surface-100 flex items-center justify-between">
        <span className="text-[10px] text-surface-400">
          القيد: {listing.case_number}
        </span>

        <Link
          href={`/units/${listing.id}`}
          className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <span>تفاصيل الفرصة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
