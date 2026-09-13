import { PaymentError } from './errors';

/**
 * Normalizes Kenyan mobile numbers into the canonical 12-digit format required by Daraja (2547XXXXXXXX or 2541XXXXXXXX)
 */
export function normalizeKenyanPhone(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new PaymentError('Phone number is required and must be a string', 'INVALID_PHONE_FORMAT', 400);
  }

  // Strip all whitespace, hyphens, parentheses, and plus symbols
  let cleaned = input.replace(/[\s\-\(\)\+]/g, '');

  // Handle leading zero (e.g. 0712345678 or 0112345678)
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // Handle 7XXXXXXXX or 1XXXXXXXX (9 digits without leading 0 or 254)
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '254' + cleaned;
  }

  // Must now be exactly 12 digits starting with 254
  if (!/^254(7|1)\d{8}$/.test(cleaned)) {
    throw new PaymentError(
      `Invalid Kenyan mobile number: '${input}'. Must be a valid Kenyan mobile number (e.g. 0712345678, 0112345678, or +254712345678).`,
      'INVALID_PHONE_FORMAT',
      400
    );
  }

  return cleaned;
}

/**
 * Masks a Kenyan phone number for safe display in UI and non-sensitive logs
 * Example: '254712345678' -> '+254 7••• ••678'
 */
export function maskPhoneNumber(phone: string): string {
  try {
    const normalized = normalizeKenyanPhone(phone);
    const prefix = normalized.substring(3, 4); // '7' or '1'
    const suffix = normalized.slice(-3);       // last 3 digits
    return `+254 ${prefix}••• ••${suffix}`;
  } catch {
    return '+254 •••• ••••';
  }
}

/**
 * Validates financial payment amount
 */
export function validatePaymentAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: 'Amount must be a valid numeric figure' };
  }
  if (amount < 1) {
    return { valid: false, error: 'Amount must be at least KES 1.00' };
  }
  if (amount > 250000) {
    return { valid: false, error: 'Amount exceeds M-Pesa single transaction limit of KES 250,000' };
  }
  return { valid: true };
}
