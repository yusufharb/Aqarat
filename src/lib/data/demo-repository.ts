import type { DataRepository, ListingsFilter } from './repository';
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
  SavedListing,
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
import {
  ALLOWED_SELLER_REQUEST_TRANSITIONS,
  ALLOWED_BUYER_REQUEST_TRANSITIONS,
} from '../types';
import {
  DEMO_PROFILES,
  DEMO_USER_ROLES,
  DEMO_PROPERTIES,
  DEMO_CONTRACTS,
  DEMO_CASES,
  DEMO_PUBLIC_LISTINGS,
  DEMO_DOCUMENTS,
  DEMO_FINANCIAL_REVIEWS,
  DEMO_LEGAL_REVIEWS,
  DEMO_PUBLICATION_GATES,
  DEMO_LEADS,
  DEMO_DEALS,
  DEMO_BUYER_PREFERENCES,
  DEMO_SAVED_LISTINGS,
  DEMO_ROLE_REQUESTS,
  DEMO_AUDIT_LOGS,
  DEMO_GOVERNORATES,
  DEMO_DEVELOPERS,
  DEMO_SELLER_REQUESTS,
  DEMO_BUYER_REQUESTS,
} from './demo-data';
import { matchBuyerRequestWithListings } from '../matching/smart-matcher';
import { generateReferenceCode, generateCaseNumber } from '../utils';

export class DemoRepository implements DataRepository {
  private profiles: Profile[];
  private userRoles: UserRoleAssignment[];
  private properties: Property[];
  private contracts: Contract[];
  private cases: AssignmentCase[];
  private listings: PublicListing[];
  private documents: CaseDocument[];
  private financialReviews: FinancialReview[];
  private legalReviews: LegalReview[];
  private publicationGates: PublicationGates[];
  private leads: Lead[];
  private deals: Deal[];
  private buyerPreferences: BuyerPreferences[];
  private savedListings: SavedListing[];
  private roleRequests: RoleRequest[];
  private auditLogs: AuditLogEntry[];
  private governorates: string[];
  private developers: string[];
  private sellerRequests: SellerRequest[];
  private buyerRequests: BuyerRequest[];

  constructor() {
    this.profiles = [...DEMO_PROFILES];
    this.userRoles = [...DEMO_USER_ROLES];
    this.properties = [...DEMO_PROPERTIES];
    this.contracts = [...DEMO_CONTRACTS];
    this.cases = [...DEMO_CASES];
    this.listings = [...DEMO_PUBLIC_LISTINGS];
    this.documents = [...DEMO_DOCUMENTS];
    this.financialReviews = [...DEMO_FINANCIAL_REVIEWS];
    this.legalReviews = [...DEMO_LEGAL_REVIEWS];
    this.publicationGates = [...DEMO_PUBLICATION_GATES];
    this.leads = [...DEMO_LEADS];
    this.deals = [...DEMO_DEALS];
    this.buyerPreferences = [...DEMO_BUYER_PREFERENCES];
    this.savedListings = [...DEMO_SAVED_LISTINGS];
    this.roleRequests = [...DEMO_ROLE_REQUESTS];
    this.auditLogs = [...DEMO_AUDIT_LOGS];
    this.governorates = [...DEMO_GOVERNORATES];
    this.developers = [...DEMO_DEVELOPERS];
    this.sellerRequests = [...DEMO_SELLER_REQUESTS];
    this.buyerRequests = [...DEMO_BUYER_REQUESTS];
  }

