import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CaseStatusBadge, Badge } from '@/components/ui/Badge';
import { getDataRepository } from '@/lib/data';
import { formatDate, formatEGP } from '@/lib/utils';
import Link from 'next/link';
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Handshake,
  History,
  Lock,
  ShieldAlert,
} from 'lucide-react';

export default async function AdminCasesPage() {
  const repo = getDataRepository();
  const cases = await repo.getAllCases();

  // Metrics
  const totalCount = cases.length;
  const pendingScreeningCount = cases.filter((c) => ['submitted', 'screening'].includes(c.status)).length;
  const inReviewCount = cases.filter((c) => ['documents_pending', 'in_review', 'ready_for_approval'].includes(c.status)).length;
  const publishedCount = cases.filter((c) => c.status === 'published').length;

  return (
    <AppShell
      activeRole="admin"
      pageTitle="إدارة ومراجعة الحالات"
      pageSubtitle="فرز طلبات التنازل، فحص المستندات، والتحقق من بوابات النشر الـ 9"
    >
      <div className="space-y-8">
        {/* KPI Stat Cards (Matching Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="إجمالي الحالات"
            value={totalCount}
            subtitle="مسجلة بالنظام"
            icon={<FolderOpen className="w-5 h-5" />}
            highlightColor="brand"
          />
          <StatCard
            title="فرز أولي جديد"
            value={pendingScreeningCount}
            subtitle="تتطلب فحص البيانات"
            icon={<AlertCircle className="w-5 h-5" />}
            highlightColor="amber"
          />
          <StatCard
            title="قيد المراجعة المالية/القانونية"
            value={inReviewCount}
            subtitle="مراجعة كشوف الحساب"
            icon={<Clock className="w-5 h-5" />}
            highlightColor="blue"
          />
          <StatCard
            title="معتمدة ومنشورة"
            value={publishedCount}
            subtitle="مستوفية للبوابات الـ 9"
            icon={<CheckCircle2 className="w-5 h-5" />}
            highlightColor="brand"
          />
        </div>

        {/* Urgent Triage Notice */}
        {pendingScreeningCount > 0 && (
          <AlertBanner
            variant="blue"
            title={`توجد ${pendingScreeningCount} حالات جديدة بحاجة إلى فرز أولي وفحص المستندات`}
            description="يرجى مطابقة صور العقود وبطاقات الرقم القومي قبل إحالة الحالات إلى المراجعة المالية والمراجعة القانونية."
            badgeText="تنبيه عمليات"
            icon={<ShieldAlert className="w-5 h-5 text-blue-300" />}
          />
        )}

        {/* Cases Data Table Card */}
        <Card>
          <CardHeader className="bg-surface-50/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>جدول فرز الحالات ({cases.length})</CardTitle>
              <p className="text-xs text-surface-400 mt-1">
                انقر على &ldquo;فحص واعتماد&rdquo; للتحقق من بوابات النشر الـ 9 وتوقيع مسؤول النشر.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-2">
              <Link
                href="/admin/deals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-surface-700 bg-white border border-surface-300 px-3 py-1.5 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <Handshake className="w-3.5 h-3.5 text-brand-700" />
                <span>الصفقات</span>
              </Link>
              <Link
                href="/admin/audit-logs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-surface-700 bg-white border border-surface-300 px-3 py-1.5 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-surface-600" />
                <span>سجل التدقيق</span>
              </Link>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-surface-100/70 border-b border-surface-200 font-bold text-surface-700">
                  <th className="p-4">رقم القيد</th>
                  <th className="p-4">المشروع والمطور</th>
                  <th className="p-4">الموقع</th>
                  <th className="p-4">طبيعة الحالة</th>
                  <th className="p-4">حالة الطلب</th>
                  <th className="p-4">المبلغ المطلوب</th>
                  <th className="p-4">تاريخ التسجيل</th>
                  <th className="p-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {cases.map(async (c) => {
                  const property = await repo.getPropertyById(c.property_id);
                  const contract = property ? await repo.getContractByPropertyId(property.id) : null;

                  return (
                    <tr key={c.id} className="hover:bg-surface-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-900">
                        {c.case_number}
                      </td>
                      <td className="p-4 font-bold text-surface-800">
                        {property ? `${property.developer_name} - ${property.project_name}` : '—'}
                      </td>
                      <td className="p-4 text-surface-600">
                        {property ? `${property.governorate} • ${property.city_district}` : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              c.case_nature === 'distress_exit'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-surface-100 text-surface-700'
                            }`}
                          >
                            {c.case_nature === 'distress_exit' ? 'تعثر وتخارج' : 'عادي'}
                          </span>
                          {c.is_private_listing && (
                            <span className="p-1 rounded bg-purple-50 text-purple-700" title="عرض خاص سري">
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <CaseStatusBadge status={c.status} />
                      </td>
                      <td className="p-4 font-bold text-surface-900">
                        {contract ? formatEGP(contract.deposit_paid + contract.installments_paid) : '—'}
                      </td>
                      <td className="p-4 text-surface-500 font-mono">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/admin/cases/${c.id}`}
                          className="inline-flex items-center gap-1 bg-brand-700 hover:bg-brand-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>فحص واعتماد</span>
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
