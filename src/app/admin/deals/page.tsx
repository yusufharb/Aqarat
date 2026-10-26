import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DealStatusBadge } from '@/components/ui/Badge';
import { getDataRepository } from '@/lib/data';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Handshake, Calendar, DollarSign, ArrowRight, UserCheck } from 'lucide-react';

export default async function AdminDealsPage() {
  const repo = getDataRepository();
  const deals = await repo.getAllDeals();

  const totalDeals = deals.length;
  const inProgressCount = deals.filter((d) => d.status === 'transfer_in_progress' || d.status === 'developer_approval_pending').length;

  return (
    <AppShell
      activeRole="admin"
      pageTitle="متابعة صفقات التنازل"
      pageSubtitle="إدارة خط سير التنازلات، مواعيد مقر المطور، والتنسيق بين البائع والمشتري"
      primaryAction={{
        label: 'العودة لجدول الحالات',
        href: '/admin/cases',
        icon: <ArrowRight className="w-4 h-4" />,
      }}
    >
      <div className="space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            title="إجمالي الصفقات"
            value={totalDeals}
            subtitle="صفقات بمختلف المراحل"
            icon={<Handshake className="w-5 h-5" />}
            highlightColor="brand"
          />
          <StatCard
            title="بانتظار مقر المطور"
            value={inProgressCount}
            subtitle="مواعيد خدمة العملاء"
            icon={<Calendar className="w-5 h-5" />}
            highlightColor="amber"
          />
          <StatCard
            title="عمولة المنصة المقررة"
            value="0 ج.م"
            subtitle="مجاناً بالكامل طوال الإطلاق"
            icon={<DollarSign className="w-5 h-5" />}
            highlightColor="brand"
          />
        </div>

        {/* Deals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map(async (deal) => {
            const c = await repo.getCaseById(deal.case_id);
            const prop = c ? await repo.getPropertyById(c.property_id) : null;
            const seller = await repo.getProfile(deal.seller_id);
            const buyer = await repo.getProfile(deal.buyer_id);

            return (
              <Card key={deal.id} className="hover:border-surface-300 transition-all">
                <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-surface-700 bg-white border border-surface-200 px-2 py-0.5 rounded">
                      {c ? c.case_number : deal.id}
                    </span>
                    <DealStatusBadge status={deal.status} />
                  </div>
                  <span className="text-[11px] text-surface-400">
                    {formatDate(deal.created_at)}
                  </span>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs">
                  <div>
                    <span className="font-bold text-surface-900 text-sm block">
                      {prop ? `${prop.developer_name} - ${prop.project_name}` : 'مشروع التنازل'}
                    </span>
                    <span className="text-surface-500">
                      {prop ? `${prop.governorate} • ${prop.city_district}` : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                    <div>
                      <span className="text-surface-400 block mb-0.5">البائع:</span>
                      <span className="font-bold text-surface-800">{seller ? seller.full_name : 'بائع معتمد'}</span>
                    </div>
                    <div>
                      <span className="text-surface-400 block mb-0.5">المشتري:</span>
                      <span className="font-bold text-surface-800">{buyer ? buyer.full_name : 'مشتري معتمد'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-brand-800 font-bold block">المبلغ المتفق عليه كاش:</span>
                      <span className="text-[10px] text-brand-600">يسدد للبائع بمقر المطور</span>
                    </div>
                    <span className="font-black text-brand-950 text-sm sm:text-base">
                      {deal.agreed_cash_amount ? formatEGP(deal.agreed_cash_amount) : 'قيد التدقيق'}
                    </span>
                  </div>

                  {deal.notes && (
                    <div className="p-2.5 bg-surface-50 rounded-xl text-[11px] text-surface-600 border border-surface-200/60">
                      <strong>الملاحظات التشغيلية:</strong> {deal.notes}
                    </div>
                  )}
                </CardContent>

                <div className="p-4 px-6 bg-surface-50/40 border-t border-surface-100 flex items-center justify-between text-xs">
                  <span className="text-surface-400 text-[11px]">
                    التنازل بحضور الطرفين وممثل المطور
                  </span>
                  <Link
                    href={`/admin/cases/${deal.case_id}`}
                    className="font-bold text-brand-700 hover:text-brand-800"
                  >
                    تفاصيل ملف الحالة ←
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
