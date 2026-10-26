import type {
  Profile,
  UserRoleAssignment,
  Property,
  Contract,
  AssignmentCase,
  PublicListing,
  CaseDocument,
  FinancialReview,
  LegalReview,
  PublicationGates,
  Lead,
  Deal,
  BuyerPreferences,
  SavedListing,
  RoleRequest,
  AuditLogEntry,
} from '../types';

// ============================================================================
// Fictional Demo Profiles (No Real PII - Common Generic Arabic Names)
// ============================================================================
export const DEMO_PROFILES: Profile[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    full_name: 'أحمد محمد محمود',
    phone: '+201000000001',
    email: 'seller.ahmed@example.com',
    created_at: '2025-11-10T10:00:00Z',
    updated_at: '2026-01-15T12:00:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111112',
    full_name: 'سارة عبدالله إبراهيم',
    phone: '+201000000002',
    email: 'seller.sara@example.com',
    created_at: '2025-12-01T09:30:00Z',
    updated_at: '2026-01-20T14:15:00Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111113',
    full_name: 'خالد حسين علي',
    phone: '+201000000003',
    email: 'seller.khaled@example.com',
    created_at: '2026-01-05T11:00:00Z',
    updated_at: '2026-02-10T16:45:00Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222221',
    full_name: 'عمر فاروق الشناوي',
    phone: '+201100000001',
    email: 'buyer.omar@example.com',
    created_at: '2026-01-12T08:00:00Z',
    updated_at: '2026-02-18T10:30:00Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    full_name: 'منى إبراهيم حسن',
    phone: '+201100000002',
    email: 'buyer.mona@example.com',
    created_at: '2026-01-18T13:20:00Z',
    updated_at: '2026-02-22T09:00:00Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333331',
    full_name: 'كريم عادل مصطفى',
    phone: '+201200000001',
    email: 'ops.karim@aqarexit.internal',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  {
    id: '44444444-4444-4444-8444-444444444441',
    full_name: 'طارق مصطفى كمال',
    phone: '+201200000002',
    email: 'finance.tarek@aqarexit.internal',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555551',
    full_name: 'المستشار محمود النجار',
    phone: '+201200000003',
    email: 'legal.mahmoud@aqarexit.internal',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  {
    id: '66666666-6666-4666-8666-666666666661',
    full_name: 'نادين الشريف',
    phone: '+201200000004',
    email: 'publisher.nadine@aqarexit.internal',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  {
    id: '77777777-7777-4777-8777-777777777771',
    full_name: 'يوسف حسن رمزي',
    phone: '+201200000005',
    email: 'admin.youssef@aqarexit.internal',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
];

// ============================================================================
// User Roles Assignments
// ============================================================================
export const DEMO_USER_ROLES: UserRoleAssignment[] = [
  {
    id: 'role-1',
    user_id: '11111111-1111-4111-8111-111111111111',
    role: 'seller',
    assigned_at: '2025-11-10T10:00:00Z',
    assigned_by: null,
  },
  {
    id: 'role-2',
    user_id: '11111111-1111-4111-8111-111111111112',
    role: 'seller',
    assigned_at: '2025-12-01T09:30:00Z',
    assigned_by: null,
  },
  {
    id: 'role-3',
    user_id: '11111111-1111-4111-8111-111111111113',
    role: 'seller',
    assigned_at: '2026-01-05T11:00:00Z',
    assigned_by: null,
  },
  {
    id: 'role-4',
    user_id: '22222222-2222-4222-8222-222222222221',
    role: 'buyer',
    assigned_at: '2026-01-12T08:00:00Z',
    assigned_by: null,
  },
  {
    id: 'role-5',
    user_id: '22222222-2222-4222-8222-222222222222',
    role: 'buyer',
    assigned_at: '2026-01-18T13:20:00Z',
    assigned_by: null,
  },
  {
    id: 'role-6',
    user_id: '33333333-3333-4333-8333-333333333331',
    role: 'operations',
    assigned_at: '2025-10-01T08:00:00Z',
    assigned_by: '77777777-7777-4777-8777-777777777771',
  },
  {
    id: 'role-7',
    user_id: '44444444-4444-4444-8444-444444444441',
    role: 'finance_reviewer',
    assigned_at: '2025-10-01T08:00:00Z',
    assigned_by: '77777777-7777-4777-8777-777777777771',
  },
  {
    id: 'role-8',
    user_id: '55555555-5555-4555-8555-555555555551',
    role: 'legal_reviewer',
    assigned_at: '2025-10-01T08:00:00Z',
    assigned_by: '77777777-7777-4777-8777-777777777771',
  },
  {
    id: 'role-9',
    user_id: '66666666-6666-4666-8666-666666666661',
    role: 'publisher',
    assigned_at: '2025-10-01T08:00:00Z',
    assigned_by: '77777777-7777-4777-8777-777777777771',
  },
  {
    id: 'role-10',
    user_id: '77777777-7777-4777-8777-777777777771',
    role: 'system_admin',
    assigned_at: '2025-10-01T08:00:00Z',
    assigned_by: null,
  },
];

// ============================================================================
// Reference Lists
// ============================================================================
export const DEMO_GOVERNORATES: string[] = [
  'القاهرة',
  'الجيزة',
  'العاصمة الإدارية الجديدة',
  'الإسكندرية',
  'البحر الأحمر',
  'الساحل الشمالي',
];

export const DEMO_DEVELOPERS: string[] = [
  'إعمار مصر (Emaar Misr)',
  'سوديك (SODIC)',
  'بالم هيلز (Palm Hills)',
  'ماونتن فيو (Mountain View)',
  'أورا ديفلوبرز (Ora Developers)',
  'مصر إيطاليا (Misr Italia)',
  'طلعت مصطفى (TMG)',
];

// ============================================================================
// Properties (Egyptian Real Estate Market)
// ============================================================================
export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'aaaaaaaa-1111-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'القاهرة',
    city_district: 'القاهرة الجديدة (التجمع الخامس)',
    developer_name: 'إعمار مصر (Emaar Misr)',
    project_name: 'ميفيدا (Mivida)',
    unit_type: 'apartment',
    area_sqm: 175,
    floor_number: 3,
    delivery_status: 'under_construction',
    expected_delivery_date: '2027-06-30',
  },
  {
    id: 'aaaaaaaa-2222-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'الجيزة',
    city_district: 'مدينة الشيخ زايد',
    developer_name: 'سوديك (SODIC)',
    project_name: 'ذا إستيتس (The Estates)',
    unit_type: 'townhouse',
    area_sqm: 240,
    floor_number: 1,
    delivery_status: 'under_construction',
    expected_delivery_date: '2026-12-31',
  },
  {
    id: 'aaaaaaaa-3333-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'الجيزة',
    city_district: 'السادس من أكتوبر',
    developer_name: 'بالم هيلز (Palm Hills)',
    project_name: 'بالم هيلز أكتوبر (Palm Hills October)',
    unit_type: 'villa',
    area_sqm: 350,
    floor_number: 0,
    delivery_status: 'delivered',
    expected_delivery_date: null,
  },
  {
    id: 'aaaaaaaa-4444-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'الجيزة',
    city_district: 'السادس من أكتوبر',
    developer_name: 'ماونتن فيو (Mountain View)',
    project_name: 'ماونتن فيو آي سيتي (Mountain View iCity)',
    unit_type: 'duplex',
    area_sqm: 210,
    floor_number: 2,
    delivery_status: 'under_construction',
    expected_delivery_date: '2027-03-31',
  },
  {
    id: 'aaaaaaaa-5555-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'العاصمة الإدارية الجديدة',
    city_district: 'الحي السكني السابع (R7)',
    developer_name: 'مصر إيطاليا (Misr Italia)',
    project_name: 'إيل بوسكو (IL Bosco)',
    unit_type: 'penthouse',
    area_sqm: 230,
    floor_number: 7,
    delivery_status: 'finishing',
    expected_delivery_date: '2026-09-30',
  },
  {
    id: 'aaaaaaaa-6666-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'القاهرة',
    city_district: 'القاهرة الجديدة (التجمع الخامس)',
    developer_name: 'أورا ديفلوبرز (Ora Developers)',
    project_name: 'زد إيست (ZED East)',
    unit_type: 'apartment',
    area_sqm: 140,
    floor_number: 4,
    delivery_status: 'under_construction',
    expected_delivery_date: '2027-12-31',
  },
  {
    id: 'aaaaaaaa-7777-4aaa-8aaa-aaaaaaaaaaaa',
    governorate: 'القاهرة',
    city_district: 'القاهرة الجديدة (التجمع الخامس)',
    developer_name: 'سوديك (SODIC)',
    project_name: 'إيست تاون (Eastown)',
    unit_type: 'apartment',
    area_sqm: 185,
    floor_number: 2,
    delivery_status: 'delivered',
    expected_delivery_date: null,
  },
];

// ============================================================================
// Contracts (Amounts in EGP)
// ============================================================================
export const DEMO_CONTRACTS: Contract[] = [
  {
    id: 'bbbbbbbb-1111-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-1111-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 12000000,
    deposit_paid: 2400000,
    installments_paid: 3600000,
    remaining_balance: 6000000,
    installment_value: 300000,
    installment_frequency: 'quarterly',
    maintenance_fee: 600000,
    contract_date: '2023-01-15',
  },
  {
    id: 'bbbbbbbb-2222-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-2222-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 16500000,
    deposit_paid: 3300000,
    installments_paid: 4950000,
    remaining_balance: 8250000,
    installment_value: 412500,
    installment_frequency: 'quarterly',
    maintenance_fee: 825000,
    contract_date: '2022-08-10',
  },
  {
    id: 'bbbbbbbb-3333-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-3333-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 28000000,
    deposit_paid: 7000000,
    installments_paid: 14000000,
    remaining_balance: 7000000,
    installment_value: 700000,
    installment_frequency: 'quarterly',
    maintenance_fee: 1400000,
    contract_date: '2021-04-01',
  },
  {
    id: 'bbbbbbbb-4444-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-4444-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 9200000,
    deposit_paid: 1840000,
    installments_paid: 1840000,
    remaining_balance: 5520000,
    installment_value: 230000,
    installment_frequency: 'quarterly',
    maintenance_fee: 460000,
    contract_date: '2023-05-20',
  },
  {
    id: 'bbbbbbbb-5555-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-5555-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 7800000,
    deposit_paid: 1560000,
    installments_paid: 3120000,
    remaining_balance: 3120000,
    installment_value: 195000,
    installment_frequency: 'quarterly',
    maintenance_fee: 390000,
    contract_date: '2022-11-12',
  },
  {
    id: 'bbbbbbbb-6666-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-6666-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 11500000,
    deposit_paid: 2300000,
    installments_paid: 2300000,
    remaining_balance: 6900000,
    installment_value: 287500,
    installment_frequency: 'quarterly',
    maintenance_fee: 575000,
    contract_date: '2023-09-01',
  },
  {
    id: 'bbbbbbbb-7777-4bbb-8bbb-bbbbbbbbbbbb',
    property_id: 'aaaaaaaa-7777-4aaa-8aaa-aaaaaaaaaaaa',
    total_contract_price: 14000000,
    deposit_paid: 7000000,
    installments_paid: 7000000,
    remaining_balance: 0,
    installment_value: null,
    installment_frequency: null,
    maintenance_fee: 700000,
    contract_date: '2019-02-15',
  },
];

// ============================================================================
// Assignment Cases (Business Entities in Various Lifecycle Stages)
// ============================================================================
export const DEMO_CASES: AssignmentCase[] = [
  {
    id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1001',
    seller_id: '11111111-1111-4111-8111-111111111111',
    property_id: 'aaaaaaaa-1111-4aaa-8aaa-aaaaaaaaaaaa',
    contract_id: 'bbbbbbbb-1111-4bbb-8bbb-bbbbbbbbbbbb',
    case_nature: 'standard_assignment',
    status: 'published',
    is_private_listing: false,
    requested_cash_amount: {
      amount: 7500000,
      confidence: 'confirmed_by_documents',
      source_description: 'المبلغ المدفوع (٦ مليون) + أوفر برايس مطلوب (١.٥ مليون)',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    seller_notes: 'تنازل رسمي في مقر شركة إعمار مصر. الشقة تطل على مساحات خضراء وبحيرة.',
    submitted_at: '2026-01-20T10:00:00Z',
    published_at: '2026-02-05T14:30:00Z',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-02-05T14:30:00Z',
  },
  {
    id: 'cccccccc-2222-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1002',
    seller_id: '11111111-1111-4111-8111-111111111112',
    property_id: 'aaaaaaaa-2222-4aaa-8aaa-aaaaaaaaaaaa',
    contract_id: 'bbbbbbbb-2222-4bbb-8bbb-bbbbbbbbbbbb',
    case_nature: 'standard_assignment',
    status: 'in_review',
    is_private_listing: false,
    requested_cash_amount: {
      amount: 9500000,
      confidence: 'seller_declared',
      source_description: 'إقرار البائع بالمدفوعات والمطلوب',
      verified_at: null,
      verified_by: null,
    },
    seller_notes: 'تاون هاوس زاوية بموقع متميز، رغبة في سرعة إنهاء التنازل لظروف السفر.',
    submitted_at: '2026-02-15T09:15:00Z',
    published_at: null,
    created_at: '2026-02-12T12:00:00Z',
    updated_at: '2026-02-16T15:00:00Z',
  },
  {
    id: 'cccccccc-3333-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1003',
    seller_id: '11111111-1111-4111-8111-111111111113',
    property_id: 'aaaaaaaa-4444-4aaa-8aaa-aaaaaaaaaaaa',
    contract_id: 'bbbbbbbb-4444-4bbb-8bbb-bbbbbbbbbbbb',
    case_nature: 'distress_exit',
    status: 'submitted',
    is_private_listing: false,
    requested_cash_amount: {
      amount: 3400000,
      confidence: 'seller_declared',
      source_description: 'تخارج عاجل بأقل من المدفوع (٣.٦٨ مليون)',
      verified_at: null,
      verified_by: null,
    },
    seller_notes: 'بيع اضطراري لعدم القدرة على استكمال الأقساط، مطلوب المشتري الجاهز للدفع الفوري.',
    submitted_at: '2026-02-20T16:00:00Z',
    published_at: null,
    created_at: '2026-02-20T14:30:00Z',
    updated_at: '2026-02-20T16:00:00Z',
  },
  {
    id: 'cccccccc-4444-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1004',
    seller_id: '11111111-1111-4111-8111-111111111111',
    property_id: 'aaaaaaaa-5555-4aaa-8aaa-aaaaaaaaaaaa',
    contract_id: 'bbbbbbbb-5555-4bbb-8bbb-bbbbbbbbbbbb',
    case_nature: 'standard_assignment',
    status: 'draft',
    is_private_listing: false,
    requested_cash_amount: {
      amount: 5200000,
      confidence: 'seller_declared',
      source_description: 'تقدير مبدئي من البائع',
      verified_at: null,
      verified_by: null,
    },
    seller_notes: 'مسودة قيد التجهيز لإرفاق إيصالات السداد البنكية.',
    submitted_at: null,
    published_at: null,
    created_at: '2026-02-22T10:00:00Z',
    updated_at: '2026-02-22T10:00:00Z',
  },
  {
    id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1005',
    seller_id: '11111111-1111-4111-8111-111111111112',
    property_id: 'aaaaaaaa-6666-4aaa-8aaa-aaaaaaaaaaaa',
    contract_id: 'bbbbbbbb-6666-4bbb-8bbb-bbbbbbbbbbbb',
    case_nature: 'distress_exit',
    status: 'published',
    is_private_listing: false,
    requested_cash_amount: {
      amount: 4400000,
      confidence: 'confirmed_by_documents',
      source_description: 'تخارج سريع بخصم ٢٠٠ ألف عن إجمالي المدفوع للمطور',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    seller_notes: 'فرصة تخارج سريع في التجمع الخامس بمشروع زد إيست، جاهز للتنازل الفوري.',
    submitted_at: '2026-02-02T11:00:00Z',
    published_at: '2026-02-12T16:00:00Z',
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-12T16:00:00Z',
  },
];

// ============================================================================
// Public Safe Listings (Sanitized View - No PII, No Sensitive Docs)
// ============================================================================
export const DEMO_PUBLIC_LISTINGS: PublicListing[] = [
  {
    id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1001',
    property: DEMO_PROPERTIES[0],
    total_contract_price: {
      amount: 12000000,
      confidence: 'confirmed_by_documents',
      source_description: 'عقد الوحدة الصادر من إعمار مصر',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    total_paid: {
      amount: 6000000,
      confidence: 'confirmed_by_documents',
      source_description: 'كشف حساب رسمي وإيصالات سداد بنكية معتمدة',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    remaining_balance: {
      amount: 6000000,
      confidence: 'confirmed_by_documents',
      source_description: 'مطابق لجدول أقساط المطور الرسمي',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    installment_value: 300000,
    installment_frequency: 'quarterly',
    case_nature: 'standard_assignment',
    published_at: '2026-02-05T14:30:00Z',
    last_verified_at: '2026-02-04T12:00:00Z',
    developer_transfer_fee: {
      amount: 600000,
      confidence: 'confirmed_by_documents',
      source_description: '٥٪ رسوم تنازل حسب اللائحة العقارية لشركة إعمار',
      verified_at: '2026-02-02T10:00:00Z',
      verified_by: '55555555-5555-4555-8555-555555555551',
    },
  },
  {
    id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    case_number: 'CAS-2026-1005',
    property: DEMO_PROPERTIES[5],
    total_contract_price: {
      amount: 11500000,
      confidence: 'confirmed_by_documents',
      source_description: 'عقد الوحدة بشركة أورا ديفلوبرز',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    total_paid: {
      amount: 4600000,
      confidence: 'confirmed_by_documents',
      source_description: 'بيان حساب موثق من المطور',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    remaining_balance: {
      amount: 6900000,
      confidence: 'confirmed_by_documents',
      source_description: 'الأقساط المتبقية حتى نهاية ٢٠٣٠',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    installment_value: 287500,
    installment_frequency: 'quarterly',
    case_nature: 'distress_exit',
    published_at: '2026-02-12T16:00:00Z',
    last_verified_at: '2026-02-11T15:30:00Z',
    developer_transfer_fee: {
      amount: 350000,
      confidence: 'confirmed_by_documents',
      source_description: 'رسوم نقل الملكية المعتمدة لدى المطور',
      verified_at: '2026-02-10T16:00:00Z',
      verified_by: '55555555-5555-4555-8555-555555555551',
    },
  },
];

// ============================================================================
// Case Documents (Metadata Only - No Sensitive Files)
// ============================================================================
export const DEMO_DOCUMENTS: CaseDocument[] = [
  {
    id: 'doc-101',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    doc_type: 'unit_contract',
    file_name: 'emaar_mivida_contract_redacted.pdf',
    file_size_bytes: 3450000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: '55555555-5555-4555-8555-555555555551',
    uploaded_at: '2026-01-20T10:15:00Z',
  },
  {
    id: 'doc-102',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    doc_type: 'payment_receipts',
    file_name: 'official_bank_receipts_all.pdf',
    file_size_bytes: 2180000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: '44444444-4444-4444-8444-444444444441',
    uploaded_at: '2026-01-20T10:20:00Z',
  },
  {
    id: 'doc-103',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    doc_type: 'statement_of_account',
    file_name: 'developer_statement_jan_2026.pdf',
    file_size_bytes: 1250000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: '44444444-4444-4444-8444-444444444441',
    uploaded_at: '2026-01-20T10:25:00Z',
  },
  {
    id: 'doc-104',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    doc_type: 'developer_policy',
    file_name: 'emaar_assignment_rules_2026.pdf',
    file_size_bytes: 850000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: '55555555-5555-4555-8555-555555555551',
    uploaded_at: '2026-01-21T09:00:00Z',
  },
  {
    id: 'doc-201',
    case_id: 'cccccccc-2222-4ccc-8ccc-cccccccccccc',
    doc_type: 'unit_contract',
    file_name: 'sodic_estates_contract.pdf',
    file_size_bytes: 4100000,
    mime_type: 'application/pdf',
    verification_status: 'pending',
    verified_by: null,
    uploaded_at: '2026-02-15T09:30:00Z',
  },
  {
    id: 'doc-202',
    case_id: 'cccccccc-2222-4ccc-8ccc-cccccccccccc',
    doc_type: 'statement_of_account',
    file_name: 'sodic_statement_2026.pdf',
    file_size_bytes: 1540000,
    mime_type: 'application/pdf',
    verification_status: 'pending',
    verified_by: null,
    uploaded_at: '2026-02-15T09:35:00Z',
  },
  {
    id: 'doc-501',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    doc_type: 'unit_contract',
    file_name: 'ora_zed_east_contract.pdf',
    file_size_bytes: 3820000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: '55555555-5555-4555-8555-555555555551',
    uploaded_at: '2026-02-02T11:15:00Z',
  },
  {
    id: 'doc-502',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    doc_type: 'statement_of_account',
    file_name: 'ora_account_statement.pdf',
    file_size_bytes: 1410000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: '44444444-4444-4444-8444-444444444441',
    uploaded_at: '2026-02-02T11:20:00Z',
  },
];

// ============================================================================
// Financial Reviews
// ============================================================================
export const DEMO_FINANCIAL_REVIEWS: FinancialReview[] = [
  {
    id: 'fin-rev-1',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    verified_paid_amount: {
      amount: 6000000,
      confidence: 'confirmed_by_documents',
      source_description: 'مطابق لكشف الحساب الصادر من إعمار مصر والإيداعات البنكية',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    verified_remaining_amount: {
      amount: 6000000,
      confidence: 'confirmed_by_documents',
      source_description: '٢٠ قسط ربع سنوي بقيمة ٣٠٠ ألف ج.م للقسط',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    verified_overdue_amount: {
      amount: 0,
      confidence: 'confirmed_by_documents',
      source_description: 'لا توجد أي أقساط متأخرة أو غرامات مسجلة',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    developer_transfer_fee: {
      amount: 600000,
      confidence: 'confirmed_by_documents',
      source_description: 'نسبة ٥٪ من إجمالي ثمن العقد تدفع لشركة إعمار مصر',
      verified_at: '2026-02-01T11:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    fee_bearer: 'buyer',
    reviewer_id: '44444444-4444-4444-8444-444444444441',
    reviewer_notes: 'تمت مراجعة جميع المستندات المالية والتحقق من سداد كامل الأقساط المستحقة حتى تاريخه.',
    reviewed_at: '2026-02-01T11:30:00Z',
  },
  {
    id: 'fin-rev-5',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    verified_paid_amount: {
      amount: 4600000,
      confidence: 'confirmed_by_documents',
      source_description: 'مراجعة بيان حساب شركة أورا ومطابقته للمدفوعات الفعلية',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    verified_remaining_amount: {
      amount: 6900000,
      confidence: 'confirmed_by_documents',
      source_description: '٢٤ قسط ربع سنوي متبقي بقيمة ٢٨٧٬٥٠٠ ج.م',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    verified_overdue_amount: {
      amount: 0,
      confidence: 'confirmed_by_documents',
      source_description: 'لا توجد متأخرات',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    developer_transfer_fee: {
      amount: 350000,
      confidence: 'confirmed_by_documents',
      source_description: 'رسوم التنازل المحددة من أورا',
      verified_at: '2026-02-10T14:00:00Z',
      verified_by: '44444444-4444-4444-8444-444444444441',
    },
    fee_bearer: 'seller',
    reviewer_id: '44444444-4444-4444-8444-444444444441',
    reviewer_notes: 'حالة تخارج سريع، السعر المطلوب من البائع مغرٍ وموثق مالياً.',
    reviewed_at: '2026-02-10T14:30:00Z',
  },
];

// ============================================================================
// Legal Reviews
// ============================================================================
export const DEMO_LEGAL_REVIEWS: LegalReview[] = [
  {
    id: 'leg-rev-1',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    legal_verdict: 'eligible',
    developer_assignment_status: 'confirmed',
    conditions_checklist: [
      'سداد كافة الشيكات والأقساط المستحقة قبل موعد التنازل',
      'حضور الطرفين البائع والمشتري شخصياً أو بتوكيل خاص موثق بالشهر العقاري يبيح التنازل',
      'سداد رسوم التنازل المقررة لشركة إعمار مصر',
      'الحصول على مخالصة نهائية باسم البائع',
    ],
    legal_notes: 'العقد الأصلي سليم وقانوني ولا يوجد أي مانع قانوني أو حظر للتنازل من شركة إعمار.',
    reviewer_id: '55555555-5555-4555-8555-555555555551',
    reviewed_at: '2026-02-02T14:00:00Z',
  },
  {
    id: 'leg-rev-5',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    legal_verdict: 'eligible',
    developer_assignment_status: 'confirmed',
    conditions_checklist: [
      'حضور البائع والمشتري لإدارة خدمة العملاء بشركة أورا',
      'سداد رسوم نقل الملكية المقررة',
      'تقديم إثبات شخصية سارٍ للطرفين',
    ],
    legal_notes: 'تمت مراجعة سياسة التنازل لدى أورا ديفلوبرز ومطابقتها لبنود العقد.',
    reviewer_id: '55555555-5555-4555-8555-555555555551',
    reviewed_at: '2026-02-11T12:00:00Z',
  },
];

// ============================================================================
// Publication Gates
// ============================================================================
export const DEMO_PUBLICATION_GATES: PublicationGates[] = [
  {
    id: 'gate-1',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    gate_1_complete_unit_data: true,
    gate_2_seller_identity_confirmed: true,
    gate_3_mandatory_docs_verified: true,
    gate_4_financial_review_approved: true,
    gate_5_legal_review_approved: true,
    gate_6_developer_transfer_clear: true,
    gate_7_publisher_authorized: true,
    gate_8_pii_sanitized_for_public: true,
    gate_9_disclaimers_and_timestamp_ready: true,
    published_by: '66666666-6666-4666-8666-666666666661',
    published_at: '2026-02-05T14:30:00Z',
  },
  {
    id: 'gate-5',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    gate_1_complete_unit_data: true,
    gate_2_seller_identity_confirmed: true,
    gate_3_mandatory_docs_verified: true,
    gate_4_financial_review_approved: true,
    gate_5_legal_review_approved: true,
    gate_6_developer_transfer_clear: true,
    gate_7_publisher_authorized: true,
    gate_8_pii_sanitized_for_public: true,
    gate_9_disclaimers_and_timestamp_ready: true,
    published_by: '66666666-6666-4666-8666-666666666661',
    published_at: '2026-02-12T16:00:00Z',
  },
];

// ============================================================================
// Fictional Buyer Leads
// ============================================================================
export const DEMO_LEADS: Lead[] = [
  {
    id: 'lead-001',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    buyer_message: 'مهتم جداً بشقة ميفيدا وجاهز لدفع المبلغ النقدي المطلوب بعد المعاينة ومراجعة الأوراق.',
    budget_cash: 7500000,
    comfortable_installment: 300000,
    created_at: '2026-02-06T10:00:00Z',
  },
  {
    id: 'lead-002',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    buyer_id: '22222222-2222-4222-8222-222222222222',
    buyer_message: 'هل رسوم التنازل لدى إعمار مشمولة في المبلغ المطلوب كاش أم يتحملها المشتري؟',
    budget_cash: 7000000,
    comfortable_installment: 300000,
    created_at: '2026-02-08T15:30:00Z',
  },
  {
    id: 'lead-003',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    buyer_message: 'مستعد للتنفيذ الفوري في زد إيست إذا كان التنازل متاحاً خلال أسبوع.',
    budget_cash: 4500000,
    comfortable_installment: 300000,
    created_at: '2026-02-14T11:20:00Z',
  },
];

// ============================================================================
// Fictional Active Deals
// ============================================================================
export const DEMO_DEALS: Deal[] = [
  {
    id: 'deal-001',
    case_id: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    lead_id: 'lead-001',
    seller_id: '11111111-1111-4111-8111-111111111111',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    status: 'developer_approval_pending',
    agreed_cash_amount: 7200000,
    notes: 'تمت المعاينة والاتفاق المبدئي، بانتظار إفادة خدمة عملاء إعمار بموعد التنازل الرسمي.',
    created_at: '2026-02-10T12:00:00Z',
    updated_at: '2026-02-18T14:30:00Z',
  },
  {
    id: 'deal-002',
    case_id: 'cccccccc-5555-4ccc-8ccc-cccccccccccc',
    lead_id: 'lead-003',
    seller_id: '11111111-1111-4111-8111-111111111112',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    status: 'viewing_or_discussion',
    agreed_cash_amount: null,
    notes: 'تواصل أولي للاستفسار عن موعد المعاينة الميدانية.',
    created_at: '2026-02-15T09:00:00Z',
    updated_at: '2026-02-15T09:00:00Z',
  },
];

// ============================================================================
// Fictional Buyer Preferences
// ============================================================================
export const DEMO_BUYER_PREFERENCES: BuyerPreferences[] = [
  {
    id: 'pref-001',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    budget_cash: 8000000,
    max_installment_value: 350000,
    preferred_governorates: ['القاهرة', 'الجيزة'],
    preferred_districts: ['القاهرة الجديدة (التجمع الخامس)', 'الشيخ زايد'],
    preferred_unit_types: ['apartment', 'duplex'],
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 'pref-002',
    buyer_id: '22222222-2222-4222-8222-222222222222',
    budget_cash: 6000000,
    max_installment_value: 250000,
    preferred_governorates: ['القاهرة'],
    preferred_districts: ['العاصمة الإدارية الجديدة', 'المستقبل سيتي'],
    preferred_unit_types: ['apartment'],
    updated_at: '2026-02-10T11:00:00Z',
  },
];

// ============================================================================
// Fictional Saved Listings (Favorites)
// ============================================================================
export const DEMO_SAVED_LISTINGS: SavedListing[] = [
  {
    id: 'saved-001',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    listing_id: 'list-001',
    saved_at: '2026-02-06T11:00:00Z',
  },
  {
    id: 'saved-002',
    buyer_id: '22222222-2222-4222-8222-222222222221',
    listing_id: 'list-005',
    saved_at: '2026-02-14T09:30:00Z',
  },
];

// ============================================================================
// Fictional Role Upgrade Requests
// ============================================================================
export const DEMO_ROLE_REQUESTS: RoleRequest[] = [
  {
    id: 'req-001',
    user_id: '11111111-1111-4111-8111-111111111111',
    requested_role: 'buyer',
    reason: 'أرغب في شراء فرصة بديلة في التجمع بعد التخارج من وحدتي الحالية.',
    status: 'pending',
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2026-02-16T11:00:00Z',
  },
  {
    id: 'req-002',
    user_id: '22222222-2222-4222-8222-222222222221',
    requested_role: 'seller',
    reason: 'أمتلك وحدة إضافية في الشيخ زايد وأرغب في عرضها للتنازل المعتمد.',
    status: 'approved',
    reviewed_by: '99999999-9999-4999-8999-999999999995',
    reviewed_at: '2026-02-18T14:00:00Z',
    created_at: '2026-02-17T09:00:00Z',
  },
];

// ============================================================================
// Fictional Audit Logs
// ============================================================================
export const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    entity_name: 'assignment_cases',
    entity_id: 'c1111111-1111-4111-8111-111111111111',
    action: 'CASE_STATUS_TRANSITION',
    actor_id: '99999999-9999-4999-8999-999999999994',
    old_values: { status: 'approved' },
    new_values: { status: 'published', gates_evaluated: true },
    ip_address: '192.168.1.10',
    timestamp: '2026-02-05T12:00:00Z',
  },
  {
    id: 'log-002',
    entity_name: 'financial_reviews',
    entity_id: 'c1111111-1111-4111-8111-111111111111',
    action: 'FINANCIAL_REVIEW_APPROVED',
    actor_id: '99999999-9999-4999-8999-999999999992',
    old_values: null,
    new_values: { verified_paid_amount: 1950000, verified_remaining_amount: 1450000 },
    ip_address: '192.168.1.12',
    timestamp: '2026-02-04T15:30:00Z',
  },
  {
    id: 'log-003',
    entity_name: 'legal_reviews',
    entity_id: 'c1111111-1111-4111-8111-111111111111',
    action: 'LEGAL_REVIEW_APPROVED',
    actor_id: '99999999-9999-4999-8999-999999999993',
    old_values: null,
    new_values: { legal_verdict: 'eligible', developer_status: 'confirmed' },
    ip_address: '192.168.1.15',
    timestamp: '2026-02-04T16:00:00Z',
  },
  {
    id: 'log-004',
    entity_name: 'profiles',
    entity_id: '22222222-2222-4222-8222-222222222221',
    action: 'ROLE_ASSIGNED',
    actor_id: '99999999-9999-4999-8999-999999999995',
    old_values: { roles: ['buyer'] },
    new_values: { roles: ['buyer', 'seller'] },
    ip_address: '192.168.1.1',
    timestamp: '2026-02-18T14:00:00Z',
  },
];

