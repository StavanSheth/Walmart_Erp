# 02 --- MVP Frontend & Screen-by-Screen Specification

## 0. Shared visual system

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

## 1. Common shell

### Header

-   Walmart ERP logo and tagline "People. Products. A Better Tomorrow."
-   Search placeholder varies by module but uses one shared search
    component.
-   Scope selector: All Regions / All Stores / All Companies depending
    on section.
-   Bell with red unread badge.
-   Avatar initials "SS" in the supplied references; role "Admin".
-   Mobile back arrow on inner pages.

### Navigation

Desktop sidebar labels from the references: - Dashboard - Inventory ---
Stocks & Products - Stores --- Store Management - Partners & Customers /
Wholesalers / Retailers / Customers - Purchases --- Procurement (shown
in some desktop references) - Sales --- Order Management / Orders &
Revenue - Suppliers (shown in some desktop references) - Ledger ---
Accounts & Transactions - Reports --- Analytics & Insights - Settings
--- System Configuration

The seven-section MVP top-level navigation is Dashboard, Inventory,
Stores, Partners, Ledger, Reports, Settings. Purchases/Sales/Suppliers
can be domain submodules and remain accessible from relevant screens.

### Shared interaction components

Search, scope dropdown, tabs, KPI cards, filter chips, date range,
dropdowns, tables, cards, charts, export, generate, save filter, reset,
view all, add, edit, overflow menu, status badges, toggles, confirmation
modal, toast, skeleton, empty state.

## 2. Dashboard

Visible elements: - "Good Morning, Stavan!" - "Here's what's happening
across your Walmart ERP today." - Date - Search - Store/region
selector - Notification/profile - KPI cards: Total Sales (Today), Total
Orders, Active Stores, Total Inventory Value, Active Customers - Sales
Overview with Sales/Orders toggle and period dropdown - Store
Performance with ranked stores and sales/orders/stock status - Inventory
Status donut: In Stock, Low Stock, Out of Stock, In Transit - Order
Fulfillment ring: Fulfilled, Pending, Cancelled - Sales by Category list
with percentage/value - Recent Transactions table/list - Alerts &
Notifications - Promotional/insight cards Buttons/actions: period
selector, Sales/Orders toggle, View All links, store selector,
notification, profile, transaction row, alert row.

## 3. Inventory

Header text: "Inventory" and "Manage your products, stock levels and
store-wise inventory in real time." Tabs: Overview, Products, Stock
Levels, Low Stock Alerts, Categories, Suppliers. KPI cards: Total
Products, In Stock (Units), Low Stock Items, Out of Stock, Total Store
Locations. Popular Products cards show image, product name, SKU, price,
stock status, units. Inventory Distribution donut. Store-wise Stock
selector and search. Table fields: #, Product, SKU, Category, Store
Stock, Reorder Level, Status, Last Updated, Actions. Right/insight
areas: Inventory Insights, Top Categories, stock stability card.
Actions: View All, store selector, export, product row overflow,
category/supplier navigation.

## 4. Stores

Header: "Stores" and "Manage all Walmart stores across regions." Scope
selector: All Regions. Tabs: Store Network, Performance, Operations,
Expansion. KPI cards: Total Stores, Operational Stores, Under
Maintenance, New Stores (This Year), Total Store Revenue (YTD). Store
Locations map with legend: Operational, Under Maintenance, Planned, New
(This Year). Store list/grid cards: image, store name, store code,
location, revenue, growth, operational status, favorite. Featured Store
panel: store image, status, address, manager, phone, opening date, size.
Store Performance metrics: Sales Revenue, Units Sold, Inventory Fill
Rate, Customer Rating. Store Facilities icons: Grocery, Electronics,
Apparel, Pharmacy, Auto Care, Vision Center, Food Court. Recent Alerts.
Actions: search, region/type/status filters, map zoom, store card,
favorite, View Details, Get Directions, View All.

## 5. Partners & Customers

