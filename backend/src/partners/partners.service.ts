import { Prisma } from "@prisma/client";
import { prisma } from "../common/database/prisma.js";
import { AppError } from "../common/errors/app-error.js";
import {
  PartnersOverviewData,
  PartnersSummary,
  PartnerDistributionItem,
  PartnerGrowthPoint,
  PartnerInsights,
  PartnerListItem,
  TopPartnerItem,
  PartnerOnboardingMetric,
  PartnersFilterOptions,
  PartnerDetailData,
  CreatePartnerInput
} from "./partners.types.js";
import {
  PartnersOverviewQueryParams,
  PartnersExportQueryParams
} from "./partners.schemas.js";
import {
  calculateGrowthPercentage,
  calculateActivityHealth,
  calculateOnboardingPercentage,
  formatPartnerType,
  getMonthBuckets
} from "./partners.helpers.js";

async function getDemoOrganizationId(): Promise<string> {
  const org = await prisma.organization.findFirst({
    where: { status: "ACTIVE" },
    select: { id: true }
  });
  return org?.id || "org-walmart-in";
}

export async function getPartnersOverview(
  params: PartnersOverviewQueryParams
): Promise<PartnersOverviewData> {
  const {
    tab = "overview",
    search,
    type,
    regionId,
    status = "ALL",
    page = 1,
    pageSize = 10,
    period = "6m"
  } = params;

  const now = new Date();
  const current30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const previous60DaysStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ytdStart = new Date(now.getFullYear(), 0, 1);

  // 1. Parallel counts and lookups for summary, distribution, and filters
  const [
    totalActivePartners,
    totalActiveSuppliers,
    totalActiveWholesalers,
    totalActiveRetailers,
    totalActiveEndCustomers,
    // 30-day period counts for trend calculations
    currentPartnersCreated,
    previousPartnersCreated,
    currentRetailersCreated,
    previousRetailersCreated,
    currentSuppliersCreated,
    previousSuppliersCreated,
    currentEndCustomersCreated,
    previousEndCustomersCreated,
    // YTD counts
    partnersYtd,
    retailersYtd,
    customersYtd,
    // Recent orders check (within 90 days)
    partnersWithRecentOrders,
    allRegions
  ] = await Promise.all([
    prisma.partner.count({ where: { status: "ACTIVE" } }),
    prisma.partner.count({ where: { type: "SUPPLIER", status: "ACTIVE" } }),
    prisma.partner.count({ where: { type: "WHOLESALER", status: "ACTIVE" } }),
    prisma.customer.count({ where: { customerType: "BUSINESS", status: "ACTIVE" } }),
    prisma.customer.count({ where: { customerType: "RETAIL", status: "ACTIVE" } }),

    prisma.partner.count({ where: { createdAt: { gte: current30DaysStart } } }),
    prisma.partner.count({
      where: { createdAt: { gte: previous60DaysStart, lt: current30DaysStart } }
    }),
    prisma.customer.count({
      where: { customerType: "BUSINESS", createdAt: { gte: current30DaysStart } }
    }),
    prisma.customer.count({
      where: {
        customerType: "BUSINESS",
        createdAt: { gte: previous60DaysStart, lt: current30DaysStart }
      }
    }),
    prisma.partner.count({
      where: { type: "SUPPLIER", createdAt: { gte: current30DaysStart } }
    }),
    prisma.partner.count({
      where: {
        type: "SUPPLIER",
        createdAt: { gte: previous60DaysStart, lt: current30DaysStart }
      }
    }),
    prisma.customer.count({
      where: { customerType: "RETAIL", createdAt: { gte: current30DaysStart } }
    }),
    prisma.customer.count({
      where: {
        customerType: "RETAIL",
        createdAt: { gte: previous60DaysStart, lt: current30DaysStart }
      }
    }),

    prisma.partner.count({ where: { createdAt: { gte: ytdStart } } }),
    prisma.customer.count({
      where: { customerType: "BUSINESS", createdAt: { gte: ytdStart } }
    }),
    prisma.customer.count({
      where: { customerType: "RETAIL", createdAt: { gte: ytdStart } }
    }),

    prisma.partner.count({
      where: {
        purchaseOrders: {
          some: {
            createdAt: { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
          }
        }
      }
    }),

    prisma.region.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  // 2. High-Performance DB-Side Batch Aggregation for Sparklines (6 months)
  // Instead of 24 independent count queries, execute 2 single parameterized SQL aggregations.
  const monthBuckets = getMonthBuckets(6, now);
  const b = monthBuckets.map((m) => m.endDate);

  const [pSparkRaw, cSparkRaw] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        p0: bigint;
        p1: bigint;
        p2: bigint;
        p3: bigint;
        p4: bigint;
        p5: bigint;
        s0: bigint;
        s1: bigint;
        s2: bigint;
        s3: bigint;
        s4: bigint;
        s5: bigint;
        w0: bigint;
        w1: bigint;
        w2: bigint;
        w3: bigint;
        w4: bigint;
        w5: bigint;
      }>
    >`
      SELECT
        COUNT(CASE WHEN "createdAt" <= ${b[0]} THEN 1 END) as p0,
        COUNT(CASE WHEN "createdAt" <= ${b[1]} THEN 1 END) as p1,
        COUNT(CASE WHEN "createdAt" <= ${b[2]} THEN 1 END) as p2,
        COUNT(CASE WHEN "createdAt" <= ${b[3]} THEN 1 END) as p3,
        COUNT(CASE WHEN "createdAt" <= ${b[4]} THEN 1 END) as p4,
        COUNT(CASE WHEN "createdAt" <= ${b[5]} THEN 1 END) as p5,
        COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${b[0]} THEN 1 END) as s0,
        COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${b[1]} THEN 1 END) as s1,
        COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${b[2]} THEN 1 END) as s2,
        COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${b[3]} THEN 1 END) as s3,
        COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${b[4]} THEN 1 END) as s4,
        COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${b[5]} THEN 1 END) as s5,
        COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${b[0]} THEN 1 END) as w0,
        COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${b[1]} THEN 1 END) as w1,
        COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${b[2]} THEN 1 END) as w2,
        COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${b[3]} THEN 1 END) as w3,
        COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${b[4]} THEN 1 END) as w4,
        COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${b[5]} THEN 1 END) as w5
      FROM "Partner"
    `,
    prisma.$queryRaw<
      Array<{
        r0: bigint;
        r1: bigint;
        r2: bigint;
        r3: bigint;
        r4: bigint;
        r5: bigint;
        c0: bigint;
        c1: bigint;
        c2: bigint;
        c3: bigint;
        c4: bigint;
        c5: bigint;
      }>
    >`
      SELECT
        COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${b[0]} THEN 1 END) as r0,
        COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${b[1]} THEN 1 END) as r1,
        COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${b[2]} THEN 1 END) as r2,
        COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${b[3]} THEN 1 END) as r3,
        COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${b[4]} THEN 1 END) as r4,
        COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${b[5]} THEN 1 END) as r5,
        COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${b[0]} THEN 1 END) as c0,
        COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${b[1]} THEN 1 END) as c1,
        COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${b[2]} THEN 1 END) as c2,
        COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${b[3]} THEN 1 END) as c3,
        COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${b[4]} THEN 1 END) as c4,
        COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${b[5]} THEN 1 END) as c5
      FROM "Customer"
    `
  ]);

  const pData = pSparkRaw[0] || {
    p0: 0n, p1: 0n, p2: 0n, p3: 0n, p4: 0n, p5: 0n,
    s0: 0n, s1: 0n, s2: 0n, s3: 0n, s4: 0n, s5: 0n,
    w0: 0n, w1: 0n, w2: 0n, w3: 0n, w4: 0n, w5: 0n
  };
  const cData = cSparkRaw[0] || {
    r0: 0n, r1: 0n, r2: 0n, r3: 0n, r4: 0n, r5: 0n,
    c0: 0n, c1: 0n, c2: 0n, c3: 0n, c4: 0n, c5: 0n
  };

  const totalPartnersSparkline = [
    { label: monthBuckets[0].label, value: Number(pData.p0) },
    { label: monthBuckets[1].label, value: Number(pData.p1) },
    { label: monthBuckets[2].label, value: Number(pData.p2) },
    { label: monthBuckets[3].label, value: Number(pData.p3) },
    { label: monthBuckets[4].label, value: Number(pData.p4) },
    { label: monthBuckets[5].label, value: Number(pData.p5) }
  ];

  const suppliersSparkline = [
    { label: monthBuckets[0].label, value: Number(pData.s0) },
    { label: monthBuckets[1].label, value: Number(pData.s1) },
    { label: monthBuckets[2].label, value: Number(pData.s2) },
    { label: monthBuckets[3].label, value: Number(pData.s3) },
    { label: monthBuckets[4].label, value: Number(pData.s4) },
    { label: monthBuckets[5].label, value: Number(pData.s5) }
  ];

  const retailersSparkline = [
    { label: monthBuckets[0].label, value: Number(cData.r0) },
    { label: monthBuckets[1].label, value: Number(cData.r1) },
    { label: monthBuckets[2].label, value: Number(cData.r2) },
    { label: monthBuckets[3].label, value: Number(cData.r3) },
    { label: monthBuckets[4].label, value: Number(cData.r4) },
    { label: monthBuckets[5].label, value: Number(cData.r5) }
  ];

  const endCustomersSparkline = [
    { label: monthBuckets[0].label, value: Number(cData.c0) },
    { label: monthBuckets[1].label, value: Number(cData.c1) },
    { label: monthBuckets[2].label, value: Number(cData.c2) },
    { label: monthBuckets[3].label, value: Number(cData.c3) },
    { label: monthBuckets[4].label, value: Number(cData.c4) },
    { label: monthBuckets[5].label, value: Number(cData.c5) }
  ];

  const summary: PartnersSummary = {
    totalPartners: totalActivePartners,
    retailers: totalActiveRetailers,
    suppliers: totalActiveSuppliers,
    endCustomers: totalActiveEndCustomers,
    trends: {
      totalPartners: {
        value: totalActivePartners,
        changePercent: calculateGrowthPercentage(
          currentPartnersCreated,
          previousPartnersCreated
        ),
        sparkline: totalPartnersSparkline
      },
      retailers: {
        value: totalActiveRetailers,
        changePercent: calculateGrowthPercentage(
          currentRetailersCreated,
          previousRetailersCreated
        ),
        sparkline: retailersSparkline
      },
      suppliers: {
        value: totalActiveSuppliers,
        changePercent: calculateGrowthPercentage(
          currentSuppliersCreated,
          previousSuppliersCreated
        ),
        sparkline: suppliersSparkline
      },
      endCustomers: {
        value: totalActiveEndCustomers,
        changePercent: calculateGrowthPercentage(
          currentEndCustomersCreated,
          previousEndCustomersCreated
        ),
        sparkline: endCustomersSparkline
      }
    }
  };

  // 3. Distribution Donut
  const distributionTotal =
    totalActiveRetailers +
    totalActiveWholesalers +
    totalActiveSuppliers +
    totalActiveEndCustomers;

  const distribution: PartnerDistributionItem[] = [
    {
      name: "Retailers",
      value: totalActiveRetailers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveRetailers / distributionTotal) * 100)
          : 0,
      color: "#0071DC"
    },
    {
      name: "Wholesalers",
      value: totalActiveWholesalers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveWholesalers / distributionTotal) * 100)
          : 0,
      color: "#10B981"
    },
    {
      name: "Suppliers",
      value: totalActiveSuppliers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveSuppliers / distributionTotal) * 100)
          : 0,
      color: "#8B5CF6"
    },
    {
      name: "End Customers",
      value: totalActiveEndCustomers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveEndCustomers / distributionTotal) * 100)
          : 0,
      color: "#F59E0B"
    }
  ];

  // 4. Growth Multi-line Chart (6m or 12m)
  // For 6m: reuse the already computed values from batch aggregation with zero extra DB calls!
  let growth: PartnerGrowthPoint[] = [];
  if (period === "6m") {
    growth = [
      {
        month: monthBuckets[0].label,
        Retailers: Number(cData.r0),
        Wholesalers: Number(pData.w0),
        Suppliers: Number(pData.s0),
        Customers: Number(cData.c0)
      },
      {
        month: monthBuckets[1].label,
        Retailers: Number(cData.r1),
        Wholesalers: Number(pData.w1),
        Suppliers: Number(pData.s1),
        Customers: Number(cData.c1)
      },
      {
        month: monthBuckets[2].label,
        Retailers: Number(cData.r2),
        Wholesalers: Number(pData.w2),
        Suppliers: Number(pData.s2),
        Customers: Number(cData.c2)
      },
      {
        month: monthBuckets[3].label,
        Retailers: Number(cData.r3),
        Wholesalers: Number(pData.w3),
        Suppliers: Number(pData.s3),
        Customers: Number(cData.c3)
      },
      {
        month: monthBuckets[4].label,
        Retailers: Number(cData.r4),
        Wholesalers: Number(pData.w4),
        Suppliers: Number(pData.s4),
        Customers: Number(cData.c4)
      },
      {
        month: monthBuckets[5].label,
        Retailers: Number(cData.r5),
        Wholesalers: Number(pData.w5),
        Suppliers: Number(pData.s5),
        Customers: Number(cData.c5)
      }
    ];
  } else {
    // 12 months batch aggregation
    const buckets12 = getMonthBuckets(12, now);
    const endDates12 = buckets12.map((m) => m.endDate);

    const [p12Raw, c12Raw] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          w0: bigint; w1: bigint; w2: bigint; w3: bigint; w4: bigint; w5: bigint;
          w6: bigint; w7: bigint; w8: bigint; w9: bigint; w10: bigint; w11: bigint;
          s0: bigint; s1: bigint; s2: bigint; s3: bigint; s4: bigint; s5: bigint;
          s6: bigint; s7: bigint; s8: bigint; s9: bigint; s10: bigint; s11: bigint;
        }>
      >`
        SELECT
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[0]} THEN 1 END) as w0,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[1]} THEN 1 END) as w1,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[2]} THEN 1 END) as w2,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[3]} THEN 1 END) as w3,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[4]} THEN 1 END) as w4,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[5]} THEN 1 END) as w5,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[6]} THEN 1 END) as w6,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[7]} THEN 1 END) as w7,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[8]} THEN 1 END) as w8,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[9]} THEN 1 END) as w9,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[10]} THEN 1 END) as w10,
          COUNT(CASE WHEN "type" = 'WHOLESALER' AND "createdAt" <= ${endDates12[11]} THEN 1 END) as w11,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[0]} THEN 1 END) as s0,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[1]} THEN 1 END) as s1,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[2]} THEN 1 END) as s2,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[3]} THEN 1 END) as s3,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[4]} THEN 1 END) as s4,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[5]} THEN 1 END) as s5,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[6]} THEN 1 END) as s6,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[7]} THEN 1 END) as s7,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[8]} THEN 1 END) as s8,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[9]} THEN 1 END) as s9,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[10]} THEN 1 END) as s10,
          COUNT(CASE WHEN "type" = 'SUPPLIER' AND "createdAt" <= ${endDates12[11]} THEN 1 END) as s11
        FROM "Partner"
      `,
      prisma.$queryRaw<
        Array<{
          r0: bigint; r1: bigint; r2: bigint; r3: bigint; r4: bigint; r5: bigint;
          r6: bigint; r7: bigint; r8: bigint; r9: bigint; r10: bigint; r11: bigint;
          c0: bigint; c1: bigint; c2: bigint; c3: bigint; c4: bigint; c5: bigint;
          c6: bigint; c7: bigint; c8: bigint; c9: bigint; c10: bigint; c11: bigint;
        }>
      >`
        SELECT
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[0]} THEN 1 END) as r0,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[1]} THEN 1 END) as r1,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[2]} THEN 1 END) as r2,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[3]} THEN 1 END) as r3,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[4]} THEN 1 END) as r4,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[5]} THEN 1 END) as r5,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[6]} THEN 1 END) as r6,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[7]} THEN 1 END) as r7,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[8]} THEN 1 END) as r8,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[9]} THEN 1 END) as r9,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[10]} THEN 1 END) as r10,
          COUNT(CASE WHEN "customerType" = 'BUSINESS' AND "createdAt" <= ${endDates12[11]} THEN 1 END) as r11,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[0]} THEN 1 END) as c0,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[1]} THEN 1 END) as c1,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[2]} THEN 1 END) as c2,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[3]} THEN 1 END) as c3,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[4]} THEN 1 END) as c4,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[5]} THEN 1 END) as c5,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[6]} THEN 1 END) as c6,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[7]} THEN 1 END) as c7,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[8]} THEN 1 END) as c8,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[9]} THEN 1 END) as c9,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[10]} THEN 1 END) as c10,
          COUNT(CASE WHEN "customerType" = 'RETAIL' AND "createdAt" <= ${endDates12[11]} THEN 1 END) as c11
        FROM "Customer"
      `
    ]);

    const p12 = (p12Raw[0] as unknown as Record<string, bigint>) || {};
    const c12 = (c12Raw[0] as unknown as Record<string, bigint>) || {};

    growth = buckets12.map((bkt, idx) => ({
      month: bkt.label,
      Retailers: Number(c12[`r${idx}`] || 0n),
      Wholesalers: Number(p12[`w${idx}`] || 0n),
      Suppliers: Number(p12[`s${idx}`] || 0n),
      Customers: Number(c12[`c${idx}`] || 0n)
    }));
  }

  // 5. Insights - Deterministic Activity Health based on real DB values (no fake satisfaction score)
  const activityHealth = calculateActivityHealth(
    totalActivePartners,
    totalActivePartners + totalActiveRetailers,
    partnersWithRecentOrders
  );

  const insights: PartnerInsights = {
    activeRetailers: totalActiveRetailers,
    activeSuppliers: totalActiveSuppliers,
    newPartnersYtd: partnersYtd + retailersYtd,
    activityHealth,
    satisfactionScore: activityHealth, // alias
    retailersTrend: calculateGrowthPercentage(
      currentRetailersCreated,
      previousRetailersCreated
    ),
    suppliersTrend: calculateGrowthPercentage(
      currentSuppliersCreated,
      previousSuppliersCreated
    ),
    newPartnersTrend: calculateGrowthPercentage(
      currentPartnersCreated,
      previousPartnersCreated
    ),
    activityHealthTrend: null, // Per requirement 11: no hardcoded satisfaction trend!
    satisfactionTrend: null // alias
  };

  // 6. Onboarding - Transparent definition (records added this year vs eligible population)
  const eligibleOnboarding = totalActivePartners + totalActiveRetailers + totalActiveEndCustomers;
  const onboardedThisYear = partnersYtd + retailersYtd + customersYtd;
  const onboardingPercentage = calculateOnboardingPercentage(
    onboardedThisYear,
    eligibleOnboarding
  );
  const onboarding: PartnerOnboardingMetric = {
    onboarded: onboardedThisYear,
    eligible: eligibleOnboarding,
    percentage: onboardingPercentage
  };

  // 7. Top Partners (By Purchase Value)
  // Strictly calculated from SUM(PurchaseOrder.total).
  // Per requirement 7: NEVER fallback to creditLimit. If only 3 have orders, return 3.
  const topPurchaseGroups = await prisma.purchaseOrder.groupBy({
    by: ["partnerId"],
    _sum: {
      total: true
    },
    orderBy: {
      _sum: {
        total: "desc"
      }
    },
    take: 5
  });

  const topPartnerIds = topPurchaseGroups.map((g) => g.partnerId);
  const topPartnerRecords = await prisma.partner.findMany({
    where: { id: { in: topPartnerIds } },
    select: { id: true, name: true, type: true }
  });
  const partnerMap = new Map(topPartnerRecords.map((p) => [p.id, p]));

  const topPartners: TopPartnerItem[] = topPurchaseGroups
    .map((g, idx): TopPartnerItem | null => {
      const p = partnerMap.get(g.partnerId);
      if (!p) return null;
      return {
        rank: idx + 1,
        id: p.id,
        name: p.name,
        type: formatPartnerType(p.type, "partner"),
        totalValue: g._sum.total ? Number(g._sum.total) : 0,
        entity: "partner"
      };
    })
    .filter((item): item is TopPartnerItem => item !== null);

  // 8. Filter Options
  const filterOptions: PartnersFilterOptions = {
    types: [
      "All Types",
      "Wholesaler",
      "Retailer",
      "Supplier",
      "Distributor",
      "Vendor",
      "Customer"
    ],
    regions: allRegions.map((r) => ({ id: r.id, name: r.name })),
    statuses: ["All Status", "Active", "Inactive"]
  };

  // 9. Partner / Customer List with Tab, Search, Type, Region, Status, and Pagination
  const shouldIncludePartners =
    tab === "overview" ||
    tab === "wholesalers-retailers" ||
    tab === "suppliers" ||
    tab === "performance";

  const shouldIncludeCustomers =
    tab === "overview" ||
    tab === "wholesalers-retailers" ||
    tab === "customers" ||
    tab === "performance";

  // Build Partner Where
  const partnerWhere: Prisma.PartnerWhereInput = {};
  if (status !== "ALL") {
    partnerWhere.status = status as "ACTIVE" | "INACTIVE";
  }
  if (tab === "suppliers") {
    partnerWhere.type = "SUPPLIER";
  } else if (tab === "wholesalers-retailers") {
    partnerWhere.type = "WHOLESALER";
  }

  if (type && type !== "ALL" && type !== "All Types") {
    const t = type.toUpperCase();
    if (t === "SUPPLIER" || t === "WHOLESALER" || t === "DISTRIBUTOR" || t === "VENDOR") {
      partnerWhere.type = t;
    } else if (t === "RETAILER" || t === "CUSTOMER") {
      partnerWhere.id = "NONE";
    }
  }

  if (search && search.trim()) {
    const q = search.trim();
    partnerWhere.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { taxId: { contains: q, mode: "insensitive" } },
      { contactPerson: { contains: q, mode: "insensitive" } }
    ];
  }

  // Region filter: Partner -> PurchaseOrder -> Store -> Region
  if (regionId && regionId !== "ALL") {
    partnerWhere.purchaseOrders = {
      some: {
        store: {
          regionId: regionId
        }
      }
    };
  }

  // Build Customer Where
  const customerWhere: Prisma.CustomerWhereInput = {};
  if (status !== "ALL") {
    customerWhere.status = status as "ACTIVE" | "INACTIVE";
  }
  if (tab === "suppliers") {
    customerWhere.id = "NONE";
  } else if (tab === "wholesalers-retailers") {
    customerWhere.customerType = "BUSINESS"; // Retailer
  } else if (tab === "customers") {
    // all customer records
  }

  if (type && type !== "ALL" && type !== "All Types") {
    const t = type.toUpperCase();
    if (t === "RETAILER" || t === "BUSINESS") {
      customerWhere.customerType = "BUSINESS";
    } else if (t === "CUSTOMER" || t === "RETAIL") {
      customerWhere.customerType = "RETAIL";
    } else if (["SUPPLIER", "WHOLESALER", "DISTRIBUTOR", "VENDOR"].includes(t)) {
      customerWhere.id = "NONE";
    }
  }

  if (search && search.trim()) {
    const q = search.trim();
    customerWhere.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { contactPerson: { contains: q, mode: "insensitive" } }
    ];
  }

  // Region filter: Customer -> SalesOrder -> Store -> Region
  if (regionId && regionId !== "ALL") {
    customerWhere.salesOrders = {
      some: {
        store: {
          regionId: regionId
        }
      }
    };
  }

  // Query partners and customers with relation-scoped counts & latest orders
  const isRegionActive = Boolean(regionId && regionId !== "ALL");

  const [partnersList, customersList] = await Promise.all([
    shouldIncludePartners
      ? prisma.partner.findMany({
          where: partnerWhere,
          include: {
            purchaseOrders: {
              where: isRegionActive ? { store: { regionId } } : undefined,
              take: 1,
              orderBy: { createdAt: "desc" },
              include: {
                store: {
                  include: {
                    region: true
                  }
                }
              }
            },
            _count: {
              select: {
                purchaseOrders: isRegionActive ? { where: { store: { regionId } } } : true
              }
            }
          }
        })
      : [],
    shouldIncludeCustomers
      ? prisma.customer.findMany({
          where: customerWhere,
          include: {
            salesOrders: {
              where: isRegionActive ? { store: { regionId } } : undefined,
              take: 1,
              orderBy: { createdAt: "desc" },
              include: {
                store: {
                  include: {
                    region: true
                  }
                }
              }
            },
            _count: {
              select: {
                salesOrders: isRegionActive ? { where: { store: { regionId } } } : true
              }
            }
          }
        })
      : []
  ]);

  // Aggregate financial values strictly scoped to the region filter if active
  const partnerIds = partnersList.map((p) => p.id);
  const customerIds = customersList.map((c) => c.id);

  const poWhere: Prisma.PurchaseOrderWhereInput = {
    partnerId: { in: partnerIds }
  };
  if (isRegionActive && regionId) {
    poWhere.store = { regionId };
  }

  const soWhere: Prisma.SalesOrderWhereInput = {
    customerId: { in: customerIds }
  };
  if (isRegionActive && regionId) {
    soWhere.store = { regionId };
  }

  const [partnerOrderSums, customerOrderSums] = await Promise.all([
    partnerIds.length > 0
      ? prisma.purchaseOrder.groupBy({
          by: ["partnerId"],
          where: poWhere,
          _sum: { total: true }
        })
      : [],
    customerIds.length > 0
      ? prisma.salesOrder.groupBy({
          by: ["customerId"],
          where: soWhere,
          _sum: { total: true }
        })
      : []
  ]);

  const partnerSumMap = new Map(
    partnerOrderSums.map((s) => [s.partnerId, s._sum.total ? Number(s._sum.total) : 0])
  );
  const customerSumMap = new Map(
    customerOrderSums.map((s) => [
      s.customerId || "",
      s._sum.total ? Number(s._sum.total) : 0
    ])
  );

  // Map to unified PartnerListItem without fabricated fallbacks
  const allItems: PartnerListItem[] = [];

  for (const p of partnersList) {
    const latestPo = p.purchaseOrders[0];
    const totalVal = partnerSumMap.get(p.id) || 0;
    // Per requirement 9: Relation-derived region or "National" (never address.split)
    const regionName = latestPo?.store?.region?.name || "National";
    const regId = latestPo?.store?.regionId || null;

    allItems.push({
      id: p.id,
      name: p.name,
      type: formatPartnerType(p.type, "partner"),
      rawType: p.type,
      entity: "partner",
      region: regionName,
      regionId: regId,
      // Per requirement 6: No fabricated contact person ("Operations Lead" etc)
      contactPerson: p.contactPerson || null,
      email: p.email,
      phone: p.phone,
      status: p.status,
      lastOrderDate: latestPo ? latestPo.createdAt.toISOString() : null,
      totalValue: totalVal,
      orderCount: p._count.purchaseOrders,
      creditLimit: Number(p.creditLimit) || 0,
      address: p.address
    });
  }

  for (const c of customersList) {
    const latestSo = c.salesOrders[0];
    const totalVal = customerSumMap.get(c.id) || 0;
    // Per requirement 9: Relation-derived region or "National"
    const regionName = latestSo?.store?.region?.name || "National";
    const regId = latestSo?.store?.regionId || null;

    allItems.push({
      id: c.id,
      name: c.name,
      type: formatPartnerType(c.customerType, "customer"),
      rawType: c.customerType,
      entity: "customer",
      region: regionName,
      regionId: regId,
      // Per requirement 6: No fabricated contact person
      contactPerson: c.contactPerson || null,
      email: c.email,
      phone: c.phone,
      status: c.status,
      lastOrderDate: latestSo ? latestSo.createdAt.toISOString() : null,
      totalValue: totalVal,
      orderCount: c._count.salesOrders,
      creditLimit: Number(c.creditLimit) || 0,
      address: c.address
    });
  }

  // Sort items
  if (tab === "performance") {
    allItems.sort((a, b) => b.totalValue - a.totalValue);
  } else {
    allItems.sort((a, b) => {
      if (b.totalValue !== a.totalValue) {
        return b.totalValue - a.totalValue;
      }
      if (b.orderCount !== a.orderCount) {
        return b.orderCount - a.orderCount;
      }
      return a.name.localeCompare(b.name);
    });
  }

  const total = allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedItems = allItems.slice(startIndex, startIndex + pageSize);

  return {
    summary,
    distribution,
    growth,
    insights,
    list: {
      items: paginatedItems,
      pagination: {
        page: validPage,
        pageSize,
        total,
        totalPages
      }
    },
    topPartners,
    onboarding,
    filterOptions
  };
}

