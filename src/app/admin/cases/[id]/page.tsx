import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getDataRepository } from '@/lib/data';
import { formatDate, formatEGP } from '@/lib/utils';
import { evaluatePublicationGates } from '@/lib/workflow/publishing-gates';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface AdminCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCaseDetailPage({ params }: AdminCaseDetailPageProps) {
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
    isPublisherRole: true, // Assuming publisher view in Backoffice
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
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
            <Link href="/admin/cases" className="hover:text-brand-800">الحالات</Link>
            <span>/</span>
            <span className="text-surface-800 font-bold">{assignmentCase.case_number}</span>
          </div>

          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-surface-600 bg-surface-100 px-2.5 py-1 rounded-md">
                  {assignmentCase.case_number}
                </span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  الحالة: {assignmentCase.status}
                </span>
                {assignmentCase.is_private_listing && (
                  <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                    عرض خاص سري
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-surface-900 mt-2">
                فحص طلب التنازل: {property.developer_name} - {property.project_name}
              </h1>
              <p className="text-xs text-surface-500 mt-1">
                تاريخ الإنشاء: {formatDate(assignmentCase.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-4 py-2 rounded-xl ${
                gateCheck.allPassed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {gateCheck.allPassed ? '✓ مستوفية للبوابات الـ 9' : '⚠️ بانتظار استيفاء البوابات'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Data Tabs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property & Contract Snapshot */}
              <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs">
                <h3 className="text-base font-bold text-surface-900 mb-4 pb-2 border-b border-surface-100">
                  بيانات الوحدة والتعاقد الأصلي
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-surface-500 block">المطور:</span>
                    <span className="font-bold text-surface-800">{property.developer_name}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">المشروع:</span>
                    <span className="font-bold text-surface-800">{property.project_name}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">المحافظة والحي:</span>
                    <span className="font-bold text-surface-800">{property.governorate} • {property.city_district}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">نوع الوحدة والمساحة:</span>
                    <span className="font-bold text-surface-800">{property.unit_type} ({property.area_sqm} م²)</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">إجمالي سعر التعاقد:</span>
                    <span className="font-bold text-surface-800">{formatEGP(contract.total_contract_price)}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">المبلغ المدفوع حتى الآن:</span>
                    <span className="font-black text-brand-900">
                      {formatEGP(contract.deposit_paid + contract.installments_paid)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Private Documents Check */}
              <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs">
                <h3 className="text-base font-bold text-surface-900 mb-4 pb-2 border-b border-surface-100 flex items-center justify-between">
                  <span>المستندات الخاصة المرفوعة (Private Storage)</span>
                  <span className="text-xs text-surface-400 font-normal">مشفرة بروابط مؤقتة</span>
                </h3>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-surface-50 rounded-xl border border-surface-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-surface-800 block">{doc.file_name}</span>
                        <span className="text-[11px] text-surface-500">نوع المستند: {doc.doc_type}</span>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        doc.verification_status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.verification_status === 'verified' ? '✓ تم التدقيق' : 'قيد الفحص'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial & Legal Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs">
                  <h4 className="font-bold text-surface-900 text-sm mb-3">المراجعة المالية المعتمدة</h4>
                  {financialReview ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-surface-500 block">المدفوع المؤكد:</span>
                        <span className="font-bold text-emerald-800">
                          {formatEGP(financialReview.verified_paid_amount.amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-surface-500 block">المتبقي المؤكد:</span>
                        <span className="font-bold text-surface-800">
                          {formatEGP(financialReview.verified_remaining_amount.amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-surface-500 block">المصدر:</span>
                        <span className="text-surface-700">
                          {financialReview.verified_paid_amount.source_description || 'كشف حساب معتمد من المطور'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-surface-400">بانتظار تسجيل المراجعة المالية</div>
                  )}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs">
                  <h4 className="font-bold text-surface-900 text-sm mb-3">المراجعة القانونية المعتمدة</h4>
                  {legalReview ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-surface-500 block">النتيجة القانونية:</span>
                        <span className="font-bold text-emerald-800">{legalReview.legal_verdict}</span>
                      </div>
                      <div>
                        <span className="text-surface-500 block">موقف المطور:</span>
                        <span className="font-bold text-surface-800">{legalReview.developer_assignment_status}</span>
                      </div>
                      <div>
                        <span className="text-surface-500 block">ملاحظات:</span>
                        <span className="text-surface-700">{legalReview.legal_notes || '—'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-surface-400">بانتظار المراجعة القانونية</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: The 9 Publication Gates */}
            <div>
              <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-xs sticky top-24">
                <h3 className="text-base font-bold text-surface-900 mb-2">
                  فحص بوابات النشر الـ 9
                </h3>
                <p className="text-xs text-surface-500 mb-6">
                  يجب تحقق جميع البوابات خادمياً قبل السماح بنشر الإعلان.
                </p>

                <div className="space-y-3 mb-8">
                  {gateNames.map((g) => {
                    const isPassed = (gateCheck.gates as any)[g.key];
                    return (
                      <div
                        key={g.key}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          isPassed
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                            : 'bg-surface-50 border-surface-200 text-surface-500'
                        }`}
                      >
                        <span className="text-[11px] leading-snug">{g.title}</span>
                        <span className="font-black text-sm shrink-0 mr-2">
                          {isPassed ? '✓' : '✗'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {gateCheck.allPassed ? (
                  <button
                    type="button"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all"
                  >
                    اعتماد النشر بالكتالوج العام (Publisher Sign-off)
                  </button>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-center font-medium">
                    ⚠️ لا يمكن النشر حتى استيفاء جميع البوابات أعلاه
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
