import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Normalize DB / form dates to valid ISO strings for metadata & JSON-LD. */
export function toIsoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value.includes(" ") ? value.replace(" ", "T") : value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}
