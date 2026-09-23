# ERP MVP — PostgreSQL + Prisma Database Schema & Architecture

## 1. Single Source of Truth (SSOT)

Desktop, tablet, and mobile use the same database, APIs, business logic, and React data hooks. Responsive behavior is frontend-only.

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

## 2. SSOT Entity Map

| Domain | Tables |
|---|---|
| Organization | `Organization` |
| Identity | `User`, `Role`, `Permission`, `UserRole`, `RolePermission` |
| Geography | `Region`, `Store` |
| Product | `Category`, `Product` |
| Inventory | `Inventory`, `InventoryMovement` |
| Parties | `Partner`, `Customer` |
| Sales | `SalesOrder`, `SalesOrderItem`, `Payment` |
| Purchasing | `PurchaseOrder`, `PurchaseOrderItem` |
| Finance | `Account`, `JournalEntry`, `JournalLine` |
| Reporting | `Report`, `ReportRun` |
| System | `Notification`, `AuditLog`, `Document`, `Workflow`, `Setting` |

Dashboard data is derived entirely from these transactional tables (no separate dashboard table).

## 3. Transaction Synchronization

### Sale Completed
- SalesOrder + Items (status: COMPLETED)
- Payment (status: PAID)
- Inventory decrease
- InventoryMovement (type: SALE)
- JournalEntry + JournalLines (debit Bank, credit Sales Revenue, debit COGS, credit Inventory)
- AuditLog

### Purchase Received
- PurchaseOrder + Items (status: RECEIVED)
- Inventory increase
- InventoryMovement (type: PURCHASE)
- JournalEntry + JournalLines
- Partner outstanding update
- AuditLog

All operations execute inside single atomic Prisma transactions.

## 4. Key Calculations

- **Available Stock**: `onHand - reserved`
- **Inventory Value**: `onHand * costPrice`
- **Low Stock Flag**: `availableStock <= reorderLevel`
- **Gross Profit**: `Σ(quantity * (unitPrice - unitCost))`
- **Outstanding**: `totalAmount - paidAmount`
