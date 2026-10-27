/**
 * Formats a monetary amount into Egyptian Pounds (EGP) with Arabic numerals.
 * Example: 1200000 -> "١٬٢٠٠٬٠٠٠ ج.م"
 */
export function formatEGP(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/**
 * Formats an ISO date string in Arabic locale using the Africa/Cairo timezone.
 * Example: "2026-02-05T14:30:00Z" -> "٥ فبراير ٢٠٢٦"
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return isoDate;
    }
    return new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return isoDate;
  }
}

/**
 * Formats an ISO date string into a relative human-readable Arabic string.
 * Example: 3 days ago -> "منذ ٣ أيام" / "قبل ٣ أيام"
 */
export function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return isoDate;
    }

    const now = new Date();
    const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const absDiff = Math.abs(diffInSeconds);

    if (absDiff < 45) {
      return 'الآن';
    }

    const diffInMinutes = Math.round(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      const rtf = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' });
      return rtf.format(diffInMinutes, 'minute');
    }

    const diffInHours = Math.round(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      const rtf = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' });
      return rtf.format(diffInHours, 'hour');
    }

    const diffInDays = Math.round(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      const rtf = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' });
      return rtf.format(diffInDays, 'day');
    }

    const diffInMonths = Math.round(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      const rtf = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' });
      return rtf.format(diffInMonths, 'month');
    }

    const diffInYears = Math.round(diffInDays / 365);
    const rtf = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' });
    return rtf.format(diffInYears, 'year');
  } catch {
    return isoDate;
  }
}

/**
 * Generates an assignment case tracking number formatted as "CAS-YYYY-XXXX".
 * Example: "CAS-2026-4819"
 */
export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CAS-${year}-${randomSuffix}`;
}

/**
 * Generates an acquisition request reference code formatted as "REQ-S-YYYY-XXXX" or "REQ-B-YYYY-XXXX".
 */
export function generateReferenceCode(prefix: 'REQ-S' | 'REQ-B'): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomSuffix}`;
}

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: unknown }
  | ClassValue[];

/**
 * Utility function to merge conditional Tailwind CSS class names.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  function process(item: ClassValue): void {
    if (!item) return;

    if (typeof item === 'string' || typeof item === 'number') {
      classes.push(String(item));
    } else if (Array.isArray(item)) {
      for (const subItem of item) {
        process(subItem);
      }
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  for (const input of inputs) {
    process(input);
  }

  return classes.join(' ');
}
