// =============================================================================
// Walmart Global Enterprise — 12-Month Multi-Country Seed System (USD)
// Covers 10 Top Countries, 120 Stores, 90 Products, 30 Global Partners,
// 150 Customers, 2,400+ Sales Orders, and 100% Balanced Double-Entry General Ledger.
// =============================================================================

import { PrismaClient, Prisma } from "@prisma/client";
import {
  ORG_ID, ORG, ADMIN_USER_ID, ADMIN_ROLE_ID,
  REGIONS, STORES, CATEGORIES, ACCOUNTS,
} from "./demo/constants.js";
import { PRODUCTS } from "./demo/data.js";
import {
  money, pastDate, createRef, calcTax,
  calcSalesLineTotal, calcPurchaseLineTotal, pick, seedId,
} from "./demo/helpers.js";

const prisma = new PrismaClient();
const D = (v: string | number) => new Prisma.Decimal(String(v));

// ─── Store distribution helper ──────────────────────────────────────────────
const STORE_IDS = STORES.map((s) => s.id);
function storesFor(dist: string): string[] {
  switch (dist) {
    case "all": return [...STORE_IDS];
    case "most": return STORE_IDS.slice(0, 90);
    case "some": return STORE_IDS.slice(0, 60);
    case "few": return STORE_IDS.slice(0, 30);
    default: return [...STORE_IDS];
  }
}

// ─── Counters for logging ───────────────────────────────────────────────────
const counts: Record<string, number> = {};
function count(model: string, n: number) { counts[model] = (counts[model] || 0) + n; }

