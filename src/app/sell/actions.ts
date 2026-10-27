'use server';

import { revalidatePath } from 'next/cache';
import { getDataRepository } from '@/lib/data';
import { getCurrentSession } from '@/lib/auth/session';
import type { UnitType, DeliveryStatus, InstallmentFrequency } from '@/lib/types';

export interface ActionResponse {
  success: boolean;
  referenceCode?: string;
  id?: string;
  error?: string;
}

export async function submitSellerRequestAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const fullName = formData.get('fullName')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const email = formData.get('email')?.toString().trim() || null;
    const governorate = formData.get('governorate')?.toString().trim();
    const cityDistrict = formData.get('cityDistrict')?.toString().trim();
    const developerName = formData.get('developerName')?.toString().trim();
    const projectName = formData.get('projectName')?.toString().trim();
    const unitType = formData.get('unitType')?.toString().trim() as UnitType;
    const areaSqmRaw = formData.get('areaSqm')?.toString().trim();
    const floorNumberRaw = formData.get('floorNumber')?.toString().trim();
    const deliveryStatus = (formData.get('deliveryStatus')?.toString().trim() || 'under_construction') as DeliveryStatus;

    const totalPriceRaw = formData.get('totalPrice')?.toString().trim();
    const paidAmountRaw = formData.get('paidAmount')?.toString().trim();
    const remainingBalanceRaw = formData.get('remainingBalance')?.toString().trim();
    const installmentValueRaw = formData.get('installmentValue')?.toString().trim();
    const installmentFrequency = (formData.get('installmentFrequency')?.toString().trim() || 'quarterly') as InstallmentFrequency;

    const hasOverdue = formData.get('hasOverdue') === 'true' || formData.get('hasOverdue') === 'on';
    const overdueAmountRaw = formData.get('overdueAmount')?.toString().trim();
    const requestedCashRaw = formData.get('requestedCashAmount')?.toString().trim();
    const notes = formData.get('notes')?.toString().trim() || null;

    // Basic Validation
    if (!fullName || fullName.length < 3) {
      return { success: false, error: 'يرجى إدخال اسم المالك ثلاثياً بشكل صحيح.' };
    }
    if (!phone || phone.length < 10) {
      return { success: false, error: 'يرجى إدخال رقم هاتف صحيح للتواصل.' };
    }
    if (!governorate || !cityDistrict) {
      return { success: false, error: 'يرجى تحديد المحافظة والحي أو المنطقة.' };
    }
    if (!developerName || !projectName) {
      return { success: false, error: 'يرجى كتابة اسم المطور العقاري واسم المشروع.' };
    }
    if (!unitType) {
      return { success: false, error: 'يرجى تحديد نوع الوحدة.' };
    }

    const totalPrice = Number(totalPriceRaw);
    const paidAmount = Number(paidAmountRaw);
    const remainingBalance = Number(remainingBalanceRaw);

    if (isNaN(totalPrice) || totalPrice <= 0) {
      return { success: false, error: 'إجمالي سعر التعاقد يجب أن يكون رقماً موجباً.' };
    }
    if (isNaN(paidAmount) || paidAmount < 0) {
      return { success: false, error: 'المبلغ المدفوع للمطور غير صالح.' };
    }
    if (isNaN(remainingBalance) || remainingBalance < 0) {
      return { success: false, error: 'المبلغ المتبقي غير صالح.' };
    }

    // Check optional numbers
    const areaSqm = areaSqmRaw ? Number(areaSqmRaw) : null;
    const floorNumber = floorNumberRaw ? Number(floorNumberRaw) : null;
    const installmentValue = installmentValueRaw ? Number(installmentValueRaw) : null;
    const overdueAmount = hasOverdue && overdueAmountRaw ? Number(overdueAmountRaw) : 0;
    const requestedCashAmount = requestedCashRaw ? Number(requestedCashRaw) : paidAmount;

    // Associate session if logged in
    const session = await getCurrentSession();
    const sellerId = session?.userId || null;

    const repo = getDataRepository();
    const request = await repo.createSellerRequest({
      seller_id: sellerId,
      full_name: fullName,
      phone,
      email,
      governorate,
      city_district: cityDistrict,
      developer_name: developerName,
      project_name: projectName,
      unit_type: unitType,
      area_sqm: areaSqm,
      floor_number: floorNumber,
      delivery_status: deliveryStatus,
      total_price: totalPrice,
      paid_amount: paidAmount,
      remaining_balance: remainingBalance,
      installment_value: installmentValue,
      installment_frequency: installmentFrequency,
      has_overdue: hasOverdue,
      overdue_amount: overdueAmount,
      requested_cash_amount: requestedCashAmount,
      notes,
    });

    revalidatePath('/control-room/requests');
    if (sellerId) {
      revalidatePath('/seller/dashboard');
    }

    return {
      success: true,
      referenceCode: request.reference_code,
      id: request.id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إرسال الطلب.';
    return { success: false, error: message };
  }
}
