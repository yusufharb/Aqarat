import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CaseStatusBadge, Badge } from '@/components/ui/Badge';
import { getDataRepository } from '@/lib/data';
import { formatDate, formatEGP } from '@/lib/utils';
import { evaluatePublicationGates } from '@/lib/workflow/publishing-gates';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Lock,
  ArrowRight,
  Building,
  DollarSign,
  Scale,
  Eye,
} from 'lucide-react';
import { ReviewControls } from './ReviewControls';

export const dynamic = 'force-dynamic';

interface ControlRoomCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ControlRoomCaseDetailPage({ params }: ControlRoomCaseDetailPageProps) {
  const { id } = await params;
  const repo = getDataRepository();

  const assignmentCase = await repo.getCaseById(id);
  if (!assignmentCase) {
    notFound();
  }

  const [property, contract, documents, financialReview, legalReview] = await Promise.all([
    repo.getPropertyById(assignmentCase.property_id),
    repo.getContractByPropertyId(assignmentCase.property_id),
    repo.getDocumentsByCaseId(assignmentCase.id),
    repo.getFinancialReview(assignmentCase.id),
    repo.getLegalReview(assignmentCase.id),
  ]);

  if (!property || !contract) {
    notFound();
  }

  // Evaluate the 9 publication gates
  const gateCheck = evaluatePublicationGates({
    assignmentCase,
    property,
    contract,
    documents,
    financialReview,
    legalReview,
    isPublisherRole: true,
  });

  const gateNames = [
    { key: 'gate_1_complete_unit_data', title: 'البوابة 1: اكتمال بيانات الوحدة والمشروع والمطور' },
    { key: 'gate_2_seller_identity_confirmed', title: 'البوابة 2: التحقق من بطاقة الرقم القومي وصفة البائع' },
    { key: 'gate_3_mandatory_docs_verified', title: 'البوابة 3: التحقق من مستندات العقد وإيصالات السداد' },
    { key: 'gate_4_financial_review_approved', title: 'البوابة 4: اعتماد المراجعة المالية بأرقام كشف الحساب' },
    { key: 'gate_5_legal_review_approved', title: 'البوابة 5: صدور مراجعة قانونية إيجابية مؤهلة للنشر' },
    { key: 'gate_6_developer_transfer_clear', title: 'البوابة 6: وضوح شروط ورسوم التنازل لدى المطور' },
    { key: 'gate_7_publisher_authorized', title: 'البوابة 7: مصادقة مسؤول النشر المخول (Publisher)' },
    { key: 'gate_8_pii_sanitized_for_public', title: 'البوابة 8: خلو الإعلان من أي بيانات شخصية (Safe View)' },
    { key: 'gate_9_disclaimers_and_timestamp_ready', title: 'البوابة 9: جاهزية التواريخ وإخلاء المسؤولية القانوني' },
  ];

