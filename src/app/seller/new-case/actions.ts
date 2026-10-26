'use server';

import { getCurrentSession } from '@/lib/auth/session';
import { getDataRepository } from '@/lib/data';
import type { UnitType, DeliveryStatus, InstallmentFrequency, CaseNature } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface CreateSellerCaseInput {
  governorate: string;
  cityDistrict: string;
  developerName: string;
  projectName: string;
  unitType: UnitType;
  areaSqm?: number | null;
  floorNumber?: number | null;
  deliveryStatus: DeliveryStatus;
  expectedDeliveryDate?: string | null;

  totalContractPrice: number;
  depositPaid: number;
  installmentsPaid: number;
  remainingBalance: number;
  installmentValue?: number | null;
  installmentFrequency?: InstallmentFrequency | null;

  caseNature: CaseNature;
  hasOverdue?: boolean;
  overdueAmount?: number;
  hasLegalNotices?: boolean;
  legalNoticeDetails?: string;
  isPrivateListing: boolean;

  documents?: Array<{
    docType: 'unit_contract' | 'payment_receipts' | 'statement_of_account' | 'national_id' | 'developer_policy' | 'other';
    fileName: string;
    fileSize?: number;
    mimeType?: string;
  }>;
}

export async function createSellerCaseAction(data: CreateSellerCaseInput) {
  const session = await getCurrentSession();

  if (!session) {
    return {
      success: false,
      error: 'يجب تسجيل الدخول للتمكن من إرسال طلب التنازل.',
    };
  }

  if (session.isSuspended) {
    return {
      success: false,
      error: 'هذا الحساب مجمد حالياً. يرجى التواصل مع إدارة المنصة.',
    };
  }

  try {
    const repo = getDataRepository();

    // 1. Save property
    const property = await repo.saveProperty({
      governorate: data.governorate,
      city_district: data.cityDistrict,
      developer_name: data.developerName,
      project_name: data.projectName,
      unit_type: data.unitType,
      area_sqm: data.areaSqm ? Number(data.areaSqm) : null,
      floor_number: data.floorNumber ? Number(data.floorNumber) : null,
      delivery_status: data.deliveryStatus,
      expected_delivery_date: data.expectedDeliveryDate || null,
    });

    // 2. Save contract
    const contract = await repo.saveContract({
      property_id: property.id,
      total_contract_price: Number(data.totalContractPrice),
      deposit_paid: Number(data.depositPaid),
      installments_paid: Number(data.installmentsPaid),
      remaining_balance: Number(data.remainingBalance),
      installment_value: data.installmentValue ? Number(data.installmentValue) : null,
      installment_frequency: data.installmentFrequency || 'quarterly',
      contract_date: new Date().toISOString(),
    });

    // 3. Create assignment case in 'submitted' status
    const totalPaid = Number(data.depositPaid) + Number(data.installmentsPaid);
    const newCase = await repo.createCase(session.userId, {
      property_id: property.id,
      contract_id: contract.id,
      case_nature: data.caseNature || 'standard_assignment',
      status: 'submitted',
      is_private_listing: Boolean(data.isPrivateListing),
      requested_cash_amount: {
        amount: totalPaid,
        confidence: 'seller_declared',
        source_description: 'المبلغ المدخل من البائع في نموذج تسجيل الوحدة',
        verified_at: null,
        verified_by: null,
      },
      seller_notes: data.legalNoticeDetails || null,
      submitted_at: new Date().toISOString(),
    });

    // 4. Save documents metadata
    if (data.documents && data.documents.length > 0) {
      for (const doc of data.documents) {
        await repo.saveCaseDocument({
          case_id: newCase.id,
          doc_type: doc.docType,
          file_name: doc.fileName,
          file_size_bytes: doc.fileSize || 1024 * 500,
          mime_type: doc.mimeType || 'application/pdf',
          verification_status: 'pending',
        });
      }
    } else {
      // Standard required documents
      await repo.saveCaseDocument({
        case_id: newCase.id,
        doc_type: 'unit_contract',
        file_name: 'عقد_الوحدة_الأصلي.pdf',
        file_size_bytes: 2048576,
        mime_type: 'application/pdf',
        verification_status: 'pending',
      });
      await repo.saveCaseDocument({
        case_id: newCase.id,
        doc_type: 'payment_receipts',
        file_name: 'كشف_حساب_وإيصالات_السداد.pdf',
        file_size_bytes: 1450000,
        mime_type: 'application/pdf',
        verification_status: 'pending',
      });
      await repo.saveCaseDocument({
        case_id: newCase.id,
        doc_type: 'national_id',
        file_name: 'بطاقة_الرقم_القومي.jpg',
        file_size_bytes: 850000,
        mime_type: 'image/jpeg',
        verification_status: 'pending',
      });
    }

    // 5. Initialize publication gates
    await repo.savePublicationGates({
      case_id: newCase.id,
      gate_1_complete_unit_data: true,
      gate_2_seller_identity_confirmed: false,
      gate_3_mandatory_docs_verified: false,
      gate_4_financial_review_approved: false,
      gate_5_legal_review_approved: false,
      gate_6_developer_transfer_clear: false,
      gate_7_publisher_authorized: false,
      gate_8_pii_sanitized_for_public: true,
      gate_9_disclaimers_and_timestamp_ready: true,
    });

    // 6. Log audit event
    await repo.logAuditEvent({
      entity_name: 'assignment_cases',
      entity_id: newCase.id,
      action: 'case_submitted',
      actor_id: session.userId,
      new_values: {
        case_number: newCase.case_number,
        status: 'submitted',
        property_id: property.id,
        nature: newCase.case_nature,
      },
    });

    revalidatePath('/seller/dashboard');
    revalidatePath('/control-room/cases');

    return {
      success: true,
      caseId: newCase.id,
      caseNumber: newCase.case_number,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'حدث خطأ غير متوقع أثناء حفظ الطلب.',
    };
  }
}
