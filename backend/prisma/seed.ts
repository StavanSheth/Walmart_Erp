// =============================================================================
// Phase 3 — Demo Data Seed System
// Idempotent seed for the Walmart ERP demo environment.
// Run with: npx prisma db seed   OR   npx tsx prisma/seed.ts
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
    case "most": return STORE_IDS.slice(0, 6);
    case "some": return STORE_IDS.slice(0, 4);
    case "few": return STORE_IDS.slice(0, 2);
    default: return [...STORE_IDS];
  }
}

// ─── Counters for logging ───────────────────────────────────────────────────
const counts: Record<string, number> = {};
function count(model: string, n: number) { counts[model] = (counts[model] || 0) + n; }

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================
async function main() {
  console.log("🌱 Phase 3 — Seeding demo data...\n");

  // ── 1. Organization ──────────────────────────────────────────────────────
  await prisma.organization.upsert({
    where: { code: ORG.code },
    update: {},
    create: { id: ORG.id, name: ORG.name, code: ORG.code, currency: ORG.currency, timezone: ORG.timezone },
  });
  count("Organization", 1);
  console.log("✅ Organization");

  // ── 1b. Role + User (for AuditLog FK) ────────────────────────────────────
  await prisma.role.upsert({
    where: { id: ADMIN_ROLE_ID },
    update: {},
    create: { id: ADMIN_ROLE_ID, name: "Demo Administrator", description: "Full demo access" },
  });
  count("Role", 1);

  await prisma.user.upsert({
    where: { id: ADMIN_USER_ID },
    update: {},
    create: {
      id: ADMIN_USER_ID, organizationId: ORG_ID, roleId: ADMIN_ROLE_ID,
      name: "Demo Admin", email: "admin@walmart-demo.in", phone: "+91 9000000001",
      passwordHash: "DEMO_NOT_A_REAL_HASH", status: "ACTIVE",
    },
  });
  count("User", 1);
  console.log("✅ Role + User");

  // ── 2. Regions ────────────────────────────────────────────────────────────
  for (const r of REGIONS) {
    await prisma.region.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: r.code } },
      update: {},
      create: { id: r.id, organizationId: ORG_ID, name: r.name, code: r.code, status: "ACTIVE" },
    });
  }
  count("Region", REGIONS.length);
  console.log("✅ Regions");

  // ── 3. Stores ─────────────────────────────────────────────────────────────
  for (const s of STORES) {
    await prisma.store.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: s.code } },
      update: {},
      create: {
        id: s.id, organizationId: ORG_ID, regionId: s.regionId,
        name: s.name, code: s.code, address: s.address, city: s.city,
        state: s.state, country: "India", pincode: s.pincode,
        phone: s.phone, email: s.email, image: s.image, status: "ACTIVE",
      },
    });
  }
  count("Store", STORES.length);
  console.log("✅ Stores");

  // ── 4. Categories ─────────────────────────────────────────────────────────
  // First create parent categories, then children
  const parents = CATEGORIES.filter((c) => !c.parentId);
  const children = CATEGORIES.filter((c) => c.parentId);
  for (const c of [...parents, ...children]) {
    await prisma.category.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: c.code } },
      update: {},
      create: {
        id: c.id, organizationId: ORG_ID, parentId: c.parentId,
        name: c.name, code: c.code, status: "ACTIVE",
      },
    });
  }
  count("Category", CATEGORIES.length);
  console.log("✅ Categories");

  // ── 5. Products ───────────────────────────────────────────────────────────
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { organizationId_sku: { organizationId: ORG_ID, sku: p.sku } },
      update: {},
      create: {
        id: p.id, organizationId: ORG_ID, categoryId: p.categoryId,
        sku: p.sku, barcode: p.barcode, name: p.name, unit: p.unit,
        costPrice: D(p.costPrice), sellingPrice: D(p.sellingPrice),
        taxRate: D(p.taxRate), reorderLevel: p.reorderLevel, status: "ACTIVE",
      },
    });
  }
  count("Product", PRODUCTS.length);
  console.log("✅ Products");

  // ── 6. Partners ───────────────────────────────────────────────────────────
  const PARTNERS_DATA = [
    { id: "partner-ref-0001", name: "ABC Wholesale Co.", type: "WHOLESALER" as const, contactPerson: "John Miller", phone: "+91 9800000101", email: "john@abcwholesale.com", address: "Sector 14, Gurgaon, Delhi NCR", taxId: "06AABCA0001Z1", creditLimit: 25000000, status: "ACTIVE" as const, daysAgo: 160 },
    { id: "partner-ref-0002", name: "Global Supplies Ltd.", type: "SUPPLIER" as const, contactPerson: "Michael Chen", phone: "+91 9800000103", email: "michael@globalsupplies.com", address: "Andheri East, Mumbai, Maharashtra", taxId: "27AABCG0002Z2", creditLimit: 10000000, status: "ACTIVE" as const, daysAgo: 145 },
    { id: "partner-ref-0003", name: "Sunrise Distributors", type: "WHOLESALER" as const, contactPerson: "Robert Brown", phone: "+91 9800000105", email: "robert@sunrisedist.com", address: "Park Street, Kolkata, West Bengal", taxId: "19AABCS0003Z3", creditLimit: 7000000, status: "INACTIVE" as const, daysAgo: 130 },
    { id: "partner-ref-0004", name: "Prime Goods", type: "SUPPLIER" as const, contactPerson: "Jessica Taylor", phone: "+91 9800000107", email: "jessica@primegoods.com", address: "Jubilee Hills, Hyderabad, Telangana", taxId: "36AABCP0004Z4", creditLimit: 5000000, status: "ACTIVE" as const, daysAgo: 115 },
    { id: "partner-ref-0005", name: "Metro Wholesale", type: "WHOLESALER" as const, contactPerson: "Amy Clark", phone: "+91 9800000109", email: "amy@metrowholesale.com", address: "SG Highway, Ahmedabad, Gujarat", taxId: "24AABCM0005Z5", creditLimit: 4000000, status: "ACTIVE" as const, daysAgo: 100 },
    { id: "partner-ref-0006", name: "Eco Supplies", type: "SUPPLIER" as const, contactPerson: "William Scott", phone: "+91 9800000110", email: "william@ecosupplies.com", address: "Hinjewadi, Pune, Maharashtra", taxId: "27AABCE0006Z6", creditLimit: 3500000, status: "ACTIVE" as const, daysAgo: 85 },
    { id: "partner-0001", name: "Raj Enterprises", type: "SUPPLIER" as const, contactPerson: "Rajesh Sharma", phone: "+91 9800000001", email: "raj@suppliers.local", address: "Andheri, Mumbai", taxId: "27AABCR0001A1Z5", creditLimit: 500000, status: "ACTIVE" as const, daysAgo: 175 },
    { id: "partner-0002", name: "Sharma Distributors", type: "DISTRIBUTOR" as const, contactPerson: "Rohan Sharma", phone: "+91 9800000002", email: "sharma@dist.local", address: "Karol Bagh, Delhi", taxId: "07AABCS0002B1Z3", creditLimit: 750000, status: "ACTIVE" as const, daysAgo: 155 },
    { id: "partner-0003", name: "Patel Wholesale", type: "WHOLESALER" as const, contactPerson: "Kavita Patel", phone: "+91 9800000003", email: "patel@wholesale.local", address: "SG Highway, Ahmedabad", taxId: "24AABCP0003C1Z1", creditLimit: 600000, status: "ACTIVE" as const, daysAgo: 140 },
    { id: "partner-0004", name: "Kumar Foods Pvt Ltd", type: "SUPPLIER" as const, contactPerson: "Arjun Kumar", phone: "+91 9800000004", email: "kumar@foods.local", address: "Koramangala, Bangalore", taxId: "29AABCK0004D1Z9", creditLimit: 400000, status: "ACTIVE" as const, daysAgo: 120 },
    { id: "partner-0005", name: "Singh Electronics", type: "VENDOR" as const, contactPerson: "Vikram Singh", phone: "+91 9800000005", email: "singh@elec.local", address: "Nehru Place, Delhi", taxId: "07AABCS0005E1Z7", creditLimit: 800000, status: "ACTIVE" as const, daysAgo: 110 },
    { id: "partner-0006", name: "Gupta Textiles", type: "SUPPLIER" as const, contactPerson: "Sanjay Gupta", phone: "+91 9800000006", email: "gupta@textiles.local", address: "Chandni Chowk, Delhi", taxId: "07AABCG0006F1Z5", creditLimit: 350000, status: "ACTIVE" as const, daysAgo: 95 },
    { id: "partner-0007", name: "Agarwal Home Supplies", type: "WHOLESALER" as const, contactPerson: "Nitin Agarwal", phone: "+91 9800000007", email: "agarwal@home.local", address: "MG Road, Pune", taxId: "27AABCA0007G1Z3", creditLimit: 450000, status: "ACTIVE" as const, daysAgo: 80 },
    { id: "partner-0008", name: "Reddy FMCG", type: "DISTRIBUTOR" as const, contactPerson: "Suresh Reddy", phone: "+91 9800000008", email: "reddy@fmcg.local", address: "Jubilee Hills, Hyderabad", taxId: "36AABCR0008H1Z1", creditLimit: 550000, status: "ACTIVE" as const, daysAgo: 65 },
    { id: "partner-0009", name: "Jain Sports Equipments", type: "VENDOR" as const, contactPerson: "Manish Jain", phone: "+91 9800000009", email: "jain@sports.local", address: "Jayanagar, Bangalore", taxId: "29AABCJ0009I1Z9", creditLimit: 300000, status: "ACTIVE" as const, daysAgo: 50 },
    { id: "partner-0010", name: "Mehta Dairy Products", type: "SUPPLIER" as const, contactPerson: "Deepak Mehta", phone: "+91 980000010", email: "mehta@dairy.local", address: "Anand, Gujarat", taxId: "24AABCM0010J1Z7", creditLimit: 400000, status: "ACTIVE" as const, daysAgo: 35 },
    { id: "partner-0011", name: "Bose Consumer Goods", type: "WHOLESALER" as const, contactPerson: "Subhash Bose", phone: "+91 9800000011", email: "bose@consumer.local", address: "Salt Lake, Kolkata", taxId: "19AABCB0011K1Z5", creditLimit: 500000, status: "ACTIVE" as const, daysAgo: 25 },
    { id: "partner-0012", name: "Verma Pet Supplies", type: "VENDOR" as const, contactPerson: "Alok Verma", phone: "+91 9800000012", email: "verma@pets.local", address: "Indiranagar, Bangalore", taxId: "29AABCV0012L1Z3", creditLimit: 200000, status: "ACTIVE" as const, daysAgo: 15 },
    { id: "partner-0013", name: "Nair Cosmetics", type: "SUPPLIER" as const, contactPerson: "Ananya Nair", phone: "+91 9800000013", email: "nair@cosmetics.local", address: "T Nagar, Chennai", taxId: "33AABCN0013M1Z1", creditLimit: 350000, status: "ACTIVE" as const, daysAgo: 10 },
  ];

  for (const p of PARTNERS_DATA) {
    const pDate = pastDate(p.daysAgo, 2);
    await prisma.partner.upsert({
      where: { id: p.id },
      update: {
        contactPerson: p.contactPerson,
        status: p.status,
      },
      create: {
        id: p.id, organizationId: ORG_ID, name: p.name, type: p.type,
        contactPerson: p.contactPerson,
        phone: p.phone, email: p.email, address: p.address, taxId: p.taxId,
        creditLimit: D(p.creditLimit), status: p.status,
        createdAt: pDate, updatedAt: pDate,
      },
    });
  }
  count("Partner", PARTNERS_DATA.length);
  console.log("✅ Partners");

  // ── 7. Customers ──────────────────────────────────────────────────────────
  const referenceBusinessCustomers = [
    { id: "cust-ref-0001", name: "FreshMart Retail", contactPerson: "Sarah Wilson", phone: "+91 9800000102", email: "sarah@freshmart.com", address: "MG Road, Bangalore, Karnataka", creditLimit: 18500000, daysAgo: 150 },
    { id: "cust-ref-0002", name: "Value Retailers", contactPerson: "Emily Davis", phone: "+91 9800000104", email: "emily@valueretail.com", address: "Connaught Place, Delhi NCR", creditLimit: 8000000, daysAgo: 135 },
    { id: "cust-ref-0003", name: "QuickShop", contactPerson: "David Lee", phone: "+91 9800000106", email: "david@quickshop.com", address: "Koramangala, Bangalore, Karnataka", creditLimit: 6000000, daysAgo: 110 },
    { id: "cust-ref-0004", name: "CityMart", contactPerson: "Daniel Kim", phone: "+91 9800000108", email: "daniel@citymart.com", address: "Anna Nagar, Chennai, Tamil Nadu", creditLimit: 4500000, daysAgo: 90 },
  ];

  for (const rc of referenceBusinessCustomers) {
    const rcDate = pastDate(rc.daysAgo, 3);
    await prisma.customer.upsert({
      where: { id: rc.id },
      update: {
        contactPerson: rc.contactPerson,
      },
      create: {
        id: rc.id, organizationId: ORG_ID, name: rc.name, contactPerson: rc.contactPerson,
        phone: rc.phone, email: rc.email, address: rc.address, customerType: "BUSINESS",
        creditLimit: D(rc.creditLimit), status: "ACTIVE",
        createdAt: rcDate, updatedAt: rcDate,
      },
    });
  }

  const firstNames = ["Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Karthik", "Meera", "Arjun", "Divya",
    "Rahul", "Neha", "Sanjay", "Kavita", "Amit", "Pooja", "Deepak", "Shreya", "Rajesh", "Nandini",
    "Suresh", "Lakshmi", "Manoj", "Anjali", "Vishal", "Swati", "Arun", "Isha", "Nitin", "Ritu",
    "Gaurav", "Pallavi", "Pranav", "Tanvi", "Varun", "Aditi", "Siddharth", "Sakshi", "Yash", "Nisha",
    "Ajay", "Geeta", "Ravi", "Sonali", "Kunal", "Bhavna", "Harsh", "Jaya", "Manish", "Rekha"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Reddy", "Joshi", "Mehta", "Gupta", "Nair", "Verma",
    "Das", "Iyer", "Shah", "Rao", "Mishra", "Banerjee", "Chauhan", "Pillai", "Agarwal", "Bhat"];

  const customersData: Array<{ id: string; name: string; contactPerson: string; phone: string; email: string; address: string; customerType: "RETAIL" | "BUSINESS"; creditLimit: number; daysAgo: number }> = [];

  for (let i = 0; i < 60; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const isBusiness = i >= 45;
    const daysAgo = 180 - Math.floor((i / 60) * 170);
    customersData.push({
      id: seedId("cust", i + 1),
      name: isBusiness ? `${fn} ${ln} Enterprises` : `${fn} ${ln}`,
      contactPerson: isBusiness ? `${fn} ${ln}` : `${fn}`,
      phone: `+91 98${String(10000000 + i * 137).slice(0, 8)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.local`,
      address: `${100 + i}, Sector ${(i % 20) + 1}, ${pick(["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pune", "Jaipur", "Hyderabad"], i)}`,
      customerType: isBusiness ? "BUSINESS" : "RETAIL",
      creditLimit: isBusiness ? 100000 + i * 5000 : 0,
      daysAgo,
    });
  }

  for (let idx = 0; idx < customersData.length; idx++) {
    const c = customersData[idx];
    const cDate = pastDate(c.daysAgo, (idx * 3) % 12);
    await prisma.customer.upsert({
      where: { id: c.id },
      update: {
        contactPerson: c.contactPerson,
      },
      create: {
        id: c.id, organizationId: ORG_ID, name: c.name, contactPerson: c.contactPerson,
        phone: c.phone, email: c.email, address: c.address, customerType: c.customerType,
        creditLimit: D(c.creditLimit), status: "ACTIVE",
        createdAt: cDate, updatedAt: cDate,
      },
    });
  }
  count("Customer", customersData.length + referenceBusinessCustomers.length);
  console.log("✅ Customers");

  // ── 8. Inventory ──────────────────────────────────────────────────────────
  type InvRecord = { storeId: string; productId: string; onHand: number; reserved: number };
  const inventoryRecords: InvRecord[] = [];

  for (const p of PRODUCTS) {
    const stores = storesFor(p.storeDistribution);
    for (let si = 0; si < stores.length; si++) {
      const baseStock = p.reorderLevel * 3;
      // Vary stock: some healthy, some low, some zero
      let onHand: number;
      let reserved: number;
      const variation = (si + parseInt(p.id.slice(-2), 10)) % 10;
      if (variation < 1) {
        onHand = 0; reserved = 0; // out-of-stock
      } else if (variation < 3) {
        onHand = Math.max(1, Math.floor(p.reorderLevel * 0.5)); reserved = 0; // low stock
      } else if (variation < 5) {
        onHand = baseStock; reserved = Math.floor(baseStock * 0.1); // normal
      } else {
        onHand = Math.floor(baseStock * 1.5); reserved = Math.floor(baseStock * 0.05); // high stock
      }
      inventoryRecords.push({ storeId: stores[si], productId: p.id, onHand, reserved });
    }
  }

  for (const inv of inventoryRecords) {
    await prisma.inventory.upsert({
      where: {
        organizationId_storeId_productId: {
          organizationId: ORG_ID, storeId: inv.storeId, productId: inv.productId,
        },
      },
      update: { onHand: inv.onHand, reserved: inv.reserved },
      create: {
        organizationId: ORG_ID, storeId: inv.storeId, productId: inv.productId,
        onHand: inv.onHand, reserved: inv.reserved,
      },
    });
  }
  count("Inventory", inventoryRecords.length);
  console.log("✅ Inventory");

  // ── 9. Purchase Orders ────────────────────────────────────────────────────
  const PO_STATUSES = ["DRAFT", "ORDERED", "PARTIALLY_RECEIVED", "RECEIVED", "RECEIVED", "RECEIVED", "CANCELLED"] as const;
  const poItems: Array<{ purchaseOrderId: string; productId: string; quantity: number; unitCost: number; tax: number; total: number }> = [];
  const poMovements: Array<{ storeId: string; productId: string; quantity: number; unitCost: number; refId: string; date: Date }> = [];

  for (let poIdx = 0; poIdx < 25; poIdx++) {
    const poId = seedId("po", poIdx + 1);
    const poNumber = createRef("PO", poIdx + 1);
    const storeId = pick(STORE_IDS, poIdx);
    const partnerId = PARTNERS_DATA[poIdx % PARTNERS_DATA.length].id;
    const status = PO_STATUSES[poIdx % PO_STATUSES.length];
    const poDate = pastDate(80 - poIdx * 3, poIdx);
    const itemCount = 2 + (poIdx % 7);

    let subtotal = 0;
    let totalTax = 0;
    const items: typeof poItems = [];

    for (let ii = 0; ii < itemCount; ii++) {
      const prod = PRODUCTS[(poIdx * 7 + ii) % PRODUCTS.length];
      const qty = 10 + ((poIdx + ii) % 40) * 5;
      const line = calcPurchaseLineTotal(qty, prod.costPrice, prod.taxRate);
      items.push({
        purchaseOrderId: poId, productId: prod.id,
        quantity: qty, unitCost: prod.costPrice, tax: line.tax, total: line.total,
      });
      subtotal += line.subtotal;
      totalTax += line.tax;

      // Create inventory movements for received POs
      if (status === "RECEIVED" || status === "PARTIALLY_RECEIVED") {
        poMovements.push({
          storeId, productId: prod.id, quantity: qty,
          unitCost: prod.costPrice, refId: poId, date: poDate,
        });
      }
    }

    const total = Math.round((subtotal + totalTax) * 100) / 100;

    await prisma.purchaseOrder.upsert({
      where: { organizationId_orderNumber: { organizationId: ORG_ID, orderNumber: poNumber } },
      update: {},
      create: {
        id: poId, organizationId: ORG_ID, storeId, partnerId, orderNumber: poNumber,
        status, subtotal: money(subtotal), tax: money(totalTax), total: money(total),
        createdAt: poDate, updatedAt: poDate,
      },
    });

    for (const item of items) {
      // Check if item already exists to avoid duplicates on re-run
      const existing = await prisma.purchaseOrderItem.findFirst({
        where: { purchaseOrderId: item.purchaseOrderId, productId: item.productId },
      });
      if (!existing) {
        await prisma.purchaseOrderItem.create({
          data: {
            purchaseOrderId: item.purchaseOrderId, productId: item.productId,
            quantity: item.quantity, unitCost: D(item.unitCost),
            tax: money(item.tax), total: money(item.total),
          },
        });
      }
    }
    poItems.push(...items);
  }
  count("PurchaseOrder", 25);
  count("PurchaseOrderItem", poItems.length);
  console.log("✅ Purchase Orders");

  // ── 10. Sales Orders ──────────────────────────────────────────────────────
  const SO_STATUSES = ["DRAFT", "CONFIRMED", "PROCESSING", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "CANCELLED", "REFUNDED"] as const;
  const PAYMENT_METHODS = ["CASH", "CARD", "UPI", "BANK_TRANSFER", "UPI", "CASH", "CARD"] as const;
  const soData: Array<{
    id: string; orderNumber: string; storeId: string; customerId: string | null;
    status: string; subtotal: number; discount: number; tax: number; total: number;
    date: Date; items: Array<{ productId: string; quantity: number; unitPrice: number; discount: number; tax: number; total: number }>;
  }> = [];

  for (let soIdx = 0; soIdx < 75; soIdx++) {
    const soId = seedId("so", soIdx + 1);
    const soNumber = createRef("SO", soIdx + 1);
    const storeId = pick(STORE_IDS, soIdx);
    const allCustomerIds = [...referenceBusinessCustomers.map((rc) => rc.id), ...customersData.map((c) => c.id)];
    const customerId = soIdx % 6 === 0 ? null : allCustomerIds[soIdx % allCustomerIds.length];
    const status = SO_STATUSES[soIdx % SO_STATUSES.length];
    const soDate = pastDate(90 - soIdx, soIdx);
    const itemCount = 1 + (soIdx % 8);

    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    const items: Array<{ productId: string; quantity: number; unitPrice: number; discount: number; tax: number; total: number }> = [];

    for (let ii = 0; ii < itemCount; ii++) {
      const prod = PRODUCTS[(soIdx * 3 + ii) % PRODUCTS.length];
      const qty = 1 + ((soIdx + ii) % 5);
      const lineDiscount = soIdx % 4 === 0 ? Math.round(prod.sellingPrice * qty * 0.05 * 100) / 100 : 0;
      const line = calcSalesLineTotal(qty, prod.sellingPrice, lineDiscount, prod.taxRate);
      items.push({
        productId: prod.id, quantity: qty, unitPrice: prod.sellingPrice,
        discount: lineDiscount, tax: line.tax, total: line.total,
      });
      subtotal += line.subtotal;
      totalTax += line.tax;
      totalDiscount += lineDiscount;
    }

    const total = Math.round((subtotal - totalDiscount + totalTax) * 100) / 100;
    soData.push({
      id: soId, orderNumber: soNumber, storeId, customerId, status,
      subtotal, discount: totalDiscount, tax: totalTax, total, date: soDate, items,
    });
  }

  for (const so of soData) {
    await prisma.salesOrder.upsert({
      where: { organizationId_orderNumber: { organizationId: ORG_ID, orderNumber: so.orderNumber } },
      update: {},
      create: {
        id: so.id, organizationId: ORG_ID, storeId: so.storeId,
        customerId: so.customerId, orderNumber: so.orderNumber,
        status: so.status as "DRAFT" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED",
        subtotal: money(so.subtotal), discount: money(so.discount),
        tax: money(so.tax), total: money(so.total),
        createdAt: so.date, updatedAt: so.date,
      },
    });

    for (const item of so.items) {
      const existing = await prisma.salesOrderItem.findFirst({
        where: { salesOrderId: so.id, productId: item.productId },
      });
      if (!existing) {
        await prisma.salesOrderItem.create({
          data: {
            salesOrderId: so.id, productId: item.productId,
            quantity: item.quantity, unitPrice: D(item.unitPrice),
            discount: money(item.discount), tax: money(item.tax), total: money(item.total),
          },
        });
      }
    }
  }
  count("SalesOrder", soData.length);
  count("SalesOrderItem", soData.reduce((s, o) => s + o.items.length, 0));
  console.log("✅ Sales Orders");

  // ── 11. Payments ──────────────────────────────────────────────────────────
  let paymentIdx = 0;
  for (const so of soData) {
    if (so.status === "COMPLETED" || so.status === "REFUNDED") {
      const payId = seedId("pay", ++paymentIdx);
      const method = PAYMENT_METHODS[paymentIdx % PAYMENT_METHODS.length];
      const payStatus = so.status === "REFUNDED" ? "REFUNDED" : "PAID";

      const existing = await prisma.payment.findFirst({ where: { salesOrderId: so.id } });
      if (!existing) {
        await prisma.payment.create({
          data: {
            id: payId, organizationId: ORG_ID, salesOrderId: so.id,
            amount: money(so.total), method, status: payStatus,
            reference: `REF-${method}-${paymentIdx}`,
            paidAt: so.date, createdAt: so.date,
          },
        });
      }
    } else if (so.status === "CONFIRMED" || so.status === "PROCESSING") {
      // Some pending payments
      if (paymentIdx % 3 === 0) {
        const payId = seedId("pay", ++paymentIdx);
        const existing = await prisma.payment.findFirst({ where: { salesOrderId: so.id } });
        if (!existing) {
          await prisma.payment.create({
            data: {
              id: payId, organizationId: ORG_ID, salesOrderId: so.id,
              amount: money(so.total), method: "UPI", status: "PENDING",
              reference: `REF-PENDING-${paymentIdx}`, createdAt: so.date,
            },
          });
        }
      }
    }
  }
  count("Payment", paymentIdx);
  console.log("✅ Payments");

  // ── 12. Inventory Movements ───────────────────────────────────────────────
  let mvIdx = 0;

  // Opening stock movements
  for (const inv of inventoryRecords) {
    if (inv.onHand > 0) {
      const prod = PRODUCTS.find((p) => p.id === inv.productId)!;
      const existing = await prisma.inventoryMovement.findFirst({
        where: { storeId: inv.storeId, productId: inv.productId, type: "OPENING" },
      });
      if (!existing) {
        await prisma.inventoryMovement.create({
          data: {
            id: seedId("mv", ++mvIdx), organizationId: ORG_ID,
            storeId: inv.storeId, productId: inv.productId,
            type: "OPENING", quantity: inv.onHand,
            unitCost: D(prod.costPrice), referenceType: "OPENING",
            notes: "Initial opening stock", createdAt: pastDate(90),
          },
        });
      }
    }
  }

  // Purchase movements
  for (const pm of poMovements) {
    const existing = await prisma.inventoryMovement.findFirst({
      where: { storeId: pm.storeId, productId: pm.productId, referenceId: pm.refId, type: "PURCHASE" },
    });
    if (!existing) {
      await prisma.inventoryMovement.create({
        data: {
          id: seedId("mv", ++mvIdx), organizationId: ORG_ID,
          storeId: pm.storeId, productId: pm.productId,
          type: "PURCHASE", quantity: pm.quantity,
          unitCost: D(pm.unitCost), referenceType: "PURCHASE",
          referenceId: pm.refId, notes: "Purchase order received",
          createdAt: pm.date,
        },
      });
    }
  }

  // Sale movements (for completed sales)
  for (const so of soData) {
    if (so.status === "COMPLETED") {
      for (const item of so.items) {
        const prod = PRODUCTS.find((p) => p.id === item.productId)!;
        const existing = await prisma.inventoryMovement.findFirst({
          where: { storeId: so.storeId, productId: item.productId, referenceId: so.id, type: "SALE" },
        });
        if (!existing) {
          await prisma.inventoryMovement.create({
            data: {
              id: seedId("mv", ++mvIdx), organizationId: ORG_ID,
              storeId: so.storeId, productId: item.productId,
              type: "SALE", quantity: -item.quantity,
              unitCost: D(prod.costPrice), referenceType: "SALE",
              referenceId: so.id, notes: `Sale ${so.orderNumber}`,
              createdAt: so.date,
            },
          });
        }
      }
    }
  }

  // A few adjustment movements
  const adjustments = [
    { storeId: STORE_IDS[0], productId: "prod-0008", quantity: -5, notes: "Damaged goods - cola bottles broken" },
    { storeId: STORE_IDS[1], productId: "prod-0022", quantity: 10, notes: "Stock recount correction - soap" },
    { storeId: STORE_IDS[2], productId: "prod-0013", quantity: -8, notes: "Expired milk removed" },
    { storeId: STORE_IDS[3], productId: "prod-0066", quantity: 15, notes: "Recount correction - notebooks" },
  ];
  for (const adj of adjustments) {
    const existing = await prisma.inventoryMovement.findFirst({
      where: { storeId: adj.storeId, productId: adj.productId, type: "ADJUSTMENT" },
    });
    if (!existing) {
      await prisma.inventoryMovement.create({
        data: {
          id: seedId("mv", ++mvIdx), organizationId: ORG_ID,
          storeId: adj.storeId, productId: adj.productId,
          type: "ADJUSTMENT", quantity: adj.quantity,
          referenceType: "ADJUSTMENT", notes: adj.notes,
          createdAt: pastDate(15, mvIdx),
        },
      });
    }
  }

  // A couple of transfer movements
  const transfers = [
    { fromStore: STORE_IDS[0], toStore: STORE_IDS[1], productId: "prod-0001", quantity: 20 },
    { fromStore: STORE_IDS[2], toStore: STORE_IDS[3], productId: "prod-0027", quantity: 15 },
  ];
  for (const tr of transfers) {
    const existing = await prisma.inventoryMovement.findFirst({
      where: { storeId: tr.fromStore, productId: tr.productId, type: "TRANSFER_OUT" },
    });
    if (!existing) {
      const prod = PRODUCTS.find((p) => p.id === tr.productId)!;
      await prisma.inventoryMovement.create({
        data: {
          id: seedId("mv", ++mvIdx), organizationId: ORG_ID,
          storeId: tr.fromStore, productId: tr.productId,
          type: "TRANSFER_OUT", quantity: -tr.quantity,
          unitCost: D(prod.costPrice), referenceType: "TRANSFER",
          notes: `Transfer to ${tr.toStore}`, createdAt: pastDate(10, mvIdx),
        },
      });
      await prisma.inventoryMovement.create({
        data: {
          id: seedId("mv", ++mvIdx), organizationId: ORG_ID,
          storeId: tr.toStore, productId: tr.productId,
          type: "TRANSFER_IN", quantity: tr.quantity,
          unitCost: D(prod.costPrice), referenceType: "TRANSFER",
          notes: `Transfer from ${tr.fromStore}`, createdAt: pastDate(10, mvIdx),
        },
      });
    }
  }
  count("InventoryMovement", mvIdx);
  console.log("✅ Inventory Movements");

  // ── 13. Accounts (Chart of Accounts) ──────────────────────────────────────
  for (const acc of ACCOUNTS) {
    await prisma.account.upsert({
      where: { organizationId_code: { organizationId: ORG_ID, code: acc.code } },
      update: {},
      create: {
        id: acc.id, organizationId: ORG_ID, code: acc.code,
        name: acc.name, type: acc.type, isActive: true,
      },
    });
  }
  count("Account", ACCOUNTS.length);
  console.log("✅ Accounts");

  // ── 14. Journal Entries ───────────────────────────────────────────────────
  let jeIdx = 0;

  // Journal entries for completed sales (sample — first 15)
  const completedSales = soData.filter((s) => s.status === "COMPLETED").slice(0, 15);
  for (const so of completedSales) {
    jeIdx++;
    const jeId = seedId("je", jeIdx);
    const jeNumber = createRef("JE", jeIdx);
    const existing = await prisma.journalEntry.findFirst({
      where: { organizationId: ORG_ID, referenceId: so.id, referenceType: "SALE" },
    });
    if (!existing) {
      await prisma.journalEntry.create({
        data: {
          id: jeId, organizationId: ORG_ID, entryNumber: jeNumber,
          referenceType: "SALE", referenceId: so.id,
          description: `Sales revenue for ${so.orderNumber}`,
          entryDate: so.date, createdAt: so.date,
          lines: {
            create: [
              { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-1000", debit: money(so.total), credit: D(0) },
              ...(so.discount > 0 ? [{ id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-4100", debit: money(so.discount), credit: D(0) }] : []),
              { id: seedId("jl", jeIdx * 10 + 3), accountId: "acc-4000", debit: D(0), credit: money(so.subtotal) },
              { id: seedId("jl", jeIdx * 10 + 4), accountId: "acc-2100", debit: D(0), credit: money(so.tax) },
            ],
          },
        },
      });
    }
  }

  // Journal entries for received purchases (sample — first 10)
  const receivedPOs = poItems.slice(0, 10);
  for (let pi = 0; pi < Math.min(10, 25); pi++) {
    const poId = seedId("po", pi + 1);
    const poStatus = PO_STATUSES[pi % PO_STATUSES.length];
    if (poStatus !== "RECEIVED") continue;

    jeIdx++;
    const jeId = seedId("je", jeIdx);
    const jeNumber = createRef("JE", jeIdx);
    const poDate = pastDate(80 - pi * 3, pi);

    const existing = await prisma.journalEntry.findFirst({
      where: { organizationId: ORG_ID, referenceId: poId, referenceType: "PURCHASE" },
    });
    if (!existing) {
      // Get total for this PO
      const poRecord = await prisma.purchaseOrder.findUnique({ where: { id: poId } });
      if (poRecord) {
        await prisma.journalEntry.create({
          data: {
            id: jeId, organizationId: ORG_ID, entryNumber: jeNumber,
            referenceType: "PURCHASE", referenceId: poId,
            description: `Purchase order ${createRef("PO", pi + 1)} received`,
            entryDate: poDate, createdAt: poDate,
            lines: {
              create: [
                { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-1200", debit: poRecord.subtotal, credit: D(0) },
                { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1300", debit: poRecord.tax, credit: D(0) },
                { id: seedId("jl", jeIdx * 10 + 3), accountId: "acc-2000", debit: D(0), credit: poRecord.total },
              ],
            },
          },
        });
      }
    }
  }

  // COGS entries for completed sales (sample — first 10)
  for (let ci = 0; ci < Math.min(10, completedSales.length); ci++) {
    const so = completedSales[ci];
    jeIdx++;
    const jeId = seedId("je", jeIdx);
    const jeNumber = createRef("JE", jeIdx);

    const existing = await prisma.journalEntry.findFirst({
      where: { organizationId: ORG_ID, referenceId: so.id, referenceType: "COGS" },
    });
    if (!existing) {
      // Approximate COGS from cost prices
      let cogsCost = 0;
      for (const item of so.items) {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        if (prod) cogsCost += item.quantity * prod.costPrice;
      }
      await prisma.journalEntry.create({
        data: {
          id: jeId, organizationId: ORG_ID, entryNumber: jeNumber,
          referenceType: "COGS", referenceId: so.id,
          description: `Cost of goods sold for ${so.orderNumber}`,
          entryDate: so.date, createdAt: so.date,
          lines: {
            create: [
              { id: seedId("jl", jeIdx * 10 + 1), accountId: "acc-5000", debit: money(cogsCost), credit: D(0) },
              { id: seedId("jl", jeIdx * 10 + 2), accountId: "acc-1200", debit: D(0), credit: money(cogsCost) },
            ],
          },
        },
      });
    }
  }
  count("JournalEntry", jeIdx);
  console.log("✅ Journal Entries");

  // ── 15. Audit Logs ────────────────────────────────────────────────────────
  const auditLogs = [
    { action: "ORGANIZATION_CREATED", entity: "Organization", entityId: ORG_ID, newValue: { name: ORG.name, code: ORG.code }, daysAgo: 90 },
    { action: "STORE_CREATED", entity: "Store", entityId: STORES[0].id, newValue: { name: STORES[0].name, code: STORES[0].code }, daysAgo: 89 },
    { action: "STORE_CREATED", entity: "Store", entityId: STORES[1].id, newValue: { name: STORES[1].name, code: STORES[1].code }, daysAgo: 89 },
    { action: "PRODUCT_CREATED", entity: "Product", entityId: "prod-0001", newValue: { name: PRODUCTS[0].name, sku: PRODUCTS[0].sku }, daysAgo: 85 },
    { action: "PRODUCT_CREATED", entity: "Product", entityId: "prod-0008", newValue: { name: PRODUCTS[7].name, sku: PRODUCTS[7].sku }, daysAgo: 85 },
    { action: "PRODUCT_UPDATED", entity: "Product", entityId: "prod-0001", oldValue: { sellingPrice: 450 }, newValue: { sellingPrice: 475 }, daysAgo: 60 },
    { action: "INVENTORY_ADJUSTED", entity: "Inventory", entityId: `${STORES[0].id}:prod-0008`, newValue: { adjustment: -5, reason: "Damaged goods" }, daysAgo: 15 },
    { action: "PURCHASE_CREATED", entity: "PurchaseOrder", entityId: "po-0001", newValue: { orderNumber: "PO-000001", status: "DRAFT" }, daysAgo: 78 },
    { action: "PURCHASE_RECEIVED", entity: "PurchaseOrder", entityId: "po-0004", newValue: { orderNumber: "PO-000004", status: "RECEIVED" }, daysAgo: 68 },
    { action: "SALE_CREATED", entity: "SalesOrder", entityId: "so-0001", newValue: { orderNumber: "SO-000001", status: "DRAFT" }, daysAgo: 88 },
    { action: "SALE_COMPLETED", entity: "SalesOrder", entityId: "so-0004", newValue: { orderNumber: "SO-000004", status: "COMPLETED" }, daysAgo: 86 },
    { action: "STORE_UPDATED", entity: "Store", entityId: STORES[2].id, oldValue: { phone: "+91 22 00000000" }, newValue: { phone: STORES[2].phone }, daysAgo: 45 },
    { action: "CUSTOMER_CREATED", entity: "Customer", entityId: "cust-0001", newValue: { name: customersData[0].name }, daysAgo: 80 },
    { action: "PARTNER_CREATED", entity: "Partner", entityId: "partner-0001", newValue: { name: PARTNERS_DATA[0].name, type: "SUPPLIER" }, daysAgo: 82 },
    { action: "PAYMENT_RECEIVED", entity: "Payment", entityId: "pay-0001", newValue: { method: "CASH", status: "PAID" }, daysAgo: 86 },
  ];

  for (let ai = 0; ai < auditLogs.length; ai++) {
    const log = auditLogs[ai];
    const logId = seedId("audit", ai + 1);
    const existing = await prisma.auditLog.findFirst({
      where: { id: logId },
    });
    if (!existing) {
      await prisma.auditLog.create({
        data: {
          id: logId, organizationId: ORG_ID, userId: ADMIN_USER_ID,
          action: log.action, entity: log.entity, entityId: log.entityId,
          oldValue: log.oldValue ?? Prisma.JsonNull,
          newValue: log.newValue,
          createdAt: pastDate(log.daysAgo, ai),
        },
      });
    }
  }
  count("AuditLog", auditLogs.length);
  console.log("✅ Audit Logs");

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n🎉 Phase 3 seed complete! Record counts:");
  for (const [model, n] of Object.entries(counts)) {
    console.log(`   ${model}: ${n}`);
  }
}

// =============================================================================
// ENTRY POINT
// =============================================================================
main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