  return (
    <AppShell
      activeRole="admin"
      pageTitle={`فحص طلب التنازل: ${assignmentCase.case_number}`}
      pageSubtitle={`${property.developer_name} • ${property.project_name}`}
      primaryAction={{
        label: 'العودة لجدول الحالات',
        href: '/control-room/cases',
        icon: <ArrowRight className="w-4 h-4" />,
      }}
    >
      <div className="space-y-8">
        {/* Status Header Banner */}
        <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-surface-700 bg-surface-100 px-2.5 py-1 rounded-md">
                {assignmentCase.case_number}
              </span>
              <CaseStatusBadge status={assignmentCase.status} />
              {assignmentCase.is_private_listing ? (
                <Badge variant="purple" size="sm" className="gap-1">
                  <Lock className="w-3 h-3" />
                  <span>عرض خاص سري</span>
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  <span>كتالوج عام</span>
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-surface-900 mt-1">
              {property.developer_name} - {property.project_name}
            </h1>
            <p className="text-xs text-surface-500">
              الموقع: {property.governorate} • {property.city_district} • تم التقديم: {formatDate(assignmentCase.created_at)}
            </p>
          </div>

          <div className="text-left">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border ${
                gateCheck.allPassed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {gateCheck.allPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
              <span>{gateCheck.allPassed ? 'مستوفية لكافة بوابات النشر الـ 9' : 'بانتظار استيفاء البوابات'}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Review Sections (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Property and Contract Snapshot */}
            <Card>
              <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-700" />
                  <span>بيانات الوحدة والتعاقد الأصلي</span>
                </CardTitle>
                <span className="text-[11px] text-surface-400">فحص أولي</span>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-surface-400 block mb-0.5">المطور والمشروع:</span>
                    <span className="font-bold text-surface-800">{property.developer_name} - {property.project_name}</span>
                  </div>
                  <div>
                    <span className="text-surface-400 block mb-0.5">نوع الوحدة والمساحة:</span>
                    <span className="font-bold text-surface-800">{property.unit_type} ({property.area_sqm} م²)</span>
                  </div>
                  <div>
                    <span className="text-surface-400 block mb-0.5">إجمالي سعر التعاقد الأصلي:</span>
                    <span className="font-bold text-surface-800">{formatEGP(contract.total_contract_price)}</span>
                  </div>
                  <div>
                    <span className="text-surface-400 block mb-0.5">المدفوع من مقدم وأقساط:</span>
                    <span className="font-black text-brand-900 text-sm">
                      {formatEGP(contract.deposit_paid + contract.installments_paid)}
                    </span>
                  </div>
                  <div>
                    <span className="text-surface-400 block mb-0.5">الأقساط المتبقية للمطور:</span>
                    <span className="font-bold text-surface-800">{formatEGP(contract.remaining_balance)}</span>
                  </div>
                  <div>
                    <span className="text-surface-400 block mb-0.5">حالة التسليم:</span>
                    <span className="font-bold text-surface-800">
                      {property.delivery_status === 'delivered' ? 'مستلمة' : property.expected_delivery_date || 'تحت الإنشاء'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Private Documents Verification */}
            <Card>
              <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-700" />
                  <span>المستندات الخاصة المرفوعة ({documents.length})</span>
                </CardTitle>
                <span className="text-[11px] text-surface-400">خزينة مشفرة Private Storage</span>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {documents.length === 0 ? (
                  <p className="text-xs text-surface-400 text-center py-4">لم يتم رفع أي مستندات بعد.</p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-surface-50 rounded-2xl border border-surface-200/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-surface-800 block">{doc.file_name}</span>
                        <span className="text-[11px] text-surface-500">نوع المستند: {doc.doc_type}</span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                          doc.verification_status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {doc.verification_status === 'verified' ? '✓ تم التدقيق والتحقق' : 'قيد الفحص'}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* 3. Financial & Legal Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <CardHeader className="bg-surface-50/60 pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span>المراجعة المالية المعتمدة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-2.5">
                  {financialReview ? (
                    <>
                      <div>
                        <span className="text-surface-400 block mb-0.5">المدفوع المؤكد بمستندات:</span>
                        <span className="font-black text-brand-900 text-sm">
                          {formatEGP(financialReview.verified_paid_amount.amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-surface-400 block mb-0.5">المتبقي المؤكد:</span>
                        <span className="font-bold text-surface-800">
                          {formatEGP(financialReview.verified_remaining_amount.amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-surface-400 block mb-0.5">مصدر التدقيق:</span>
                        <span className="text-surface-700">
                          {financialReview.verified_paid_amount.source_description || 'كشف حساب رسمي معتمد'}
                        </span>
                      </div>
                      {financialReview.developer_transfer_fee && (
                        <div>
                          <span className="text-surface-400 block mb-0.5">رسوم التنازل لدى المطور:</span>
                          <span className="font-bold text-surface-800">
                            {formatEGP(financialReview.developer_transfer_fee.amount)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-surface-400 py-3 text-center">
                      لم يتم تسجيل المراجعة المالية بعد. استخدم زر الإجراءات على اليسار.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-surface-50/60 pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-brand-700" />
                    <span>المراجعة القانونية المعتمدة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-2.5">
                  {legalReview ? (
                    <>
                      <div>
                        <span className="text-surface-400 block mb-0.5">النتيجة القانونية:</span>
                        <span className="font-bold text-emerald-800">{legalReview.legal_verdict}</span>
                      </div>
                      <div>
                        <span className="text-surface-400 block mb-0.5">موقف المطور العقاري:</span>
                        <span className="font-bold text-surface-800">{legalReview.developer_assignment_status}</span>
                      </div>
                      <div>
                        <span className="text-surface-400 block mb-0.5">الملاحظات:</span>
                        <span className="text-surface-700">{legalReview.legal_notes || 'لا توجد موانع نقل ملكية'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-surface-400 py-3 text-center">
                      لم يتم تسجيل المراجعة القانونية بعد. استخدم زر الإجراءات على اليسار.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Col: Review Controls & The 9 Publication Gates */}
          <div className="space-y-6">
            {/* Interactive Review Controls */}
            <ReviewControls
              caseId={assignmentCase.id}
              currentStatus={assignmentCase.status}
              allGatesPassed={gateCheck.allPassed}
              documents={documents}
              contractDepositPlusInstallments={contract.deposit_paid + contract.installments_paid}
              contractRemaining={contract.remaining_balance}
            />

            {/* The 9 Publication Gates Check Card */}
            <Card className="sticky top-24">
              <CardHeader className="bg-surface-50/60 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="w-5 h-5 text-brand-700" />
                  <span>فحص بوابات النشر الـ 9</span>
                </CardTitle>
                <p className="text-xs text-surface-400 mt-0.5">
                  يجب تحقق جميع البوابات خادمياً قبل السماح بنشر الإعلان.
                </p>
              </CardHeader>

              <CardContent className="pt-4 space-y-2.5">
                {gateNames.map((g) => {
                  const isPassed = (gateCheck.gates as any)[g.key];
                  return (
                    <div
                      key={g.key}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        isPassed
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-semibold'
                          : 'bg-surface-50 border-surface-200 text-surface-500'
                      }`}
                    >
                      <span className="text-[11px] leading-tight pr-1">{g.title}</span>
                      <span className="font-black text-sm shrink-0 mr-2">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-surface-300" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
