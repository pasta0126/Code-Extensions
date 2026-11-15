export const DEFAULT_DATE_FORMAT = 'yyyy-mm-dd';
export const DEFAULT_FIRST_DAY = 'monday';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

function count(pattern: string, token: string): number {
  return pattern.toLowerCase().split(token).length - 1;
}

/** A pattern is valid when it has `yyyy`, `mm` and `dd` exactly once each. */
export function isValidDateFormat(value: unknown): value is string {
  return typeof value === 'string' && count(value, 'yyyy') === 1 && count(value, 'mm') === 1 && count(value, 'dd') === 1;
}

/** Effective pattern (lowercased), falling back to the default when absent or invalid. */
export function resolveDateFormat(value: unknown): string {
  return isValidDateFormat(value) ? value.toLowerCase() : DEFAULT_DATE_FORMAT;
}

export function isValidFirstDay(value: unknown): boolean {
  return typeof value === 'string' && DAYS.includes(value.toLowerCase());
}

/** Effective first day of the week as an index (Sunday = 0 ... Saturday = 6); Monday by default. */
export function resolveFirstDay(value: unknown): number {
  return DAYS.indexOf(isValidFirstDay(value) ? (value as string).toLowerCase() : DEFAULT_FIRST_DAY);
}

function validDate(y: number, m: number, d: number): boolean {
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** Formats a stored ISO date (`yyyy-mm-dd`); anything else is returned untouched. */
export function formatDate(iso: string, format: string): string {
  const m = ISO.exec(iso);
  if (!m || !validDate(+m[1]!, +m[2]!, +m[3]!)) return iso;
  return format.replace(/yyyy|mm|dd/g, (t) => (t === 'yyyy' ? m[1]! : t === 'mm' ? m[2]! : m[3]!));
}

/** Parses text written with `format` into ISO `yyyy-mm-dd`, or null when it is not a real date. */
export function parseDate(text: string, format: string): string | null {
  const order: string[] = [];
  const source = format
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/yyyy|mm|dd/g, (t) => {
      order.push(t);
      return t === 'yyyy' ? '(\\d{4})' : '(\\d{1,2})';
    });
  const m = new RegExp(`^${source}$`).exec(text.trim());
  if (!m) return null;
  const parts: Record<string, number> = {};
  order.forEach((t, i) => (parts[t] = +m[i + 1]!));
  const { yyyy, mm, dd } = parts as { yyyy: number; mm: number; dd: number };
  if (!validDate(yyyy, mm, dd)) return null;
  return `${String(yyyy).padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
}
