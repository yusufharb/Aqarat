import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { DealStatusBadge } from '@/components/ui/Badge';
import { getDataRepository } from '@/lib/data';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Handshake, Calendar, DollarSign, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';
import type { Deal, AssignmentCase, Property, Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ControlRoomDealsPage() {
  const repo = getDataRepository();
  const deals = await repo.getAllDeals();

  const totalDeals = deals.length;
  const inProgressCount = deals.filter(
    (d) => d.status === 'transfer_in_progress' || d.status === 'developer_approval_pending'
  ).length;

  const dealsWithDetails = await Promise.all(
    deals.map(async (deal: Deal) => {
      const c = await repo.getCaseById(deal.case_id);
      const prop = c ? await repo.getPropertyById(c.property_id) : null;
      const seller = await repo.getProfile(deal.seller_id);
      const buyer = await repo.getProfile(deal.buyer_id);
      return { deal, c, prop, seller, buyer };
    })
  );

  return (
    <AppShell
      activeRole="admin"
      pageTitle="متابعة صفقات التنازل"
      pageSubtitle="إدارة خط سير التنازلات، مواعيد مقر المطور، والتنسيق بين البائع والمشتري"
      primaryAction={{
        label: 'العودة لجدول الحالات',
        href: '/control-room/cases',
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
          {dealsWithDetails.map(({ deal, c, prop, seller, buyer }) => (
            <Card key={deal.id} className="hover:border-surface-300 transition-all">
              <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-surface-700 bg-white border border-surface-200 px-2 py-0.5 rounded">
                    {c ? c.case_number : deal.id}
                  </span>
                  <DealStatusBadge status={deal.status} />
                </div>
                <span className="text-[11px] text-surface-400 font-mono">
                  {formatDate(deal.created_at)}
                </span>
              </CardHeader>

              <CardContent className="space-y-4 text-xs pt-4">
                <div>
                  <span className="font-bold text-surface-900 text-sm block">
                    {prop ? `${prop.developer_name} - ${prop.project_name}` : 'مشروع التنازل'}
                  </span>
                  <span className="text-surface-500">
                    {prop ? `${prop.governorate} • ${prop.city_district}` : ''}
                  </span>
                </div>

                {/* Seller & Buyer Info (Authorized for Ops only) */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-surface-50 rounded-2xl border border-surface-200/70">
                  <div>
                    <span className="text-[10px] text-surface-400 block font-bold">البائع (المالك):</span>
                    <span className="font-bold text-surface-800 block">{seller?.full_name || '—'}</span>
                    <span className="font-mono text-[11px] text-surface-500">{seller?.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-surface-400 block font-bold">المشتري الراغب:</span>
                    <span className="font-bold text-surface-800 block">{buyer?.full_name || '—'}</span>
                    <span className="font-mono text-[11px] text-surface-500">{buyer?.phone || '—'}</span>
                  </div>
                </div>

                <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-200/60 flex items-center justify-between">
                  <span className="text-brand-800 font-bold">الكاش المتفق عليه للتنازل:</span>
                  <span className="font-black text-brand-950 text-sm sm:text-base">
                    {deal.agreed_cash_amount ? formatEGP(deal.agreed_cash_amount) : 'قيد التفاوض'}
                  </span>
                </div>

                {deal.notes && (
                  <div className="p-3 bg-surface-50 rounded-xl text-[11px] text-surface-600 border border-surface-200/60">
                    <strong>ملاحظات المتابعة:</strong> {deal.notes}
                  </div>
                )}
              </CardContent>

              <div className="p-4 px-6 bg-surface-50/40 border-t border-surface-100 flex items-center justify-between text-xs">
                <span className="text-surface-400 text-[11px]">
                  التنازل معتمد لدى خدمة عملاء المطور
                </span>
                <Link
                  href={`/control-room/cases/${deal.case_id}`}
                  className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>ملف الحالة بالكامل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
