import type { Experience } from "@/lib/types";
import type { Locale } from "@/lib/i18n/translations";

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getEndDate(exp: Experience): Date {
  if (exp.current) return new Date();
  return parseDate(exp.end_date) ?? new Date();
}

function monthsBetween(start: Date, end: Date): number {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

export function getExperienceMonths(exp: Experience): number {
  const start = parseDate(exp.start_date);
  if (!start) return 0;
  return monthsBetween(start, getEndDate(exp));
}

export function formatExperiencePeriod(exp: Experience, locale: Locale): string {
  const start = parseDate(exp.start_date);
  if (!start) return "—";

  const startLabel = String(start.getFullYear());
  const endLabel = exp.current
    ? locale === "id"
      ? "Sekarang"
      : "Present"
    : parseDate(exp.end_date)
      ? String(parseDate(exp.end_date)!.getFullYear())
      : "—";

  return `${startLabel} — ${endLabel}`;
}

export function formatExperienceDuration(exp: Experience, locale: Locale): string {
  const totalMonths = getExperienceMonths(exp);
  if (totalMonths <= 0) return locale === "id" ? "< 1 Bulan" : "< 1 Month";

  if (totalMonths < 12) {
    return locale === "id"
      ? `${totalMonths} Bulan`
      : `${totalMonths} ${totalMonths === 1 ? "Month" : "Months"}`;
  }

  const years = Math.round(totalMonths / 12);
  return locale === "id"
    ? `${years} Tahun`
    : `${years} ${years === 1 ? "Year" : "Years"}`;
}