  async getPublicListings(filter?: ListingsFilter): Promise<PublicListing[]> {
    let result = [...this.listings];

    if (!filter) {
      return result;
    }

    if (filter.governorate) {
      const gov = filter.governorate.trim();
      result = result.filter(
        (item) => item.property.governorate.trim() === gov
      );
    }

    if (filter.city_district) {
      const district = filter.city_district.toLowerCase().trim();
      result = result.filter((item) =>
        item.property.city_district.toLowerCase().includes(district)
      );
    }

    if (filter.developer_name) {
      const dev = filter.developer_name.toLowerCase().trim();
      result = result.filter((item) =>
        item.property.developer_name.toLowerCase().includes(dev)
      );
    }

    if (filter.unit_type) {
      result = result.filter(
        (item) => item.property.unit_type === filter.unit_type
      );
    }

    if (typeof filter.min_price === 'number') {
      result = result.filter(
        (item) => item.total_contract_price.amount >= (filter.min_price as number)
      );
    }

    if (typeof filter.max_price === 'number') {
      result = result.filter(
        (item) => item.total_contract_price.amount <= (filter.max_price as number)
      );
    }

    if (filter.case_nature) {
      result = result.filter((item) => item.case_nature === filter.case_nature);
    }

    if (filter.search_query) {
      const q = filter.search_query.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          item.case_number.toLowerCase().includes(q) ||
          item.property.project_name.toLowerCase().includes(q) ||
          item.property.developer_name.toLowerCase().includes(q) ||
          item.property.city_district.toLowerCase().includes(q) ||
          item.property.governorate.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }

  async getPublicListingById(id: string): Promise<PublicListing | null> {
    const listing = this.listings.find(
      (item) => item.id === id || item.case_number === id
    );
    return listing || null;
  }

  async getAllCases(): Promise<AssignmentCase[]> {
    return [...this.cases];
  }

  async getCasesBySeller(sellerId: string): Promise<AssignmentCase[]> {
    return this.cases.filter((c) => c.seller_id === sellerId);
  }

  async getCaseById(caseId: string): Promise<AssignmentCase | null> {
    const item = this.cases.find((c) => c.id === caseId);
    return item || null;
  }

  async createCase(
    sellerId: string,
    data: Partial<AssignmentCase>
  ): Promise<AssignmentCase> {
    const now = new Date().toISOString();
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const newCase: AssignmentCase = {
      id: crypto.randomUUID(),
      case_number: `CAS-${year}-${randomSuffix}`,
      seller_id: sellerId,
      property_id: data.property_id || '',
      contract_id: data.contract_id || '',
      case_nature: data.case_nature || 'standard_assignment',
      status: data.status || 'draft',
      is_private_listing: data.is_private_listing ?? false,
      requested_cash_amount: data.requested_cash_amount || null,
      seller_notes: data.seller_notes || null,
      submitted_at: data.submitted_at || null,
      published_at: data.published_at || null,
      created_at: now,
      updated_at: now,
    };

    this.cases.push(newCase);
    return newCase;
  }

  async updateCase(
    caseId: string,
    data: Partial<AssignmentCase>
  ): Promise<AssignmentCase> {
    const index = this.cases.findIndex((c) => c.id === caseId);
    if (index === -1) {
      throw new Error(`Assignment case with ID "${caseId}" not found.`);
    }

    const currentCase = this.cases[index];
    const updatedCase: AssignmentCase = {
      ...currentCase,
      ...data,
      id: currentCase.id,
      seller_id: currentCase.seller_id,
      updated_at: new Date().toISOString(),
    };

    this.cases[index] = updatedCase;
    return updatedCase;
  }

  async getPropertyById(propertyId: string): Promise<Property | null> {
    const prop = this.properties.find((p) => p.id === propertyId);
    return prop || null;
  }

  async getContractByPropertyId(propertyId: string): Promise<Contract | null> {
    const contract = this.contracts.find((c) => c.property_id === propertyId);
    return contract || null;
  }

  async getDocumentsByCaseId(caseId: string): Promise<CaseDocument[]> {
    return this.documents.filter((doc) => doc.case_id === caseId);
  }

  async getFinancialReview(caseId: string): Promise<FinancialReview | null> {
    const review = this.financialReviews.find((r) => r.case_id === caseId);
    return review || null;
  }

  async getLegalReview(caseId: string): Promise<LegalReview | null> {
    const review = this.legalReviews.find((r) => r.case_id === caseId);
    return review || null;
  }

  async createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const newLead: Lead = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.leads.push(newLead);
    return newLead;
  }

  async getLeadsByCaseId(caseId: string): Promise<Lead[]> {
    return this.leads.filter((lead) => lead.case_id === caseId);
  }

  async getBuyerLeads(buyerId: string): Promise<Lead[]> {
    return this.leads.filter((lead) => lead.buyer_id === buyerId);
  }

  async getAllDeals(): Promise<Deal[]> {
    return [...this.deals];
  }

  async getBuyerDeals(buyerId: string): Promise<Deal[]> {
    return this.deals.filter((d) => d.buyer_id === buyerId);
  }