// Helper for chunked promise execution to keep performance fast
async function inChunks<T>(items: T[], chunkSize: number, fn: (item: T, index: number) => Promise<any>) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await Promise.all(chunk.map((item, idx) => fn(item, i + idx)));
  }
}

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================
async function main() {
  console.log("🌱 Starting Walmart Global Enterprise Seed (10 Countries, 120 Stores, USD)...\n");

  // ── 0. Clean Existing Dynamic Transaction Data ─────────────────────────────
  console.log("🧹 Clearing dynamic transactional tables...");
  try {
    await prisma.auditLog.deleteMany({});
    await prisma.journalLine.deleteMany({});
    await prisma.journalEntry.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.salesOrderItem.deleteMany({});
    await prisma.salesOrder.deleteMany({});
    await prisma.purchaseOrderItem.deleteMany({});
    await prisma.purchaseOrder.deleteMany({});
    await prisma.inventoryMovement.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.partner.deleteMany({});
    console.log("✅ Cleared legacy dynamic records.");
  } catch (err) {
    console.warn("Notice during cleanup:", (err as Error).message);
  }

  // ── 1. Organization ────────────────────────────────────────────────────────
  await prisma.organization.upsert({
    where: { id: ORG.id },
    update: {
      name: ORG.name,
      code: ORG.code,
      currency: "USD",
      timezone: "America/New_York",
    },
    create: {
      id: ORG.id,
      name: ORG.name,
      code: ORG.code,
      currency: "USD",
      timezone: "America/New_York",
    },
  });
  count("Organization", 1);
  console.log("✅ Organization (Walmart Global Enterprise - USD / America/New_York)");

  // ── 1b. Role + User (Admin and Store Managers) ──────────────────────────────
  await prisma.role.upsert({
    where: { id: ADMIN_ROLE_ID },
    update: { name: "Super Admin", description: "Full enterprise administrative access" },
    create: { id: ADMIN_ROLE_ID, name: "Super Admin", description: "Full enterprise administrative access" },
  });
  count("Role", 1);

  await prisma.user.upsert({
    where: { id: ADMIN_USER_ID },
    update: {
      name: "Global Admin",
      email: "admin@walmart.com",
      phone: "+1 800 925 6278",
      roleId: ADMIN_ROLE_ID,
      status: "ACTIVE",
    },
    create: {
      id: ADMIN_USER_ID,
      organizationId: ORG_ID,
      roleId: ADMIN_ROLE_ID,
      name: "Global Admin",
      email: "admin@walmart.com",
      phone: "+1 800 925 6278",
      passwordHash: "DEMO_NOT_A_REAL_HASH",
      status: "ACTIVE",
    },
  });
  count("User", 1);

  // Ensure Stavan Sheth exists as Super Admin
  await prisma.user.upsert({
    where: { organizationId_email: { organizationId: ORG_ID, email: "stavan@walmart.com" } },
    update: {
      name: "Stavan Sheth",
      phone: "+1 479 273 4000",
      roleId: ADMIN_ROLE_ID,
      status: "ACTIVE",
    },
    create: {
      organizationId: ORG_ID,
      roleId: ADMIN_ROLE_ID,
      name: "Stavan Sheth",
      email: "stavan@walmart.com",
      phone: "+1 479 273 4000",
      passwordHash: "DEMO_NOT_A_REAL_HASH",
      status: "ACTIVE",
    },
  });
  count("User", 1);

  // Create store manager accounts
  const managerRole = await prisma.role.upsert({
    where: { name: "Store Manager" },
    update: {},
    create: { name: "Store Manager", description: "Store operations management" },
  });

  const managerUsers = STORES.map((s, idx) => ({
    id: `user-mgr-${s.code.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    organizationId: ORG_ID,
    roleId: managerRole.id,
    name: `${s.city} Store Manager`,
    email: `manager.${s.code.toLowerCase()}@walmart.com`,
    phone: s.phone,
    passwordHash: "DEMO_HASH",
    status: "ACTIVE" as const,
  }));

  await inChunks(managerUsers, 30, async (u) => {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { name: u.name, email: u.email, phone: u.phone },
      create: u,
    });
  });
  count("User", managerUsers.length);
  console.log(`✅ Roles and Users (Admin & ${managerUsers.length} Store Managers)`);

  // ── 2. Regions ────────────────────────────────────────────────────────────
  for (const r of REGIONS) {
    await prisma.region.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: r.code } },
      update: { name: r.name },
      create: { id: r.id, organizationId: ORG_ID, name: r.name, code: r.code, status: "ACTIVE" },
    });
  }
  count("Region", REGIONS.length);
  console.log("✅ Regions (10 Top Global Markets)");

  // ── 3. Stores ─────────────────────────────────────────────────────────────
  await inChunks(STORES, 25, async (s) => {
    const mgrId = `user-mgr-${s.code.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    await prisma.store.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: s.code } },
      update: {
        name: s.name,
        address: s.address,
        city: s.city,
        state: s.state,
        country: s.country,
        pincode: s.pincode,
        phone: s.phone,
        email: s.email,
        image: s.image,
        latitude: s.latitude != null ? D(s.latitude) : null,
        longitude: s.longitude != null ? D(s.longitude) : null,
        status: s.status,
        managerId: mgrId,
      },
      create: {
        id: s.id,
        organizationId: ORG_ID,
        regionId: s.regionId,
        name: s.name,
        code: s.code,
        address: s.address,
        city: s.city,
        state: s.state,
        country: s.country,
        pincode: s.pincode,
        phone: s.phone,
        email: s.email,
        image: s.image,
        status: s.status,
        managerId: mgrId,
        latitude: s.latitude != null ? D(s.latitude) : null,
        longitude: s.longitude != null ? D(s.longitude) : null,
      },
    });
  });
  count("Store", STORES.length);
  console.log(`✅ Stores (${STORES.length} Outlets across 10 Countries)`);

  // ── 4. Categories ─────────────────────────────────────────────────────────
  const parents = CATEGORIES.filter((c) => !c.parentId);
  const children = CATEGORIES.filter((c) => c.parentId);
  for (const c of [...parents, ...children]) {
    await prisma.category.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: c.code } },
      update: { name: c.name },
      create: {
        id: c.id,
        organizationId: ORG_ID,
        parentId: c.parentId,
        name: c.name,
        code: c.code,
        status: "ACTIVE",
      },
    });
  }
  count("Category", CATEGORIES.length);
  console.log("✅ Categories (20 Retail Hierarchies)");

  // ── 5. Products ───────────────────────────────────────────────────────────
  await inChunks(PRODUCTS, 30, async (p) => {
    await prisma.product.upsert({
      where: { organizationId_sku: { organizationId: ORG_ID, sku: p.sku } },
      update: {
        name: p.name,
        costPrice: D(p.costPrice),
        sellingPrice: D(p.sellingPrice),
        taxRate: D(p.taxRate),
        reorderLevel: p.reorderLevel,
      },
      create: {
        id: p.id,
        organizationId: ORG_ID,
        categoryId: p.categoryId,
        sku: p.sku,
        barcode: p.barcode,
        name: p.name,
        unit: p.unit,
        costPrice: D(p.costPrice),
        sellingPrice: D(p.sellingPrice),
        taxRate: D(p.taxRate),
        reorderLevel: p.reorderLevel,
        status: "ACTIVE",
      },
    });
  });
  count("Product", PRODUCTS.length);
  console.log(`✅ Products (${PRODUCTS.length} Global SKU Catalog in USD)`);

  // ── 6. Partners (Suppliers across 10 Countries) ───────────────────────────
  const PARTNERS_DATA = [
    // USA
    { id: "partner-0001", name: "Procter & Gamble Co.", type: "SUPPLIER" as const, contactPerson: "Jon R. Moeller", phone: "+1 513 983 1100", email: "procurement@pg.com", address: "1 P&G Plaza, Cincinnati, OH, United States", taxId: "US310418810", creditLimit: 2500000, daysAgo: 360 },
    { id: "partner-0002", name: "Tyson Foods Fresh Logistics", type: "SUPPLIER" as const, contactPerson: "Donnie King", phone: "+1 479 290 4000", email: "sales@tyson.com", address: "2200 W Don Tyson Pkwy, Springdale, AR, United States", taxId: "US710225165", creditLimit: 1800000, daysAgo: 355 },
    { id: "partner-0003", name: "General Mills Wholesale Hub", type: "WHOLESALER" as const, contactPerson: "Jeff Harmening", phone: "+1 763 764 7600", email: "orders@genmills.com", address: "1 General Mills Blvd, Minneapolis, MN, United States", taxId: "US410274440", creditLimit: 1500000, daysAgo: 350 },
    { id: "partner-0004", name: "Kraft Heinz Distribution", type: "DISTRIBUTOR" as const, contactPerson: "Carlos Abrams", phone: "+1 847 646 2000", email: "supply@kraftheinz.com", address: "200 E Randolph St, Chicago, IL, United States", taxId: "US252160970", creditLimit: 2000000, daysAgo: 345 },
    // Canada
    { id: "partner-0005", name: "Maple Leaf Foods Inc.", type: "SUPPLIER" as const, contactPerson: "Curtis Frank", phone: "+1 905 285 5777", email: "orders@mapleleaf.com", address: "6985 Financial Dr, Mississauga, ON, Canada", taxId: "CA103498877", creditLimit: 1200000, daysAgo: 340 },
    { id: "partner-0006", name: "Saputo Dairy Global Hub", type: "WHOLESALER" as const, contactPerson: "Lino Saputo", phone: "+1 514 328 6662", email: "sales@saputo.com", address: "6869 Metropolitain Blvd E, Montreal, QC, Canada", taxId: "CA132456789", creditLimit: 1100000, daysAgo: 335 },
    // UK
    { id: "partner-0007", name: "Unilever UK Trade Corp", type: "SUPPLIER" as const, contactPerson: "Hein Schumacher", phone: "+44 20 7822 5252", email: "uktrade@unilever.com", address: "100 Victoria Embankment, London, United Kingdom", taxId: "GB242456780", creditLimit: 2200000, daysAgo: 330 },
    { id: "partner-0008", name: "Associated British Foods", type: "WHOLESALER" as const, contactPerson: "George Weston", phone: "+44 20 7399 6500", email: "b2b@abfoods.com", address: "Weston Centre, 10 Grosvenor St, London, United Kingdom", taxId: "GB293847162", creditLimit: 1400000, daysAgo: 325 },
    // Germany
    { id: "partner-0009", name: "Henkel Consumer Goods AG", type: "SUPPLIER" as const, contactPerson: "Carsten Knobel", phone: "+49 211 7970", email: "supply@henkel.de", address: "Henkelstrasse 67, Dusseldorf, Germany", taxId: "DE119427042", creditLimit: 1600000, daysAgo: 320 },
    { id: "partner-0010", name: "Dr. Oetker Food Logistics", type: "DISTRIBUTOR" as const, contactPerson: "Albert Christmann", phone: "+49 521 1550", email: "logistics@oetker.de", address: "Lutterstrasse 14, Bielefeld, Germany", taxId: "DE126953401", creditLimit: 1300000, daysAgo: 315 },
    // Japan
    { id: "partner-0011", name: "Ajinomoto Global Supplies", type: "SUPPLIER" as const, contactPerson: "Taro Fujie", phone: "+81 3 5250 8111", email: "global@ajinomoto.com", address: "1-15-1 Kyobashi, Chuo-ku, Tokyo, Japan", taxId: "JP1010001008770", creditLimit: 1900000, daysAgo: 310 },
    { id: "partner-0012", name: "Nissin Foods Holdings Hub", type: "WHOLESALER" as const, contactPerson: "Koki Ando", phone: "+81 3 3205 5111", email: "trade@nissin.com", address: "6-28-1 Shinjuku, Shinjuku-ku, Tokyo, Japan", taxId: "JP2011101007823", creditLimit: 1400000, daysAgo: 305 },
    // India
    { id: "partner-0013", name: "Tata Consumer Products Ltd", type: "SUPPLIER" as const, contactPerson: "Sunil D'Souza", phone: "+91 22 66658282", email: "procurement@tataconsumer.com", address: "1 Bombay House, Fort, Mumbai, India", taxId: "27AAACT2876A1Z3", creditLimit: 1800000, daysAgo: 300 },
    { id: "partner-0014", name: "Britannia FMCG Wholesale", type: "WHOLESALER" as const, contactPerson: "Rajneet Kohli", phone: "+91 80 37687100", email: "sales@britannia.co.in", address: "Old Airport Road, Bangalore, India", taxId: "29AAACB1234C1Z9", creditLimit: 1200000, daysAgo: 295 },
    // Mexico
    { id: "partner-0015", name: "Grupo Bimbo Global Supply", type: "SUPPLIER" as const, contactPerson: "Daniel Servitje", phone: "+52 55 5268 6600", email: "b2b@grupobimbo.com", address: "Prolongacion Paseo de la Reforma 1000, Mexico City, Mexico", taxId: "MXBIM8005128T0", creditLimit: 1700000, daysAgo: 290 },
    { id: "partner-0016", name: "FEMSA Beverage Distributors", type: "DISTRIBUTOR" as const, contactPerson: "Ian Craig", phone: "+52 81 8328 6000", email: "orders@femsa.com", address: "General Anaya 601, Monterrey, Mexico", taxId: "MXFEM9104018A2", creditLimit: 2100000, daysAgo: 285 },
    // China
    { id: "partner-0017", name: "COFCO Agri-Products Group", type: "SUPPLIER" as const, contactPerson: "Luan Richeng", phone: "+86 10 8500 8000", email: "trade@cofco.com", address: "COFCO Fortune Plaza, Chaoyang, Beijing, China", taxId: "CN91110000100010237G", creditLimit: 2800000, daysAgo: 280 },
    { id: "partner-0018", name: "Wahaha Wholesale Beverage", type: "WHOLESALER" as const, contactPerson: "Kelly Zong", phone: "+86 571 8788 0508", email: "orders@wahaha.com.cn", address: "160 Qingtai St, Hangzhou, Zhejiang, China", taxId: "CN91330100143048923Y", creditLimit: 1500000, daysAgo: 275 },
    // Brazil
    { id: "partner-0019", name: "JBS Global Food Distribution", type: "SUPPLIER" as const, contactPerson: "Gilberto Tomazoni", phone: "+55 11 3144 4000", email: "vendas@jbs.com.br", address: "Av. Marginal Direita do Tiete 500, Sao Paulo, Brazil", taxId: "BR02916265000100", creditLimit: 2400000, daysAgo: 270 },
    { id: "partner-0020", name: "BRF Agro Logistics Hub", type: "DISTRIBUTOR" as const, contactPerson: "Miguel Gularte", phone: "+55 11 2322 5000", email: "supply@brf.com", address: "Rua Hungria 1400, Sao Paulo, Brazil", taxId: "BR01838723000127", creditLimit: 1600000, daysAgo: 265 },
    // Australia
    { id: "partner-0021", name: "Woolworths Primary Supplies", type: "WHOLESALER" as const, contactPerson: "Amanda Bardwell", phone: "+61 2 8885 0000", email: "wholesale@woolworths.com.au", address: "1 Woolworths Way, Bella Vista, NSW, Australia", taxId: "AU88000014675", creditLimit: 1900000, daysAgo: 260 },
    { id: "partner-0022", name: "Goodman Fielder Australia", type: "SUPPLIER" as const, contactPerson: "Prenton Baker", phone: "+61 2 8874 6000", email: "orders@goodmanfielder.com.au", address: "40 Mount St, North Sydney, NSW, Australia", taxId: "AU44000395472", creditLimit: 1300000, daysAgo: 255 },
    // Tech & Electronics Global
    { id: "partner-0023", name: "Anker Innovations Distribution", type: "SUPPLIER" as const, contactPerson: "Steven Yang", phone: "+1 800 988 7973", email: "b2b@anker.com", address: "400 108th Ave NE, Bellevue, WA, United States", taxId: "US912837465", creditLimit: 1500000, daysAgo: 250 },
    { id: "partner-0024", name: "Logitech Global Electronics", type: "SUPPLIER" as const, contactPerson: "Bracken Darrell", phone: "+1 510 795 8500", email: "orders@logitech.com", address: "7700 Gateway Blvd, Newark, CA, United States", taxId: "US942589302", creditLimit: 1700000, daysAgo: 245 },
  ];

  for (const p of PARTNERS_DATA) {
    const pDate = pastDate(p.daysAgo, 2);
    await prisma.partner.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        contactPerson: p.contactPerson,
        phone: p.phone,
        email: p.email,
        address: p.address,
        taxId: p.taxId,
        creditLimit: D(p.creditLimit),
        status: "ACTIVE",
      },
      create: {
        id: p.id,
        organizationId: ORG_ID,
        name: p.name,
        type: p.type,
        contactPerson: p.contactPerson,
        phone: p.phone,
        email: p.email,
        address: p.address,
        taxId: p.taxId,
        creditLimit: D(p.creditLimit),
        status: "ACTIVE",
        createdAt: pDate,
        updatedAt: pDate,
      },
    });
  }
  count("Partner", PARTNERS_DATA.length);
  console.log(`✅ Partners (${PARTNERS_DATA.length} Global Multi-National Suppliers in USD)`);

  // ── 7. Customers (150 International Accounts across 10 Countries) ───────────
  const countryData = [
    { country: "United States", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Bentonville"], phonePrefix: "+1 555" },
    { country: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary"], phonePrefix: "+1 416" },
    { country: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Edinburgh"], phonePrefix: "+44 20" },
    { country: "Germany", cities: ["Berlin", "Munich", "Frankfurt", "Hamburg"], phonePrefix: "+49 30" },
    { country: "Japan", cities: ["Tokyo", "Osaka", "Nagoya", "Yokohama"], phonePrefix: "+81 3" },
    { country: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad"], phonePrefix: "+91 98" },
    { country: "Mexico", cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla"], phonePrefix: "+52 55" },
    { country: "China", cities: ["Shanghai", "Beijing", "Shenzhen", "Guangzhou"], phonePrefix: "+86 21" },
    { country: "Brazil", cities: ["Sao Paulo", "Rio de Janeiro", "Curitiba", "Brasilia"], phonePrefix: "+55 11" },
    { country: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth"], phonePrefix: "+61 2" },
  ];

  const firstNames = ["James", "Emma", "Liam", "Olivia", "William", "Sophia", "Lucas", "Isabella", "Benjamin", "Mia",
    "Kenji", "Yuki", "Aarav", "Priya", "Carlos", "Sofia", "Hans", "Greta", "Wei", "Mei",
    "Alexander", "Chloe", "Mateo", "Camila", "Oliver", "Charlotte", "Hiroshi", "Sakura", "Rohan", "Ananya"];
  const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Miller", "Wilson", "Davis", "Martinez", "Anderson", "Thomas",
    "Sato", "Takahashi", "Sharma", "Patel", "Rodriguez", "Hernandez", "Schmidt", "Mueller", "Zhang", "Wang"];

  const customersData: Array<{ id: string; name: string; contactPerson: string; phone: string; email: string; address: string; customerType: "RETAIL" | "BUSINESS"; creditLimit: number; daysAgo: number }> = [];

  for (let i = 0; i < 150; i++) {
    const cMeta = countryData[i % countryData.length];
    const city = cMeta.cities[i % cMeta.cities.length];
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const isBusiness = i % 3 === 0;
    const daysAgo = 365 - Math.floor((i / 150) * 360);
    const id = seedId("cust", i + 1);

    customersData.push({
      id,
      name: isBusiness ? `${fn} ${ln} Enterprise LLC` : `${fn} ${ln}`,
      contactPerson: `${fn} ${ln}`,
      phone: `${cMeta.phonePrefix} ${String(1000000 + i * 4921).slice(0, 7)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@${isBusiness ? "enterprise-global.com" : "gmail.com"}`,
      address: `${100 + (i * 12) % 899} Main Blvd, Suite ${(i % 40) + 1}, ${city}, ${cMeta.country}`,
      customerType: isBusiness ? "BUSINESS" : "RETAIL",
      creditLimit: isBusiness ? 5000 + (i * 350) : 0,
      daysAgo,
    });
  }

  await inChunks(customersData, 30, async (c) => {
    const cDate = pastDate(c.daysAgo, 1);
    await prisma.customer.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        contactPerson: c.contactPerson,
        phone: c.phone,
        email: c.email,
        address: c.address,
        creditLimit: D(c.creditLimit),
      },
      create: {
        id: c.id,
        organizationId: ORG_ID,
        name: c.name,
        contactPerson: c.contactPerson,
        phone: c.phone,
        email: c.email,
        address: c.address,
        customerType: c.customerType,
        creditLimit: D(c.creditLimit),
        status: "ACTIVE",
        createdAt: cDate,
        updatedAt: cDate,
      },
    });
  });
  count("Customer", customersData.length);
  console.log(`✅ Customers (${customersData.length} Global Enterprise & Retail Accounts in USD)`);

  // ── 8. Inventory ──────────────────────────────────────────────────────────
  console.log("📦 Generating multi-store inventory allocations across 120 stores...");
  const inventoryRecords: Array<{ storeId: string; productId: string; onHand: number; reserved: number }> = [];

  const nationwideOutOfStockSkus = new Set(["prod-0010", "prod-0035", "prod-0070"]);
  const nationwideLowStockSkus = new Set([
    "prod-0005", "prod-0015", "prod-0025", "prod-0040", 
    "prod-0050", "prod-0060", "prod-0075", "prod-0082"
  ]);

  for (const p of PRODUCTS) {
    const stores = storesFor(p.storeDistribution);
    for (let si = 0; si < stores.length; si++) {
      const baseStock = p.reorderLevel * 4;
      let onHand: number;
      let reserved: number;

      if (nationwideOutOfStockSkus.has(p.id)) {
        onHand = 0;
        reserved = 0;
      } else if (nationwideLowStockSkus.has(p.id)) {
        onHand = (si % 5 === 0) ? Math.max(1, Math.floor(p.reorderLevel / 12)) : 0;
        reserved = 0;
      } else {
        const variation = (si + parseInt(p.id.slice(-2), 10)) % 15;
        if (variation === 0) {
          onHand = 0;
          reserved = 0;
        } else if (variation === 1 || variation === 2) {
          onHand = Math.max(1, Math.floor(p.reorderLevel * 0.4));
          reserved = 0;
        } else if (variation < 9) {
          onHand = baseStock;
          reserved = Math.floor(baseStock * 0.08);
        } else {
          onHand = Math.floor(baseStock * 1.5);
          reserved = Math.floor(baseStock * 0.05);
        }
      }
      inventoryRecords.push({ storeId: stores[si], productId: p.id, onHand, reserved });
    }
  }

  await inChunks(inventoryRecords, 100, async (inv) => {
    await prisma.inventory.upsert({
      where: {
        organizationId_storeId_productId: {
          organizationId: ORG_ID,
          storeId: inv.storeId,
          productId: inv.productId,
        },
      },
      update: { onHand: inv.onHand, reserved: inv.reserved },
      create: {
        organizationId: ORG_ID,
        storeId: inv.storeId,
        productId: inv.productId,
        onHand: inv.onHand,
        reserved: inv.reserved,
      },
    });
  });
  count("Inventory", inventoryRecords.length);
  console.log(`✅ Inventory (${inventoryRecords.length} records across 120 stores)`);

  // ── 9. Chart of Accounts ──────────────────────────────────────────────────
  for (const acc of ACCOUNTS) {
    await prisma.account.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: acc.code } },
      update: { name: acc.name, type: acc.type },
      create: {
        id: acc.id,
        organizationId: ORG_ID,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        isActive: true,
      },
    });
  }
  count("Account", ACCOUNTS.length);
  console.log("✅ Chart of Accounts (US GAAP compliant)");

  // ── 10. Purchase Orders (Past 12 Months: ~240 POs) ─────────────────────────
  console.log("📦 Generating 240 Purchase Orders across 12 months in USD...");
  const PO_STATUSES = ["RECEIVED", "RECEIVED", "RECEIVED", "RECEIVED", "RECEIVED", "PARTIALLY_RECEIVED", "ORDERED", "DRAFT"] as const;
  const poMovements: Array<{ storeId: string; productId: string; quantity: number; unitCost: number; refId: string; date: Date }> = [];
  const poJournalData: Array<{ id: string; orderNumber: string; subtotal: number; tax: number; total: number; date: Date }> = [];

  const poList: any[] = [];
  for (let poIdx = 0; poIdx < 240; poIdx++) {
    const poId = seedId("po", poIdx + 1);
    const poNumber = createRef("PO", poIdx + 1);
    const storeId = pick(STORE_IDS, poIdx);
    const partner = pick(PARTNERS_DATA, poIdx);
    const status = pick(PO_STATUSES, poIdx);

    const daysAgo = Math.floor(365 - (poIdx / 240) * 363);
    const poDate = pastDate(daysAgo, poIdx);
    const itemCount = 2 + (poIdx % 6);

    let subtotal = 0;
    let totalTax = 0;
    const items: Array<{ purchaseOrderId: string; productId: string; quantity: number; unitCost: number; tax: number; total: number }> = [];

    for (let ii = 0; ii < itemCount; ii++) {
      const prod = PRODUCTS[(poIdx * 5 + ii) % PRODUCTS.length];
      const qty = 50 + ((poIdx + ii) % 30) * 20;
      const line = calcPurchaseLineTotal(qty, prod.costPrice, prod.taxRate);
      items.push({
        purchaseOrderId: poId,
        productId: prod.id,
        quantity: qty,
        unitCost: prod.costPrice,
        tax: line.tax,
        total: line.total,
      });
      subtotal += line.subtotal;
      totalTax += line.tax;

      if (status === "RECEIVED" || status === "PARTIALLY_RECEIVED") {
        poMovements.push({
          storeId,
          productId: prod.id,
          quantity: qty,
          unitCost: prod.costPrice,
          refId: poId,
          date: poDate,
        });
      }
    }

    const total = Math.round((subtotal + totalTax) * 100) / 100;
    poList.push({
      poId, storeId, partnerId: partner.id, poNumber, status, subtotal, totalTax, total, poDate, items
    });

    if (status === "RECEIVED") {
      poJournalData.push({ id: poId, orderNumber: poNumber, subtotal, tax: totalTax, total, date: poDate });
    }
  }

  await inChunks(poList, 25, async (po) => {
    await prisma.purchaseOrder.create({
      data: {
        id: po.poId,
        organizationId: ORG_ID,
        storeId: po.storeId,
        partnerId: po.partnerId,
        orderNumber: po.poNumber,
        status: po.status,
        subtotal: money(po.subtotal),
        tax: money(po.totalTax),
        total: money(po.total),
        createdAt: po.poDate,
        updatedAt: po.poDate,
        items: {
          create: po.items.map((it: any) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitCost: D(it.unitCost),
            tax: money(it.tax),
            total: money(it.total),
          })),
        },
      },
    });
  });
  count("PurchaseOrder", 240);
  console.log("✅ Purchase Orders (240 POs covering Oct 2025 – Sep 2026 in USD)");

  // ── 11. Sales Orders & Payments (2,500 Orders, with dense daily orders for past 30 days) ──
  console.log("🛒 Generating 2,500 Sales Orders & Payments across 12 months in USD...");
  const SO_STATUSES = ["COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "PROCESSING", "CONFIRMED", "REFUNDED"] as const;
  const PAYMENT_METHODS = ["CARD", "CARD", "CASH", "BANK_TRANSFER", "OTHER"] as const;
  const completedSalesForJournal: Array<{ id: string; orderNumber: string; storeId: string; subtotal: number; discount: number; tax: number; total: number; date: Date; items: Array<{ productId: string; quantity: number }> }> = [];

  const salesOrdersToCreate: any[] = [];
  const TOTAL_ORDERS = 2500;

  // We ensure EVERY single day from 0 to 30 has 20-30 orders so the sales chart is continuous and rich!
  for (let soIdx = 0; soIdx < TOTAL_ORDERS; soIdx++) {
    const soId = seedId("so", soIdx + 1);
    const soNumber = createRef("SO", soIdx + 1);
    const storeId = pick(STORE_IDS, soIdx);
    const customer = soIdx % 8 === 0 ? null : pick(customersData, soIdx);
    const status = pick(SO_STATUSES, soIdx);

    let daysAgo: number;
    if (soIdx < 800) {
      // First 800 orders distributed strictly across the last 30 days (days 0..30)
      // ~26 orders per day!
      daysAgo = Math.floor((soIdx / 800) * 31);
    } else {
      // Remaining 1700 orders distributed across days 31..365
      daysAgo = 31 + Math.floor(((soIdx - 800) / (TOTAL_ORDERS - 800)) * 334);
    }

    const soDate = pastDate(daysAgo, soIdx);
    const itemCount = 1 + (soIdx % 6);

    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    const items: Array<{ productId: string; quantity: number; unitPrice: number; discount: number; tax: number; total: number }> = [];

    for (let ii = 0; ii < itemCount; ii++) {
      const prod = PRODUCTS[(soIdx * 3 + ii) % PRODUCTS.length];
      const qty = 1 + ((soIdx + ii) % 5);
      const lineDiscount = soIdx % 5 === 0 ? Math.round(prod.sellingPrice * qty * 0.05 * 100) / 100 : 0;
      const line = calcSalesLineTotal(qty, prod.sellingPrice, lineDiscount, prod.taxRate);
      items.push({
        productId: prod.id,
        quantity: qty,
        unitPrice: prod.sellingPrice,
        discount: lineDiscount,
        tax: line.tax,
        total: line.total,
      });
      subtotal += line.subtotal;
      totalTax += line.tax;
      totalDiscount += lineDiscount;
    }

    const total = Math.round((subtotal - totalDiscount + totalTax) * 100) / 100;
    const payMethod = pick(PAYMENT_METHODS, soIdx);
    const payStatus = status === "REFUNDED" ? "REFUNDED" : status === "COMPLETED" ? "PAID" : "PENDING";

    salesOrdersToCreate.push({
      soId,
      storeId,
      customerId: customer?.id ?? null,
      soNumber,
      status,
      subtotal,
      totalDiscount,
      totalTax,
      total,
      soDate,
      items,
      payMethod,
      payStatus,
      soIdx,
    });

    if (status === "COMPLETED") {
      completedSalesForJournal.push({
        id: soId,
        orderNumber: soNumber,
        storeId,
        subtotal,
        discount: totalDiscount,
        tax: totalTax,
        total,
        date: soDate,
        items: items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
      });
    }
  }

  await inChunks(salesOrdersToCreate, 50, async (order) => {
    await prisma.salesOrder.create({
      data: {
        id: order.soId,
        organizationId: ORG_ID,
        storeId: order.storeId,
        customerId: order.customerId,
        orderNumber: order.soNumber,
        status: order.status as any,
        subtotal: money(order.subtotal),
        discount: money(order.totalDiscount),
        tax: money(order.totalTax),
        total: money(order.total),
        createdAt: order.soDate,
        updatedAt: order.soDate,
        items: {
          create: order.items.map((it: any) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: D(it.unitPrice),
            discount: money(it.discount),
            tax: money(it.tax),
            total: money(it.total),
          })),
        },
      },
    });

    await prisma.payment.create({
      data: {
        id: seedId("pay", order.soIdx + 1),
        organizationId: ORG_ID,
        salesOrderId: order.soId,
        amount: money(order.total),
        method: order.payMethod,
        status: order.payStatus,
        reference: `WMT-PAY-${order.soIdx + 1}`,
        paidAt: order.status === "COMPLETED" ? order.soDate : null,
        createdAt: order.soDate,
      },
    });
  });

  count("SalesOrder", TOTAL_ORDERS);
  count("Payment", TOTAL_ORDERS);
  console.log(`✅ Sales Orders & Payments (${TOTAL_ORDERS} orders across 10 Countries in USD)`);

  // ── 12. Inventory Movements ───────────────────────────────────────────────
  console.log("📊 Generating inventory movement audit trail...");
  let mvIdx = 0;
  const movementsToCreate: any[] = [];

  // Opening stocks (12 months ago)
  for (const inv of inventoryRecords.slice(0, 500)) {
    if (inv.onHand > 0) {
      const prod = PRODUCTS.find((p) => p.id === inv.productId)!;
      movementsToCreate.push({
        id: seedId("mv", ++mvIdx),
        organizationId: ORG_ID,
        storeId: inv.storeId,
        productId: inv.productId,
        type: "OPENING",
        quantity: inv.onHand,
        unitCost: D(prod.costPrice),
        referenceType: "OPENING",
        notes: "Initial inventory allocation",
        createdAt: pastDate(345),
      });
    }
  }

  // PO movements
  for (const pm of poMovements) {
    movementsToCreate.push({
      id: seedId("mv", ++mvIdx),
      organizationId: ORG_ID,
      storeId: pm.storeId,
      productId: pm.productId,
      type: "PURCHASE",
      quantity: pm.quantity,
      unitCost: D(pm.unitCost),
      referenceType: "PURCHASE",
      referenceId: pm.refId,
      notes: "PO stock received",
      createdAt: pm.date,
    });
  }

  // Sale movements (for first 1200 completed sales)
  for (const cs of completedSalesForJournal.slice(0, 1200)) {
    for (const item of cs.items) {
      const prod = PRODUCTS.find((p) => p.id === item.productId);
      if (!prod) continue;
      movementsToCreate.push({
        id: seedId("mv", ++mvIdx),
        organizationId: ORG_ID,
        storeId: cs.storeId,
        productId: item.productId,
        type: "SALE",
        quantity: -item.quantity,
        unitCost: D(prod.costPrice),
        referenceType: "SALE",
        referenceId: cs.id,
        notes: `POS invoice ${cs.orderNumber}`,
        createdAt: cs.date,
      });
    }
  }

  await inChunks(movementsToCreate, 100, async (mv) => {
    await prisma.inventoryMovement.create({ data: mv });
  });
  count("InventoryMovement", movementsToCreate.length);
  console.log(`✅ Inventory Movements (${movementsToCreate.length} records)`);

  // ── 13. General Ledger Journal Entries (Double-Entry in USD) ───────────────
  console.log("📑 Generating double-entry General Ledger journal entries in USD...");
  let jeIdx = 0;

  // Opening Capitalization Entry: $50 Million USD
  jeIdx++;
  await prisma.journalEntry.create({
    data: {
      id: seedId("je", jeIdx),
      organizationId: ORG_ID,
      entryNumber: createRef("JV", jeIdx),
      referenceType: "CAPITAL",
      description: "Initial Capitalization & Equity Infusion for 120 Global Outlets",
      entryDate: pastDate(350),
      createdAt: pastDate(350),
      lines: {
        create: [
          { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-1010", debit: D("45000000.00"), credit: D(0) }, // Bank $45M
          { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1000", debit: D("5000000.00"), credit: D(0) },  // Cash $5M
          { id: seedId("jl", jeIdx * 10 + 3), accountId: "acc-3000", debit: D(0), credit: D("50000000.00") }, // Equity $50M
        ],
      },
    },
  });

  // Sales entries (sample of completed sales for ledger performance)
  const salesToJournalize = completedSalesForJournal.slice(0, 450);
  const journalEntriesToCreate: any[] = [];

  for (const cs of salesToJournalize) {
    jeIdx++;
    const jeId = seedId("je", jeIdx);
    const jeNumber = createRef("JV", jeIdx);
    const isCreditSale = cs.total > 250 || jeIdx % 3 === 0;

    if (isCreditSale) {
      journalEntriesToCreate.push({
        id: jeId,
        entryNumber: jeNumber,
        referenceType: "SALE",
        referenceId: cs.id,
        description: `Credit Sale: Invoice ${cs.orderNumber}`,
        entryDate: cs.date,
        lines: [
          { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-1100", debit: money(cs.total), credit: D(0) },
          ...(cs.discount > 0 ? [{ id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-4100", debit: money(cs.discount), credit: D(0) }] : []),
          { id: seedId("jl", jeIdx * 10 + 3), accountId: "acc-4000", debit: D(0), credit: money(cs.subtotal) },
          { id: seedId("jl", jeIdx * 10 + 4), accountId: "acc-2100", debit: D(0), credit: money(cs.tax) },
        ],
      });

      const daysOld = Math.floor((Date.now() - cs.date.getTime()) / (24 * 60 * 60 * 1000));
      if (daysOld > 25) {
        jeIdx++;
        const payJeId = seedId("je", jeIdx);
        const payJeNumber = createRef("JV", jeIdx);
        const settleDate = new Date(cs.date.getTime() + 14 * 24 * 60 * 60 * 1000);
        journalEntriesToCreate.push({
          id: payJeId,
          entryNumber: payJeNumber,
          referenceType: "RECEIPT",
          referenceId: cs.id,
          description: `Payment Receipt: AR Settlement for ${cs.orderNumber}`,
          entryDate: settleDate,
          lines: [
            { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-1010", debit: money(cs.total), credit: D(0) },
            { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1100", debit: D(0), credit: money(cs.total) },
          ],
        });
      }
    } else {
      const payAcc = jeIdx % 4 === 0 ? "acc-1000" : "acc-1010";
      journalEntriesToCreate.push({
        id: jeId,
        entryNumber: jeNumber,
        referenceType: "SALE",
        referenceId: cs.id,
        description: `Retail POS Revenue: ${cs.orderNumber}`,
        entryDate: cs.date,
        lines: [
          { id: seedId("jl", jeIdx * 10 + 1), accountId: payAcc, debit: money(cs.total), credit: D(0) },
          ...(cs.discount > 0 ? [{ id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-4100", debit: money(cs.discount), credit: D(0) }] : []),
          { id: seedId("jl", jeIdx * 10 + 3), accountId: "acc-4000", debit: D(0), credit: money(cs.subtotal) },
          { id: seedId("jl", jeIdx * 10 + 4), accountId: "acc-2100", debit: D(0), credit: money(cs.tax) },
        ],
      });
    }

    let cogsAmount = 0;
    for (const it of cs.items) {
      const prod = PRODUCTS.find((p) => p.id === it.productId);
      if (prod) cogsAmount += it.quantity * prod.costPrice;
    }
    cogsAmount = Math.round(cogsAmount * 100) / 100;

    if (cogsAmount > 0) {
      jeIdx++;
      journalEntriesToCreate.push({
        id: seedId("je", jeIdx),
        entryNumber: createRef("JV", jeIdx),
        referenceType: "COGS",
        referenceId: cs.id,
        description: `COGS: Order ${cs.orderNumber}`,
        entryDate: cs.date,
        lines: [
          { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-5000", debit: money(cogsAmount), credit: D(0) },
          { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1200", debit: D(0), credit: money(cogsAmount) },
        ],
      });
    }
  }

  // Purchase Entries
  for (const po of poJournalData) {
    jeIdx++;
    journalEntriesToCreate.push({
      id: seedId("je", jeIdx),
      entryNumber: createRef("JV", jeIdx),
      referenceType: "PURCHASE",
      referenceId: po.id,
      description: `Procurement: PO ${po.orderNumber}`,
      entryDate: po.date,
      lines: [
        { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-1200", debit: money(po.subtotal), credit: D(0) },
        { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1300", debit: money(po.tax), credit: D(0) },
        { id: seedId("jl", jeIdx * 10 + 3), accountId: "acc-2000", debit: D(0), credit: money(po.total) },
      ],
    });

    const daysOld = Math.floor((Date.now() - po.date.getTime()) / (24 * 60 * 60 * 1000));
    if (daysOld > 35) {
      jeIdx++;
      const payDate = new Date(po.date.getTime() + 25 * 24 * 60 * 60 * 1000);
      journalEntriesToCreate.push({
        id: seedId("je", jeIdx),
        entryNumber: createRef("JV", jeIdx),
        referenceType: "PAYMENT",
        referenceId: po.id,
        description: `Vendor Settlement: PO ${po.orderNumber}`,
        entryDate: payDate,
        lines: [
          { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-2000", debit: money(po.total), credit: D(0) },
          { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1010", debit: D(0), credit: money(po.total) },
        ],
      });
    }
  }

  // Monthly Operating Expenses
  for (let m = 11; m >= 0; m--) {
    const expenseDate = pastDate(m * 30 + 15, m);
    jeIdx++;
    journalEntriesToCreate.push({
      id: seedId("je", jeIdx),
      entryNumber: createRef("JV", jeIdx),
      referenceType: "EXPENSE",
      description: `Global Logistics & Multi-Store Facility Operations`,
      entryDate: expenseDate,
      lines: [
        { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-5100", debit: D("85000.00"), credit: D(0) },
        { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1010", debit: D(0), credit: D("85000.00") },
      ],
    });
  }

  await inChunks(journalEntriesToCreate, 40, async (je) => {
    await prisma.journalEntry.create({
      data: {
        id: je.id,
        organizationId: ORG_ID,
        entryNumber: je.entryNumber,
        referenceType: je.referenceType,
        referenceId: je.referenceId,
        description: je.description,
        entryDate: je.entryDate,
        createdAt: je.entryDate,
        lines: { create: je.lines },
      },
    });
  });
  count("JournalEntry", jeIdx);
  console.log(`✅ General Ledger (${jeIdx} double-entry Journal Entries in USD)`);

  // ── 14. Audit Logs ────────────────────────────────────────────────────────
  console.log("🔒 Generating audit logs across 12 months in USD...");
  const auditLogs = [
    { action: "ORGANIZATION_INITIALIZED", entity: "Organization", entityId: ORG_ID, newValue: { name: ORG.name, currency: "USD", timezone: "America/New_York" }, daysAgo: 365 },
    { action: "GLOBAL_NETWORK_EXPANSION", entity: "StoreNetwork", entityId: "NET-120", newValue: { countries: 10, totalStores: 120 }, daysAgo: 360 },
    { action: "SUPPLIER_ONBOARDED", entity: "Partner", entityId: "partner-0001", newValue: { name: "Procter & Gamble Co.", taxId: "US310418810" }, daysAgo: 350 },
    { action: "SUPPLIER_ONBOARDED", entity: "Partner", entityId: "partner-0007", newValue: { name: "Unilever UK Trade Corp", taxId: "GB242456780" }, daysAgo: 330 },
    { action: "GLOBAL_TAX_COMPLIANCE", entity: "Tax", entityId: "TAX-GLOBAL-2026", newValue: { status: "ACTIVE", compliance: "OECD / US GAAP" }, daysAgo: 300 },
    { action: "STORE_COMMISSIONED", entity: "Store", entityId: STORES[0].id, newValue: { name: STORES[0].name, city: STORES[0].city, country: STORES[0].country }, daysAgo: 280 },
    { action: "STORE_COMMISSIONED", entity: "Store", entityId: STORES[24].id, newValue: { name: STORES[24].name, city: STORES[24].city, country: STORES[24].country }, daysAgo: 240 },
    { action: "STORE_COMMISSIONED", entity: "Store", entityId: STORES[48].id, newValue: { name: STORES[48].name, city: STORES[48].city, country: STORES[48].country }, daysAgo: 200 },
    { action: "ANNUAL_SECURITY_AUDIT", entity: "Security", entityId: "SEC-AUD-2026", newValue: { status: "PASSED", cert: "SOC2 Type II / ISO-27001" }, daysAgo: 120 },
    { action: "INVENTORY_CYCLE_COUNT", entity: "Inventory", entityId: STORES[0].id, newValue: { accuracyRate: "99.8%" }, daysAgo: 60 },
    { action: "REGIONAL_SETTINGS_SYNC", entity: "Settings", entityId: "SET-REG-01", newValue: { defaultRegion: "United States", currency: "USD" }, daysAgo: 5 },
  ];

  for (let ai = 0; ai < auditLogs.length; ai++) {
    const log = auditLogs[ai];
    await prisma.auditLog.create({
      data: {
        id: seedId("audit", ai + 1),
        organizationId: ORG_ID,
        userId: ADMIN_USER_ID,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        oldValue: Prisma.JsonNull,
        newValue: log.newValue,
        createdAt: pastDate(log.daysAgo, ai),
      },
    });
  }
  count("AuditLog", auditLogs.length);
  console.log("✅ Audit Logs (Multi-country compliance history)");

  // ── Final Summary ─────────────────────────────────────────────────────────
  console.log("\n========================================================");
  console.log("🌐 Walmart Global Enterprise 12-Month Seed Complete!");
  console.log("========================================================");
  for (const [model, n] of Object.entries(counts)) {
    console.log(`   ${model.padEnd(20)}: ${n}`);
  }
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
