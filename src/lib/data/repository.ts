import type {
  AssignmentCase,
  PublicListing,
  Property,
  Contract,
  CaseDocument,
  FinancialReview,
  LegalReview,
  Lead,
  Deal,
  BuyerPreferences,
  Profile,
  UserRoleAssignment,
} from '../types';

export interface ListingsFilter {
  governorate?: string;
  city_district?: string;
  developer_name?: string;
  unit_type?: string;
  min_price?: number;
  max_price?: number;
  case_nature?: string;
  search_query?: string;
}

export interface DataRepository {
  // Public listings (safe view - no PII)
  getPublicListings(filter?: ListingsFilter): Promise<PublicListing[]>;
  getPublicListingById(id: string): Promise<PublicListing | null>;

  // Cases (authenticated, role-checked)
  getAllCases(): Promise<AssignmentCase[]>;
  getCasesBySeller(sellerId: string): Promise<AssignmentCase[]>;
  getCaseById(caseId: string): Promise<AssignmentCase | null>;
  createCase(sellerId: string, data: Partial<AssignmentCase>): Promise<AssignmentCase>;
  updateCase(caseId: string, data: Partial<AssignmentCase>): Promise<AssignmentCase>;

  // Properties
  getPropertyById(propertyId: string): Promise<Property | null>;

  // Contracts
  getContractByPropertyId(propertyId: string): Promise<Contract | null>;

  // Documents (only accessible by case owner or reviewers)
  getDocumentsByCaseId(caseId: string): Promise<CaseDocument[]>;

  // Reviews
  getFinancialReview(caseId: string): Promise<FinancialReview | null>;
  getLegalReview(caseId: string): Promise<LegalReview | null>;

  // Leads & Inquiries
  createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<Lead>;
  getLeadsByCaseId(caseId: string): Promise<Lead[]>;
  getBuyerLeads(buyerId: string): Promise<Lead[]>;

  // Deals
  getAllDeals(): Promise<Deal[]>;
  getBuyerDeals(buyerId: string): Promise<Deal[]>;

  // Buyer Specific
  getBuyerSavedListings(buyerId: string): Promise<PublicListing[]>;
  getBuyerPreferences(buyerId: string): Promise<BuyerPreferences | null>;

  // Profiles
  getProfile(userId: string): Promise<Profile | null>;
  getUserRoles(userId: string): Promise<UserRoleAssignment[]>;

  // Reference data
  getGovernorates(): Promise<string[]>;
  getDevelopers(): Promise<string[]>;
}