  async getBuyerSavedListings(buyerId: string): Promise<PublicListing[]> {
    const savedIds = this.savedListings
      .filter((s) => s.buyer_id === buyerId)
      .map((s) => s.listing_id);
    return this.listings.filter((l) => savedIds.includes(l.id));
  }

  async getBuyerPreferences(buyerId: string): Promise<BuyerPreferences | null> {
    const pref = this.buyerPreferences.find((p) => p.buyer_id === buyerId);
    return pref || null;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const profile = this.profiles.find((p) => p.id === userId);
    return profile || null;
  }

  async getUserRoles(userId: string): Promise<UserRoleAssignment[]> {
    return this.userRoles.filter((r) => r.user_id === userId);
  }

  async saveProperty(property: Partial<Property>): Promise<Property> {
    const id = property.id || crypto.randomUUID();
    const existingIndex = this.properties.findIndex((p) => p.id === id);
    const updated: Property = {
      id,
      governorate: property.governorate || 'القاهرة',
      city_district: property.city_district || 'القاهرة الجديدة',
      developer_name: property.developer_name || 'سوديك',
      project_name: property.project_name || 'مشروع التنازل',
      unit_type: property.unit_type || 'apartment',
      area_sqm: property.area_sqm ?? 120,
      floor_number: property.floor_number ?? 1,
      delivery_status: property.delivery_status || 'under_construction',
      expected_delivery_date: property.expected_delivery_date || null,
      ...property,
    };
    if (existingIndex >= 0) {
      this.properties[existingIndex] = updated;
    } else {
      this.properties.push(updated);
    }
    return updated;
  }

  async saveContract(contract: Partial<Contract>): Promise<Contract> {
    const id = contract.id || crypto.randomUUID();
    const existingIndex = this.contracts.findIndex(
      (c) => c.id === id || (contract.property_id && c.property_id === contract.property_id)
    );
    const updated: Contract = {
      id,
      property_id: contract.property_id || '',
      total_contract_price: contract.total_contract_price || 0,
      deposit_paid: contract.deposit_paid || 0,
      installments_paid: contract.installments_paid || 0,
      remaining_balance: contract.remaining_balance || 0,
      installment_value: contract.installment_value ?? null,
      installment_frequency: contract.installment_frequency ?? 'quarterly',
      maintenance_fee: contract.maintenance_fee ?? null,
      contract_date: contract.contract_date ?? new Date().toISOString(),
      ...contract,
    };
    if (existingIndex >= 0) {
      this.contracts[existingIndex] = updated;
    } else {
      this.contracts.push(updated);
    }
    return updated;
  }

  async saveCaseDocument(doc: Partial<CaseDocument>): Promise<CaseDocument> {
    const id = doc.id || crypto.randomUUID();
    const existingIndex = this.documents.findIndex((d) => d.id === id);
    const updated: CaseDocument = {
      id,
      case_id: doc.case_id || '',
      doc_type: doc.doc_type || 'other',
      file_name: doc.file_name || 'document.pdf',
      file_size_bytes: doc.file_size_bytes || 1024 * 1024,
      mime_type: doc.mime_type || 'application/pdf',
      verification_status: doc.verification_status || 'pending',
      verified_by: doc.verified_by ?? null,
      uploaded_at: doc.uploaded_at || new Date().toISOString(),
      ...doc,
    };
    if (existingIndex >= 0) {
      this.documents[existingIndex] = updated;
    } else {
      this.documents.push(updated);
    }
    return updated;
  }

