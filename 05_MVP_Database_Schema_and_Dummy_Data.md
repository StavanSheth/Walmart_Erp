# ERP MVP — PostgreSQL + Prisma Database Schema & Dummy Data

## 1. Purpose

This is the database SSOT for the agreed ERP MVP: Next.js/React/TypeScript frontend, Fastify/TypeScript backend, Prisma ORM and PostgreSQL. Desktop, tablet and mobile use the same database, APIs, business logic and React data hooks. Responsive behavior is frontend-only.

### Core synchronization rule

```text
Desktop / Tablet / Mobile
          ↓
   Same React hooks
          ↓
   Same Fastify APIs
          ↓
     Same Prisma
          ↓
    Same PostgreSQL
```

There are no mobile/desktop tables, APIs or databases.

---

## 2. SSOT Entity Map

| Domain | Tables |
|---|---|
| Organization | Organization |
| Identity | User, Role, Permission, UserRole, RolePermission |
| Geography | Region, Store |
| Product | Category, Product |
| Inventory | Inventory, InventoryMovement |
| Parties | Partner, Customer |
| Sales | SalesOrder, SalesOrderItem, Payment |
| Purchasing | PurchaseOrder, PurchaseOrderItem |
| Finance | Account, JournalEntry, JournalLine |
| Reporting | Report, ReportRun |
| System | Notification, AuditLog, Document, Workflow, Setting |

Dashboard data is derived from these tables; there is intentionally no Dashboard table.

---

## 3. Business Relationships

```text
Organization
 ├── Users ── Roles ── Permissions
 ├── Regions ── Stores
 │              └── Inventory ── Products ── Categories
 ├── Partners
 ├── Customers
 ├── SalesOrders ── SalesOrderItems ── Products
 │       └── Payments
 ├── PurchaseOrders ── PurchaseOrderItems ── Products
 ├── Accounts ── JournalLines ── JournalEntries
 ├── Reports ── ReportRuns
 ├── Notifications
 ├── AuditLogs
 ├── Documents
 ├── Workflows
 └── Settings
```

Transaction synchronization:

```text
SALE COMPLETED
  → SalesOrder + Items
  → Payment
  → Inventory decrease
  → InventoryMovement
  → JournalEntry + JournalLines
  → AuditLog
  → Dashboard/Reports read the updated SSOT
```

```text
PURCHASE RECEIVED
  → PurchaseOrder + Items
  → Inventory increase
  → InventoryMovement
  → JournalEntry + JournalLines
  → Partner outstanding update
  → AuditLog
```

These writes should happen inside one Prisma transaction.

---

# 4. `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus { ACTIVE INVITED SUSPENDED DISABLED }
enum StoreStatus { ACTIVE INACTIVE MAINTENANCE }
enum ProductStatus { ACTIVE INACTIVE DISCONTINUED }
enum InventoryMovementType { PURCHASE SALE SALE_RETURN PURCHASE_RETURN ADJUSTMENT TRANSFER_IN TRANSFER_OUT DAMAGE STOCK_COUNT }
enum PartnerType { SUPPLIER WHOLESALER DISTRIBUTOR }
enum CustomerType { RETAIL BUSINESS }
enum OrderStatus { DRAFT CONFIRMED PROCESSING COMPLETED CANCELLED REFUNDED }
enum PaymentStatus { PENDING PARTIAL PAID REFUNDED FAILED }
enum PaymentMethod { CASH CARD UPI BANK_TRANSFER WALLET CREDIT }
enum PurchaseStatus { DRAFT ORDERED PARTIALLY_RECEIVED RECEIVED CANCELLED }
enum AccountType { ASSET LIABILITY EQUITY REVENUE EXPENSE }
enum JournalStatus { DRAFT POSTED VOID }
enum ReportStatus { QUEUED RUNNING COMPLETED FAILED }
enum NotificationType { INFO SUCCESS WARNING ERROR STOCK_ALERT PAYMENT_ALERT SYSTEM }
enum WorkflowStatus { PENDING APPROVED REJECTED CANCELLED }

model Organization {
  id String @id @default(uuid())
  name String
  legalName String?
  currency String @default("INR")
  timezone String @default("Asia/Kolkata")
  locale String @default("en-IN")
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users User[]
  regions Region[]
  stores Store[]
  categories Category[]
  products Product[]
  partners Partner[]
  customers Customer[]
  salesOrders SalesOrder[]
  purchaseOrders PurchaseOrder[]
  accounts Account[]
  journalEntries JournalEntry[]
  reports Report[]
  reportRuns ReportRun[]
  notifications Notification[]
  auditLogs AuditLog[]
  documents Document[]
  workflows Workflow[]
  settings Setting[]
  @@index([name])
}

