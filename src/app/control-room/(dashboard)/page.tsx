import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CaseStatusBadge } from '@/components/ui/Badge';
import { getDataRepository } from '@/lib/data';
import { formatDate, formatEGP } from '@/lib/utils';
import Link from 'next/link';
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Handshake,
  History,
  FileCheck,
  Eye,
  ShieldAlert,
  Users,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ControlRoomOverviewPage() {
  const repo = getDataRepository();
  const [cases, deals, users, roleRequests] = await Promise.all([
    repo.getAllCases(),
    repo.getAllDeals(),
    repo.getAllUsers(),
    repo.getRoleRequests(),
  ]);

  const totalCases = cases.length;
  const newSubmissions = cases.filter((c) => ['submitted', 'screening'].includes(c.status)).length;
  const inReviewCases = cases.filter((c) =>
    ['in_review', 'documents_pending', 'ready_for_approval'].includes(c.status)
  ).length;
  const publishedListings = cases.filter((c) => c.status === 'published').length;
  const activeDeals = deals.length;
  const pendingRoleRequests = roleRequests.filter((r) => r.status === 'pending').length;

  return (
    <AppShell
      activeRole="admin"
      pageTitle="غرفة التحكم والعمليات المركزية"
      pageSubtitle="نظرة تنفيذية ورقابية شاملة على تدفق الحالات، جاهزية بوابات النشر، وإدارة المستخدمين"
      primaryAction={{
        label: 'جدول فرز الحالات',
        href: '/control-room/cases',
        icon: <FolderOpen className="w-4 h-4" />,
      }}
    >
      <div className="space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="إجمالي طلبات التنازل"
            value={totalCases}
            subtitle="مسجلة بالمنصة"
            icon={<FolderOpen className="w-5 h-5" />}
            highlightColor="brand"
            actionLink={{ label: 'عرض الحالات', href: '/control-room/cases' }}
          />
          <StatCard
            title="طلبات جديدة للفرز"
            value={newSubmissions}
            subtitle="تحتاج فحص مبدئي"
            icon={<Clock className="w-5 h-5" />}
            highlightColor="blue"
            trend={{ value: `${newSubmissions} طلب`, isPositive: true }}
            actionLink={{ label: 'بدء الفرز', href: '/control-room/cases' }}
          />
          <StatCard
            title="قيد التدقيق والفحص"
            value={inReviewCases}
            subtitle="مراجعة مالية وقانونية"
            icon={<AlertCircle className="w-5 h-5" />}
            highlightColor="amber"
            actionLink={{ label: 'متابعة المراجعات', href: '/control-room/cases' }}
          />
          <StatCard
            title="وحدات معتمدة ومنشورة"
            value={publishedListings}
            subtitle="مستوفية للـ 9 بوابات"
            icon={<CheckCircle2 className="w-5 h-5" />}
            highlightColor="purple"
            actionLink={{ label: 'عرض الكتالوج', href: '/units' }}
          />
        </div>

        {/* Operational Notice Banner */}
        <AlertBanner
          variant="amber"
          title="معايير الأمان والتحقق الصارم قبل نشر أي وحدة"
          description="لا يمكن نشر أي وحدة للعامة دون استيفاء بوابات النشر التسع، ومطابقة العقد وكشف الحساب البنكي الرسمي مع شروط المطور العقاري."
          badgeText="إشعار رقابي مشدد"
          icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
          actionText="إدارة المستخدمين والصلاحيات"
          actionHref="/control-room/users"
        />

        {/* Quick Operational Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Submissions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-surface-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-700" />
                <span>أحدث الحالات الواردة للتدقيق</span>
              </h2>
              <Link href="/control-room/cases" className="text-xs font-bold text-brand-700 hover:text-brand-800">
                عرض جميع الحالات ({cases.length}) ←
              </Link>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-surface-100 border-b border-surface-200 font-bold text-surface-700">
                      <th className="p-4">رقم الحالة</th>
                      <th className="p-4">نوع الطلب</th>
                      <th className="p-4">الحالة الراهنة</th>
                      <th className="p-4">تاريخ التقديم</th>
                      <th className="p-4 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {cases.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-surface-50/70">
                        <td className="p-4 font-mono font-bold text-surface-900">
                          {c.case_number}
                        </td>
                        <td className="p-4 font-semibold text-surface-700">
                          {c.case_nature === 'distress_exit' ? (
                            <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px] font-bold">
                              تعثر وتخارج
                            </span>
                          ) : (
                            <span className="text-surface-700">تنازل عادي</span>
                          )}
                        </td>
                        <td className="p-4">
                          <CaseStatusBadge status={c.status} />
                        </td>
                        <td className="p-4 text-surface-500 font-mono">
                          {c.submitted_at ? formatDate(c.submitted_at) : 'مسودة'}
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/control-room/cases/${c.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>فحص الملف</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Side Overview: Users & Transactions */}
          <div className="space-y-6">
            {/* Users & Role Requests Card */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-surface-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-700" />
                  <span>المستخدمين والصلاحيات</span>
                </h3>
                <Link href="/control-room/users" className="text-xs font-bold text-blue-700 hover:underline">
                  إدارة ←
                </Link>
              </div>

              <Card>
                <CardContent className="p-5 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center pb-2.5 border-b border-surface-100">
                    <span className="text-surface-600">إجمالي الحسابات المسجلة:</span>
                    <span className="font-bold text-surface-900 font-mono text-sm">{users.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-surface-100">
                    <span className="text-surface-600">طلبات ترقية الصلاحيات المعلقة:</span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
                      {pendingRoleRequests}
                    </span>
                  </div>
                  <div className="pt-1">
                    <Link
                      href="/control-room/users"
                      className="w-full inline-flex items-center justify-center py-2 bg-surface-100 hover:bg-surface-200 text-surface-800 font-bold rounded-xl transition-colors text-xs"
                    >
                      مراجعة الحسابات وطلبات الترقية
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Deals Card */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-surface-900 flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-purple-700" />
                  <span>الصفقات الجارية ({activeDeals})</span>
                </h3>
                <Link href="/control-room/deals" className="text-xs font-bold text-purple-700 hover:underline">
                  عرض الكل ←
                </Link>
              </div>

              <Card>
                <CardContent className="p-5 space-y-3 text-xs">
                  {deals.length === 0 ? (
                    <p className="text-surface-400 text-center py-4">لا توجد صفقات جارية حالياً.</p>
                  ) : (
                    deals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className="p-3 bg-surface-50 rounded-xl border border-surface-200/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-surface-800 text-[11px]">{deal.id}</span>
                          <span className="text-[10px] font-bold text-brand-800 bg-brand-100 px-2 py-0.5 rounded">
                            {deal.status}
                          </span>
                        </div>
                        <div className="font-bold text-surface-900">
                          {deal.agreed_cash_amount ? formatEGP(deal.agreed_cash_amount) : 'قيد التفاوض'}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