Header: "Partners & Customers" and "Manage wholesalers, retailers,
suppliers and end customers." KPI cards: Total Partners, Retailers,
Suppliers, End Customers. Tabs: Overview, Wholesalers & Retailers,
Suppliers, Customers, Partner Performance. Partner Distribution donut.
Partner Growth chart. Partner search and filters: All Types, All
Regions, All Status. Partner List fields: Name, Type, Region, Contact
Person, Email, Status, Last Order, Total Sales, Actions. Right rail:
Partner Insights, Top Partners (By Sales), Partner Onboarding, Growing
Together card. Actions: Add Partner, View Reports, Export, View All,
partner row overflow.

## 6. Ledger

Header: "General Ledger" and "Track, manage and reconcile all financial
transactions." KPI cards: Total Transactions, Total Debits, Total
Credits, Account Balance. Tabs: Transactions, Accounts, Reconciliation,
Journal Entries, More / Chart of Accounts / Financial Periods.
Transaction Trends chart with Debits and Credits. Recent Transactions
fields: Date, Reference, Description, Account, Type, Debit, Credit,
Status, Actions. Account Summary: Accounts Receivable, Accounts Payable,
Cash & Bank, Inventory, Expenses, Revenue. Quick Actions: New Journal
Entry, Upload Transactions, Reconcile Account, Generate Report. Actions:
search, account/type/date filters, export, new journal entry, upload,
reconcile, generate report, transaction overflow.

## 7. Reports

Header: "Reports" and "Explore, analyze and generate reports across your
Walmart ERP data." Report categories: - Sales Reports --- revenue,
orders, product performance - Inventory Reports --- stock levels,
movement, aging - Store Reports --- performance, footfall/operations -
Partner Reports --- wholesalers, retailers, suppliers - Financial
Reports --- P&L, balance sheet, transactions - Operational Reports ---
fulfillment, logistics, maintenance - Custom Reports --- create your own
Report Filters: Report Type, Date Range, Region, Store, Category,
Product, Partner Type, Partner, Status; Save Filter Set; Generate
Report; Reset Filters. Sales Overview: Total Sales, Total Orders, Avg
Order Value, Stores, Products Sold; Sales trend; Sales by Category.
Generated Reports table: Report Name, Type, Date Range, Generated On,
Generated By, Status, Actions. Quick Reports: Daily Sales Report, Low
Stock Report, Top Selling Products, Store Performance, Partner
Performance, Inventory Aging, Financial Summary, Custom Report.
Scheduled Reports: Weekly Sales, Monthly Inventory, Quarterly Financial,
Daily Store Performance with toggles. Actions: report category card,
filter dropdowns, save filter, generate, reset, view all,
download/export, schedule toggle, overflow.

## 8. Settings

Header: "Settings" and "Configure your system and preferences." Profile
card: avatar, user name, role, email, Manage Profile. Search settings.
Micro-sections: 1. Organization Settings --- company details, regions,
business units. 2. User Management --- users, roles, permissions. 3.
Store Management --- store details, locations, hours. 4. Product &
Inventory Settings --- categories, attributes, stock rules. 5. Partner &
Customer Settings --- wholesalers, retailers, suppliers, customers. 6.
Financial Settings --- tax, currency, payment methods, accounting
preferences. 7. Notification Settings --- alerts, email, system updates.
8. Report Preferences --- default filters, export settings, scheduled
reports. 9. System Configuration --- language, timezone, retention,
integrations. 10. Security & Compliance --- password policies, audit
logs, data privacy. 11. Help & Support --- documentation, tickets,
contact. Support card: "Together for a Brighter Tomorrow." / Contact
Support. Each row has icon + title + description + chevron. Tapping
opens a dedicated settings sub-screen.

## 9. Frontend data contract

Each screen must map: UI element -\> API endpoint/hook -\> DTO field -\>
entity/table -\> calculation/service. Example: Dashboard Total Sales -\>
GET /dashboard/overview -\> totalSales -\> sales_orders -\>
SalesMetricsService.

## 10. Mobile behavior

-   Bottom navigation: Dashboard, Inventory, Stores, Partners, More.
-   Ledger and Reports can be reached through More or a second-level
    module switch.
-   Tables become cards or horizontal-scroll lists.
-   KPI grids become 2-column.
-   Tabs become horizontal scroll.
-   Filters become bottom sheets.
-   Right rails become stacked cards.
-   Charts preserve labels and tooltips.
