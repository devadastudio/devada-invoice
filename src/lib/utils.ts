import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number into FCFA currency display
 * Example: formatFCFA(250000) => "250 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  const formatted = Math.round(amount || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} FCFA`;
}

export type SupportedCurrency = "FCFA" | "EUR" | "USD";

export const CONVERSION_RATES: Record<SupportedCurrency, number> = {
  FCFA: 1,
  EUR: 655.957,
  USD: 600,
};

/**
 * Format currency according to chosen currency code (FCFA, EUR, USD)
 */
export function formatCurrency(amount: number, currency: string = "FCFA"): string {
  const curr = (currency || "FCFA").toUpperCase();
  if (curr.includes("EUR") || curr === "€") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  }
  if (curr.includes("USD") || curr === "$") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  }
  return formatFCFA(amount);
}

/**
 * Convert an amount from FCFA to another currency, or vice-versa
 */
export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount;
  // Convert from origin to FCFA first
  const inFCFA = amount * (CONVERSION_RATES[from] || 1);
  // Convert from FCFA to target
  const targetRate = CONVERSION_RATES[to] || 1;
  return inFCFA / targetRate;
}

/**
 * Format date string (YYYY-MM-DD) into jour/mois/année format
 * Example: formatDate("2026-10-24") => "24/10/2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

/**
 * Format an amount stored in FCFA into target currency (FCFA, EUR, USD)
 * Performs dynamic conversion if target currency is EUR or USD
 */
export function formatAmountWithCurrency(
  amountInFCFA: number,
  targetCurrency: string = "FCFA"
): string {
  const curr = (targetCurrency || "FCFA").toUpperCase();
  if (curr.includes("EUR") || curr === "€") {
    const inEur = convertCurrency(amountInFCFA, "FCFA", "EUR");
    return formatCurrency(inEur, "EUR");
  }
  if (curr.includes("USD") || curr === "$") {
    const inUsd = convertCurrency(amountInFCFA, "FCFA", "USD");
    return formatCurrency(inUsd, "USD");
  }
  return formatFCFA(amountInFCFA);
}


