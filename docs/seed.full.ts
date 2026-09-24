import {
  PrismaClient,
  Prisma,
  UserStatus,
  StoreStatus,
  ProductStatus,
  InventoryMovementType,
  PartnerType,
  CustomerType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  PurchaseStatus,
  AccountType,
  JournalStatus,
  ReportStatus,
  NotificationType,
  WorkflowStatus
} from "@prisma/client";

const prisma = new PrismaClient();
const D = (v: string) => new Prisma.Decimal(v);

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: "org-demo-001" },
    update: {},
    create: {
      id: "org-demo-001",
      name: "Walmart ERP Demo",
      legalName: "Walmart ERP Demo Pvt Ltd",
      currency: "INR",
      timezone: "Asia/Kolkata",
      locale: "en-IN"
    }
  });

  // Roles / permissions
  const codes = [
    "dashboard.view", "inventory.view", "inventory.manage", "stores.view", "stores.manage",
    "partners.view", "partners.manage", "customers.view", "customers.manage", "ledger.view",
    "ledger.manage", "reports.view", "reports.export", "settings.view", "settings.manage"
  ];
  for (const code of codes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { id: `perm-${code.replaceAll(".", "-")}`, code }
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { id: "role-admin" },
    update: {},
    create: { id: "role-admin", name: "Administrator", description: "Full access" }
  });
  const managerRole = await prisma.role.upsert({
    where: { id: "role-manager" },
    update: {},
    create: { id: "role-manager", name: "Store Manager", description: "Operational access" }
  });
  const analystRole = await prisma.role.upsert({
    where: { id: "role-analyst" },
    update: {},
    create: { id: "role-analyst", name: "Analyst", description: "Dashboard/report access" }
  });

  const permissions = await prisma.permission.findMany();
  for (const p of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id }
    });
  }

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user-admin-001",
        organizationId: org.id,
        name: "Aarav Mehta",
        email: "admin@walmart-erp.local",
        phone: "+91 9000000001",
        status: UserStatus.ACTIVE,
        passwordHash: "DEMO_ARGON2_HASH"
      }
    }),
    prisma.user.create({
      data: {
        id: "user-manager-001",
        organizationId: org.id,
        name: "Riya Shah",
        email: "manager@walmart-erp.local",
        phone: "+91 9000000002",
        status: UserStatus.ACTIVE,
        passwordHash: "DEMO_ARGON2_HASH"
      }
    }),
    prisma.user.create({
      data: {
        id: "user-analyst-001",
        organizationId: org.id,
        name: "Kabir Patel",
        email: "analyst@walmart-erp.local",
        phone: "+91 9000000003",
        status: UserStatus.ACTIVE,
        passwordHash: "DEMO_ARGON2_HASH"
      }
    })
  ]);

  await prisma.userRole.createMany({
    data: [
      { userId: users[0].id, roleId: adminRole.id },
      { userId: users[1].id, roleId: managerRole.id },
      { userId: users[2].id, roleId: analystRole.id }
    ]
  });

  // Regions / stores
  const west = await prisma.region.create({
    data: { id: "region-west", organizationId: org.id, name: "West India", code: "WEST" }
  });
  const north = await prisma.region.create({
    data: { id: "region-north", organizationId: org.id, name: "North India", code: "NORTH" }
  });

  const stores = await Promise.all([
    prisma.store.create({
      data: {
        id: "store-mumbai-01",
        organizationId: org.id,
        regionId: west.id,
        code: "MUM-001",
        name: "Mumbai Central Store",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400013",
        imageUrl: "/images/stores/store-main.webp"
      }
    }),
    prisma.store.create({
      data: {
        id: "store-pune-01",
        organizationId: org.id,
        regionId: west.id,
        code: "PUN-001",
        name: "Pune City Store",
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411005",
        imageUrl: "/images/stores/store-main.webp"
      }
    }),
    prisma.store.create({
      data: {
        id: "store-delhi-01",
        organizationId: org.id,
        regionId: north.id,
        code: "DEL-001",
        name: "Delhi Central Store",
        city: "New Delhi",
        state: "Delhi",
        postalCode: "110017",
        imageUrl: "/images/stores/store-main.webp"
      }
    })
  ]);

  // Categories / products
  const cats = await Promise.all([
    prisma.category.create({
      data: { id: "cat-bev", organizationId: org.id, name: "Beverages", code: "BEV", imageUrl: "/images/categories/beverages.webp" }
    }),
    prisma.category.create({
      data: { id: "cat-grocery", organizationId: org.id, name: "Groceries", code: "GRC", imageUrl: "/images/categories/groceries.webp" }
    }),
    prisma.category.create({
      data: { id: "cat-elec", organizationId: org.id, name: "Electronics", code: "ELEC", imageUrl: "/images/categories/electronics.webp" }
    }),
    prisma.category.create({
      data: { id: "cat-home", organizationId: org.id, name: "Household", code: "HOME", imageUrl: "/images/categories/household.webp" }
    })
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        id: "prod-001",
        organizationId: org.id,
        categoryId: cats[0].id,
        sku: "BEV-COLA-500",
        barcode: "890100000001",
        name: "Cola Soft Drink 500ml",
        brand: "Demo Cola",
        costPrice: D("28"),
        sellingPrice: D("40"),
        reorderLevel: 50,
        taxRate: D("18"),
        imageUrl: "/images/products/beverages/cola-500.webp",
        status: ProductStatus.ACTIVE
      }
    }),
    prisma.product.create({
      data: {
        id: "prod-002",
        organizationId: org.id,
        categoryId: cats[1].id,
        sku: "GRC-RICE-5KG",
        barcode: "890100000002",
        name: "Premium Rice 5kg",
        brand: "Demo Foods",
        costPrice: D("390"),
        sellingPrice: D("475"),
        reorderLevel: 20,
        taxRate: D("5"),
        imageUrl: "/images/products/groceries/rice-5kg.webp",
        status: ProductStatus.ACTIVE
      }
    }),
    prisma.product.create({
      data: {
        id: "prod-003",
        organizationId: org.id,
        categoryId: cats[2].id,
        sku: "ELEC-EARBUD-01",
        barcode: "890100000003",
        name: "Wireless Earbuds",
        brand: "Demo Audio",
        costPrice: D("850"),
        sellingPrice: D("1299"),
        reorderLevel: 10,
        taxRate: D("18"),
        imageUrl: "/images/products/electronics/earbuds.webp",
        status: ProductStatus.ACTIVE
      }
    }),
    prisma.product.create({
      data: {
        id: "prod-004",
        organizationId: org.id,
        categoryId: cats[3].id,
        sku: "HOME-DETERGENT-2L",
        barcode: "890100000004",
        name: "Liquid Detergent 2L",
        brand: "Demo Home",
        costPrice: D("180"),
        sellingPrice: D("245"),
        reorderLevel: 30,
        taxRate: D("18"),
        imageUrl: "/images/products/household/detergent.webp",
        status: ProductStatus.ACTIVE
      }
    })
  ]);

  // Inventory: 4 products × 3 stores
  const stock = [
    ["store-mumbai-01", 320, 145, 42, 88],
    ["store-pune-01", 210, 95, 18, 65],
    ["store-delhi-01", 275, 120, 31, 72]
  ];
  for (const [storeId, a, b, c, e] of stock) {
    for (const [i, qty] of [a, b, c, e].entries()) {
      await prisma.inventory.create({
        data: {
          storeId: storeId as string,
          productId: products[i].id,
          onHand: qty as number,
          reserved: i === 0 ? 10 : 3,
          damaged: 0
        }
      });
    }
  }

  // Parties
  const partner = await prisma.partner.create({
    data: {
      id: "partner-001",
      organizationId: org.id,
      code: "SUP-001",
      type: PartnerType.SUPPLIER,
      name: "Demo Consumer Goods Supply",
      contactPerson: "Nikhil Shah",
      email: "supplier@example.local",
      phone: "+91 9000020001",
      city: "Mumbai",
      state: "Maharashtra",
      gstin: "27AAAAA0000A1Z5",
      creditLimit: D("500000"),
      outstanding: D("125000")
    }
  });

  const customer = await prisma.customer.create({
    data: {
      id: "customer-001",
      organizationId: org.id,
      code: "CUS-001",
      type: CustomerType.RETAIL,
      name: "Rahul Mehta",
      email: "rahul@example.local",
      phone: "+91 9000030001",
      city: "Mumbai",
      state: "Maharashtra"
    }
  });

  // Completed sale: 2 earbuds
  const sale = await prisma.salesOrder.create({
    data: {
      id: "sale-001",
      organizationId: org.id,
      storeId: stores[0].id,
      customerId: customer.id,
      createdById: users[1].id,
      orderNumber: "SO-2026-0001",
      status: OrderStatus.COMPLETED,
      subtotal: D("2598"),
      taxAmount: D("467.64"),
      discountAmount: D("100"),
      totalAmount: D("2965.64"),
      paidAmount: D("2965.64"),
      paymentStatus: PaymentStatus.PAID,
      orderedAt: new Date("2026-09-22T12:15:00+05:30"),
      completedAt: new Date("2026-09-22T12:25:00+05:30"),
      items: {
        create: {
          id: "sale-item-001",
          productId: products[2].id,
          quantity: 2,
          unitPrice: D("1299"),
          unitCost: D("850"),
          discount: D("100"),
          taxAmount: D("467.64"),
          lineTotal: D("2965.64")
        }
      }
    }
  });

  await prisma.payment.create({
    data: {
      id: "payment-001",
      salesOrderId: sale.id,
      amount: D("2965.64"),
      method: PaymentMethod.UPI,
      status: PaymentStatus.PAID,
      reference: "UPI-DEMO-0001"
    }
  });

  // Received purchase
  const po = await prisma.purchaseOrder.create({
    data: {
      id: "po-001",
      organizationId: org.id,
      storeId: stores[0].id,
      partnerId: partner.id,
      createdById: users[1].id,
      orderNumber: "PO-2026-0001",
      status: PurchaseStatus.RECEIVED,
      subtotal: D("56000"),
      taxAmount: D("10080"),
      totalAmount: D("66080"),
      orderedAt: new Date("2026-09-18T10:00:00+05:30"),
      receivedAt: new Date("2026-09-20T15:30:00+05:30"),
      items: {
        create: {
          id: "po-item-001",
          productId: products[0].id,
          quantity: 2000,
          receivedQty: 2000,
          unitCost: D("28"),
          taxAmount: D("10080"),
          lineTotal: D("66080")
        }
      }
    }
  });

  await prisma.inventoryMovement.createMany({
    data: [
      {
        id: "move-sale-001",
        organizationId: org.id,
        storeId: stores[0].id,
        productId: products[2].id,
        userId: users[1].id,
        movementType: InventoryMovementType.SALE,
        quantity: -2,
        unitCost: D("850"),
        referenceType: "SalesOrder",
        referenceId: sale.id,
        note: "Completed customer sale"
      },
      {
        id: "move-purchase-001",
        organizationId: org.id,
        storeId: stores[0].id,
        productId: products[0].id,
        userId: users[1].id,
        movementType: InventoryMovementType.PURCHASE,
        quantity: 2000,
        unitCost: D("28"),
        referenceType: "PurchaseOrder",
        referenceId: po.id,
        note: "Supplier shipment received"
      }
    ]
  });

  // Chart of accounts + balanced sale journal
  const accounts = await Promise.all([
    prisma.account.create({ data: { id: "acct-bank", organizationId: org.id, code: "1010", name: "Bank", type: AccountType.ASSET } }),
    prisma.account.create({ data: { id: "acct-inventory", organizationId: org.id, code: "1200", name: "Inventory", type: AccountType.ASSET } }),
    prisma.account.create({ data: { id: "acct-revenue", organizationId: org.id, code: "4000", name: "Sales Revenue", type: AccountType.REVENUE } }),
    prisma.account.create({ data: { id: "acct-cogs", organizationId: org.id, code: "5000", name: "Cost of Goods Sold", type: AccountType.EXPENSE } }),
    prisma.account.create({ data: { id: "acct-payable", organizationId: org.id, code: "2000", name: "Accounts Payable", type: AccountType.LIABILITY } })
  ]);
  const byCode = Object.fromEntries(accounts.map((a) => [a.code, a]));

  await prisma.journalEntry.create({
    data: {
      id: "journal-sale-001",
      organizationId: org.id,
      referenceType: "SalesOrder",
      referenceId: sale.id,
      entryNumber: "JE-2026-0001",
      description: "Sale SO-2026-0001",
      status: JournalStatus.POSTED,
      lines: {
        create: [
          { id: "jl-001", accountId: byCode["1010"].id, debit: D("2965.64"), credit: D("0"), description: "UPI received" },
          { id: "jl-002", accountId: byCode["4000"].id, debit: D("0"), credit: D("2598"), description: "Sales revenue" },
          { id: "jl-003", accountId: byCode["5000"].id, debit: D("1700"), credit: D("0"), description: "COGS" },
          { id: "jl-004", accountId: byCode["1200"].id, debit: D("0"), credit: D("1700"), description: "Inventory reduction" }
        ]
      }
    }
  });

  // Reports, notifications, settings, audit/workflow
  const report = await prisma.report.create({
    data: { id: "report-sales", organizationId: org.id, name: "Sales Performance", code: "SALES_PERFORMANCE", category: "Sales" }
  });
  await prisma.reportRun.create({
    data: {
      id: "report-run-001",
      organizationId: org.id,
      reportId: report.id,
      requestedById: users[2].id,
      status: ReportStatus.COMPLETED,
      filters: { storeId: stores[0].id, dateFrom: "2026-09-01", dateTo: "2026-09-23" },
      resultMeta: { rows: 124 },
      completedAt: new Date("2026-09-23T10:00:04+05:30")
    }
  });

  await prisma.notification.create({
    data: {
      id: "notification-001",
      organizationId: org.id,
      userId: users[1].id,
      type: NotificationType.STOCK_ALERT,
      title: "Low stock alert",
      message: "Wireless Earbuds are approaching reorder level at Pune City Store.",
      actionUrl: "/inventory?store=store-pune-01&status=low-stock"
    }
  });

  await prisma.setting.createMany({
    data: [
      { id: "setting-currency", organizationId: org.id, key: "currency", value: "INR", category: "financial" },
      { id: "setting-store", organizationId: org.id, key: "default_store_id", value: stores[0].id, category: "organization" },
      { id: "setting-responsive", organizationId: org.id, key: "dashboard_layout", value: "responsive", category: "system" },
      { id: "setting-stock-alert", organizationId: org.id, key: "stock_alerts_enabled", value: true, category: "notifications" }
    ]
  });

  await prisma.auditLog.create({
    data: {
      id: "audit-001",
      organizationId: org.id,
      userId: users[1].id,
      storeId: stores[0].id,
      action: "CREATE",
      entityType: "SalesOrder",
      entityId: sale.id,
      afterData: { orderNumber: sale.orderNumber, total: "2965.64" }
    }
  });

  await prisma.workflow.create({
    data: {
      id: "workflow-001",
      organizationId: org.id,
      requestedById: users[1].id,
      entityType: "InventoryAdjustment",
      entityId: "inv-demo",
      action: "APPROVE_STOCK_ADJUSTMENT",
      status: WorkflowStatus.APPROVED,
      reviewedById: users[0].id,
      reviewNote: "Verified"
    }
  });

  console.log("ERP MVP dummy data seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