export async function getPartnerById(id: string): Promise<PartnerDetailData> {
  // First look in Partner
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: {
      purchaseOrders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          store: {
            include: {
              region: true
            }
          }
        }
      },
      _count: {
        select: { purchaseOrders: true }
      }
    }
  });

  if (partner) {
    const poSum = await prisma.purchaseOrder.aggregate({
      where: { partnerId: partner.id },
      _sum: { total: true }
    });
    const totalVal = poSum._sum.total ? Number(poSum._sum.total) : 0;
    const orderCount = partner._count.purchaseOrders;
    const avgOrderVal = orderCount > 0 ? Math.round(totalVal / orderCount) : 0;
    const latestPo = partner.purchaseOrders[0];

    return {
      id: partner.id,
      name: partner.name,
      type: formatPartnerType(partner.type, "partner"),
      rawType: partner.type,
      entity: "partner",
      contactPerson: partner.contactPerson || null,
      email: partner.email,
      phone: partner.phone,
      address: partner.address,
      taxId: partner.taxId,
      creditLimit: Number(partner.creditLimit) || 0,
      status: partner.status,
      region: latestPo?.store?.region?.name || "National",
      latestStoreName: latestPo?.store?.name || null,
      orderCount,
      totalValue: totalVal,
      averageOrderValue: avgOrderVal,
      lastOrderDate: latestPo ? latestPo.createdAt.toISOString() : null,
      recentOrders: partner.purchaseOrders.map((po) => ({
        id: po.id,
        orderNumber: po.orderNumber,
        date: po.createdAt.toISOString(),
        total: Number(po.total) || 0,
        status: po.status,
        storeName: po.store.name
      }))
    };
  }

  // Otherwise check in Customer
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      salesOrders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          store: {
            include: {
              region: true
            }
          }
        }
      },
      _count: {
        select: { salesOrders: true }
      }
    }
  });

  if (customer) {
    const soSum = await prisma.salesOrder.aggregate({
      where: { customerId: customer.id },
      _sum: { total: true }
    });
    const totalVal = soSum._sum.total ? Number(soSum._sum.total) : 0;
    const orderCount = customer._count.salesOrders;
    const avgOrderVal = orderCount > 0 ? Math.round(totalVal / orderCount) : 0;
    const latestSo = customer.salesOrders[0];

    return {
      id: customer.id,
      name: customer.name,
      type: formatPartnerType(customer.customerType, "customer"),
      rawType: customer.customerType,
      entity: "customer",
      contactPerson: customer.contactPerson || null,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      creditLimit: Number(customer.creditLimit) || 0,
      status: customer.status,
      region: latestSo?.store?.region?.name || "National",
      latestStoreName: latestSo?.store?.name || null,
      orderCount,
      totalValue: totalVal,
      averageOrderValue: avgOrderVal,
      lastOrderDate: latestSo ? latestSo.createdAt.toISOString() : null,
      recentOrders: customer.salesOrders.map((so) => ({
        id: so.id,
        orderNumber: so.orderNumber,
        date: so.createdAt.toISOString(),
        total: Number(so.total) || 0,
        status: so.status,
        storeName: so.store.name
      }))
    };
  }

  throw new AppError(`Partner or Customer with ID "${id}" not found`, 404, "NOT_FOUND");
}