model User {
  id String @id @default(uuid())
  organizationId String
  name String
  email String @unique
  phone String?
  avatarUrl String?
  status UserStatus @default(ACTIVE)
  passwordHash String
  lastLoginAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  roles UserRole[]
  salesOrders SalesOrder[]
  purchaseOrders PurchaseOrder[]
  inventoryMovements InventoryMovement[]
  notifications Notification[]
  auditLogs AuditLog[]
  workflows Workflow[]
  @@index([organizationId, status])
}

model Role {
  id String @id @default(uuid())
  name String @unique
  description String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users UserRole[]
  permissions RolePermission[]
}

model Permission {
  id String @id @default(uuid())
  code String @unique
  description String?
  roles RolePermission[]
}

model UserRole {
  userId String
  roleId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])
}

model RolePermission {
  roleId String
  permissionId String
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  @@id([roleId, permissionId])
}

model Region {
  id String @id @default(uuid())
  organizationId String
  name String
  code String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  stores Store[]
  @@unique([organizationId, code])
}

model Store {
  id String @id @default(uuid())
  organizationId String
  regionId String?
  code String
  name String
  addressLine1 String?
  city String?
  state String?
  postalCode String?
  country String @default("India")
  latitude Decimal? @db.Decimal(10,7)
  longitude Decimal? @db.Decimal(10,7)
  phone String?
  imageUrl String?
  status StoreStatus @default(ACTIVE)
  openingDate DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  region Region? @relation(fields: [regionId], references: [id], onDelete: SetNull)
  inventory Inventory[]
  inventoryMovements InventoryMovement[]
  salesOrders SalesOrder[]
  purchaseOrders PurchaseOrder[]
  auditLogs AuditLog[]
  @@unique([organizationId, code])
  @@index([organizationId, status])
  @@index([name])
}

model Category {
  id String @id @default(uuid())
  organizationId String
  parentId String?
  name String
  code String
  imageUrl String?
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  parent Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children Category[] @relation("CategoryHierarchy")
  products Product[]
  @@unique([organizationId, code])
  @@index([organizationId, isActive])
}

model Product {
  id String @id @default(uuid())
  organizationId String
  categoryId String?
  sku String
  barcode String?
  name String
  description String?
  brand String?
  unit String @default("pcs")
  costPrice Decimal @db.Decimal(12,2)
  sellingPrice Decimal @db.Decimal(12,2)
  reorderLevel Int @default(0)
  taxRate Decimal @default(0) @db.Decimal(5,2)
  imageUrl String?
  status ProductStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  inventory Inventory[]
  inventoryMovements InventoryMovement[]
  salesOrderItems SalesOrderItem[]
  purchaseOrderItems PurchaseOrderItem[]
  @@unique([organizationId, sku])
  @@unique([organizationId, barcode])
  @@index([organizationId, status])
  @@index([organizationId, name])
}

