// Enums
export type UserRole =
  | 'buyer'
  | 'seller'
  | 'operations'
  | 'finance_reviewer'
  | 'legal_reviewer'
  | 'publisher'
  | 'admin'
  | 'system_admin';

export type CaseStatus =
  | 'draft'
  | 'submitted'
  | 'screening'
  | 'documents_pending'
  | 'in_review'
  | 'ready_for_approval'
  | 'approved'
  | 'published'
  | 'paused'
  | 'closed'
  | 'rejected';

export type CaseNature = 'standard_assignment' | 'distress_exit';

export type LegalVerdict =
  | 'not_started'
  | 'in_progress'
  | 'eligible'
  | 'eligible_with_conditions'
  | 'not_eligible';

export type DeveloperAssignmentStatus =
  | 'confirmed'
  | 'pending_letter'
  | 'forbidden_until_full_payment'
  | 'not_required'
  | 'unknown';

export type DealStatus =
  | 'lead'
  | 'buyer_qualified'
  | 'viewing_or_discussion'
  | 'offer_made'
  | 'offer_accepted'
  | 'developer_approval_pending'
  | 'transfer_in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type DocumentType =
  | 'unit_contract'
  | 'payment_receipts'
  | 'statement_of_account'
  | 'national_id'
  | 'developer_policy'
  | 'other';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type UnitType =
  | 'apartment'
  | 'duplex'
  | 'villa'
  | 'townhouse'
  | 'penthouse'
  | 'studio'
  | 'commercial'
  | 'administrative'
  | 'medical'
  | 'other';

export type DeliveryStatus = 'delivered' | 'under_construction' | 'finishing';

export type InstallmentFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual';

export type FeeBearerType = 'seller' | 'buyer' | 'split' | 'to_be_determined';

export type AmountConfidence =
  | 'confirmed_by_documents'
  | 'seller_declared'
  | 'estimated'
  | 'requires_verification';

// Interfaces for each entity. Keep them clean.
// Profile - no sensitive PII exposed publicly
export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  is_suspended?: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role: UserRole;
  assigned_at: string;
  assigned_by: string | null;
}

