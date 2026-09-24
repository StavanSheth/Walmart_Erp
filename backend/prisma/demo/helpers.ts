// =============================================================================
// Demo Seed Helpers
// Utility functions for deterministic, reproducible seed data generation
// =============================================================================

import { Prisma } from "@prisma/client";

const D = (v: string | number) => new Prisma.Decimal(String(v));

/**
 * Round a number to 2 decimal places and return as Prisma Decimal.
 */
export function money(amount: number): Prisma.Decimal {
  return D(Math.round(amount * 100) / 100);
}

/**
 * Generate a deterministic date within the past N days.
 * Uses a simple seed-based offset so the same index always gives the same date.
 */
export function pastDate(daysAgo: number, hourOffset = 0): Date {
  const now = new Date("2026-09-24T12:00:00+05:30");
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(9 + (hourOffset % 12), (hourOffset * 17) % 60, 0, 0);
  return d;
}

/**
 * Generate a reference number with prefix and zero-padded index.
 * Example: createRef("SO", 1) => "SO-000001"
 */
export function createRef(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(6, "0")}`;
}

/**
 * Calculate tax amount for a given subtotal and tax rate percentage.
 */
export function calcTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * taxRate) / 100;
}

/**
 * Calculate a single sales line item total.
 * lineTotal = (qty * unitPrice) - discount + tax
 */
export function calcSalesLineTotal(
  qty: number,
  unitPrice: number,
  discount: number,
  taxRate: number
): { subtotal: number; tax: number; total: number } {
  const subtotal = qty * unitPrice;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * taxRate) / 100;
  const total = Math.round((taxableAmount + tax) * 100) / 100;
  return { subtotal: Math.round(subtotal * 100) / 100, tax, total };
}

/**
 * Calculate a single purchase line item total.
 * lineTotal = (qty * unitCost) + tax
 */
export function calcPurchaseLineTotal(
  qty: number,
  unitCost: number,
  taxRate: number
): { subtotal: number; tax: number; total: number } {
  const subtotal = qty * unitCost;
  const tax = Math.round(subtotal * taxRate) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal: Math.round(subtotal * 100) / 100, tax, total };
}

/**
 * Deterministic pseudo-random pick from array using index.
 */
export function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

/**
 * Generate a deterministic UUID-like ID for seeded entities.
 */
export function seedId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, "0")}`;
}
