import { DataRepository, ListingsFilter } from './repository';
import {
  PublicListing,
  AssignmentCase,
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
} from '../types';
import { createServerSupabaseClient } from '../supabase/server';

export class SupabaseRepository implements DataRepository {
  async getPublicListings(filter?: ListingsFilter): Promise<PublicListing[]> {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('public_verified_listings_view').select('*');

    if (filter?.governorate) {
      query = query.ilike('governorate', `%${filter.governorate}%`);
    }
    if (filter?.city_district) {
      query = query.ilike('city_district', `%${filter.city_district}%`);
    }
    if (filter?.developer_name) {
      query = query.ilike('developer_name', `%${filter.developer_name}%`);
    }
    if (filter?.unit_type) {
      query = query.eq('unit_type', filter.unit_type);
    }
    if (filter?.min_price) {
      query = query.gte('total_paid_amount', filter.min_price);
    }
    if (filter?.max_price) {
      query = query.lte('total_paid_amount', filter.max_price);
    }
    if (filter?.case_nature) {
      query = query.eq('case_nature', filter.case_nature);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch public listings: ${error.message}`);
    }

    return (data || []).map((row: Record<string, unknown>) => ({
      id: String(row.case_id),
      case_number: String(row.case_number),
      property: {
        id: String(row.case_id),
        governorate: String(row.governorate),
        city_district: String(row.city_district),
        developer_name: String(row.developer_name),
        project_name: String(row.project_name),
        unit_type: row.unit_type as any,
        area_sqm: Number(row.area_sqm) || null,
        floor_number: Number(row.floor_number) || null,
        delivery_status: row.delivery_status as any,
        expected_delivery_date: (row.expected_delivery_date as string) || null,
      },
      total_contract_price: {
        amount: Number(row.total_contract_price),
        confidence: 'confirmed_by_documents',
        source_description: 'العقد الأصلي المعتمد',
        verified_at: (row.last_verified_at as string) || null,
        verified_by: null,
      },
      total_paid: {
        amount: Number(row.total_paid_amount),
        confidence: 'confirmed_by_documents',
        source_description: 'إيصالات السداد وكشف الحساب',
        verified_at: (row.last_verified_at as string) || null,
        verified_by: null,
      },
      remaining_balance: {
        amount: Number(row.remaining_balance_amount),
        confidence: 'confirmed_by_documents',
        source_description: 'جدول الأقساط المعتمد',
        verified_at: (row.last_verified_at as string) || null,
        verified_by: null,
      },
      installment_value: Number(row.installment_value) || null,
      installment_frequency: (row.installment_frequency as any) || null,
      case_nature: row.case_nature as any,
      published_at: String(row.published_at),
      last_verified_at: (row.last_verified_at as string) || null,
      developer_transfer_fee: row.developer_transfer_fee
        ? {
            amount: Number(row.developer_transfer_fee),
            confidence: 'confirmed_by_documents',
            source_description: 'لائحة المطور المعتمدة للتنازل',
            verified_at: (row.last_verified_at as string) || null,
            verified_by: null,
          }
        : null,
    }));
  }

  async getPublicListingById(id: string): Promise<PublicListing | null> {
    const listings = await this.getPublicListings();
    return listings.find((l) => l.id === id) || null;
  }

  async getAllCases(): Promise<AssignmentCase[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('assignment_cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch all cases: ${error.message}`);
    }
    return (data || []) as AssignmentCase[];
  }

  async getCasesBySeller(sellerId: string): Promise<AssignmentCase[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('assignment_cases')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch seller cases: ${error.message}`);
    }
    return (data || []) as AssignmentCase[];
  }

  async getCaseById(caseId: string): Promise<AssignmentCase | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('assignment_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (error) return null;
    return data as AssignmentCase;
  }

  async createCase(sellerId: string, data: Partial<AssignmentCase>): Promise<AssignmentCase> {
    const supabase = await createServerSupabaseClient();
    const { data: created, error } = await supabase
      .from('assignment_cases')
      .insert({ ...data, seller_id: sellerId })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create case: ${error.message}`);
    }
    return created as AssignmentCase;
  }

  async updateCase(caseId: string, data: Partial<AssignmentCase>): Promise<AssignmentCase> {
    const supabase = await createServerSupabaseClient();
    const { data: updated, error } = await supabase
      .from('assignment_cases')
      .update(data)
      .eq('id', caseId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update case: ${error.message}`);
    }
    return updated as AssignmentCase;
  }

  async getPropertyById(propertyId: string): Promise<Property | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) return null;
    return data as Property;
  }

  async getContractByPropertyId(propertyId: string): Promise<Contract | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (error) return null;
    return data as Contract;
  }

  async getDocumentsByCaseId(caseId: string): Promise<CaseDocument[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('case_documents')
      .select('id, case_id, doc_type, file_name, file_size_bytes, mime_type, verification_status, verified_by, uploaded_at')
      .eq('case_id', caseId);

    if (error) return [];
    return (data || []) as CaseDocument[];
  }

  async getFinancialReview(caseId: string): Promise<FinancialReview | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('financial_reviews')
      .select('*')
      .eq('case_id', caseId)
      .single();

    if (error) return null;
    return data as FinancialReview;
  }

  async getLegalReview(caseId: string): Promise<LegalReview | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('legal_reviews')
      .select('*')
      .eq('case_id', caseId)
      .single();

    if (error) return null;
    return data as LegalReview;
  }

  async createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const supabase = await createServerSupabaseClient();
    const { data: created, error } = await supabase
      .from('leads')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lead: ${error.message}`);
    }
    return created as Lead;
  }

  async getLeadsByCaseId(caseId: string): Promise<Lead[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('case_id', caseId);

    if (error) return [];
    return (data || []) as Lead[];
  }

  async getBuyerLeads(buyerId: string): Promise<Lead[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []) as Lead[];
  }

  async getAllDeals(): Promise<Deal[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []) as Deal[];
  }

  async getBuyerDeals(buyerId: string): Promise<Deal[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []) as Deal[];
  }

  async getBuyerSavedListings(buyerId: string): Promise<PublicListing[]> {
    const supabase = await createServerSupabaseClient();
    const { data: savedData, error } = await supabase
      .from('saved_listings')
      .select('listing_id')
      .eq('buyer_id', buyerId);

    if (error || !savedData || savedData.length === 0) return [];
    const listingIds = savedData.map((s: { listing_id: string }) => s.listing_id);
    const allListings = await this.getPublicListings();
    return allListings.filter((l) => listingIds.includes(l.id));
  }

  async getBuyerPreferences(buyerId: string): Promise<BuyerPreferences | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('buyer_preferences')
      .select('*')
      .eq('buyer_id', buyerId)
      .single();

    if (error) return null;
    return data as BuyerPreferences;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data as Profile;
  }

  async getUserRoles(userId: string): Promise<UserRoleAssignment[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (error) return [];
    return (data || []) as UserRoleAssignment[];
  }

  async getGovernorates(): Promise<string[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('reference_governorates').select('name_ar');
    return (data || []).map((r: { name_ar: string }) => r.name_ar);
  }

  async getDevelopers(): Promise<string[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('reference_developers').select('name_ar');
    return (data || []).map((r: { name_ar: string }) => r.name_ar);
  }

  async saveProperty(property: Partial<Property>): Promise<Property> {
    const supabase = await createServerSupabaseClient();
    if (property.id) {
      const { data, error } = await supabase
        .from('properties')
        .upsert(property)
        .select()
        .single();
      if (error) throw new Error(`Failed to save property: ${error.message}`);
      return data as Property;
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();
      if (error) throw new Error(`Failed to create property: ${error.message}`);
      return data as Property;
    }
  }

  async saveContract(contract: Partial<Contract>): Promise<Contract> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('contracts')
      .upsert(contract)
      .select()
      .single();
    if (error) throw new Error(`Failed to save contract: ${error.message}`);
    return data as Contract;
  }

  async saveCaseDocument(doc: Partial<CaseDocument>): Promise<CaseDocument> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('case_documents')
      .upsert(doc)
      .select()
      .single();
    if (error) throw new Error(`Failed to save document: ${error.message}`);
    return data as CaseDocument;
  }

  async updateDocumentStatus(
    docId: string,
    status: VerificationStatus,
    reviewerId: string,
    rejectionReason?: string
  ): Promise<CaseDocument> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('case_documents')
      .update({
        verification_status: status,
        verified_by: reviewerId,
        rejection_reason: rejectionReason || null,
      })
      .eq('id', docId)
      .select()
      .single();
    if (error) throw new Error(`Failed to update document status: ${error.message}`);
    return data as CaseDocument;
  }

  async saveFinancialReview(review: Partial<FinancialReview>): Promise<FinancialReview> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('financial_reviews')
      .upsert(review)
      .select()
      .single();
    if (error) throw new Error(`Failed to save financial review: ${error.message}`);
    return data as FinancialReview;
  }

  async saveLegalReview(review: Partial<LegalReview>): Promise<LegalReview> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('legal_reviews')
      .upsert(review)
      .select()
      .single();
    if (error) throw new Error(`Failed to save legal review: ${error.message}`);
    return data as LegalReview;
  }

  async getPublicationGates(caseId: string): Promise<PublicationGates | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('publication_gates')
      .select('*')
      .eq('case_id', caseId)
      .single();
    if (error) return null;
    return data as PublicationGates;
  }

  async savePublicationGates(gates: Partial<PublicationGates>): Promise<PublicationGates> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('publication_gates')
      .upsert(gates)
      .select()
      .single();
    if (error) throw new Error(`Failed to save publication gates: ${error.message}`);
    return data as PublicationGates;
  }

  async createDeal(data: Partial<Deal>): Promise<Deal> {
    const supabase = await createServerSupabaseClient();
    const { data: result, error } = await supabase
      .from('deals')
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(`Failed to create deal: ${error.message}`);
    return result as Deal;
  }

  async updateDealStatus(dealId: string, status: DealStatus, notes?: string): Promise<Deal> {
    const supabase = await createServerSupabaseClient();
    const updatePayload: Record<string, unknown> = { status };
    if (notes !== undefined) updatePayload.closing_notes = notes;
    const { data, error } = await supabase
      .from('deals')
      .update(updatePayload)
      .eq('id', dealId)
      .select()
      .single();
    if (error) throw new Error(`Failed to update deal status: ${error.message}`);
    return data as Deal;
  }

  async toggleSavedListing(buyerId: string, caseId: string): Promise<{ saved: boolean }> {
    const supabase = await createServerSupabaseClient();
    const { data: existing } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('buyer_id', buyerId)
      .eq('case_id', caseId)
      .single();

    if (existing) {
      await supabase.from('saved_listings').delete().eq('id', existing.id);
      return { saved: false };
    } else {
      await supabase.from('saved_listings').insert({ buyer_id: buyerId, case_id: caseId });
      return { saved: true };
    }
  }

  async isListingSaved(buyerId: string, caseId: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('buyer_id', buyerId)
      .eq('case_id', caseId)
      .single();
    return Boolean(data);
  }

  async saveBuyerPreferences(
    prefs: Partial<BuyerPreferences> & { buyer_id: string }
  ): Promise<BuyerPreferences> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('buyer_preferences')
      .upsert(prefs, { onConflict: 'buyer_id' })
      .select()
      .single();
    if (error) throw new Error(`Failed to save preferences: ${error.message}`);
    return data as BuyerPreferences;
  }

  async getAllUsers(): Promise<Profile[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Failed to list users: ${error.message}`);
    return (data || []) as Profile[];
  }

  async saveProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();
    if (error) throw new Error(`Failed to save profile: ${error.message}`);
    return data as Profile;
  }

  async updateUserStatus(userId: string, isSuspended: boolean): Promise<Profile> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_suspended: isSuspended })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(`Failed to update user status: ${error.message}`);
    return data as Profile;
  }

  async assignUserRole(
    userId: string,
    role: UserRole,
    assignedBy: string
  ): Promise<UserRoleAssignment> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role, assigned_by: assignedBy }, { onConflict: 'user_id,role' })
      .select()
      .single();
    if (error) throw new Error(`Failed to assign role: ${error.message}`);
    return data as UserRoleAssignment;
  }

  async revokeUserRole(userId: string, role: UserRole): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    return !error;
  }

  async getRoleRequests(): Promise<RoleRequest[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('role_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []) as RoleRequest[];
  }

  async createRoleRequest(
    userId: string,
    requestedRole: UserRole,
    reason: string
  ): Promise<RoleRequest> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('role_requests')
      .insert({ user_id: userId, requested_role: requestedRole, reason })
      .select()
      .single();
    if (error) throw new Error(`Failed to create role request: ${error.message}`);
    return data as RoleRequest;
  }

  async resolveRoleRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewerId: string
  ): Promise<RoleRequest> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('role_requests')
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();
    if (error) throw new Error(`Failed to resolve role request: ${error.message}`);
    if (status === 'approved') {
      await this.assignUserRole(data.user_id, data.requested_role, reviewerId);
    }
    return data as RoleRequest;
  }

  async getAuditLogs(limit: number = 50): Promise<AuditLogEntry[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data || []) as AuditLogEntry[];
  }

  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.from('audit_logs').insert(entry);
  }
}