model Inventory {
  id String @id @default(uuid())
  storeId String
  productId String
  onHand Int @default(0)
  reserved Int @default(0)
  damaged Int @default(0)
  updatedAt DateTime @updatedAt
  store Store @relation(fields: [storeId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  @@unique([storeId, productId])
  @@index([storeId])
  @@index([productId])
}

model InventoryMovement {
  id String @id @default(uuid())
  organizationId String
  storeId String
  productId String
  userId String?
  movementType InventoryMovementType
  quantity Int
  unitCost Decimal? @db.Decimal(12,2)
  referenceType String?
  referenceId String?
  note String?
  createdAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  store Store @relation(fields: [storeId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([organizationId, createdAt])
  @@index([storeId, productId, createdAt])
  @@index([referenceType, referenceId])
}

model Partner {
  id String @id @default(uuid())
  organizationId String
  code String
  type PartnerType
  name String
  contactPerson String?
  email String?
  phone String?
  address String?
  city String?
  state String?
  gstin String?
  creditLimit Decimal @default(0) @db.Decimal(12,2)
  outstanding Decimal @default(0) @db.Decimal(12,2)
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  purchaseOrders PurchaseOrder[]
  @@unique([organizationId, code])
  @@index([organizationId, name])
}

model Customer {
  id String @id @default(uuid())
  organizationId String
  code String
  type CustomerType @default(RETAIL)
  name String
  email String?
  phone String?
  address String?
  city String?
  state String?
  gstin String?
  creditLimit Decimal @default(0) @db.Decimal(12,2)
  outstanding Decimal @default(0) @db.Decimal(12,2)
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  salesOrders SalesOrder[]
  @@unique([organizationId, code])
  @@index([organizationId, name])
}

model SalesOrder {
  id String @id @default(uuid())
  organizationId String
  storeId String
  customerId String?
  createdById String?
  orderNumber String
  status OrderStatus @default(DRAFT)
  subtotal Decimal @default(0) @db.Decimal(12,2)
  taxAmount Decimal @default(0) @db.Decimal(12,2)
  discountAmount Decimal @default(0) @db.Decimal(12,2)
  totalAmount Decimal @default(0) @db.Decimal(12,2)
  paidAmount Decimal @default(0) @db.Decimal(12,2)
  paymentStatus PaymentStatus @default(PENDING)
  orderedAt DateTime @default(now())
  completedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  store Store @relation(fields: [storeId], references: [id], onDelete: Restrict)
  customer Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  createdBy User? @relation(fields: [createdById], references: [id], onDelete: SetNull)
  items SalesOrderItem[]
  payments Payment[]
  @@unique([organizationId, orderNumber])
  @@index([organizationId, orderedAt])
  @@index([storeId, orderedAt])
}

model SalesOrderItem {
  id String @id @default(uuid())
  salesOrderId String
  productId String
  quantity Int
  unitPrice Decimal @db.Decimal(12,2)
  unitCost Decimal @db.Decimal(12,2)
  discount Decimal @default(0) @db.Decimal(12,2)
  taxAmount Decimal @default(0) @db.Decimal(12,2)
  lineTotal Decimal @db.Decimal(12,2)
  salesOrder SalesOrder @relation(fields: [salesOrderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Restrict)
  @@index([salesOrderId])
  @@index([productId])
}

model Payment {
  id String @id @default(uuid())
  salesOrderId String?
  amount Decimal @db.Decimal(12,2)
  method PaymentMethod
  status PaymentStatus @default(PAID)
  reference String?
  paidAt DateTime @default(now())
  createdAt DateTime @default(now())
  salesOrder SalesOrder? @relation(fields: [salesOrderId], references: [id], onDelete: SetNull)
  @@index([salesOrderId])
  @@index([paidAt])
}

model PurchaseOrder {
  id String @id @default(uuid())
  organizationId String
  storeId String
  partnerId String
  createdById String?
  orderNumber String
  status PurchaseStatus @default(DRAFT)
  subtotal Decimal @default(0) @db.Decimal(12,2)
  taxAmount Decimal @default(0) @db.Decimal(12,2)
  totalAmount Decimal @default(0) @db.Decimal(12,2)
  orderedAt DateTime @default(now())
  receivedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  store Store @relation(fields: [storeId], references: [id], onDelete: Restrict)
  partner Partner @relation(fields: [partnerId], references: [id], onDelete: Restrict)
  createdBy User? @relation(fields: [createdById], references: [id], onDelete: SetNull)
  items PurchaseOrderItem[]
  @@unique([organizationId, orderNumber])
  @@index([organizationId, orderedAt])
  @@index([storeId, orderedAt])
}

model PurchaseOrderItem {
  id String @id @default(uuid())
  purchaseOrderId String
  productId String
  quantity Int
  receivedQty Int @default(0)
  unitCost Decimal @db.Decimal(12,2)
  taxAmount Decimal @default(0) @db.Decimal(12,2)
  lineTotal Decimal @db.Decimal(12,2)
  purchaseOrder PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Restrict)
  @@index([purchaseOrderId])
  @@index([productId])
}

model Account {
  id String @id @default(uuid())
  organizationId String
  code String
  name String
  type AccountType
  parentId String?
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  parent Account? @relation("AccountHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children Account[] @relation("AccountHierarchy")
  journalLines JournalLine[]
  @@unique([organizationId, code])
  @@index([organizationId, type])
}

model JournalEntry {
  id String @id @default(uuid())
  organizationId String
  referenceType String?
  referenceId String?
  entryNumber String
  description String
  status JournalStatus @default(POSTED)
  entryDate DateTime @default(now())
  createdAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  lines JournalLine[]
  @@unique([organizationId, entryNumber])
  @@index([organizationId, entryDate])
  @@index([referenceType, referenceId])
}

model JournalLine {
  id String @id @default(uuid())
  journalEntryId String
  accountId String
  debit Decimal @default(0) @db.Decimal(12,2)
  credit Decimal @default(0) @db.Decimal(12,2)
  description String?
  journalEntry JournalEntry @relation(fields: [journalEntryId], references: [id], onDelete: Cascade)
  account Account @relation(fields: [accountId], references: [id], onDelete: Restrict)
  @@index([journalEntryId])
  @@index([accountId])
}

model Report {
  id String @id @default(uuid())
  organizationId String
  name String
  code String
  description String?
  category String
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  runs ReportRun[]
  @@unique([organizationId, code])
}

model ReportRun {
  id String @id @default(uuid())
  organizationId String
  reportId String
  requestedById String?
  status ReportStatus @default(QUEUED)
  filters Json?
  resultMeta Json?
  fileUrl String?
  startedAt DateTime?
  completedAt DateTime?
  createdAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
  @@index([organizationId, createdAt])
}

model Notification {
  id String @id @default(uuid())
  organizationId String
  userId String?
  type NotificationType
  title String
  message String
  isRead Boolean @default(false)
  actionUrl String?
  createdAt DateTime @default(now())
  readAt DateTime?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user User? @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, isRead, createdAt])
}

model AuditLog {
  id String @id @default(uuid())
  organizationId String
  userId String?
  storeId String?
  action String
  entityType String
  entityId String?
  beforeData Json?
  afterData Json?
  ipAddress String?
  createdAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  store Store? @relation(fields: [storeId], references: [id], onDelete: SetNull)
  @@index([organizationId, createdAt])
  @@index([entityType, entityId])
}

model Document {
  id String @id @default(uuid())
  organizationId String
  entityType String?
  entityId String?
  fileName String
  fileUrl String
  mimeType String?
  fileSize Int?
  createdAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@index([organizationId, entityType, entityId])
}

model Workflow {
  id String @id @default(uuid())
  organizationId String
  requestedById String?
  entityType String
  entityId String
  action String
  status WorkflowStatus @default(PENDING)
  reviewedById String?
  reviewNote String?
  createdAt DateTime @default(now())
  reviewedAt DateTime?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  requestedBy User? @relation(fields: [requestedById], references: [id], onDelete: SetNull)
  @@index([organizationId, status, createdAt])
  @@index([entityType, entityId])
}

model Setting {
  id String @id @default(uuid())
  organizationId String
  key String
  value Json
  category String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, key])
  @@index([organizationId, category])
}
```

> Implementation note: the schema intentionally uses normal PostgreSQL relations and indexes for the MVP. PostgreSQL full-text/trigram search can be added later without introducing Elasticsearch.

---

# 5. Dummy Data — `backend/prisma/seed.ts`

The seed below is intentionally compact but covers every major screen and synchronization path.

```ts
import { PrismaClient, Prisma, UserStatus, StoreStatus, ProductStatus,
  InventoryMovementType, PartnerType, CustomerType, OrderStatus,
  PaymentStatus, PaymentMethod, PurchaseStatus, AccountType,
  JournalStatus, ReportStatus, NotificationType, WorkflowStatus } from "@prisma/client";

const prisma = new PrismaClient();
const D = (v: string) => new Prisma.Decimal(v);

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: "org-demo-001" }, update: {}, create: {
      id: "org-demo-001", name: "Walmart ERP Demo", legalName: "Walmart ERP Demo Pvt Ltd",
      currency: "INR", timezone: "Asia/Kolkata", locale: "en-IN"
    }
  });

  // Roles / permissions
  const codes = [
    "dashboard.view","inventory.view","inventory.manage","stores.view","stores.manage",
    "partners.view","partners.manage","customers.view","customers.manage","ledger.view",
    "ledger.manage","reports.view","reports.export","settings.view","settings.manage"
  ];
  for (const code of codes) await prisma.permission.upsert({
    where: { code }, update: {}, create: { id: `perm-${code.replaceAll(".", "-")}`, code }
  });

  const adminRole = await prisma.role.upsert({ where: { id: "role-admin" }, update: {},
    create: { id: "role-admin", name: "Administrator", description: "Full access" } });
  const managerRole = await prisma.role.upsert({ where: { id: "role-manager" }, update: {},
    create: { id: "role-manager", name: "Store Manager", description: "Operational access" } });
  const analystRole = await prisma.role.upsert({ where: { id: "role-analyst" }, update: {},
    create: { id: "role-analyst", name: "Analyst", description: "Dashboard/report access" } });

  const permissions = await prisma.permission.findMany();
  for (const p of permissions) await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } }, update: {},
    create: { roleId: adminRole.id, permissionId: p.id }
  });

  const users = await Promise.all([
    prisma.user.create({ data: { id:"user-admin-001", organizationId:org.id, name:"Aarav Mehta", email:"admin@walmart-erp.local", phone:"+91 9000000001", status:UserStatus.ACTIVE, passwordHash:"DEMO_ARGON2_HASH" } }),
    prisma.user.create({ data: { id:"user-manager-001", organizationId:org.id, name:"Riya Shah", email:"manager@walmart-erp.local", phone:"+91 9000000002", status:UserStatus.ACTIVE, passwordHash:"DEMO_ARGON2_HASH" } }),
    prisma.user.create({ data: { id:"user-analyst-001", organizationId:org.id, name:"Kabir Patel", email:"analyst@walmart-erp.local", phone:"+91 9000000003", status:UserStatus.ACTIVE, passwordHash:"DEMO_ARGON2_HASH" } })
  ]);
  await prisma.userRole.createMany({ data: [
    { userId: users[0].id, roleId: adminRole.id },
    { userId: users[1].id, roleId: managerRole.id },
    { userId: users[2].id, roleId: analystRole.id }
  ]});

  // Regions / stores
  const west = await prisma.region.create({ data:{ id:"region-west", organizationId:org.id, name:"West India", code:"WEST" } });
  const north = await prisma.region.create({ data:{ id:"region-north", organizationId:org.id, name:"North India", code:"NORTH" } });
  const stores = await Promise.all([
    prisma.store.create({ data:{ id:"store-mumbai-01", organizationId:org.id, regionId:west.id, code:"MUM-001", name:"Mumbai Central Store", city:"Mumbai", state:"Maharashtra", postalCode:"400013", imageUrl:"/images/stores/store-main.webp" } }),
    prisma.store.create({ data:{ id:"store-pune-01", organizationId:org.id, regionId:west.id, code:"PUN-001", name:"Pune City Store", city:"Pune", state:"Maharashtra", postalCode:"411005", imageUrl:"/images/stores/store-main.webp" } }),
    prisma.store.create({ data:{ id:"store-delhi-01", organizationId:org.id, regionId:north.id, code:"DEL-001", name:"Delhi Central Store", city:"New Delhi", state:"Delhi", postalCode:"110017", imageUrl:"/images/stores/store-main.webp" } })
  ]);

  // Categories / products
  const cats = await Promise.all([
    prisma.category.create({ data:{ id:"cat-bev", organizationId:org.id, name:"Beverages", code:"BEV", imageUrl:"/images/categories/beverages.webp" } }),
    prisma.category.create({ data:{ id:"cat-grocery", organizationId:org.id, name:"Groceries", code:"GRC", imageUrl:"/images/categories/groceries.webp" } }),
    prisma.category.create({ data:{ id:"cat-elec", organizationId:org.id, name:"Electronics", code:"ELEC", imageUrl:"/images/categories/electronics.webp" } }),
    prisma.category.create({ data:{ id:"cat-home", organizationId:org.id, name:"Household", code:"HOME", imageUrl:"/images/categories/household.webp" } })
  ]);
  const products = await Promise.all([
    prisma.product.create({ data:{ id:"prod-001", organizationId:org.id, categoryId:cats[0].id, sku:"BEV-COLA-500", barcode:"890100000001", name:"Cola Soft Drink 500ml", brand:"Demo Cola", costPrice:D("28"), sellingPrice:D("40"), reorderLevel:50, taxRate:D("18"), imageUrl:"/images/products/beverages/cola-500.webp", status:ProductStatus.ACTIVE } }),
    prisma.product.create({ data:{ id:"prod-002", organizationId:org.id, categoryId:cats[1].id, sku:"GRC-RICE-5KG", barcode:"890100000002", name:"Premium Rice 5kg", brand:"Demo Foods", costPrice:D("390"), sellingPrice:D("475"), reorderLevel:20, taxRate:D("5"), imageUrl:"/images/products/groceries/rice-5kg.webp", status:ProductStatus.ACTIVE } }),
    prisma.product.create({ data:{ id:"prod-003", organizationId:org.id, categoryId:cats[2].id, sku:"ELEC-EARBUD-01", barcode:"890100000003", name:"Wireless Earbuds", brand:"Demo Audio", costPrice:D("850"), sellingPrice:D("1299"), reorderLevel:10, taxRate:D("18"), imageUrl:"/images/products/electronics/earbuds.webp", status:ProductStatus.ACTIVE } }),
    prisma.product.create({ data:{ id:"prod-004", organizationId:org.id, categoryId:cats[3].id, sku:"HOME-DETERGENT-2L", barcode:"890100000004", name:"Liquid Detergent 2L", brand:"Demo Home", costPrice:D("180"), sellingPrice:D("245"), reorderLevel:30, taxRate:D("18"), imageUrl:"/images/products/household/detergent.webp", status:ProductStatus.ACTIVE } })
  ]);

  // Inventory: 4 products × 3 stores
  const stock = [
    ["store-mumbai-01",320,145,42,88], ["store-pune-01",210,95,18,65], ["store-delhi-01",275,120,31,72]
  ];
  for (const [storeId,a,b,c,e] of stock) for (const [i,qty] of [a,b,c,e].entries())
    await prisma.inventory.create({ data:{ storeId:storeId as string, productId:products[i].id, onHand:qty as number, reserved:i===0?10:3, damaged:0 } });

  // Parties
  const partner = await prisma.partner.create({ data:{ id:"partner-001", organizationId:org.id, code:"SUP-001", type:PartnerType.SUPPLIER, name:"Demo Consumer Goods Supply", contactPerson:"Nikhil Shah", email:"supplier@example.local", phone:"+91 9000020001", city:"Mumbai", state:"Maharashtra", gstin:"27AAAAA0000A1Z5", creditLimit:D("500000"), outstanding:D("125000") } });
  const customer = await prisma.customer.create({ data:{ id:"customer-001", organizationId:org.id, code:"CUS-001", type:CustomerType.RETAIL, name:"Rahul Mehta", email:"rahul@example.local", phone:"+91 9000030001", city:"Mumbai", state:"Maharashtra" } });

  // Completed sale: 2 earbuds
  const sale = await prisma.salesOrder.create({ data:{
    id:"sale-001", organizationId:org.id, storeId:stores[0].id, customerId:customer.id, createdById:users[1].id,
    orderNumber:"SO-2026-0001", status:OrderStatus.COMPLETED, subtotal:D("2598"), taxAmount:D("467.64"),
    discountAmount:D("100"), totalAmount:D("2965.64"), paidAmount:D("2965.64"), paymentStatus:PaymentStatus.PAID,
    orderedAt:new Date("2026-09-22T12:15:00+05:30"), completedAt:new Date("2026-09-22T12:25:00+05:30"),
    items:{ create:{ id:"sale-item-001", productId:products[2].id, quantity:2, unitPrice:D("1299"), unitCost:D("850"), discount:D("100"), taxAmount:D("467.64"), lineTotal:D("2965.64") } }
  }});
  await prisma.payment.create({ data:{ id:"payment-001", salesOrderId:sale.id, amount:D("2965.64"), method:PaymentMethod.UPI, status:PaymentStatus.PAID, reference:"UPI-DEMO-0001" } });

  // Received purchase
  const po = await prisma.purchaseOrder.create({ data:{
    id:"po-001", organizationId:org.id, storeId:stores[0].id, partnerId:partner.id, createdById:users[1].id,
    orderNumber:"PO-2026-0001", status:PurchaseStatus.RECEIVED, subtotal:D("56000"), taxAmount:D("10080"), totalAmount:D("66080"),
    orderedAt:new Date("2026-09-18T10:00:00+05:30"), receivedAt:new Date("2026-09-20T15:30:00+05:30"),
    items:{ create:{ id:"po-item-001", productId:products[0].id, quantity:2000, receivedQty:2000, unitCost:D("28"), taxAmount:D("10080"), lineTotal:D("66080") } }
  }});

  await prisma.inventoryMovement.createMany({ data:[
    { id:"move-sale-001", organizationId:org.id, storeId:stores[0].id, productId:products[2].id, userId:users[1].id, movementType:InventoryMovementType.SALE, quantity:-2, unitCost:D("850"), referenceType:"SalesOrder", referenceId:sale.id, note:"Completed customer sale" },
    { id:"move-purchase-001", organizationId:org.id, storeId:stores[0].id, productId:products[0].id, userId:users[1].id, movementType:InventoryMovementType.PURCHASE, quantity:2000, unitCost:D("28"), referenceType:"PurchaseOrder", referenceId:po.id, note:"Supplier shipment received" }
  ]});

  // Chart of accounts + balanced sale journal
  const accounts = await Promise.all([
    prisma.account.create({data:{id:"acct-bank",organizationId:org.id,code:"1010",name:"Bank",type:AccountType.ASSET}}),
    prisma.account.create({data:{id:"acct-inventory",organizationId:org.id,code:"1200",name:"Inventory",type:AccountType.ASSET}}),
    prisma.account.create({data:{id:"acct-revenue",organizationId:org.id,code:"4000",name:"Sales Revenue",type:AccountType.REVENUE}}),
    prisma.account.create({data:{id:"acct-cogs",organizationId:org.id,code:"5000",name:"Cost of Goods Sold",type:AccountType.EXPENSE}}),
    prisma.account.create({data:{id:"acct-payable",organizationId:org.id,code:"2000",name:"Accounts Payable",type:AccountType.LIABILITY}})
  ]);
  const byCode = Object.fromEntries(accounts.map(a => [a.code,a]));
  await prisma.journalEntry.create({ data:{ id:"journal-sale-001", organizationId:org.id, referenceType:"SalesOrder", referenceId:sale.id, entryNumber:"JE-2026-0001", description:"Sale SO-2026-0001", status:JournalStatus.POSTED,
    lines:{create:[
      {id:"jl-001",accountId:byCode["1010"].id,debit:D("2965.64"),credit:D("0"),description:"UPI received"},
      {id:"jl-002",accountId:byCode["4000"].id,debit:D("0"),credit:D("2598"),description:"Sales revenue"},
      {id:"jl-003",accountId:byCode["5000"].id,debit:D("1700"),credit:D("0"),description:"COGS"},
      {id:"jl-004",accountId:byCode["1200"].id,debit:D("0"),credit:D("1700"),description:"Inventory reduction"}
    ]}
  }});

  // Reports, notifications, settings, audit/workflow
  const report = await prisma.report.create({ data:{ id:"report-sales", organizationId:org.id, name:"Sales Performance", code:"SALES_PERFORMANCE", category:"Sales" } });
  await prisma.reportRun.create({ data:{ id:"report-run-001", organizationId:org.id, reportId:report.id, requestedById:users[2].id, status:ReportStatus.COMPLETED, filters:{storeId:stores[0].id,dateFrom:"2026-09-01",dateTo:"2026-09-23"}, resultMeta:{rows:124}, completedAt:new Date("2026-09-23T10:00:04+05:30") } });
  await prisma.notification.create({ data:{ id:"notification-001", organizationId:org.id, userId:users[1].id, type:NotificationType.STOCK_ALERT, title:"Low stock alert", message:"Wireless Earbuds are approaching reorder level at Pune City Store.", actionUrl:"/inventory?store=store-pune-01&status=low-stock" } });
  await prisma.setting.createMany({ data:[
    {id:"setting-currency",organizationId:org.id,key:"currency",value:"INR",category:"financial"},
    {id:"setting-store",organizationId:org.id,key:"default_store_id",value:stores[0].id,category:"organization"},
    {id:"setting-responsive",organizationId:org.id,key:"dashboard_layout",value:"responsive",category:"system"},
    {id:"setting-stock-alert",organizationId:org.id,key:"stock_alerts_enabled",value:true,category:"notifications"}
  ]});
  await prisma.auditLog.create({ data:{ id:"audit-001", organizationId:org.id, userId:users[1].id, storeId:stores[0].id, action:"CREATE", entityType:"SalesOrder", entityId:sale.id, afterData:{orderNumber:sale.orderNumber,total:"2965.64"} } });
  await prisma.workflow.create({ data:{ id:"workflow-001", organizationId:org.id, requestedById:users[1].id, entityType:"InventoryAdjustment", entityId:"inv-demo", action:"APPROVE_STOCK_ADJUSTMENT", status:WorkflowStatus.APPROVED, reviewedById:users[0].id, reviewNote:"Verified" } });

  console.log("ERP MVP dummy data seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

> The password hash above is a placeholder for demo data. Generate a real Argon2id hash in the actual application seed/auth flow; never ship the literal demo hash as a real credential.

---

# 6. Database Setup

`backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/walmart_erp?schema=public"
```

`backend/package.json`:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "prisma": { "seed": "tsx prisma/seed.ts" }
}
```

Commands:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run db:studio
```

