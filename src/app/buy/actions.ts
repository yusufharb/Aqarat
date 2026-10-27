'use server';

import { revalidatePath } from 'next/cache';
import { getDataRepository } from '@/lib/data';
import { getCurrentSession } from '@/lib/auth/session';
import type { UnitType, InstallmentFrequency } from '@/lib/types';

export interface ActionResponse {
  success: boolean;
  referenceCode?: string;
  id?: string;
  error?: string;
}

export async function submitBuyerRequestAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const fullName = formData.get('fullName')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const email = formData.get('email')?.toString().trim() || null;

    const budgetCashRaw = formData.get('budgetCash')?.toString().trim();
    const maxInstallmentRaw = formData.get('maxInstallment')?.toString().trim();
    const installmentFrequency = (formData.get('installmentFrequency')?.toString().trim() || 'quarterly') as InstallmentFrequency;
    const isBudgetFlexible = formData.get('isBudgetFlexible') === 'true' || formData.get('isBudgetFlexible') === 'on';

    const preferredGovernoratesRaw = formData.get('preferredGovernorates')?.toString().trim() || '';
    const preferredDistrictsRaw = formData.get('preferredDistricts')?.toString().trim() || '';
    const preferredUnitTypesRaw = formData.get('preferredUnitTypes')?.toString().trim() || '';
    const preferredDevelopersRaw = formData.get('preferredDevelopers')?.toString().trim() || '';

    const deliveryPreference = (formData.get('deliveryPreference')?.toString().trim() || 'any') as
      | 'immediate'
      | 'within_1_year'
      | 'within_2_years'
      | 'any';
    const bedrooms = formData.get('bedrooms')?.toString().trim() || null;
    const notes = formData.get('notes')?.toString().trim() || null;

    // Validation
    if (!fullName || fullName.length < 3) {
      return { success: false, error: 'يرجى إدخال اسم المشتري ثلاثياً بشكل صحيح.' };
    }
    if (!phone || phone.length < 10) {
      return { success: false, error: 'يرجى إدخال رقم هاتف صحيح للتواصل والمطابقة.' };
    }

    const budgetCash = Number(budgetCashRaw);
    const maxInstallment = Number(maxInstallmentRaw);

    if (isNaN(budgetCash) || budgetCash <= 0) {
      return { success: false, error: 'الميزانية النقدية (الكاش الجاهز) يجب أن تكون رقماً موجباً.' };
    }
    if (isNaN(maxInstallment) || maxInstallment <= 0) {
      return { success: false, error: 'أقصى قسط دوري يجب أن يكون رقماً موجباً.' };
    }

    const preferredGovernorates = preferredGovernoratesRaw
      ? preferredGovernoratesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : ['القاهرة'];

    const preferredDistricts = preferredDistrictsRaw
      ? preferredDistrictsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const preferredUnitTypes = preferredUnitTypesRaw
      ? (preferredUnitTypesRaw.split(',').map((s) => s.trim()).filter(Boolean) as UnitType[])
      : (['apartment'] as UnitType[]);

    const preferredDevelopers = preferredDevelopersRaw
      ? preferredDevelopersRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    // Check session
    const session = await getCurrentSession();
    const buyerId = session?.userId || null;

    const repo = getDataRepository();
    const request = await repo.createBuyerRequest({
      buyer_id: buyerId,
      full_name: fullName,
      phone,
      email,
      budget_cash: budgetCash,
      max_installment: maxInstallment,
      installment_frequency: installmentFrequency,
      is_budget_flexible: isBudgetFlexible,
      preferred_governorates: preferredGovernorates,
      preferred_districts: preferredDistricts,
      preferred_unit_types: preferredUnitTypes,
      preferred_developers: preferredDevelopers,
      delivery_preference: deliveryPreference,
      bedrooms,
      notes,
    });

    revalidatePath('/control-room/requests');
    if (buyerId) {
      revalidatePath('/buyer/dashboard');
    }

    return {
      success: true,
      referenceCode: request.reference_code,
      id: request.id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل طلب الشراء.';
    return { success: false, error: message };
  }
}
