import { validateCaseTransition } from '../src/lib/workflow/transitions';
import { evaluatePublicationGates } from '../src/lib/workflow/publishing-gates';
import { DemoRepository } from '../src/lib/data/demo-repository';
import { formatEGP, generateCaseNumber } from '../src/lib/utils';
import { normalizeEgyptianPhone, validateEmail } from '../src/lib/auth/validation';
import { hashPassword, verifyPassword } from '../src/lib/auth/passwords';
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
  console.log('🧪 Starting Aqar Swap (عقار سواب) Functional & Security Test Suite');
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
    depositPaid: 1500000,
    installments_paid: 2500000,
    remaining_balance: 4500000,
    installment_value: 250000,
    installment_frequency: 'quarterly',
    maintenance_fee: null,
    contract_date: '2023-01-15',
  } as any;

  const validDocs: CaseDocument[] = [
    {
      id: 'doc-1',
      case_id: 'case-test-1',
      doc_type: 'unit_contract',
      file_name: 'contract.pdf',
      file_size_bytes: 1024,
      mime_type: 'application/pdf',
      verification_status: 'verified',
      verified_by: 'reviewer-1',
      uploaded_at: '2026-01-01',
    },
    {
      id: 'doc-2',
      case_id: 'case-test-1',
      doc_type: 'payment_receipts',
      file_name: 'receipts.pdf',
      file_size_bytes: 1024,
      mime_type: 'application/pdf',
      verification_status: 'verified',
      verified_by: 'reviewer-1',
      uploaded_at: '2026-01-01',
    },
    {
      id: 'doc-3',
      case_id: 'case-test-1',
      doc_type: 'national_id',
      file_name: 'id.pdf',
      file_size_bytes: 1024,
      mime_type: 'application/pdf',
      verification_status: 'verified',
      verified_by: 'reviewer-1',
      uploaded_at: '2026-01-01',
    },
  ];

  const validFinancialReview: FinancialReview = {
    id: 'fr-1',
    case_id: 'case-test-1',
    verified_paid_amount: {
      amount: 4000000,
      confidence: 'confirmed_by_documents',
      source_description: 'كشف حساب رسمي معتمد من سوديك',
      verified_at: '2026-01-02',
      verified_by: 'finance-rev-1',
    },
    verified_remaining_amount: {
      amount: 4500000,
      confidence: 'confirmed_by_documents',
      source_description: 'جدول أقساط المطور الرسمي',
      verified_at: '2026-01-02',
      verified_by: 'finance-rev-1',
    },
    verified_overdue_amount: null,
    developer_transfer_fee: {
      amount: 150000,
      confidence: 'confirmed_by_documents',
      source_description: 'رسوم التنازل لدى سوديك',
      verified_at: '2026-01-02',
      verified_by: 'finance-rev-1',
    },
    fee_bearer: 'seller',
    reviewer_id: 'finance-rev-1',
    reviewer_notes: 'الأرقام مطابقة 100%',
    reviewed_at: '2026-01-02',
  };

  const validLegalReview: LegalReview = {
    id: 'lr-1',
    case_id: 'case-test-1',
    legal_verdict: 'eligible',
    developer_assignment_status: 'confirmed',
    conditions_checklist: ['عقد ثلاثي', 'سداد رسوم التنازل'],
    legal_notes: 'لا توجد موانع قانونية للتنازل',
    reviewer_id: 'legal-rev-1',
    reviewed_at: '2026-01-02',
  };

  // Test 2.1: All gates pass when all conditions met
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
    isPublisherRole: false,
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

  // ---------------------------------------------------------------------------
  // Test Group 5: Egyptian Phone Normalization & Email Validation
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Testing Egyptian Phone Normalization & Email Validation ---');

  // Test 5.1: Vodafone, Etisalat, Orange, WE normalization
  assert(normalizeEgyptianPhone('01012345678') === '+201012345678', '010 (Vodafone) normalizes to +201012345678');
  assert(normalizeEgyptianPhone('01123456789') === '+201123456789', '011 (Etisalat) normalizes to +201123456789');
  assert(normalizeEgyptianPhone('01234567890') === '+201234567890', '012 (Orange) normalizes to +201234567890');
  assert(normalizeEgyptianPhone('01599998888') === '+201599998888', '015 (WE) normalizes to +201599998888');

  // Test 5.2: Arabic-Indic numerals normalization
  assert(normalizeEgyptianPhone('٠١٠١٢٣٤٥٦٧٨') === '+201012345678', 'Arabic-Indic numerals (٠١٠...) normalized correctly');

  // Test 5.3: Invalid numbers rejected
  assert(normalizeEgyptianPhone('01912345678') === null, 'Invalid Egyptian mobile carrier 019 rejected');
  assert(normalizeEgyptianPhone('01012345') === null, 'Too short number rejected');
  assert(normalizeEgyptianPhone('0101234567899') === null, 'Too long number rejected');
  assert(normalizeEgyptianPhone('not-a-number') === null, 'Non-numeric string rejected');

  // Test 5.4: Email validation
  assert(validateEmail('test.user@aqarswap.eg') === true, 'Valid Egyptian email format accepted');
  assert(validateEmail('invalid-email-format') === false, 'Invalid email without @ domain rejected');

  // ---------------------------------------------------------------------------
  // Test Group 6: Password Hashing & Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Testing Password Hashing & PBKDF2 Verification ---');

  const storedHash = hashPassword('SecurePass123!#');
  assert(storedHash.includes(':'), 'Password hash formatted as salt:hash');
  const [saltPart, hashPart] = storedHash.split(':');
  assert(hashPart.length === 128, 'SHA-512 PBKDF2 generates 128 hex char hash');
  assert(saltPart.length === 32, 'Salt generated with 32 hex chars');
  assert(verifyPassword('SecurePass123!#', storedHash) === true, 'Correct password verification succeeds');
  assert(verifyPassword('WrongPassword!', storedHash) === false, 'Incorrect password verification fails');

  // ---------------------------------------------------------------------------
  // Test Group 7: Seller Case Creation, Documents & Submission
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Testing Seller Case Creation & Lifecycle ---');

  const testSellerId = '11111111-1111-4111-8111-111111111111';

  // Create property
  const newProp = await repo.saveProperty({
    governorate: 'الجيزة',
    city_district: 'الشيخ زايد',
    developer_name: 'بالم هيلز',
    project_name: 'بالم باركس',
    unit_type: 'duplex',
    area_sqm: 220,
    floor_number: 1,
    delivery_status: 'delivered',
  });
  assert(Boolean(newProp.id), `Property created with ID: ${newProp.id}`);

  // Create contract
  const newContract = await repo.saveContract({
    property_id: newProp.id,
    total_contract_price: 12000000,
    deposit_paid: 2000000,
    installments_paid: 4000000,
    remaining_balance: 6000000,
    installment_value: 300000,
    installment_frequency: 'quarterly',
  });
  assert(Boolean(newContract.id), `Contract saved with total: ${formatEGP(newContract.total_contract_price)}`);

  // Create submitted case
  const createdCase = await repo.createCase(testSellerId, {
    property_id: newProp.id,
    contract_id: newContract.id,
    case_nature: 'distress_exit',
    status: 'submitted',
    is_private_listing: false,
    requested_cash_amount: {
      amount: 6000000,
      confidence: 'seller_declared',
      source_description: 'المبلغ المدفوع كاش للبائع',
      verified_at: null,
      verified_by: null,
    },
    submitted_at: new Date().toISOString(),
  });
  assert(createdCase.status === 'submitted', `Case created in status '${createdCase.status}' with number: ${createdCase.case_number}`);

  // Upload Case Documents
  const uploadedDoc = await repo.saveCaseDocument({
    case_id: createdCase.id,
    doc_type: 'unit_contract',
    file_name: 'palm_parks_contract.pdf',
    verification_status: 'pending',
  });
  assert(uploadedDoc.verification_status === 'pending', 'Document uploaded and initialized to pending');

  const retrievedDocs = await repo.getDocumentsByCaseId(createdCase.id);
  assert(retrievedDocs.length >= 1, `Retrieved documents for created case: ${retrievedDocs.length}`);

  // ---------------------------------------------------------------------------
  // Test Group 8: Buyer Saved Listings & Inquiry Pipeline
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. Testing Buyer Saved Listings & Inquiry Pipeline ---');

  const testBuyerId = '22222222-2222-4222-8222-222222222221';
  const targetListingId = publicListings[0].id;

  // Toggle favorite / saved listing
  const toggleResult = await repo.toggleSavedListing(testBuyerId, targetListingId);
  assert(toggleResult.saved === true, 'Listing saved successfully to buyer favorites');

  const checkSaved = await repo.isListingSaved(testBuyerId, targetListingId);
  assert(checkSaved === true, 'isListingSaved returns true for saved listing');

  // Submit buyer inquiry lead
  const newLead = await repo.createLead({
    case_id: targetListingId,
    buyer_id: testBuyerId,
    budget_cash: 3000000,
    comfortable_installment: 200000,
    buyer_message: 'مهتم بالمعاينة والتفاوض النهائي في مقر المطور.',
  });
  assert(Boolean(newLead.id), `Lead created successfully with ID: ${newLead.id}`);

  // Connect Lead to Deal pipeline in Control Room
  const newDeal = await repo.createDeal({
    case_id: targetListingId,
    lead_id: newLead.id,
    seller_id: testSellerId,
    buyer_id: testBuyerId,
    status: 'lead',
    agreed_cash_amount: 3000000,
    notes: 'صفقة تجريبية جديدة عبر الفحص الآلي',
  });
  assert(newDeal.status === 'lead', `Deal registered in pipeline with status: ${newDeal.status}`);

  const buyerDeals = await repo.getBuyerDeals(testBuyerId);
  assert(buyerDeals.some((d) => d.id === newDeal.id), 'Deal is accessible in buyer dashboard pipeline');

  // ---------------------------------------------------------------------------
  // Test Group 9: User Suspension & Audit Trail
  // ---------------------------------------------------------------------------
  console.log('\n--- 9. Testing User Suspension & Trigger-Enforced Audit Trail ---');

  // Test suspension flag toggle
  const suspendedUser = await repo.updateUserStatus('33333333-3333-4333-8333-333333333331', true);
  assert(suspendedUser.is_suspended === true, 'User status successfully updated to suspended');

  const reactivatedUser = await repo.updateUserStatus('33333333-3333-4333-8333-333333333331', false);
  assert(reactivatedUser.is_suspended === false, 'User status successfully reactivated');

  // Test immutable audit logging
  await repo.logAuditEvent({
    entity_name: 'assignment_cases',
    entity_id: createdCase.id,
    action: 'status_transition_test',
    actor_id: 'system-test-runner',
    old_values: { status: 'draft' },
    new_values: { status: 'submitted' },
  });

  const recentLogs = await repo.getAuditLogs(10);
  const foundLog = recentLogs.find(
    (l) => l.entity_id === createdCase.id && l.action === 'status_transition_test'
  );
  assert(Boolean(foundLog), 'Audit log entry persisted and retrievable in audit trail');

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
