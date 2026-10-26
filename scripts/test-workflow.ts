import { validateCaseTransition } from '../src/lib/workflow/transitions';
import { evaluatePublicationGates } from '../src/lib/workflow/publishing-gates';
import { DemoRepository } from '../src/lib/data/demo-repository';
import { formatEGP, generateCaseNumber } from '../src/lib/utils';
import {
  AssignmentCase,
  Property,
  Contract,
  CaseDocument,
  FinancialReview,
  LegalReview,
} from '../src/lib/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 Starting Aqar Exit Workflow & Security Test Suite');
  console.log('======================================================\n');

  // ---------------------------------------------------------------------------
  // Test Group 1: State Machine & Status Transitions
  // ---------------------------------------------------------------------------
  console.log('--- 1. Testing State Transitions & RBAC ---');

  // Test 1.1: Seller can transition draft to submitted
  const t1 = validateCaseTransition('draft', 'submitted', ['seller']);
  assert(t1.allowed === true, 'Seller can transition case from draft to submitted');

  // Test 1.2: Seller CANNOT publish directly from draft
  const t2 = validateCaseTransition('draft', 'published', ['seller']);
  assert(t2.allowed === false, 'Direct transition from draft to published is BLOCKED');

  // Test 1.3: Operations can transition submitted to screening
  const t3 = validateCaseTransition('submitted', 'screening', ['operations']);
  assert(t3.allowed === true, 'Operations can move submitted to screening');

  // Test 1.4: Buyer cannot approve a case
  const t4 = validateCaseTransition('ready_for_approval', 'approved', ['buyer']);
  assert(t4.allowed === false, 'Buyer role CANNOT approve a case');

  // Test 1.5: Publisher can approve a case
  const t5 = validateCaseTransition('ready_for_approval', 'approved', ['publisher']);
  assert(t5.allowed === true, 'Publisher role CAN approve a case');

  // Test 1.6: Closed case cannot transition to anything
  const t6 = validateCaseTransition('closed', 'published', ['admin']);
  assert(t6.allowed === false, 'Terminal closed status cannot transition');

  // ---------------------------------------------------------------------------
  // Test Group 2: The 9 Publication Gates Engine
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Testing 9 Publication Gates Engine ---');

  const dummyCase: AssignmentCase = {
    id: 'case-test-1',
    case_number: 'CAS-2026-TEST',
    seller_id: 'seller-1',
    property_id: 'prop-1',
    contract_id: 'contract-1',
    case_nature: 'standard_assignment',
    status: 'approved',
    is_private_listing: false,
    requested_cash_amount: null,
    seller_notes: null,
    submitted_at: '2026-01-01',
    published_at: null,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  };

  const dummyProperty: Property = {
    id: 'prop-1',
    governorate: 'القاهرة',
    city_district: 'التجمع الخامس',
    developer_name: 'سوديك',
    project_name: 'ايست تاون',
    unit_type: 'apartment',
    area_sqm: 185,
    floor_number: 3,
    delivery_status: 'delivered',
    expected_delivery_date: null,
  };

  const dummyContract: Contract = {
    id: 'contract-1',
    property_id: 'prop-1',
    total_contract_price: 8500000,
    deposit_paid: 1500000,
    installments_paid: 3000000,
    remaining_balance: 4000000,
    installment_value: 250000,
    installment_frequency: 'quarterly',
    maintenance_fee: 400000,
    contract_date: '2023-01-01',
  };

  const validDocs: CaseDocument[] = [
    {
      id: 'doc-1',
      case_id: 'case-test-1',
      doc_type: 'national_id',
      file_name: 'id.pdf',
      file_size_bytes: 500000,
      mime_type: 'application/pdf',
      verification_status: 'verified',
      verified_by: 'ops-1',
      uploaded_at: '2026-01-01',
    },
    {
      id: 'doc-2',
      case_id: 'case-test-1',
      doc_type: 'unit_contract',
      file_name: 'contract.pdf',
      file_size_bytes: 2500000,
      mime_type: 'application/pdf',
      verification_status: 'verified',
      verified_by: 'ops-1',
      uploaded_at: '2026-01-01',
    },
    {
      id: 'doc-3',
      case_id: 'case-test-1',
      doc_type: 'payment_receipts',
      file_name: 'receipts.pdf',
      file_size_bytes: 1500000,
      mime_type: 'application/pdf',
      verification_status: 'verified',
      verified_by: 'finance-1',
      uploaded_at: '2026-01-01',
    },
  ];

  const validFinancialReview: FinancialReview = {
    id: 'fr-1',
    case_id: 'case-test-1',
    verified_paid_amount: {
      amount: 4500000,
      confidence: 'confirmed_by_documents',
      source_description: 'كشف حساب معتمد',
      verified_at: '2026-01-10',
      verified_by: 'finance-1',
    },
    verified_remaining_amount: {
      amount: 4000000,
      confidence: 'confirmed_by_documents',
      source_description: 'جدول الأقساط',
      verified_at: '2026-01-10',
      verified_by: 'finance-1',
    },
    verified_overdue_amount: null,
    developer_transfer_fee: {
      amount: 250000,
      confidence: 'confirmed_by_documents',
      source_description: 'لائحة المطور',
      verified_at: '2026-01-10',
      verified_by: 'finance-1',
    },
    fee_bearer: 'seller',
    reviewer_id: 'finance-1',
    reviewer_notes: 'الأرقام متطابقة مع كشف حساب المطور',
    reviewed_at: '2026-01-10',
  };

  const validLegalReview: LegalReview = {
    id: 'lr-1',
    case_id: 'case-test-1',
    legal_verdict: 'eligible',
    developer_assignment_status: 'confirmed',
    conditions_checklist: ['سداد دفعة الصيانة المستحقة', 'حضور الطرفين بالمقر الرئيسي'],
    legal_notes: 'العقد ساري ولا توجد موانع نقل ملكية',
    reviewer_id: 'legal-1',
    reviewed_at: '2026-01-11',
  };

  // Test 2.1: All gates pass when all requirements are met
  const g1 = evaluatePublicationGates({
    assignmentCase: dummyCase,
    property: dummyProperty,
    contract: dummyContract,
    documents: validDocs,
    financialReview: validFinancialReview,
    legalReview: validLegalReview,
    isPublisherRole: true,
  });
  assert(g1.allPassed === true, 'All 9 gates pass for fully verified case');

  // Test 2.2: Missing National ID fails Gate 2
  const docsWithoutID = validDocs.filter((d) => d.doc_type !== 'national_id');
  const g2 = evaluatePublicationGates({
    assignmentCase: dummyCase,
    property: dummyProperty,
    contract: dummyContract,
    documents: docsWithoutID,
    financialReview: validFinancialReview,
    legalReview: validLegalReview,
    isPublisherRole: true,
  });
  assert(g2.allPassed === false, 'Gate 2 fails when national ID is missing');
  assert(g2.gates.gate_2_seller_identity_confirmed === false, 'gate_2_seller_identity_confirmed is false');

  // Test 2.3: Ineligible legal verdict fails Gate 5
  const g3 = evaluatePublicationGates({
    assignmentCase: dummyCase,
    property: dummyProperty,
    contract: dummyContract,
    documents: validDocs,
    financialReview: validFinancialReview,
    legalReview: { ...validLegalReview, legal_verdict: 'not_eligible' },
    isPublisherRole: true,
  });
  assert(g3.allPassed === false, 'Gate 5 fails when legal verdict is not_eligible');

  // Test 2.4: Non-publisher cannot approve publication (Gate 7)
  const g4 = evaluatePublicationGates({
    assignmentCase: dummyCase,
    property: dummyProperty,
    contract: dummyContract,
    documents: validDocs,
    financialReview: validFinancialReview,
    legalReview: validLegalReview,
    isPublisherRole: false, // NOT publisher
  });
  assert(g4.allPassed === false, 'Gate 7 fails when user lacks publisher role');

  // ---------------------------------------------------------------------------
  // Test Group 3: Data Repository & Public Safe View
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Testing Data Repository & Safe View ---');

  const repo = new DemoRepository();
  const publicListings = await repo.getPublicListings();

  // Test 3.1: Public listings exist
  assert(publicListings.length > 0, `Public listings returned count: ${publicListings.length}`);

  // Test 3.2: Verify no seller PII in public listings
  const hasLeakedPII = publicListings.some((l: any) => l.seller_id || l.seller_phone || l.national_id);
  assert(!hasLeakedPII, 'Zero PII in Public Listing objects (Safe View enforced)');

  // Test 3.3: Filter by governorate works
  const cairoListings = await repo.getPublicListings({ governorate: 'القاهرة' });
  const allInCairo = cairoListings.every((l) => l.property.governorate === 'القاهرة');
  assert(allInCairo && cairoListings.length > 0, 'Governorate filter functions accurately');

  // ---------------------------------------------------------------------------
  // Test Group 4: Formatting Utilities
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Testing Formatting Utilities ---');

  const formatted = formatEGP(1500000);
  assert(formatted.includes('ج.م'), `Currency formatted with Egyptian Pounds symbol: ${formatted}`);

  const caseNum = generateCaseNumber();
  assert(caseNum.startsWith('CAS-'), `Case number generator produces valid code: ${caseNum}`);

  // Summary
  console.log('\n======================================================');
  console.log(`📊 Test Summary: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
