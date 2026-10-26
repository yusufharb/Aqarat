import { DataRepository, ListingsFilter } from './repository';
import {
  PublicListing,
  AssignmentCase,
  Property,
  Contract,
  CaseDocument,
  FinancialReview,
  LegalReview,
  Lead,
  Profile,
  UserRoleAssignment,
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
}
