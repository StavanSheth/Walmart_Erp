/**
 * Centralized formatting helpers for Walmart ERP (Phase 5 Dashboard)
 * Enforces Indian Currency (₹ INR), tabular numerals, and locale formatting.
 */

export function formatCurrency(amount: number, compact = false): string {
  if (isNaN(amount)) return "₹0";

  if (compact && Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(d);
}

export function formatPercentage(value: number, decimals = 1): string {
  if (isNaN(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}

export function formatShortDate(dateString: string): string {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short"
  }).format(d);
}

export function formatDateTime(dateString: string): string {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}
