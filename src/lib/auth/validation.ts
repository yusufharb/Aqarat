/**
 * Server-side validation and normalization for Egyptian phone numbers, emails, and credentials.
 */

/**
 * Normalizes Egyptian mobile phone numbers to standard E.164 format (+201XXXXXXXXX).
 * Valid carriers in Egypt:
 * - 010 (Vodafone)
 * - 011 (Etisalat / e&)
 * - 012 (Orange)
 * - 015 (WE / Telecom Egypt)
 *
 * Accepted inputs:
 * - 01012345678
 * - +201012345678
 * - 00201012345678
 * - 201012345678
 * - 010 1234 5678 / 010-1234-5678
 */
export function normalizeEgyptianPhone(phone: string): string | null {
  if (!phone || typeof phone !== 'string') return null;

  // Remove whitespace, dashes, parens
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Convert Arabic-Indic numerals (٠-٩) to Western (0-9)
  const arabicIndicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  arabicIndicDigits.forEach((digit, i) => {
    cleaned = cleaned.replace(new RegExp(digit, 'g'), String(i));
  });

  // Handle leading prefixes: +20, 0020, 20, or 0
  if (cleaned.startsWith('+20')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0020')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('20') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Now cleaned should start with 1 followed by 0, 1, 2, or 5 and then 8 digits (10 digits total)
  const egyptianMobileRegex = /^1[0125][0-9]{8}$/;
  if (!egyptianMobileRegex.test(cleaned)) {
    return null;
  }

  return `+20${cleaned}`;
}

/**
 * Validates email format according to RFC 5322 standard regex.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed) && trimmed.length <= 255;
}

/**
 * Validates password strength:
 * - At least 8 characters
 * - Contains at least one letter and at least one number
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'كلمة المرور مطلوبة.' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'يجب ألا تقل كلمة المرور عن 8 خانات.' };
  }

  const hasLetter = /[a-zA-Z\u0600-\u06FF]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  if (!hasLetter || !hasDigit) {
    return { valid: false, error: 'يجب أن تحتوي كلمة المرور على أحرف وأرقام معاً.' };
  }

  return { valid: true };
}
