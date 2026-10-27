import type {
  AssignmentCase,
  PublicListing,
  Property,
  Contract,
  CaseDocument,
  FinancialReview,
  LegalReview,
  PublicationGates,
  Lead,
  Deal,
  DealStatus,
  BuyerPreferences,
  Profile,
  UserRole,
  UserRoleAssignment,
  RoleRequest,
  AuditLogEntry,
  VerificationStatus,
  SellerRequest,
  SellerRequestStatus,
  BuyerRequest,
  BuyerRequestStatus,
  BuyerMatchedListing,
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
  saveProperty(property: Partial<Property>): Promise<Property>;

  // Contracts
  getContractByPropertyId(propertyId: string): Promise<Contract | null>;
  saveContract(contract: Partial<Contract>): Promise<Contract>;

  // Documents
  getDocumentsByCaseId(caseId: string): Promise<CaseDocument[]>;
  saveCaseDocument(doc: Partial<CaseDocument>): Promise<CaseDocument>;
  updateDocumentStatus(
    docId: string,
    status: VerificationStatus,
    reviewerId: string,
    rejectionReason?: string
  ): Promise<CaseDocument>;

  // Reviews & Gates
  getFinancialReview(caseId: string): Promise<FinancialReview | null>;
  saveFinancialReview(review: Partial<FinancialReview>): Promise<FinancialReview>;
  getLegalReview(caseId: string): Promise<LegalReview | null>;
  saveLegalReview(review: Partial<LegalReview>): Promise<LegalReview>;
  getPublicationGates(caseId: string): Promise<PublicationGates | null>;
  savePublicationGates(gates: Partial<PublicationGates>): Promise<PublicationGates>;

  // Leads & Inquiries
  createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<Lead>;
  getLeadsByCaseId(caseId: string): Promise<Lead[]>;
  getBuyerLeads(buyerId: string): Promise<Lead[]>;

  // Deals
  getAllDeals(): Promise<Deal[]>;
  getBuyerDeals(buyerId: string): Promise<Deal[]>;
  createDeal(data: Partial<Deal>): Promise<Deal>;
  updateDealStatus(dealId: string, status: DealStatus, notes?: string): Promise<Deal>;

  // Buyer Specific
  getBuyerSavedListings(buyerId: string): Promise<PublicListing[]>;
  toggleSavedListing(buyerId: string, caseId: string): Promise<{ saved: boolean }>;
  isListingSaved(buyerId: string, caseId: string): Promise<boolean>;
  getBuyerPreferences(buyerId: string): Promise<BuyerPreferences | null>;
  saveBuyerPreferences(
    prefs: Partial<BuyerPreferences> & { buyer_id: string }
  ): Promise<BuyerPreferences>;

  // Profiles & User Management
  getProfile(userId: string): Promise<Profile | null>;
  saveProfile(profile: Partial<Profile> & { id: string }): Promise<Profile>;
  getAllUsers(): Promise<Profile[]>;
  updateUserStatus(userId: string, isSuspended: boolean): Promise<Profile>;
  getUserRoles(userId: string): Promise<UserRoleAssignment[]>;
  assignUserRole(userId: string, role: UserRole, assignedBy: string): Promise<UserRoleAssignment>;
  revokeUserRole(userId: string, role: UserRole): Promise<boolean>;

  // Role Requests
  getRoleRequests(): Promise<RoleRequest[]>;
  createRoleRequest(userId: string, requestedRole: UserRole, reason: string): Promise<RoleRequest>;
  resolveRoleRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewerId: string
  ): Promise<RoleRequest>;

  // Audit Logs
  getAuditLogs(limit?: number): Promise<AuditLogEntry[]>;
  logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void>;

  // Reference data
  getGovernorates(): Promise<string[]>;
  getDevelopers(): Promise<string[]>;

  // Seller Requests (/sell)
  getSellerRequests(filter?: { status?: SellerRequestStatus; search?: string }): Promise<SellerRequest[]>;
  getSellerRequestById(id: string): Promise<SellerRequest | null>;
  getSellerRequestByReference(referenceCode: string): Promise<SellerRequest | null>;
  getSellerRequestsByUserId(userId: string): Promise<SellerRequest[]>;
  createSellerRequest(
    data: Omit<SellerRequest, 'id' | 'reference_code' | 'created_at' | 'updated_at' | 'status'> & {
      status?: SellerRequestStatus;
    }
  ): Promise<SellerRequest>;
  updateSellerRequestStatus(
    id: string,
    status: SellerRequestStatus,
    adminNotes?: string,
    rejectionReason?: string,
    reviewerId?: string
  ): Promise<SellerRequest>;
  convertSellerRequestToCase(
    requestId: string,
    reviewerId?: string
  ): Promise<{ request: SellerRequest; caseId: string }>;

  // Buyer Requests (/buy)
  getBuyerRequests(filter?: { status?: BuyerRequestStatus; search?: string }): Promise<BuyerRequest[]>;
  getBuyerRequestById(id: string): Promise<BuyerRequest | null>;
  getBuyerRequestByReference(referenceCode: string): Promise<BuyerRequest | null>;
  getBuyerRequestsByUserId(userId: string): Promise<BuyerRequest[]>;
  createBuyerRequest(
    data: Omit<BuyerRequest, 'id' | 'reference_code' | 'created_at' | 'updated_at' | 'status'> & {
      status?: BuyerRequestStatus;
    }
  ): Promise<BuyerRequest>;
  updateBuyerRequestStatus(
    id: string,
    status: BuyerRequestStatus,
    adminNotes?: string,
    rejectionReason?: string,
    reviewerId?: string
  ): Promise<BuyerRequest>;
  convertBuyerRequestToDeal(
    requestId: string,
    targetCaseId: string,
    reviewerId?: string
  ): Promise<{ request: BuyerRequest; dealId: string }>;
  matchListingsForBuyerRequest(requestId: string): Promise<BuyerMatchedListing[]>;
}