export async function createPartner(input: CreatePartnerInput) {
  const organizationId = await getDemoOrganizationId();
  const partner = await prisma.partner.create({
    data: {
      organizationId,
      name: input.name,
      type: input.type,
      contactPerson: input.contactPerson || null,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      taxId: input.taxId || null,
      creditLimit: new Prisma.Decimal(input.creditLimit || 0),
      status: "ACTIVE"
    }
  });
  return partner;
}

export async function exportPartnersCsv(
  params: PartnersExportQueryParams
): Promise<string> {
  const overview = await getPartnersOverview({
    ...params,
    page: 1,
    pageSize: 1000, // Full filtered dataset export
    period: "6m"
  });

  const headers = [
    "ID",
    "Name",
    "Type",
    "Entity",
    "Region",
    "Contact Person",
    "Email",
    "Phone",
    "Status",
    "Last Order Date",
    "Total Value",
    "Order Count",
    "Credit Limit",
    "Address"
  ];

  const escapeCsv = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = overview.list.items.map((item) => [
    escapeCsv(item.id),
    escapeCsv(item.name),
    escapeCsv(item.type),
    escapeCsv(item.entity),
    escapeCsv(item.region),
    escapeCsv(item.contactPerson || "—"),
    escapeCsv(item.email || "—"),
    escapeCsv(item.phone || "—"),
    escapeCsv(item.status),
    escapeCsv(item.lastOrderDate ? item.lastOrderDate.slice(0, 10) : "No orders"),
    escapeCsv(item.totalValue),
    escapeCsv(item.orderCount),
    escapeCsv(item.creditLimit),
    escapeCsv(item.address || "—")
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