  async updateDocumentStatus(
    docId: string,
    status: VerificationStatus,
    reviewerId: string,
    rejectionReason?: string
  ): Promise<CaseDocument> {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) {
      throw new Error(`Document with ID "${docId}" not found.`);
    }
    doc.verification_status = status;
    doc.verified_by = reviewerId;
    return { ...doc };
  }

  async saveFinancialReview(review: Partial<FinancialReview>): Promise<FinancialReview> {
    const id = review.id || crypto.randomUUID();
    const existingIndex = this.financialReviews.findIndex((r) => r.case_id === review.case_id);
    const updated: FinancialReview = {
      id,
      case_id: review.case_id || '',
      verified_paid_amount: review.verified_paid_amount || {
        amount: 0,
        confidence: 'seller_declared',
        source_description: null,
        verified_at: null,
        verified_by: null,
      },
      verified_remaining_amount: review.verified_remaining_amount || {
        amount: 0,
        confidence: 'seller_declared',
        source_description: null,
        verified_at: null,
        verified_by: null,
      },
      verified_overdue_amount: review.verified_overdue_amount || null,
      developer_transfer_fee: review.developer_transfer_fee || null,
      fee_bearer: review.fee_bearer || 'seller',
      reviewer_id: review.reviewer_id || '',
      reviewer_notes: review.reviewer_notes || null,
      reviewed_at: review.reviewed_at || new Date().toISOString(),
      ...review,
    };
    if (existingIndex >= 0) {
      this.financialReviews[existingIndex] = updated;
    } else {
      this.financialReviews.push(updated);
    }
    return updated;
  }

  async saveLegalReview(review: Partial<LegalReview>): Promise<LegalReview> {
    const id = review.id || crypto.randomUUID();
    const existingIndex = this.legalReviews.findIndex((r) => r.case_id === review.case_id);
    const updated: LegalReview = {
      id,
      case_id: review.case_id || '',
      legal_verdict: review.legal_verdict || 'in_progress',
      developer_assignment_status: review.developer_assignment_status || 'unknown',
      conditions_checklist: review.conditions_checklist || [],
      legal_notes: review.legal_notes || null,
      reviewer_id: review.reviewer_id || '',
      reviewed_at: review.reviewed_at || new Date().toISOString(),
      ...review,
    };
    if (existingIndex >= 0) {
      this.legalReviews[existingIndex] = updated;
    } else {
      this.legalReviews.push(updated);
    }
    return updated;
  }

  async getPublicationGates(caseId: string): Promise<PublicationGates | null> {
    const gate = this.publicationGates.find((g) => g.case_id === caseId);
    return gate || null;
  }

  async savePublicationGates(gates: Partial<PublicationGates>): Promise<PublicationGates> {
    const id = gates.id || crypto.randomUUID();
    const existingIndex = this.publicationGates.findIndex((g) => g.case_id === gates.case_id);
    const updated: PublicationGates = {
      id,
      case_id: gates.case_id || '',
      gate_1_complete_unit_data: gates.gate_1_complete_unit_data ?? false,
      gate_2_seller_identity_confirmed: gates.gate_2_seller_identity_confirmed ?? false,
      gate_3_mandatory_docs_verified: gates.gate_3_mandatory_docs_verified ?? false,
      gate_4_financial_review_approved: gates.gate_4_financial_review_approved ?? false,
      gate_5_legal_review_approved: gates.gate_5_legal_review_approved ?? false,
      gate_6_developer_transfer_clear: gates.gate_6_developer_transfer_clear ?? false,
      gate_7_publisher_authorized: gates.gate_7_publisher_authorized ?? false,
      gate_8_pii_sanitized_for_public: gates.gate_8_pii_sanitized_for_public ?? true,
      gate_9_disclaimers_and_timestamp_ready: gates.gate_9_disclaimers_and_timestamp_ready ?? false,
      published_by: gates.published_by ?? null,
      published_at: gates.published_at ?? null,
      ...gates,
    };
    if (existingIndex >= 0) {
      this.publicationGates[existingIndex] = updated;
    } else {
      this.publicationGates.push(updated);
    }
    return updated;
  }

  async createDeal(data: Partial<Deal>): Promise<Deal> {
    const newDeal: Deal = {
      id: data.id || crypto.randomUUID(),
      case_id: data.case_id || '',
      lead_id: data.lead_id || '',
      seller_id: data.seller_id || '',
      buyer_id: data.buyer_id || '',
      status: data.status || 'lead',
      agreed_cash_amount: data.agreed_cash_amount ?? null,
      notes: data.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.deals.push(newDeal);
    return newDeal;
  }

  async updateDealStatus(dealId: string, status: DealStatus, notes?: string): Promise<Deal> {
    const deal = this.deals.find((d) => d.id === dealId);
    if (!deal) {
      throw new Error(`Deal with ID "${dealId}" not found.`);
    }
    deal.status = status;
    if (notes !== undefined) {
      deal.notes = notes;
    }
    deal.updated_at = new Date().toISOString();
    return { ...deal };
  }

  async toggleSavedListing(buyerId: string, caseId: string): Promise<{ saved: boolean }> {
    const index = this.savedListings.findIndex(
      (s) => s.buyer_id === buyerId && s.listing_id === caseId
    );
    if (index >= 0) {
      this.savedListings.splice(index, 1);
      return { saved: false };
    } else {
      this.savedListings.push({
        id: crypto.randomUUID(),
        buyer_id: buyerId,
        listing_id: caseId,
        saved_at: new Date().toISOString(),
      });
      return { saved: true };
    }
  }

  async isListingSaved(buyerId: string, caseId: string): Promise<boolean> {
    return this.savedListings.some(
      (s) => s.buyer_id === buyerId && s.listing_id === caseId
    );
  }

  async saveBuyerPreferences(
    prefs: Partial<BuyerPreferences> & { buyer_id: string }
  ): Promise<BuyerPreferences> {
    const existingIndex = this.buyerPreferences.findIndex((p) => p.buyer_id === prefs.buyer_id);
    const updated: BuyerPreferences = {
      budget_cash: 0,
      max_installment_value: 0,
      preferred_governorates: [],
      preferred_districts: [],
      preferred_unit_types: [],
      ...prefs,
      id: prefs.id || crypto.randomUUID(),
      buyer_id: prefs.buyer_id,
      updated_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      this.buyerPreferences[existingIndex] = updated;
    } else {
      this.buyerPreferences.push(updated);
    }
    return updated;
  }

  async getAllUsers(): Promise<Profile[]> {
    return [...this.profiles];
  }

  async saveProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const index = this.profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      this.profiles[index] = {
        ...this.profiles[index],
        ...profile,
        updated_at: new Date().toISOString(),
      };
      return this.profiles[index];
    }
    const newProfile: Profile = {
      full_name: '',
      phone: '',
      email: null,
      is_suspended: false,
      phone_verified: false,
      email_verified: false,
      ...profile,
      id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  async updateUserStatus(userId: string, isSuspended: boolean): Promise<Profile> {
    const p = this.profiles.find((u) => u.id === userId);
    if (!p) {
      throw new Error(`User with ID "${userId}" not found.`);
    }
    p.is_suspended = isSuspended;
    p.updated_at = new Date().toISOString();
    return { ...p };
  }

  async assignUserRole(
    userId: string,
    role: UserRole,
    assignedBy: string
  ): Promise<UserRoleAssignment> {
    const existing = this.userRoles.find((r) => r.user_id === userId && r.role === role);
    if (existing) {
      return existing;
    }
    const assignment: UserRoleAssignment = {
      id: crypto.randomUUID(),
      user_id: userId,
      role,
      assigned_at: new Date().toISOString(),
      assigned_by: assignedBy,
    };
    this.userRoles.push(assignment);
    return assignment;
  }

  async revokeUserRole(userId: string, role: UserRole): Promise<boolean> {
    const index = this.userRoles.findIndex((r) => r.user_id === userId && r.role === role);
    if (index >= 0) {
      this.userRoles.splice(index, 1);
      return true;
    }
    return false;
  }

  async getRoleRequests(): Promise<RoleRequest[]> {
    return [...this.roleRequests];
  }

  async createRoleRequest(
    userId: string,
    requestedRole: UserRole,
    reason: string
  ): Promise<RoleRequest> {
    const newReq: RoleRequest = {
      id: crypto.randomUUID(),
      user_id: userId,
      requested_role: requestedRole,
      reason,
      status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    };
    this.roleRequests.push(newReq);
    return newReq;
  }

  async resolveRoleRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewerId: string
  ): Promise<RoleRequest> {
    const req = this.roleRequests.find((r) => r.id === requestId);
    if (!req) {
      throw new Error(`Role request with ID "${requestId}" not found.`);
    }
    req.status = status;
    req.reviewed_by = reviewerId;
    req.reviewed_at = new Date().toISOString();
    if (status === 'approved') {
      await this.assignUserRole(req.user_id, req.requested_role, reviewerId);
    }
    return { ...req };
  }

  async getAuditLogs(limit: number = 50): Promise<AuditLogEntry[]> {
    return [...this.auditLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    this.auditLogs.unshift({
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
  }

  async getGovernorates(): Promise<string[]> {
    return [...this.governorates];
  }

  async getDevelopers(): Promise<string[]> {
    return [...this.developers];
  }

  // ============================================================================
  // Seller Requests (/sell)
  // ============================================================================

  async getSellerRequests(filter?: { status?: SellerRequestStatus; search?: string }): Promise<SellerRequest[]> {
    let result = [...this.sellerRequests];
    if (filter?.status) {
      result = result.filter((r) => r.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.reference_code.toLowerCase().includes(q) ||
          r.full_name.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.project_name.toLowerCase().includes(q) ||
          r.developer_name.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getSellerRequestById(id: string): Promise<SellerRequest | null> {
    const item = this.sellerRequests.find((r) => r.id === id);
    return item ? { ...item } : null;
  }

  async getSellerRequestByReference(referenceCode: string): Promise<SellerRequest | null> {
    const item = this.sellerRequests.find(
      (r) => r.reference_code.toUpperCase() === referenceCode.toUpperCase().trim()
    );
    return item ? { ...item } : null;
  }

  async getSellerRequestsByUserId(userId: string): Promise<SellerRequest[]> {
    return this.sellerRequests
      .filter((r) => r.seller_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createSellerRequest(
    data: Omit<SellerRequest, 'id' | 'reference_code' | 'created_at' | 'updated_at' | 'status'> & {
      status?: SellerRequestStatus;
    }
  ): Promise<SellerRequest> {
    const now = new Date().toISOString();
    const newReq: SellerRequest = {
      ...data,
      id: crypto.randomUUID(),
      reference_code: generateReferenceCode('REQ-S'),
      status: data.status || 'pending',
      created_at: now,
      updated_at: now,
    };
    this.sellerRequests.unshift(newReq);
    await this.logAuditEvent({
      entity_name: 'seller_requests',
      entity_id: newReq.id,
      action: 'SELLER_REQUEST_CREATED',
      actor_id: newReq.seller_id || null,
      old_values: null,
      new_values: { reference_code: newReq.reference_code, total_price: newReq.total_price },
      ip_address: null,
    });
    return { ...newReq };
  }

  async updateSellerRequestStatus(
    id: string,
    status: SellerRequestStatus,
    adminNotes?: string,
    rejectionReason?: string,
    reviewerId?: string
  ): Promise<SellerRequest> {
    const req = this.sellerRequests.find((r) => r.id === id);
    if (!req) {
      throw new Error(`طلب البائع بالمعرّف ${id} غير موجود.`);
    }

    const allowed = ALLOWED_SELLER_REQUEST_TRANSITIONS[req.status];
    if (status !== req.status && (!allowed || !allowed.includes(status))) {
      throw new Error(`انتقال غير مسموح به لحالة طلب البائع من "${req.status}" إلى "${status}".`);
    }

    if (status === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
      throw new Error('سبب الرفض إلزامي عند رفض الطلب.');
    }

    const oldStatus = req.status;
    req.status = status;
    if (adminNotes !== undefined) req.admin_notes = adminNotes;
    if (rejectionReason !== undefined) req.rejection_reason = rejectionReason;
    if (reviewerId) req.reviewed_by = reviewerId;
    req.reviewed_at = new Date().toISOString();
    req.updated_at = new Date().toISOString();

    await this.logAuditEvent({
      entity_name: 'seller_requests',
      entity_id: req.id,
      action: `SELLER_REQUEST_STATUS_${status.toUpperCase()}`,
      actor_id: reviewerId || null,
      old_values: { status: oldStatus },
      new_values: { status, rejection_reason: rejectionReason, admin_notes: adminNotes },
      ip_address: null,
    });

    return { ...req };
  }

  async convertSellerRequestToCase(
    requestId: string,
    reviewerId?: string
  ): Promise<{ request: SellerRequest; caseId: string }> {
    const req = this.sellerRequests.find((r) => r.id === requestId);
    if (!req) {
      throw new Error(`طلب البائع بالمعرّف ${requestId} غير موجود.`);
    }

    if (req.converted_case_id) {
      throw new Error(
        `الطلب تم تحويله بالفعل إلى ملف دراسة سابق (${req.converted_case_id}) ولا يمكن إنشاء ملف مكرر.`
      );
    }

    const now = new Date().toISOString();

    // 1. Create Property
    const propId = crypto.randomUUID();
    const newProperty: Property = {
      id: propId,
      governorate: req.governorate,
      city_district: req.city_district,
      developer_name: req.developer_name,
      project_name: req.project_name,
      unit_type: req.unit_type,
      area_sqm: req.area_sqm || null,
      floor_number: req.floor_number || null,
      delivery_status: req.delivery_status || 'under_construction',
      expected_delivery_date: null,
    };
    this.properties.unshift(newProperty);

    // 2. Create Contract
    const contractId = crypto.randomUUID();
    const deposit = Math.round(req.paid_amount * 0.2);
    const newContract: Contract = {
      id: contractId,
      property_id: propId,
      total_contract_price: req.total_price,
      deposit_paid: deposit,
      installments_paid: Math.max(0, req.paid_amount - deposit),
      remaining_balance: req.remaining_balance,
      installment_value: req.installment_value || null,
      installment_frequency: req.installment_frequency || 'quarterly',
      maintenance_fee: null,
      contract_date: null,
    };
    this.contracts.unshift(newContract);

    // 3. Create AssignmentCase
    const caseId = crypto.randomUUID();
    const newCase: AssignmentCase = {
      id: caseId,
      case_number: generateCaseNumber(),
      seller_id: req.seller_id || '11111111-1111-4111-8111-111111111111',
      property_id: propId,
      contract_id: contractId,
      case_nature: 'standard_assignment',
      status: 'screening',
      is_private_listing: false,
      requested_cash_amount: {
        amount: req.requested_cash_amount || req.paid_amount,
        confidence: 'seller_declared',
        source_description: `تم إنشاؤه عبر تحويل طلب البائع (${req.reference_code})`,
        verified_at: null,
        verified_by: null,
      },
      seller_notes: req.notes || null,
      submitted_at: now,
      published_at: null,
      created_at: now,
      updated_at: now,
    };
    this.cases.unshift(newCase);

    // Link back to request
    req.converted_case_id = caseId;
    req.status = 'converted_to_case';
    req.reviewed_by = reviewerId || req.reviewed_by || null;
    req.reviewed_at = now;
    req.updated_at = now;

    await this.logAuditEvent({
      entity_name: 'seller_requests',
      entity_id: req.id,
      action: 'SELLER_REQUEST_CONVERTED_TO_CASE',
      actor_id: reviewerId || null,
      old_values: { status: 'qualified' },
      new_values: { status: 'converted_to_case', converted_case_id: caseId, case_number: newCase.case_number },
      ip_address: null,
    });

    return { request: { ...req }, caseId };
  }

  // ============================================================================
  // Buyer Requests (/buy)
  // ============================================================================

  async getBuyerRequests(filter?: { status?: BuyerRequestStatus; search?: string }): Promise<BuyerRequest[]> {
    let result = [...this.buyerRequests];
    if (filter?.status) {
      result = result.filter((r) => r.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.reference_code.toLowerCase().includes(q) ||
          r.full_name.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.preferred_governorates.some((g) => g.toLowerCase().includes(q)) ||
          r.preferred_districts.some((d) => d.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getBuyerRequestById(id: string): Promise<BuyerRequest | null> {
    const item = this.buyerRequests.find((r) => r.id === id);
    return item ? { ...item } : null;
  }

  async getBuyerRequestByReference(referenceCode: string): Promise<BuyerRequest | null> {
    const item = this.buyerRequests.find(
      (r) => r.reference_code.toUpperCase() === referenceCode.toUpperCase().trim()
    );
    return item ? { ...item } : null;
  }

  async getBuyerRequestsByUserId(userId: string): Promise<BuyerRequest[]> {
    return this.buyerRequests
      .filter((r) => r.buyer_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createBuyerRequest(
    data: Omit<BuyerRequest, 'id' | 'reference_code' | 'created_at' | 'updated_at' | 'status'> & {
      status?: BuyerRequestStatus;
    }
  ): Promise<BuyerRequest> {
    const now = new Date().toISOString();
    const newReq: BuyerRequest = {
      ...data,
      id: crypto.randomUUID(),
      reference_code: generateReferenceCode('REQ-B'),
      status: data.status || 'pending',
      created_at: now,
      updated_at: now,
    };
    this.buyerRequests.unshift(newReq);
    await this.logAuditEvent({
      entity_name: 'buyer_requests',
      entity_id: newReq.id,
      action: 'BUYER_REQUEST_CREATED',
      actor_id: newReq.buyer_id || null,
      old_values: null,
      new_values: { reference_code: newReq.reference_code, budget_cash: newReq.budget_cash },
      ip_address: null,
    });
    return { ...newReq };
  }

  async updateBuyerRequestStatus(
    id: string,
    status: BuyerRequestStatus,
    adminNotes?: string,
    rejectionReason?: string,
    reviewerId?: string
  ): Promise<BuyerRequest> {
    const req = this.buyerRequests.find((r) => r.id === id);
    if (!req) {
      throw new Error(`طلب المشتري بالمعرّف ${id} غير موجود.`);
    }

    const allowed = ALLOWED_BUYER_REQUEST_TRANSITIONS[req.status];
    if (status !== req.status && (!allowed || !allowed.includes(status))) {
      throw new Error(`انتقال غير مسموح به لحالة طلب المشتري من "${req.status}" إلى "${status}".`);
    }

    if (status === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
      throw new Error('سبب الرفض إلزامي عند رفض الطلب.');
    }

    const oldStatus = req.status;
    req.status = status;
    if (adminNotes !== undefined) req.admin_notes = adminNotes;
    if (rejectionReason !== undefined) req.rejection_reason = rejectionReason;
    if (reviewerId) req.reviewed_by = reviewerId;
    req.reviewed_at = new Date().toISOString();
    req.updated_at = new Date().toISOString();

    await this.logAuditEvent({
      entity_name: 'buyer_requests',
      entity_id: req.id,
      action: `BUYER_REQUEST_STATUS_${status.toUpperCase()}`,
      actor_id: reviewerId || null,
      old_values: { status: oldStatus },
      new_values: { status, rejection_reason: rejectionReason, admin_notes: adminNotes },
      ip_address: null,
    });

    return { ...req };
  }

  async convertBuyerRequestToDeal(
    requestId: string,
    targetCaseId: string,
    reviewerId?: string
  ): Promise<{ request: BuyerRequest; dealId: string }> {
    const req = this.buyerRequests.find((r) => r.id === requestId);
    if (!req) {
      throw new Error(`طلب المشتري بالمعرّف ${requestId} غير موجود.`);
    }

    if (req.converted_deal_id) {
      throw new Error(`الطلب تم تحويله بالفعل إلى صفقة سابقة (${req.converted_deal_id}).`);
    }

    const targetCase = this.cases.find((c) => c.id === targetCaseId);
    if (!targetCase) {
      throw new Error(`ملف الوحدة بالمعرّف ${targetCaseId} غير موجود.`);
    }

    const buyerId = req.buyer_id || '22222222-2222-4222-8222-222222222221';

    // Create Lead
    const lead = await this.createLead({
      case_id: targetCaseId,
      buyer_id: buyerId,
      buyer_message: req.notes || `طلب شراء متطابق (${req.reference_code})`,
      budget_cash: req.budget_cash,
      comfortable_installment: req.max_installment,
    });

    // Create Deal
    const deal = await this.createDeal({
      case_id: targetCaseId,
      lead_id: lead.id,
      seller_id: targetCase.seller_id,
      buyer_id: buyerId,
      status: 'buyer_qualified',
      agreed_cash_amount: req.budget_cash,
      notes: `تم إنشاء الصفقة بناءً على طلب الشراء (${req.reference_code}) ومطابقته للوحدة (${targetCase.case_number})`,
    });

    const now = new Date().toISOString();
    req.converted_deal_id = deal.id;
    req.status = 'converted_to_deal';
    req.reviewed_by = reviewerId || req.reviewed_by || null;
    req.reviewed_at = now;
    req.updated_at = now;

    await this.logAuditEvent({
      entity_name: 'buyer_requests',
      entity_id: req.id,
      action: 'BUYER_REQUEST_CONVERTED_TO_DEAL',
      actor_id: reviewerId || null,
      old_values: { status: 'matching' },
      new_values: { status: 'converted_to_deal', converted_deal_id: deal.id, target_case_id: targetCaseId },
      ip_address: null,
    });

    return { request: { ...req }, dealId: deal.id };
  }

  async matchListingsForBuyerRequest(requestId: string): Promise<BuyerMatchedListing[]> {
    const req = await this.getBuyerRequestById(requestId);
    if (!req) return [];
    const listings = await this.getPublicListings();
    return matchBuyerRequestWithListings(req, listings);
  }
}