---

# 7. Frontend ↔ Backend Synchronization

Recommended TanStack Query hooks:

```text
useDashboardOverview()
useInventoryOverview()
useStores()
usePartners()
useCustomers()
useLedger()
useReports()
useSettings()
```

Example dashboard contract:

```http
GET /api/dashboard/overview?storeId=store-mumbai-01&from=2026-09-01&to=2026-09-23
```

```json
{
  "storeContext": {
    "selectedStoreId": "store-mumbai-01",
    "storeName": "Mumbai Central Store",
    "imageUrl": "/images/stores/store-main.webp"
  },
  "kpis": {
    "revenue": 8425000,
    "orders": 1842,
    "inventoryValue": 5210000,
    "customers": 9280
  },
  "salesTrend": [],
  "inventorySummary": {},
  "storePerformance": [],
  "recentActivity": []
}
```

Desktop and mobile consume exactly this response. The UI decides whether to display the widgets in rows, columns, cards or carousels.

---

# 8. Common Store Context

The selected store is a frontend/query concern backed by the `Store` table.

Examples:

```text
/dashboard?store=store-mumbai-01
/inventory?store=store-mumbai-01
/reports?store=store-mumbai-01
```

Resizing from laptop to mobile must not reset the selected store or important filters.

---

# 9. Search SSOT

