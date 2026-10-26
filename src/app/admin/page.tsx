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
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const repo = getDataRepository();
  const [cases, deals] = await Promise.all([
    repo.getAllCases(),
    repo.getAllDeals(),
  ]);

  const totalCases = cases.length;
  const newSubmissions = cases.filter((c) => ['submitted', 'screening'].includes(c.status)).length;
  const inReviewCases = cases.filter((c) => ['in_review', 'documents_pending', 'ready_for_approval'].includes(c.status)).length;
  const publishedListings = cases.filter((c) => c.status === 'published').length;
  const activeDeals = deals.length;

  return (
    <AppShell
      activeRole="admin"
      pageTitle="لوحة العمليات والرقابة"
      pageSubtitle="نظرة تنفيذية شاملة على تدفق الحالات، جاهزية بوابات النشر، والصفقات الجارية"
      primaryAction={{
        label: 'جدول فرز الحالات',
        href: '/admin/cases',
        icon: <FolderOpen className="w-4 h-4" />,
      }}
    >
      <div className="space-y-8">
        {/* KPI Stat Cards (Matching Image 2 Dashboard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="إجمالي طلبات التنازل"
            value={totalCases}
            subtitle="مسجلة بالمنصة"
            icon={<FolderOpen className="w-5 h-5" />}
            highlightColor="brand"
            actionLink={{ label: 'عرض الحالات', href: '/admin/cases' }}
          />
          <StatCard
            title="طلبات جديدة للفرز"
            value={newSubmissions}
            subtitle="تحتاج فحص مبدئي"
            icon={<AlertCircle className="w-5 h-5" />}
            highlightColor="amber"
            actionLink={{ label: 'بدء الفرز', href: '/admin/cases' }}
          />
          <StatCard
            title="قيد المراجعة والتدقيق"
            value={inReviewCases}
            subtitle="تدقيق مالي وقانوني"
            icon={<Clock className="w-5 h-5" />}
            highlightColor="blue"
            actionLink={{ label: 'مراجعة الأوراق', href: '/admin/cases' }}
          />
          <StatCard
            title="صفقات التنازل الجارية"
            value={activeDeals}
            subtitle="مواعيد مقر المطور"
            icon={<Handshake className="w-5 h-5" />}
            highlightColor="brand"
            actionLink={{ label: 'متابعة الصفقات', href: '/admin/deals' }}
          />
        </div>

        {/* Action Required Alert Banner */}
        {newSubmissions > 0 && (
          <AlertBanner
            variant="blue"
            title={`توجد ${newSubmissions} حالات تنازل جديدة بانتظار الفرز ومراجعة بطاقات الرقم القومي`}
            description="يجب تدقيق هوية البائع وصحة العقد قبل الإحالة للمراجعة المالية والقانونية وتطبيق بوابات النشر الـ 9."
            actionText="الانتقال لجدول الفرز"
            actionHref="/admin/cases"
            badgeText="فرز عاجل"
            icon={<ShieldAlert className="w-5 h-5 text-blue-300" />}
          />
        )}

        {/* Recent Cases Queue */}
        <Card>
          <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
            <div>
              <CardTitle>أحدث الحالات المسجلة</CardTitle>
              <p className="text-xs text-surface-400 mt-0.5">
                حالات التنازل التي تتطلب تدقيقاً وإجراءات فحص مستمرة
              </p>
            </div>
            <Link href="/admin/cases" className="text-xs font-bold text-brand-700 hover:text-brand-800">
              عرض كافة الحالات ←
            </Link>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-surface-100/70 border-b border-surface-200 font-bold text-surface-700">
                  <th className="p-4">رقم القيد</th>
                  <th className="p-4">المشروع والمطور</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">المبلغ المطلوب</th>
                  <th className="p-4">تاريخ التسجيل</th>
                  <th className="p-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {cases.slice(0, 5).map(async (c) => {
                  const property = await repo.getPropertyById(c.property_id);
                  const contract = property ? await repo.getContractByPropertyId(property.id) : null;

                  return (
                    <tr key={c.id} className="hover:bg-surface-50/70">
                      <td className="p-4 font-mono font-bold text-brand-900">{c.case_number}</td>
                      <td className="p-4 font-bold text-surface-800">
                        {property ? `${property.developer_name} - ${property.project_name}` : '—'}
                      </td>
                      <td className="p-4">
                        <CaseStatusBadge status={c.status} />
                      </td>
                      <td className="p-4 font-bold text-surface-900">
                        {contract ? formatEGP(contract.deposit_paid + contract.installments_paid) : '—'}
                      </td>
                      <td className="p-4 text-surface-500 font-mono">{formatDate(c.created_at)}</td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/admin/cases/${c.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>فحص</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
