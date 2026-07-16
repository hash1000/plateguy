import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a UK registration with the correct space, e.g. "EWQ32" -> "EWQ 32"
export function formatRegistration(raw: string): string {
  const reg = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const patterns: RegExp[] = [
    /^([A-Z]{2}[0-9]{2})([A-Z]{3})$/, // current: AB12 CDE
    /^([A-Z][0-9]{1,3})([A-Z]{3})$/, // prefix: A123 BCD
    /^([A-Z]{3})([0-9]{1,3}[A-Z])$/, // suffix: ABC 123D
    /^([A-Z]{1,3})([0-9]{1,4})$/, // dateless: EWQ 32
    /^([0-9]{1,4})([A-Z]{1,3})$/, // dateless reversed: 32 EWQ
  ];
  for (const re of patterns) {
    const m = reg.match(re);
    if (m) return `${m[1]} ${m[2]}`;
  }
  return reg;
}

export function plateSizeLabel(key: string): string {
  const k = key.replace(/"/g, "").toLowerCase();
  if (k === "standard") return "Standard Oblong";
  if (k === "18") return '18" Oblong';
  if (k === "square") return "Square";
  return key;
}
