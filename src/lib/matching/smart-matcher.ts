import type {
  PublicListing,
  BuyerRequest,
  BuyerMatchedListing,
  ListingMatchCriteria,
  InstallmentFrequency,
} from '../types';

/**
 * Normalizes periodic installment values to an equivalent monthly amount
 * for accurate, apples-to-apples comparison across different schedules.
 */
export function normalizeToMonthly(amount: number, frequency: InstallmentFrequency | null | undefined): number {
  if (!amount || amount <= 0) return 0;
  switch (frequency) {
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'semi_annual':
      return amount / 6;
    case 'annual':
      return amount / 12;
    default:
      // Default to quarterly if unspecified in Egyptian market contracts
      return amount / 3;
  }
}

/**
 * Evaluates whether a published public listing matches a buyer's structured acquisition request.
 * Explains clearly which criteria matched and which diverged.
 */
export function evaluateListingMatch(
  request: BuyerRequest,
  listing: PublicListing
): ListingMatchCriteria {
  const explanations: string[] = [];
  let matchedWeight = 0;
  const totalWeight = 100;

  // 1. Cash Upfront Check (Weight: 35)
  // Upfront cash required is the amount the seller needs to recover (total_paid.amount)
  const requiredCash = listing.total_paid?.amount || 0;
  const buyerCash = request.budget_cash || 0;
  const cashBuffer = request.is_budget_flexible ? 1.15 : 1.0; // 15% tolerance if flexible

  const cashMatches = requiredCash > 0 && requiredCash <= buyerCash * cashBuffer;
  if (cashMatches) {
    matchedWeight += 35;
    explanations.push(`الكاش المطلوب للوحدة (${requiredCash.toLocaleString('ar-EG')} ج.م) متوافق مع ميزانية المشتري الكاش.`);
  } else {
    explanations.push(`الكاش المطلوب (${requiredCash.toLocaleString('ar-EG')} ج.م) يتجاوز ميزانية المشتري (${buyerCash.toLocaleString('ar-EG')} ج.م).`);
  }

  // 2. Installment Capacity Check with Frequency Normalization (Weight: 25)
  const listingInstallment = listing.installment_value || 0;
  const listingMonthly = normalizeToMonthly(listingInstallment, listing.installment_frequency);
  const buyerMonthly = normalizeToMonthly(request.max_installment, request.installment_frequency);

  const installmentMatches =
    listingInstallment <= 0 || (buyerMonthly > 0 && listingMonthly <= buyerMonthly * (request.is_budget_flexible ? 1.1 : 1.0));

  if (installmentMatches) {
    matchedWeight += 25;
    explanations.push('قيمة القسط الدوري تقع ضمن القدرة الشهرية المريحة للمشتري بعد توحيد الدوريات.');
  } else {
    explanations.push('قيمة القسط الدوري تتجاوز الحد الأقصى المريح للمشتري.');
  }

  // 3. Location Check (Governorate & District) (Weight: 20)
  const gov = listing.property.governorate?.trim().toLowerCase();
  const district = listing.property.city_district?.trim().toLowerCase();

  const govMatches =
    request.preferred_governorates.length === 0 ||
    request.preferred_governorates.some((g) => g.trim().toLowerCase() === gov);

  const districtMatches =
    request.preferred_districts.length === 0 ||
    request.preferred_districts.some((d) => district.includes(d.trim().toLowerCase()) || d.trim().toLowerCase().includes(district));

  const locationMatches = govMatches && (request.preferred_districts.length === 0 || districtMatches);
  if (locationMatches) {
    matchedWeight += 20;
    explanations.push(`الموقع (${listing.property.governorate} • ${listing.property.city_district}) يطابق النطاق الجغرافي المطلوب.`);
  } else {
    explanations.push(`الموقع يختلف عن المحافظات أو المناطق المفضلة للمشتري.`);
  }

  // 4. Unit Type Check (Weight: 10)
  const typeMatches =
    request.preferred_unit_types.length === 0 ||
    request.preferred_unit_types.includes(listing.property.unit_type);

  if (typeMatches) {
    matchedWeight += 10;
    explanations.push(`نوع الوحدة (${listing.property.unit_type}) يطابق رغبة المشتري.`);
  } else {
    explanations.push(`نوع الوحدة (${listing.property.unit_type}) غير مدرج في التفضيلات.`);
  }

  // 5. Developer Preference Check (Weight: 5)
  const dev = listing.property.developer_name?.trim().toLowerCase();
  const developerMatches =
    !request.preferred_developers ||
    request.preferred_developers.length === 0 ||
    request.preferred_developers.some((d) => dev.includes(d.trim().toLowerCase()));

  if (developerMatches) {
    matchedWeight += 5;
    if (request.preferred_developers && request.preferred_developers.length > 0) {
      explanations.push(`المطور (${listing.property.developer_name}) ضمن قائمة المطورين المفضلين.`);
    }
  }

  // 6. Delivery Preference Check (Weight: 5)
  let deliveryMatches = true;
  if (request.delivery_preference === 'immediate') {
    deliveryMatches = listing.property.delivery_status === 'delivered';
  } else if (request.delivery_preference === 'within_1_year') {
    deliveryMatches = listing.property.delivery_status === 'delivered' || listing.property.delivery_status === 'finishing';
  }
  if (deliveryMatches) {
    matchedWeight += 5;
  }

  const score = Math.min(100, Math.round(matchedWeight));

  let matchType: 'exact' | 'partial' | 'none' = 'none';
  if (cashMatches && installmentMatches && locationMatches && typeMatches) {
    matchType = 'exact';
  } else if (score >= 50 && (cashMatches || locationMatches)) {
    matchType = 'partial';
  }

  return {
    cashMatches,
    installmentMatches,
    locationMatches,
    typeMatches,
    developerMatches,
    deliveryMatches,
    score,
    matchType,
    explanations,
  };
}

/**
 * Finds and sorts all matching published listings for a given buyer request.
 */
export function matchBuyerRequestWithListings(
  request: BuyerRequest,
  listings: PublicListing[]
): BuyerMatchedListing[] {
  return listings
    .map((listing) => ({
      listing,
      match: evaluateListingMatch(request, listing),
    }))
    .filter((item) => item.match.matchType !== 'none')
    .sort((a, b) => b.match.score - a.match.score);
}
