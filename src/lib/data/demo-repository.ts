import type { DataRepository, ListingsFilter } from './repository';
import type {
  AssignmentCase,
  PublicListing,
  Property,
  Contract,
  CaseDocument,
  FinancialReview,
  LegalReview,
  Lead,
  Profile,
  UserRoleAssignment,
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
  DEMO_LEADS,
  DEMO_GOVERNORATES,
  DEMO_DEVELOPERS,
} from './demo-data';

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
  private leads: Lead[];
  private governorates: string[];
  private developers: string[];

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
    this.leads = [...DEMO_LEADS];
    this.governorates = [...DEMO_GOVERNORATES];
    this.developers = [...DEMO_DEVELOPERS];
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

  async getProfile(userId: string): Promise<Profile | null> {
    const profile = this.profiles.find((p) => p.id === userId);
    return profile || null;
  }

  async getUserRoles(userId: string): Promise<UserRoleAssignment[]> {
    return this.userRoles.filter((r) => r.user_id === userId);
  }

  async getGovernorates(): Promise<string[]> {
    return [...this.governorates];
  }

  async getDevelopers(): Promise<string[]> {
    return [...this.developers];
  }
}
