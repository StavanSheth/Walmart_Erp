export function calculateGrowthPercentage(current: number, previous: number): number | null {
  if (previous <= 0) {
    if (current > 0) return 100;
    return null;
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct;
}

export function calculateSatisfactionScore(
  activeCount: number,
  totalCount: number,
  activeWithOrdersCount: number
): number {
  if (totalCount <= 0) return 95.0; // standard healthy baseline fallback
  const activeRatio = Math.min(1, Math.max(0, activeCount / totalCount));
  const activityRatio = Math.min(1, Math.max(0, activeWithOrdersCount / totalCount));
  const rawScore = (activeRatio * 0.6 + activityRatio * 0.4) * 100;
  return Number(Math.max(50, Math.min(99.5, rawScore)).toFixed(1));
}

export function calculateOnboardingPercentage(onboarded: number, eligible: number): number {
  if (eligible <= 0) return 0;
  const pct = Math.round((onboarded / eligible) * 100);
  return Math.min(100, Math.max(0, pct));
}

export function formatPartnerType(rawType: string, entity: "partner" | "customer"): string {
  if (entity === "customer") {
    if (rawType === "BUSINESS") return "Retailer";
    return "Customer";
  }
  switch (rawType) {
    case "SUPPLIER":
      return "Supplier";
    case "WHOLESALER":
      return "Wholesaler";
    case "DISTRIBUTOR":
      return "Distributor";
    case "VENDOR":
      return "Vendor";
    default:
      return rawType.charAt(0) + rawType.slice(1).toLowerCase();
  }
}

export interface MonthBucket {
  label: string;
  year: number;
  month: number; // 0-indexed
  startDate: Date;
  endDate: Date;
}

export function getMonthBuckets(count: number = 6, referenceDate: Date = new Date()): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  const ref = new Date(referenceDate);

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const label = d.toLocaleString("en-US", { month: "short" });

    buckets.push({
      label,
      year,
      month,
      startDate,
      endDate
    });
  }

  return buckets;
}
