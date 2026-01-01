// Date helpers for Asia/Jakarta (WIB)
const TIMEZONE = "Asia/Jakarta";

// Reusable formatter builders (keeps code DRY)
const buildDateFormatter = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const buildYearMonthFormatter = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
  });

/**
 * YYYY-MM-DD untuk hari WIB dari suatu Date (default: sekarang).
 */
export function getJakartaDateString(date: Date = new Date()): string {
  return buildDateFormatter().format(date);
}

/**
 * YYYY-MM-01 (awal bulan) untuk bulan WIB dari suatu Date (default: sekarang).
 */
export function getJakartaMonthStartString(date: Date = new Date()): string {
  const parts = buildYearMonthFormatter().formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  return `${year}-${month}-01`;
}

/**
 * YYYY-MM-DD untuk N hari lalu berdasarkan WIB (default: sekarang).
 */
export function getJakartaDateStringDaysAgo(
  days: number,
  date: Date = new Date()
): string {
  const past = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  return getJakartaDateString(past);
}
