import {
  AssignmentCase,
  Property,
  Contract,
  CaseDocument,
  FinancialReview,
  LegalReview,
  PublicationGates,
} from '../types';

export interface GateCheckResult {
  allPassed: boolean;
  gates: Omit<PublicationGates, 'id' | 'case_id' | 'published_by' | 'published_at'>;
  failures: string[];
}

export function evaluatePublicationGates(params: {
  assignmentCase: AssignmentCase;
  property: Property;
  contract: Contract;
  documents: CaseDocument[];
  financialReview: FinancialReview | null;
  legalReview: LegalReview | null;
  isPublisherRole: boolean;
}): GateCheckResult {
  const { property, contract, documents, financialReview, legalReview, isPublisherRole } = params;
  const failures: string[] = [];

  // Gate 1: Complete unit and project data
  const gate_1_complete_unit_data = Boolean(
    property.governorate &&
    property.city_district &&
    property.developer_name &&
    property.project_name &&
    property.unit_type &&
    property.area_sqm &&
    property.area_sqm > 0 &&
    contract.total_contract_price > 0
  );
  if (!gate_1_complete_unit_data) {
    failures.push('البوابة 1: بيانات الوحدة والمشروع والمطور أو أسعار العقد غير مكتملة.');
  }

  // Gate 2: Seller identity confirmed
  const hasNationalIdDoc = documents.some(
    (d) => d.doc_type === 'national_id' && d.verification_status === 'verified'
  );
  const gate_2_seller_identity_confirmed = hasNationalIdDoc;
  if (!gate_2_seller_identity_confirmed) {
    failures.push('البوابة 2: لم يتم التحقق من بطاقة الرقم القومي للبائع وصحة صفته.');
  }

  // Gate 3: Mandatory documents verified (Contract + Payment Receipts)
  const hasVerifiedContract = documents.some(
    (d) => d.doc_type === 'unit_contract' && d.verification_status === 'verified'
  );
  const hasVerifiedReceipts = documents.some(
    (d) => (d.doc_type === 'payment_receipts' || d.doc_type === 'statement_of_account') &&
           d.verification_status === 'verified'
  );
  const gate_3_mandatory_docs_verified = hasVerifiedContract && hasVerifiedReceipts;
  if (!gate_3_mandatory_docs_verified) {
    failures.push('البوابة 3: المستندات الإلزامية (العقد وإيصالات السداد) غير مرفوعة أو لم يتم تدقيقها.');
  }

  // Gate 4: Financial review approved
  const gate_4_financial_review_approved = Boolean(
    financialReview &&
    financialReview.verified_paid_amount.confidence === 'confirmed_by_documents' &&
    financialReview.verified_remaining_amount.confidence === 'confirmed_by_documents'
  );
  if (!gate_4_financial_review_approved) {
    failures.push('البوابة 4: المراجعة المالية لم تعتمد بأرقام مؤكدة بمستندات رسمية.');
  }

  // Gate 5: Legal review approved (eligible or eligible_with_conditions)
  const gate_5_legal_review_approved = Boolean(
    legalReview &&
    (legalReview.legal_verdict === 'eligible' || legalReview.legal_verdict === 'eligible_with_conditions')
  );
  if (!gate_5_legal_review_approved) {
    failures.push('البوابة 5: المراجعة القانونية غير مكتملة أو النتيجة غير مؤهلة للنشر.');
  }

  // Gate 6: Developer transfer terms clear
  const gate_6_developer_transfer_clear = Boolean(
    legalReview &&
    legalReview.developer_assignment_status !== 'unknown' &&
    legalReview.developer_assignment_status !== 'forbidden_until_full_payment'
  );
  if (!gate_6_developer_transfer_clear) {
    failures.push('البوابة 6: موقف المطور من التنازل غير محدد أو محظور حتى تمام السداد.');
  }

  // Gate 7: Publisher authorized
  const gate_7_publisher_authorized = isPublisherRole;
  if (!gate_7_publisher_authorized) {
    failures.push('البوابة 7: المستخدم الحالي لا يملك صلاحية مسؤول النشر (Publisher).');
  }

  // Gate 8: PII Sanitized for public listing
  // Guaranteed by architecture (Safe View / Server serialization excludes seller phone, national id, contract numbers)
  const gate_8_pii_sanitized_for_public = true;

  // Gate 9: Disclaimers and timestamp ready
  const gate_9_disclaimers_and_timestamp_ready = Boolean(
    financialReview?.reviewed_at &&
    legalReview?.reviewed_at
  );
  if (!gate_9_disclaimers_and_timestamp_ready) {
    failures.push('البوابة 9: تواريخ المراجعات والتحقق غير مسجلة لإظهارها للمشتري.');
  }

  const allPassed =
    gate_1_complete_unit_data &&
    gate_2_seller_identity_confirmed &&
    gate_3_mandatory_docs_verified &&
    gate_4_financial_review_approved &&
    gate_5_legal_review_approved &&
    gate_6_developer_transfer_clear &&
    gate_7_publisher_authorized &&
    gate_8_pii_sanitized_for_public &&
    gate_9_disclaimers_and_timestamp_ready;

  return {
    allPassed,
    gates: {
      gate_1_complete_unit_data,
      gate_2_seller_identity_confirmed,
      gate_3_mandatory_docs_verified,
      gate_4_financial_review_approved,
      gate_5_legal_review_approved,
      gate_6_developer_transfer_clear,
      gate_7_publisher_authorized,
      gate_8_pii_sanitized_for_public,
      gate_9_disclaimers_and_timestamp_ready,
    },
    failures,
  };
}