export interface RoleRequest {
  id: string;
  user_id: string;
  requested_role: UserRole;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// Property - the physical real estate unit
export interface Property {
  id: string;
  governorate: string;
  city_district: string;
  developer_name: string;
  project_name: string;
  unit_type: UnitType;
  area_sqm: number | null;
  floor_number: number | null;
  delivery_status: DeliveryStatus;
  expected_delivery_date: string | null;
}

// Contract - the financial agreement
export interface Contract {
  id: string;
  property_id: string;
  total_contract_price: number;
  deposit_paid: number;
  installments_paid: number;
  remaining_balance: number;
  installment_value: number | null;
  installment_frequency: InstallmentFrequency | null;
  maintenance_fee: number | null;
  contract_date: string | null;
}

// Financial amounts with source tracking
export interface TrackedAmount {
  amount: number;
  confidence: AmountConfidence;
  source_description: string | null;
  verified_at: string | null;
  verified_by: string | null;
}

// Assignment Case - the core business entity
export interface AssignmentCase {
  id: string;
  case_number: string;
  seller_id: string;
  property_id: string;
  contract_id: string;
  case_nature: CaseNature;
  status: CaseStatus;
  is_private_listing: boolean;
  requested_cash_amount: TrackedAmount | null;
  seller_notes: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Public-safe view of a listing (no seller PII, no private docs)
export interface PublicListing {
  id: string;
  case_number: string;
  property: Property;
  total_contract_price: TrackedAmount;
  total_paid: TrackedAmount;
  remaining_balance: TrackedAmount;
  installment_value: number | null;
  installment_frequency: InstallmentFrequency | null;
  case_nature: CaseNature;
  published_at: string;
  last_verified_at: string | null;
  developer_transfer_fee: TrackedAmount | null;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  doc_type: DocumentType;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  verification_status: VerificationStatus;
  verified_by: string | null;
  uploaded_at: string;
  // storage_path is NEVER exposed to client - only server-side
}

export interface FinancialReview {
  id: string;
  case_id: string;
  verified_paid_amount: TrackedAmount;
  verified_remaining_amount: TrackedAmount;
  verified_overdue_amount: TrackedAmount | null;
  developer_transfer_fee: TrackedAmount | null;
  fee_bearer: FeeBearerType;
  reviewer_id: string;
  reviewer_notes: string | null;
  reviewed_at: string;
}

export interface LegalReview {
  id: string;
  case_id: string;
  legal_verdict: LegalVerdict;
  developer_assignment_status: DeveloperAssignmentStatus;
  conditions_checklist: string[];
  legal_notes: string | null;
  reviewer_id: string;
  reviewed_at: string;
}

export interface PublicationGates {
  id: string;
  case_id: string;
  gate_1_complete_unit_data: boolean;
  gate_2_seller_identity_confirmed: boolean;
  gate_3_mandatory_docs_verified: boolean;
  gate_4_financial_review_approved: boolean;
  gate_5_legal_review_approved: boolean;
  gate_6_developer_transfer_clear: boolean;
  gate_7_publisher_authorized: boolean;
  gate_8_pii_sanitized_for_public: boolean;
  gate_9_disclaimers_and_timestamp_ready: boolean;
  published_by: string | null;
  published_at: string | null;
}

export interface Lead {
  id: string;
  case_id: string;
  buyer_id: string;
  buyer_message: string | null;
  budget_cash: number | null;
  comfortable_installment: number | null;
  created_at: string;
}

export interface Deal {
  id: string;
  case_id: string;
  lead_id: string;
  seller_id: string;
  buyer_id: string;
  status: DealStatus;
  agreed_cash_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuyerPreferences {
  id: string;
  buyer_id: string;
  budget_cash: number;
  max_installment_value: number;
  preferred_governorates: string[];
  preferred_districts: string[];
  preferred_unit_types: UnitType[];
  updated_at: string;
}

export interface SavedListing {
  id: string;
  buyer_id: string;
  listing_id: string;
  saved_at: string;
}

export interface AuditLogEntry {
  id: string;
  entity_name: string;
  entity_id: string;
  action: string;
  actor_id: string | null;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  ip_address?: string | null;
  timestamp: string;
}

// Allowed case status transitions (used by server-side validation)
export const ALLOWED_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  draft: ['submitted'],
  submitted: ['screening', 'rejected'],
  screening: ['documents_pending', 'in_review', 'rejected'],
  documents_pending: ['screening', 'in_review'],
  in_review: ['ready_for_approval', 'documents_pending', 'rejected'],
  ready_for_approval: ['approved', 'in_review', 'rejected'],
  approved: ['published', 'paused'],
  published: ['paused', 'closed'],
  paused: ['published', 'closed'],
  closed: [],
  rejected: [],
};

// ============================================================================
// Acquisition Requests Enums and Interfaces (/sell & /buy)
// ============================================================================

export type SellerRequestStatus =
  | 'pending'
  | 'under_review'
  | 'needs_information'
  | 'qualified'
  | 'rejected'
  | 'converted_to_case'
  | 'closed';

export type BuyerRequestStatus =
  | 'pending'
  | 'under_review'
  | 'needs_information'
  | 'qualified'
  | 'matching'
  | 'contacted'
  | 'converted_to_deal'
  | 'rejected'
  | 'closed';

export const ALLOWED_SELLER_REQUEST_TRANSITIONS: Record<SellerRequestStatus, SellerRequestStatus[]> = {
  pending: ['under_review', 'rejected', 'closed'],
  under_review: ['needs_information', 'qualified', 'rejected', 'closed'],
  needs_information: ['under_review', 'rejected', 'closed'],
  qualified: ['converted_to_case', 'rejected', 'closed'],
  converted_to_case: ['closed'],
  rejected: ['under_review'],
  closed: [],
};

export const ALLOWED_BUYER_REQUEST_TRANSITIONS: Record<BuyerRequestStatus, BuyerRequestStatus[]> = {
  pending: ['under_review', 'rejected', 'closed'],
  under_review: ['needs_information', 'qualified', 'rejected', 'closed'],
  needs_information: ['under_review', 'rejected', 'closed'],
  qualified: ['matching', 'contacted', 'converted_to_deal', 'rejected', 'closed'],
  matching: ['contacted', 'converted_to_deal', 'rejected', 'closed'],
  contacted: ['matching', 'converted_to_deal', 'rejected', 'closed'],
  converted_to_deal: ['closed'],
  rejected: ['under_review'],
  closed: [],
};

export interface SellerRequest {
  id: string;
  reference_code: string;
  seller_id?: string | null;
  full_name: string;
  phone: string;
  email?: string | null;
  governorate: string;
  city_district: string;
  developer_name: string;
  project_name: string;
  unit_type: UnitType;
  area_sqm?: number | null;
  floor_number?: number | null;
  delivery_status?: DeliveryStatus;
  total_price: number;
  paid_amount: number;
  remaining_balance: number;
  installment_value?: number | null;
  installment_frequency?: InstallmentFrequency | null;
  has_overdue: boolean;
  overdue_amount?: number | null;
  requested_cash_amount?: number | null;
  notes?: string | null;
  status: SellerRequestStatus;
  admin_notes?: string | null;
  rejection_reason?: string | null;
  converted_case_id?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuyerRequest {
  id: string;
  reference_code: string;
  buyer_id?: string | null;
  full_name: string;
  phone: string;
  email?: string | null;
  budget_cash: number;
  max_installment: number;
  installment_frequency?: InstallmentFrequency | null;
  is_budget_flexible: boolean;
  preferred_governorates: string[];
  preferred_districts: string[];
  preferred_unit_types: UnitType[];
  preferred_developers: string[];
  delivery_preference: 'immediate' | 'within_1_year' | 'within_2_years' | 'any';
  bedrooms?: string | null;
  notes?: string | null;
  status: BuyerRequestStatus;
  admin_notes?: string | null;
  rejection_reason?: string | null;
  converted_deal_id?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingMatchCriteria {
  cashMatches: boolean;
  installmentMatches: boolean;
  locationMatches: boolean;
  typeMatches: boolean;
  developerMatches: boolean;
  deliveryMatches: boolean;
  score: number; // 0 - 100
  matchType: 'exact' | 'partial' | 'none';
  explanations: string[];
}

export interface BuyerMatchedListing {
  listing: PublicListing;
  match: ListingMatchCriteria;
}

