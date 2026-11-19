// src/utils/helpers.ts
// Safe text getter with graceful fallbacks, plus small shared formatting
// utilities used across the public site and admin panel.

type SafeBilingual = Partial<Record<'en' | 'ar', string>>;

/**
 * Returns:
 * - text[language] if present
 * - else 'en' if present
 * - else first string in object
 * - else empty string
 */
export function getText(
  text: SafeBilingual | undefined | null,
  language: 'en' | 'ar'
): string {
  if (!text || typeof text !== 'object') return '';
  const langValue = text[language];
  if (typeof langValue === 'string') return langValue;
  if (typeof text.en === 'string') return text.en;
  const first = Object.values(text).find((v): v is string => typeof v === 'string');
  return first || '';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Formats a KWD price the way a Kuwaiti menu conventionally shows it (3 decimals). */
export function formatPrice(price: number): string {
  return `${price.toFixed(3)} KD`;
}

/**
 * Masks a visitor IP for display in the admin Dashboard — keeps enough to
 * eyeball repeat visitors/rough origin without showing the full address.
 * IPv4 "192.168.1.42" -> "192.168.1.•••"; IPv6 keeps only the first
 * segment. Falls back to a plain bullet for anything unrecognized.
 */
export function maskIp(ip: string | undefined | null): string {
  if (!ip) return '';
  const v4 = ip.split('.');
  if (v4.length === 4) {
    return `${v4[0]}.${v4[1]}.${v4[2]}.•••`;
  }
  const v6 = ip.split(':');
  if (v6.length > 1) {
    return `${v6[0]}:•••`;
  }
  return '•••';
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]{8,}$/.test(phone);
}
