import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DealStatusBadge, Badge } from '@/components/ui/Badge';
import { UnitCard } from '@/components/units/UnitCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDataRepository } from '@/lib/data';
import { getCurrentSession } from '@/lib/auth/session';
import { formatEGP, formatDate } from '@/lib/utils';
import type { Deal, PublicListing, Lead } from '@/lib/types';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Bookmark,
  FileText,
  Handshake,
  DollarSign,
  Search,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export default async function BuyerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/auth/login?returnUrl=/buyer/dashboard');
  }

  const repo = getDataRepository();
  const buyerId = session.userId;

  const [savedListings, leads, deals, preferences] = await Promise.all([
    repo.getBuyerSavedListings(buyerId),
    repo.getBuyerLeads(buyerId),
    repo.getBuyerDeals(buyerId),
    repo.getBuyerPreferences(buyerId),
  ]);

  const dealsWithDetails = await Promise.all(
    deals.map(async (deal: Deal) => {
      const c = await repo.getCaseById(deal.case_id);
      const prop = c ? await repo.getPropertyById(c.property_id) : null;
      return { deal, c, prop };
    })
  );

  return (
    <AppShell
      activeRole="buyer"
      pageTitle="لوحة تحكم المشتري"
      pageSubtitle="متابعة الفرص المحفوظة، طلبات الاهتمام، ومسار التنازل الرسمي بمقر المطور"
      primaryAction={{
        label: 'تصفح الكتالوج المعتمد',
        href: '/units',
        icon: <Search className="w-4 h-4" />,
      }}
    >
      <div className="space-y-8">
        {/* KPI Stat Cards (Matching Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="الوحدات المحفوظة"
            value={savedListings.length}
            subtitle="فرص بأسعار تعاقد قديمة"
            icon={<Bookmark className="w-5 h-5" />}
            highlightColor="brand"
            actionLink={{ label: 'عرض المحفوظات', href: '#saved' }}
          />
          <StatCard
            title="طلبات الاستفسار والاهتمام"
            value={leads.length}
            subtitle="طلبات نشطة للمعاينة"
            icon={<FileText className="w-5 h-5" />}
            highlightColor="blue"
            actionLink={{ label: 'متابعة الطلبات', href: '#leads' }}
          />
          <StatCard
            title="الصفقات الجارية"
            value={deals.length}
            subtitle="مراحل التنازل مع المطور"
            icon={<Handshake className="w-5 h-5" />}
            highlightColor="amber"
            actionLink={{ label: 'متابعة الصفقات', href: '#deals' }}
          />
          <StatCard
            title="الميزانية النقدية المحددة"
            value={preferences ? formatEGP(preferences.budget_cash) : '—'}
            subtitle={preferences ? `أقصى قسط: ${formatEGP(preferences.max_installment_value)}` : 'غير محددة'}
            icon={<DollarSign className="w-5 h-5" />}
            highlightColor="purple"
            actionLink={{ label: 'تعديل التفضيلات', href: '#preferences' }}
          />
        </div>

        {/* Reassurance Banner */}
        <AlertBanner
          variant="brand"
          title="ضمان سلامة الإجراءات ونقل الملكية بمقر المطور"
          description="جميع الصفقات تتم مباشرة في مقر خدمة عملاء الشركة المطورة وبحضور الطرفين لنقل العقد واستكمال الأقساط القديمة رسمياً."
          badgeText="حماية المشتري"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-300" />}
        />

        {/* Section 1: Active Deals */}
        <div id="deals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-surface-900 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-brand-700" />
              <span>الصفقات الجارية ومراحل التنازل ({deals.length})</span>
            </h2>
            <span className="text-xs text-surface-400">متابعة إجراءات التنازل الرسمي بمقر المطور</span>
          </div>

          {deals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-xs text-surface-500">
                لا توجد صفقات جارية حالياً. عند قبول عرضك على إحدى الوحدات، ستظهر تفاصيل موعد التنازل هنا.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dealsWithDetails.map(({ deal, c, prop }) => (
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

                  <CardContent className="space-y-3 text-xs pt-4">
                    <div>
                      <span className="font-bold text-surface-900 text-sm block">
                        {prop ? `${prop.developer_name} - ${prop.project_name}` : 'مشروع التنازل'}
                      </span>
                      <span className="text-surface-500">
                        {prop ? `${prop.governorate} • ${prop.city_district}` : ''}
                      </span>
                    </div>

                    <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-brand-800 font-bold block">المبلغ المتفق عليه كاش:</span>
                        <span className="text-[10px] text-brand-600">يسدد للبائع بمقر المطور</span>
                      </div>
                      <span className="font-black text-brand-950 text-sm sm:text-base">
                        {deal.agreed_cash_amount ? formatEGP(deal.agreed_cash_amount) : 'قيد التفاوض النهائي'}
                      </span>
                    </div>

                    {deal.notes && (
                      <div className="p-2.5 bg-surface-50 rounded-xl text-[11px] text-surface-600 border border-surface-200/60">
                        <strong>المرحلة الحالية:</strong> {deal.notes}
                      </div>
                    )}
                  </CardContent>

                  <div className="p-4 px-6 bg-surface-50/40 border-t border-surface-100 flex items-center justify-between text-xs">
                    <span className="text-surface-400 text-[11px]">
                      التنازل بحضور الطرفين وممثل المطور
                    </span>
                    <Link
                      href={`/units/${deal.case_id}`}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    >
                      <span>مراجعة بيانات الوحدة</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Saved / Favorite Listings */}
        <div id="saved" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-surface-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-brand-700" />
              <span>الوحدات المحفوظة ({savedListings.length})</span>
            </h2>
            <Link href="/units" className="text-xs font-bold text-brand-700 hover:text-brand-800">
              تصفح المزيد من الوحدات ←
            </Link>
          </div>

          {savedListings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-xs text-surface-500">
                لم تقم بحفظ أي وحدات بعد. يمكنك حفظ أي فرصة بالضغط على زر الحفظ في الكتالوج.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map((listing: PublicListing) => (
                <UnitCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Submitted Inquiries (Leads) */}
        <div id="leads" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-surface-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-700" />
              <span>طلبات الاهتمام والاستفسارات السابقة ({leads.length})</span>
            </h2>
            <span className="text-xs text-surface-400">سجل تواصلك مع فريق الفحص</span>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-surface-100 border-b border-surface-200 font-bold text-surface-700">
                    <th className="p-4">تاريخ الطلب</th>
                    <th className="p-4">رسالتك واستفسارك</th>
                    <th className="p-4">الكاش المتاح</th>
                    <th className="p-4">القسط المريح</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {leads.map((lead: Lead) => (
                    <tr key={lead.id} className="hover:bg-surface-50/70">
                      <td className="p-4 font-mono text-surface-500">{formatDate(lead.created_at)}</td>
                      <td className="p-4 font-semibold text-surface-800 max-w-xs truncate">
                        {lead.buyer_message || 'طلب استفسار ومعاينة للوحدة'}
                      </td>
                      <td className="p-4 font-bold text-brand-900">
                        {lead.budget_cash ? formatEGP(lead.budget_cash) : '—'}
                      </td>
                      <td className="p-4 font-bold text-surface-700">
                        {lead.comfortable_installment ? formatEGP(lead.comfortable_installment) : '—'}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/units/${lead.case_id}`}
                          className="text-xs font-bold text-brand-700 hover:text-brand-800"
                        >
                          عرض الوحدة ←
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Section 4: Buyer Preferences Card */}
        {preferences && (
          <div id="preferences">
            <Card>
              <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-700" />
                  <span>تفضيلات الميزانية والبحث للمشتري</span>
                </CardTitle>
                <span className="text-[11px] text-surface-400">
                  آخر تحديث: {formatDate(preferences.updated_at)}
                </span>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                    <span className="text-surface-400 block mb-1">الميزانية النقدية المتاحة (كاش):</span>
                    <span className="font-black text-brand-900 text-sm">
                      {formatEGP(preferences.budget_cash)}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                    <span className="text-surface-400 block mb-1">أقصى قسط مريح دورياً:</span>
                    <span className="font-bold text-surface-800 text-sm">
                      {formatEGP(preferences.max_installment_value)}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                    <span className="text-surface-400 block mb-1">المحافظات المفضلة:</span>
                    <span className="font-bold text-surface-800">
                      {preferences.preferred_governorates.join('، ')}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                    <span className="text-surface-400 block mb-1">المناطق والأحياء:</span>
                    <span className="font-bold text-surface-800">
                      {preferences.preferred_districts.join('، ')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
