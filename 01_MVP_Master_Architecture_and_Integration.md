# 01 --- MVP Master Architecture & Integration Specification

## 0. Purpose

This document defines the **demonstration-grade MVP** for the
seven-section Walmart ERP UI shown in the supplied references. The MVP
prioritizes a believable end-to-end flow, consistent shared data,
deterministic calculations, reusable components, and a small number of
documents rather than production-scale infrastructure.

## 1. Seven sections

1.  Dashboard
2.  Inventory
3.  Stores
4.  Partners & Customers
5.  Ledger
6.  Reports
7.  Settings

## 2. MVP rule

Use a **modular monolith**: one application/backend and one PostgreSQL
database, separated into domain modules. Do not create microservices for
the demo. Common capabilities are implemented once and reused by all
sections.

### Common visual system / styling template

-   **Primary:** Deep Navy `#071B3A`
-   **Secondary:** Walmart Royal Blue `#0071CE`
-   **Accent:** Walmart Spark Yellow `#FFC220`, used sparingly for
    brand/spark/highlight states.
-   **Success:** green; **Warning:** amber/yellow; **Danger:** red;
    **Info:** blue.
-   **Surface:** white / very light blue; page background
    `#F4F8FC`-like.
-   **Typography:** clean modern sans-serif; desktop uses strong
    semibold section headings, mobile uses compact semibold headings.
-   **Cards:** rounded corners, subtle border, soft shadow, light
    glass/blur effect only where the reference uses imagery behind the
    content.
-   **Charts:** blue/green/purple/orange semantic series; never rely on
    color alone---use labels/status text.
-   **Icons:** rounded outline/duotone icons; consistent 24px desktop
    and 20--24px mobile.
-   **Buttons:** primary blue filled; secondary white/outlined;
    destructive red; compact icon-only actions where space is
    constrained.
-   **Status chips:** green = active/completed/in stock; amber =
    pending/low stock; red = inactive/out of stock/error; blue =
    processing/info.
-   **Desktop template:** left sidebar + global header + hero/background
    image + card grid + tables/right rail.
-   **Mobile template:** iPhone/portrait composition, compact branded
    hero, search, horizontally scrollable tabs/cards, stacked sections,
    fixed bottom navigation.
-   **Common visual assets:** Walmart/store/warehouse/transport imagery,
    product thumbnails, store photos, avatar initials, notification
    badge.
-   **Spacing:** 8px base rhythm; 12/16/24px common gaps; larger
    24--32px section separation.
-   **Responsive rule:** no desktop table should overflow on mobile;
    convert rows to cards or horizontally scrollable tables.

## 3. Common frontend shell

Every section shares: - Walmart ERP brand/header - Global search -
Notification bell + unread badge - User avatar/name/role -
Region/store/company scope selector - Breadcrumb/back control on
mobile - Reusable KPI cards - Reusable filter controls - Reusable
tables/cards/charts - Toast/modal/loading/empty/error states -
Responsive desktop/mobile navigation

## 4. Common backend services

-   Auth/RBAC
-   Global Search
-   Filter/Sort/Pagination
-   Analytics primitives
-   Notifications
-   Audit logging
-   Workflow/approval
-   Export
-   File/document handling
-   Cache
-   Validation/error handling
-   Date/time/currency formatting
-   Dashboard aggregation
-   Event dispatcher

## 5. Common database domains

Organization, Users/Roles/Permissions, Regions/Locations, Stores,
Products/Categories, Inventory/Movements, Partners, Customers, Sales
Orders/Items, Purchase Orders/Items, Payments, Chart of Accounts,
Journal Entries/Lines, Reports/Runs/Schedules, Notifications, Audit
Logs, Documents, Workflows, System Configuration.

## 6. Golden data rule

A business entity is stored once and referenced everywhere: -
Product/SKU is one entity across Dashboard, Inventory, Stores, Reports
and Ledger. - Store is one entity across Dashboard, Inventory, Stores,
Sales and Reports. - Partner is one entity across Partners, Sales,
Procurement, Ledger and Reports. - User/role is one entity across
Settings, audit, approvals and generated reports.

## 7. Core calculations

Common: - total = SUM - count = COUNT - average = SUM(value)/COUNT -
growth % = (current - previous) / previous \* 100 - percentage = part /
total \* 100 - available stock = on_hand - reserved - inventory value =
on_hand \* cost_price - fulfillment % = fulfilled / total_orders \*
100 - AOV = sales / completed_orders

Domain calculations remain in their domain service.

## 8. Event flow

A sale demonstrates the architecture: Frontend -\> Sales API -\>
validate -\> create order/items -\> emit SALE_COMPLETED -\> update
inventory movement -\> post ledger journal -\> update analytics/cache
-\> notify if necessary -\> audit -\> return result.

## 9. MVP data strategy

Use deterministic seeded demo data. The UI should never invent values
independently. Every visible KPI/table/chart should come from the same
API/data layer. If a feature is only visual, mark it as demo behavior
and keep its state local or persisted in a lightweight table.

## 10. Recommended routes

-   `/dashboard`
-   `/inventory`
-   `/stores`
-   `/partners`
-   `/ledger`
-   `/reports`
-   `/settings`
-   `/search`
-   `/notifications`
-   `/profile`

## 11. API convention

-   `GET` reads
-   `POST` creates/actions
-   `PATCH` updates
-   `DELETE` removes/archives
-   `/overview` for aggregated section payloads
-   `/search` for scoped search
-   `/export` for generated files
-   `/schedule` for report scheduling
-   All write APIs validate permission, input, business rule,
    transaction consistency and audit the change.

## 12. Frontend-to-backend-to-database contract

Every UI element follows:
`UI component -> API hook -> controller -> service -> calculation/business rule -> repository -> PostgreSQL -> response DTO -> UI state`.

No critical business calculation should be duplicated in the frontend.

## 13. MVP acceptance criteria

-   All seven sections use one shared navigation/data model.
-   Global search works across at least products, stores, partners,
    customers, transactions and reports.
-   Dashboard changes when seed data changes.
-   Inventory stock changes propagate to store stock and low-stock
    alerts.
-   A sale creates a transaction and corresponding inventory/ledger
    effects.
-   Reports use common filters and the same underlying data.
-   Settings changes affect relevant UI behavior.
-   Every important write produces an audit record.
-   Mobile and desktop layouts remain consistent with the supplied
    visual language.
