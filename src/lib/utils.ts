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
 * Format date string into strict jour/mois/année (JJ/MM/AAAA) format
 * Handles ISO strings ("2026-10-24T21:26:41..."), SQL timestamps ("2026-10-24 21:26:41..."), and date strings ("2026-10-24")
 * Example: formatDate("2026-10-24") => "24/10/2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  // Strip any time part (after T or space)
  const clean = dateString.includes("T")
    ? dateString.split("T")[0]
    : dateString.includes(" ")
    ? dateString.split(" ")[0]
    : dateString;

  const parts = clean.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year && month && day) {
      const cleanDay = day.replace(/\D/g, "").slice(0, 2);
      const cleanMonth = month.replace(/\D/g, "").slice(0, 2);
      const cleanYear = year.replace(/\D/g, "").slice(0, 4);
      if (cleanDay && cleanMonth && cleanYear) {
        return `${cleanDay.padStart(2, "0")}/${cleanMonth.padStart(2, "0")}/${cleanYear}`;
      }
    }
  }

  // Fallback to Date object if string was in another format
  try {
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch {}

  return dateString;
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

/**
 * Format a phone number to WhatsApp international format (e.g. 221778241520)
 * Handles local numbers (+221, 00221, or 9-digit Senegalese numbers starting with 7 or 3)
 */
export function sanitizeWhatsAppNumber(rawPhone?: string): string | null {
  if (!rawPhone) return null;
  let cleaned = rawPhone.replace(/\D/g, "");
  if (!cleaned) return null;

  if (cleaned.startsWith("00")) {
    cleaned = cleaned.substring(2);
  }

  if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("3"))) {
    cleaned = "221" + cleaned;
  }

  if (cleaned.length >= 8) {
    return cleaned;
  }

  return null;
}

/**
 * Generate a direct WhatsApp click-to-chat URL with a message
 */
export function generateWhatsAppLink(phone: string, message: string = ""): string {
  const sanitized = sanitizeWhatsAppNumber(phone) || phone.replace(/\D/g, "");
  return `https://wa.me/${sanitized}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}