MVP common search:

```http
GET /api/search?q=earbuds
```

Search targets:

```text
Product / SKU
Store
Partner
Customer
Sales Order
Purchase Order
Account
Journal Entry
Report
User
```

Use PostgreSQL `ILIKE` initially. Add `pg_trgm` later if needed. Do not introduce Elasticsearch for this MVP.

---

# 10. Important Calculations

```text
availableStock = onHand - reserved
inventoryValue = onHand × costPrice
potentialSalesValue = availableStock × sellingPrice
lowStock = availableStock <= reorderLevel

salesSubtotal = Σ(quantity × unitPrice)
grossProfit = Σ(quantity × (unitPrice - unitCost))
outstanding = totalAmount - paidAmount

growth% = ((currentPeriod - previousPeriod) / previousPeriod) × 100
```

All important business/financial calculations are backend-owned. React should not become the source of truth.

---

# 11. Responsive Database Rule

The database is completely unaware of viewport size.

```text
1366px laptop ─┐
1440px desktop ├──> same API ──> same DB
390px mobile ──┤
768px tablet ──┘
```

Only these change between screen sizes:

- navigation layout
- grid columns
- card arrangement
- table → card transformation
- filter bar → filter sheet
- chart dimensions
- modal → bottom sheet
- typography/spacing
- image crop

