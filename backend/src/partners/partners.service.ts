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
  PartnerDetailData
} from "./partners.types.js";
import { PartnersOverviewQueryParams } from "./partners.schemas.js";
import {
  calculateGrowthPercentage,
  calculateSatisfactionScore,
  calculateOnboardingPercentage,
  formatPartnerType,
  getMonthBuckets
} from "./partners.helpers.js";

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

  // 1. Parallel Aggregations for Summary, Distribution, Insights, Onboarding, Filter Options
  const [
    totalActivePartners,
    totalActiveSuppliers,
    totalActiveWholesalers,
    totalActiveDistributors,
    totalActiveVendors,
    totalActiveRetailers,
    totalActiveEndCustomers,
    // Previous periods for 30-day growth trends
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
    // Order activity for satisfaction score
    partnersWithRecentOrders,
    allRegions
  ] = await Promise.all([
    // Active counts
    prisma.partner.count({ where: { status: "ACTIVE" } }),
    prisma.partner.count({ where: { type: "SUPPLIER", status: "ACTIVE" } }),
    prisma.partner.count({ where: { type: "WHOLESALER", status: "ACTIVE" } }),
    prisma.partner.count({ where: { type: "DISTRIBUTOR", status: "ACTIVE" } }),
    prisma.partner.count({ where: { type: "VENDOR", status: "ACTIVE" } }),
    prisma.customer.count({ where: { customerType: "BUSINESS", status: "ACTIVE" } }),
    prisma.customer.count({ where: { customerType: "RETAIL", status: "ACTIVE" } }),

    // Trend counts
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

    // YTD
    prisma.partner.count({ where: { createdAt: { gte: ytdStart } } }),
    prisma.customer.count({
      where: { customerType: "BUSINESS", createdAt: { gte: ytdStart } }
    }),
    prisma.customer.count({
      where: { customerType: "RETAIL", createdAt: { gte: ytdStart } }
    }),

    // Recent orders check (within 90 days)
    prisma.partner.count({
      where: {
        purchaseOrders: {
          some: {
            createdAt: { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
          }
        }
      }
    }),

    // Regions for filters
    prisma.region.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  // 2. Sparklines (6 months history)
  const monthBuckets = getMonthBuckets(6, now);
  const sparklinePromises = monthBuckets.map(async (bucket) => {
    const [pCount, rCount, sCount, cCount] = await Promise.all([
      prisma.partner.count({ where: { createdAt: { lte: bucket.endDate } } }),
      prisma.customer.count({
        where: { customerType: "BUSINESS", createdAt: { lte: bucket.endDate } }
      }),
      prisma.partner.count({
        where: { type: "SUPPLIER", createdAt: { lte: bucket.endDate } }
      }),
      prisma.customer.count({
        where: { customerType: "RETAIL", createdAt: { lte: bucket.endDate } }
      })
    ]);
    return {
      label: bucket.label,
      totalPartners: pCount,
      retailers: rCount,
      suppliers: sCount,
      endCustomers: cCount
    };
  });
  const sparklineResults = await Promise.all(sparklinePromises);

  const totalPartnersSparkline = sparklineResults.map((r) => ({
    label: r.label,
    value: r.totalPartners
  }));
  const retailersSparkline = sparklineResults.map((r) => ({
    label: r.label,
    value: r.retailers
  }));
  const suppliersSparkline = sparklineResults.map((r) => ({
    label: r.label,
    value: r.suppliers
  }));
  const endCustomersSparkline = sparklineResults.map((r) => ({
    label: r.label,
    value: r.endCustomers
  }));

  // Summary object
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
      color: "#0071DC" // Walmart primary blue
    },
    {
      name: "Wholesalers",
      value: totalActiveWholesalers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveWholesalers / distributionTotal) * 100)
          : 0,
      color: "#10B981" // Emerald green
    },
    {
      name: "Suppliers",
      value: totalActiveSuppliers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveSuppliers / distributionTotal) * 100)
          : 0,
      color: "#8B5CF6" // Purple
    },
    {
      name: "End Customers",
      value: totalActiveEndCustomers,
      percentage:
        distributionTotal > 0
          ? Math.round((totalActiveEndCustomers / distributionTotal) * 100)
          : 0,
      color: "#F59E0B" // Amber
    }
  ];

  // 4. Growth Multi-line Chart (6m or 12m)
  const growthBucketCount = period === "12m" ? 12 : 6;
  const growthBuckets = getMonthBuckets(growthBucketCount, now);
  const growthPromises = growthBuckets.map(async (b) => {
    const [retCount, whoCount, supCount, cusCount] = await Promise.all([
      prisma.customer.count({
        where: { customerType: "BUSINESS", createdAt: { lte: b.endDate } }
      }),
      prisma.partner.count({
        where: { type: "WHOLESALER", createdAt: { lte: b.endDate } }
      }),
      prisma.partner.count({
        where: { type: "SUPPLIER", createdAt: { lte: b.endDate } }
      }),
      prisma.customer.count({
        where: { customerType: "RETAIL", createdAt: { lte: b.endDate } }
      })
    ]);
    return {
      month: b.label,
      Retailers: retCount,
      Wholesalers: whoCount,
      Suppliers: supCount,
      Customers: cusCount
    };
  });
  const growth: PartnerGrowthPoint[] = await Promise.all(growthPromises);

  // 5. Insights
  const satisfactionScore = calculateSatisfactionScore(
    totalActivePartners,
    totalActivePartners + 2,
    partnersWithRecentOrders
  );
  const insights: PartnerInsights = {
    activeRetailers: totalActiveRetailers,
    activeSuppliers: totalActiveSuppliers,
    newPartnersYtd: partnersYtd + retailersYtd,
    satisfactionScore,
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
    satisfactionTrend: 2
  };

  // 6. Onboarding
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
    .map((g, idx) => {
      const p = partnerMap.get(g.partnerId);
      if (!p) return null;
      return {
        rank: idx + 1,
        id: p.id,
        name: p.name,
        type: formatPartnerType(p.type, "partner"),
        totalValue: g._sum.total ? Number(g._sum.total) : 0,
        entity: "partner" as const
      };
    })
    .filter((item): item is TopPartnerItem => item !== null);

  // If fewer than 5 top partners from orders, fill with active partners by credit limit
  if (topPartners.length < 5) {
    const existingIds = topPartners.map((tp) => tp.id);
    const fillers = await prisma.partner.findMany({
      where: { id: { notIn: existingIds }, status: "ACTIVE" },
      orderBy: { creditLimit: "desc" },
      take: 5 - topPartners.length,
      select: { id: true, name: true, type: true, creditLimit: true }
    });
    fillers.forEach((f) => {
      topPartners.push({
        rank: topPartners.length + 1,
        id: f.id,
        name: f.name,
        type: formatPartnerType(f.type, "partner"),
        totalValue: Number(f.creditLimit) || 0,
        entity: "partner"
      });
    });
  }

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
  // Determine which entities to query based on tab and type
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
      // Type is customer-only, so partner where shouldn't match
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
    customerWhere.id = "NONE"; // no customers in suppliers tab
  } else if (tab === "wholesalers-retailers") {
    customerWhere.customerType = "BUSINESS"; // business customers are retailers
  } else if (tab === "customers") {
    // all customers allowed
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

  if (regionId && regionId !== "ALL") {
    customerWhere.salesOrders = {
      some: {
        store: {
          regionId: regionId
        }
      }
    };
  }

  // Fetch partners and customers concurrently with their latest orders and aggregates
  const [partnersList, customersList] = await Promise.all([
    shouldIncludePartners
      ? prisma.partner.findMany({
          where: partnerWhere,
          include: {
            purchaseOrders: {
              where: regionId && regionId !== "ALL" ? { store: { regionId } } : undefined,
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
              select: { purchaseOrders: true }
            }
          }
        })
      : [],
    shouldIncludeCustomers
      ? prisma.customer.findMany({
          where: customerWhere,
          include: {
            salesOrders: {
              where: regionId && regionId !== "ALL" ? { store: { regionId } } : undefined,
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
              select: { salesOrders: true }
            }
          }
        })
      : []
  ]);

  // Aggregate financial values for partners (sum of PO totals) and customers (sum of SO totals)
  const partnerIds = partnersList.map((p) => p.id);
  const customerIds = customersList.map((c) => c.id);

  const [partnerOrderSums, customerOrderSums] = await Promise.all([
    partnerIds.length > 0
      ? prisma.purchaseOrder.groupBy({
          by: ["partnerId"],
          where: { partnerId: { in: partnerIds } },
          _sum: { total: true }
        })
      : [],
    customerIds.length > 0
      ? prisma.salesOrder.groupBy({
          by: ["customerId"],
          where: { customerId: { in: customerIds } },
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

  // Map to unified PartnerListItem
  const allItems: PartnerListItem[] = [];

  for (const p of partnersList) {
    const latestPo = p.purchaseOrders[0];
    const totalVal = partnerSumMap.get(p.id) || 0;
    const regionName = latestPo?.store?.region?.name || (p.address ? p.address.split(",").pop()?.trim() || "National" : "National");
    const regId = latestPo?.store?.regionId || null;

    allItems.push({
      id: p.id,
      name: p.name,
      type: formatPartnerType(p.type, "partner"),
      rawType: p.type,
      entity: "partner",
      region: regionName,
      regionId: regId,
      contactPerson: p.contactPerson || "Operations Lead",
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
    const regionName = latestSo?.store?.region?.name || (c.address ? c.address.split(",").pop()?.trim() || "National" : "National");
    const regId = latestSo?.store?.regionId || null;

    allItems.push({
      id: c.id,
      name: c.name,
      type: formatPartnerType(c.customerType, "customer"),
      rawType: c.customerType,
      entity: "customer",
      region: regionName,
      regionId: regId,
      contactPerson: c.contactPerson || (c.customerType === "RETAIL" ? c.name : "Procurement Officer"),
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
    // In performance tab, sort by totalValue descending
    allItems.sort((a, b) => b.totalValue - a.totalValue);
  } else {
    // Primary overview sorting: by totalValue desc, then orderCount desc, then name asc
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
      contactPerson: partner.contactPerson || "Operations Lead",
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
      contactPerson: customer.contactPerson || (customer.customerType === "RETAIL" ? customer.name : "Accounts Manager"),
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
