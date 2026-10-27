import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CaseStatusBadge, Badge } from '@/components/ui/Badge';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDataRepository } from '@/lib/data';
import { getCurrentSession } from '@/lib/auth/session';
import { formatEGP, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Building,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  PlusCircle,
  ArrowLeft,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export default async function SellerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/auth/login?returnUrl=/seller/dashboard');
  }

  const repo = getDataRepository();
  const sellerId = session.userId;
  const [cases, sellerRequests] = await Promise.all([
    repo.getCasesBySeller(sellerId),
    repo.getSellerRequestsByUserId(sellerId),
  ]);

  // Compute status counts
  const totalCount = cases.length;
  const inReviewCount = cases.filter((c) =>
    ['submitted', 'screening', 'in_review', 'ready_for_approval'].includes(c.status)
  ).length;
  const publishedCount = cases.filter((c) => c.status === 'published').length;
  const actionRequiredCount = cases.filter((c) =>
    ['draft', 'documents_pending'].includes(c.status)
  ).length;

  // Check if any case needs urgent documents
  const pendingDocsCase = cases.find((c) => c.status === 'documents_pending');

  return (
    <AppShell
      activeRole="seller"
      pageTitle="لوحة تحكم البائع"
      pageSubtitle="متابعة طلبات التنازل، حالة المراجعة القانونية، وملاحظات فريق التشغيل"
      primaryAction={{
        label: 'أضف وحدة للتنازل',
        href: '/seller/new-case',
        icon: <PlusCircle className="w-4 h-4" />,
      }}
    >
      <div className="space-y-8">
        {/* KPI Stat Cards (Matching Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="إجمالي طلباتي"
            value={totalCount}
            subtitle="وحدات مسجلة بالمنصة"
            icon={<Building className="w-5 h-5" />}
            highlightColor="brand"
          />
          <StatCard
            title="قيد المراجعة والتدقيق"
            value={inReviewCount}
            subtitle="مراجعة مالية وقانونية"
            icon={<Clock className="w-5 h-5" />}
            highlightColor="amber"
          />
          <StatCard
            title="معتمدة ومنشورة"
            value={publishedCount}
            subtitle="متاحة للمشترين المؤهلين"
            icon={<CheckCircle2 className="w-5 h-5" />}
            highlightColor="brand"
          />
          <StatCard
            title="إجراءات مطلوبة"
            value={actionRequiredCount}
            subtitle={actionRequiredCount > 0 ? 'يرجى استكمال المستندات' : 'كل الطلبات مكتملة'}
            icon={<AlertCircle className="w-5 h-5" />}
            highlightColor={actionRequiredCount > 0 ? 'amber' : 'brand'}
          />
        </div>

        {/* Action Required Banner (Inspired by Image 2 Action Notice) */}
        {pendingDocsCase ? (
          <AlertBanner
            variant="amber"
            title="مطلوب استكمال مستندات رسمية لوحدتك"
            description={`طلب القيد ${pendingDocsCase.case_number} بانتظار رفع كشف حساب المطور المحدث أو إيصال السداد الأخير لاستكمال بوابات النشر.`}
            actionText="استكمال رفع المستندات الآن"
            actionHref="/seller/new-case"
            badgeText="تنبيه هام"
            icon={<FileText className="w-5 h-5 text-amber-900" />}
          />
        ) : (
          <AlertBanner
            variant="brand"
            title="إطلاق مجاني بالكامل — عمولة 0% على البائع والمشتري"
            description="جميع خدمات المراجعة والتدقيق والربط بالمشتري معفاة تماماً من أي رسوم أو عمولات خلال مرحلة الإطلاق الأولي."
            actionText="عرض الشروط وكيفية العمل"
            actionHref="/how-it-works"
            badgeText="مجاناً"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-200" />}
          />
        )}

        {/* Submitted Acquisition Requests (/sell) */}
        {sellerRequests.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-surface-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-100">
              <div>
                <h3 className="text-base font-black text-surface-900">طلبات البيع والتنازل المبدئية (/sell)</h3>
                <p className="text-xs text-surface-500">متابعة الطلبات المقدمة عبر نموذج البيع قبل تحويلها إلى ملفات دراسة</p>
              </div>
              <Link
                href="/sell"
                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-xl transition-colors"
              >
                + تقديم طلب بيع جديد
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-surface-50 text-surface-600 font-bold border-b border-surface-200">
                  <tr>
                    <th className="py-2.5 px-3">الرقم المرجعي</th>
                    <th className="py-2.5 px-3">الوحدة والمشروع</th>
                    <th className="py-2.5 px-3">المدفوع / الكاش المطلوب</th>
                    <th className="py-2.5 px-3">تاريخ التقديم</th>
                    <th className="py-2.5 px-3">حالة الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {sellerRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3 px-3 font-mono font-bold text-brand-700">{req.reference_code}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-surface-900">{req.project_name}</div>
                        <div className="text-[11px] text-surface-500">{req.developer_name} • {req.city_district}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        {formatEGP(req.requested_cash_amount || req.paid_amount)}
                      </td>
                      <td className="py-3 px-3 text-surface-600">{formatDate(req.created_at)}</td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-100 text-surface-800">
                          {req.status === 'pending'
                            ? 'بانتظار المراجعة'
                            : req.status === 'under_review'
                            ? 'قيد الفحص'
                            : req.status === 'qualified'
                            ? 'مؤهل للتنازل'
                            : req.status === 'converted_to_case'
                            ? 'تم التحويل لملف دراسة'
                            : req.status === 'rejected'
                            ? 'مرفوض'
                            : req.status}
                        </span>
                        {req.rejection_reason && (
                          <span className="block text-[10px] text-red-600 mt-1 max-w-xs">{req.rejection_reason}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cases Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-black text-surface-900">
              قائمة طلبات التنازل ({cases.length})
            </h2>
            <span className="text-xs text-surface-400">
              يتم تحديث حالات الطلبات دورياً مع تقدم فريق الفحص والتدقيق
            </span>
          </div>

          {cases.length === 0 ? (
            <EmptyState
              icon={<Building className="w-8 h-8 text-surface-400" />}
              title="لم تقم بإضافة أي وحدات للتنازل حتى الآن"
              description="ابدأ بإدخال بيانات وحدتك وعقدك مع المطور العقاري لاسترداد مدفوعاتك كاش بدون غرامات فسخ."
              actionText="أضف أول وحدة للتنازل"
              actionHref="/seller/new-case"
            />
          ) : (
            <div className="space-y-5">
              {cases.map(async (c) => {
                const property = await repo.getPropertyById(c.property_id);
                const contract = property ? await repo.getContractByPropertyId(property.id) : null;
                const documents = await repo.getDocumentsByCaseId(c.id);

                const verifiedDocsCount = documents.filter((d) => d.verification_status === 'verified').length;

                return (
                  <Card key={c.id} className="overflow-hidden hover:border-surface-300 transition-all">
                    <CardHeader className="bg-surface-50/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-surface-700 bg-white border border-surface-200 px-2.5 py-1 rounded-lg">
                          {c.case_number}
                        </span>
                        <CaseStatusBadge status={c.status} />

                        {c.is_private_listing ? (
                          <Badge variant="purple" size="sm" className="gap-1">
                            <Lock className="w-3 h-3" />
                            <span>عرض خاص سري</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm">
                            <span>كتالوج عام</span>
                          </Badge>
                        )}

                        <span className="text-[11px] text-surface-500 font-medium">
                          {c.case_nature === 'distress_exit' ? '• حالة تعثر وتخارج آمن' : '• تنازل عادي'}
                        </span>
                      </div>

                      <span className="text-[11px] text-surface-400">
                        تاريخ الطلب: {formatDate(c.created_at)}
                      </span>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-5">
                      {/* Property & Financial Details Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                          <span className="text-surface-400 block mb-1">الوحدة والمشروع:</span>
                          <span className="font-bold text-surface-900 text-sm block">
                            {property ? `${property.developer_name} - ${property.project_name}` : 'بيانات الوحدة'}
                          </span>
                          <span className="text-surface-500 mt-0.5 block">
                            {property ? `${property.governorate} • ${property.city_district}` : ''}
                          </span>
                        </div>

                        <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-200/60">
                          <span className="text-brand-700 block mb-1">المبلغ المطلوب للبائع (كاش):</span>
                          <span className="font-black text-brand-950 text-base block">
                            {contract
                              ? formatEGP(contract.deposit_paid + contract.installments_paid)
                              : '—'}
                          </span>
                          <span className="text-[11px] text-brand-800">
                            {contract ? `مقدم: ${formatEGP(contract.deposit_paid)}` : ''}
                          </span>
                        </div>

                        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                          <span className="text-surface-400 block mb-1">حالة المستندات المرفوعة:</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-bold text-surface-800">
                              {verifiedDocsCount} من {documents.length} مستند مدقق
                            </span>
                            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              {verifiedDocsCount === documents.length && documents.length > 0 ? 'مكتمل' : 'قيد الفحص'}
                            </span>
                          </div>
                          <span className="text-[10px] text-surface-400 mt-1 block">
                            خزينة خاصة مشفرة (Private Storage)
                          </span>
                        </div>
                      </div>

                      {/* Workflow Stepper */}
                      <div className="pt-2 pb-1 border-t border-surface-100">
                        <span className="text-[11px] font-bold text-surface-400 block mb-4">
                          مسار المراجعة والاعتماد خادمياً:
                        </span>
                        <WorkflowStepper currentStatus={c.status} />
                      </div>

                      {/* Seller Notes / Operation Feedback */}
                      {c.seller_notes && (
                        <div className="p-3 bg-surface-50 rounded-xl text-xs text-surface-600 border border-surface-200/60">
                          <strong className="text-surface-800">ملاحظاتك المسجلة:</strong> {c.seller_notes}
                        </div>
                      )}
                    </CardContent>

                    {/* Card Actions Footer */}
                    <div className="p-4 px-6 bg-surface-50/50 border-t border-surface-100 flex items-center justify-between">
                      <div className="text-xs text-surface-500">
                        {c.status === 'published' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>الوحدة معتمدة ومتاحة للمشترين المؤهلين</span>
                          </span>
                        ) : (
                          <span>طلبك قيد المعالجة وفق بوابات النشر الـ 9</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {c.status === 'published' && (
                          <Link
                            href={`/units/${c.id}`}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-surface-100 text-surface-800 border border-surface-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة الإعلان</span>
                          </Link>
                        )}

                        {c.status === 'draft' && (
                          <Link
                            href="/seller/new-case"
                            className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs"
                          >
                            <span>استكمال المسودة</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