These do **not** change:

- database entities
- IDs
- API contracts
- calculations
- permissions
- business rules
- transaction history

---

# 12. Asset References

Agreed store/banner assets:

```text
frontend/public/images/banners/store-banner.webp
frontend/public/images/stores/store-main.webp
frontend/public/images/stores/store-sidebar.webp
```

The same banner is used on desktop and mobile with responsive cropping. `Store.imageUrl` points to the store-main asset for the demo.

---

# 13. Transaction Integrity

Sale completion should be one database transaction:

```text
BEGIN
  SalesOrder → COMPLETED
  SalesOrderItems → create/confirm
  Payment → PAID
  Inventory → decrement
  InventoryMovement → create
  JournalEntry → create
  JournalLines → create balanced debit/credit
  AuditLog → create
COMMIT
```

Purchase receiving:

```text
BEGIN
  PurchaseOrder → RECEIVED
  receivedQty → update
  Inventory → increment
  InventoryMovement → create
  JournalEntry → create
  Partner outstanding → update
  AuditLog → create
COMMIT
```

If any critical operation fails, rollback the complete transaction.

---

# 14. Recommended Repository Placement

```text
walmart-erp/
├── frontend/
│   ├── src/
│   └── public/
├── backend/
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── .env
└── docs/
    └── 05-MVP-Database-Schema-and-Dummy-Data.md
```

---

# 15. Final SSOT

```text
                         ORGANIZATION
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
      USERS                 STORES               PRODUCTS
        │                     │                     │
      ROLES              INVENTORY ◄───────────────┘
        │                     │
        │              INVENTORY MOVEMENTS
        │                     │
        ├──────────────┐      │
        │              │      │
    SALES ORDERS   PURCHASE ORDERS
        │              │
     PAYMENTS       PARTNERS
        │              │
        └───────┬──────┘
                │
          JOURNAL ENTRIES
                │
          JOURNAL LINES
                │
          CHART OF ACCOUNTS

Everything feeds:
Dashboard • Reports • Search • Notifications • Audit • Settings
```

**Result:** one PostgreSQL SSOT, one Prisma model, one API layer and one responsive frontend. Desktop and mobile are synchronized automatically because they are simply two presentations of the same underlying data and business logic.
