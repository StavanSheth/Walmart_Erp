# 03 --- MVP Backend, Database, API & Calculation Specification

## 1. Backend approach

Use a modular monolith. Common services are shared; domain services own
domain-specific calculations and workflows.

## 2. Common modules

### SearchService

Searches products/SKUs, stores, partners, customers, orders, purchase
orders, transactions, accounts, reports and users. Use a normalized
search index/view or PostgreSQL full-text/trigram search for the MVP.

### FilterService

Reusable filters for date/date range, region, store, category,
product/SKU, partner/type, customer, supplier, status, transaction type
and channel.

### AnalyticsService

Reusable sum/count/average/growth/percentage/ranking/date-bucket
functions.

### NotificationService

Creates in-app alerts and optionally email/push records.

### AuditService

Writes who/what/when/entity/old/new data.

### WorkflowService

Reusable approvals for purchase orders, partner onboarding, inventory
adjustments, journal entries, store expansion and user access.

### ExportService

Exports filtered datasets to CSV/XLSX/PDF.

### FileService

Stores product/store images, invoices, contracts and generated reports.

### CacheService

Caches dashboard/summary queries and invalidates on relevant events.

## 3. Database schema --- MVP

### Organization

organizations(id, code, name, legal_name, logo_url, currency, timezone,
status) business_units(id, organization_id, code, name, type, region_id,
manager_id, status) regions(id, organization_id, name, code, country,
state, timezone, currency, status) locations(id, region_id, country,
state, city, postal_code, address_line_1, address_line_2, latitude,
longitude)

### Users/access

users(id, organization_id, employee_code, first_name, last_name, email,
phone, avatar_url, role_id, status) roles(id, organization_id, name,
description, status) permissions(id, module, resource, action)
role_permissions(role_id, permission_id) user_sessions(id, user_id,
token_hash, expires_at, revoked_at) user_security(id, user_id,
mfa_enabled, password_updated_at)

### Stores

stores(id, organization_id, store_code, store_number, name, store_type,
region_id, location_id, manager_id, phone, email, opening_date,
store_size, status, operational_status, image_url, latitude, longitude)
store_facilities(id, store_id, facility_type, status)
store_operating_hours(id, store_id, day_of_week, opening_time,
closing_time, is_closed) store_alerts(id, store_id, type, severity,
title, description, status, created_at, resolved_at)

### Products/inventory

categories(id, organization_id, parent_id, name, code, description,
image_url, status) products(id, organization_id, sku, barcode, name,
description, brand, category_id, subcategory_id, unit, cost_price,
selling_price, tax_rate, weight, dimensions, image_url, status)
product_variants(id, product_id, variant_code, attributes_json, price,
barcode, image_url, status) inventory(id, product_id, store_id,
quantity_on_hand, reserved_quantity, available_quantity,
in_transit_quantity, reorder_level, reorder_quantity,
low_stock_threshold, last_updated) inventory_movements(id, product_id,
store_id, movement_type, quantity, before_quantity, after_quantity,
reference_type, reference_id, user_id, timestamp)

### Partners/customers

business_partners(id, organization_id, partner_code, name, legal_name,
partner_type, email, phone, tax_id, location_id, status, credit_limit,
payment_terms, rating) customers(id, organization_id, customer_code,
first_name, last_name, email, phone, customer_type, location_id, status)
partner_metrics(id, partner_id, period, total_orders, total_sales,
total_purchases, outstanding_amount, average_order_value,
on_time_delivery_rate, return_rate, rating)

### Sales/procurement

sales_orders(id, order_number, customer_id, partner_id, store_id,
sales_channel, order_date, subtotal, discount, tax, shipping, total,
payment_status, fulfillment_status, order_status, created_by,
created_at, updated_at) sales_order_items(id, order_id, product_id,
quantity, unit_price, discount, tax, total) purchase_orders(id,
po_number, supplier_id, store_id, order_date, expected_date, subtotal,
tax, discount, total, payment_status, receiving_status, approval_status,
created_by, approved_by, created_at) purchase_order_items(id,
purchase_order_id, product_id, quantity, received_quantity, unit_cost,
tax, total) payments(id, payment_number, reference_type, reference_id,
payer_id, payee_id, payment_method, amount, currency, payment_date,
status, transaction_id)

### Ledger

chart_of_accounts(id, organization_id, account_code, account_name,
account_type, parent_account_id, currency, status) journal_entries(id,
journal_number, organization_id, transaction_date, description,
reference_type, reference_id, status, created_by, approved_by,
created_at) journal_entry_lines(id, journal_entry_id, account_id,
store_id, partner_id, debit, credit, currency, description)
financial_transactions(id, transaction_number, transaction_type,
reference_type, reference_id, account_id, partner_id, customer_id,
store_id, amount, currency, debit, credit, status, transaction_date,
created_by) financial_periods(id, organization_id, period_start,
period_end, status)

### Reports/settings/ops

report_definitions(id, name, code, category, description, data_source,
report_type, visibility, status) report_runs(id, report_definition_id,
user_id, filters_json, date_from, date_to, status, file_url,
generated_at) scheduled_reports(id, report_definition_id, user_id,
frequency, schedule_json, filters_json, delivery_method, recipient,
status, next_run_at, last_run_at) saved_filters(id, user_id, name,
module, filters_json, is_default) notifications(id, user_id, type,
title, message, severity, reference_type, reference_id, is_read,
created_at) notification_preferences(id, user_id, notification_type,
email_enabled, push_enabled, in_app_enabled, sms_enabled) documents(id,
organization_id, entity_type, entity_id, document_type, file_name,
file_url, mime_type, file_size, uploaded_by, created_at) audit_logs(id,
organization_id, user_id, action, module, entity_type, entity_id,
old_values_json, new_values_json, ip_address, user_agent, timestamp)
workflow_definitions(id, name, module, entity_type, trigger, status)
workflow_instances(id, workflow_id, entity_type, entity_id,
current_step, status, started_at, completed_at) workflow_approvals(id,
workflow_instance_id, approver_id, step, decision, comment, decided_at)

## 4. Section modules and APIs

### Dashboard

GET /dashboard/overview GET /dashboard/sales-trend GET
/dashboard/store-performance GET /dashboard/inventory-status GET
/dashboard/fulfillment GET /dashboard/category-sales GET
/dashboard/transactions GET /dashboard/alerts

Calculations: - sales = sum(order totals for valid/completed sales) -
orders = count valid orders - inventory value = sum(inventory.on_hand \*
product.cost_price) - fulfillment % = fulfilled / total × 100 - growth =
(current - previous)/previous × 100 - category share = category sales /
total sales × 100

### Inventory

GET /inventory/overview GET /inventory/products GET /inventory/stock GET
/inventory/low-stock GET /inventory/categories GET /inventory/suppliers
GET /inventory/:productId PATCH /inventory/:productId/stock POST
/inventory/movements POST /inventory/export

Rules: available = on_hand - reserved low stock if available \<=
reorder_level out of stock if available \<= 0 inventory value = on_hand
× cost price stock movement must record before/after quantity and
reference.

### Stores

GET /stores/overview GET /stores/map GET /stores GET /stores/:id GET
/stores/:id/performance GET /stores/:id/operations GET
/stores/:id/alerts POST /stores PATCH /stores/:id POST
/stores/:id/maintenance POST /stores/:id/favorite

Store performance is calculated from sales/order/inventory data; ranking
is server-side.

### Partners

GET /partners/overview GET /partners GET /partners/:id GET
/partners/:id/performance GET /partners/top POST /partners PATCH
/partners/:id POST /partners/:id/onboarding POST /partners/:id/approve

Partner growth = current active/new count compared with previous period.
Supplier performance can calculate on-time delivery, average delivery
time, returns and purchase volume.

### Ledger

GET /ledger/overview GET /ledger/transactions GET /ledger/accounts GET
/ledger/reconciliation GET /ledger/journals GET
/ledger/chart-of-accounts POST /ledger/journals POST
/ledger/transactions/import POST /ledger/reconciliation POST
/ledger/reports

Rules: - Debit/credit lines must balance: total debits = total
credits. - Closed financial periods reject normal posting. - A completed
sale can generate AR/revenue and inventory/COGS journal lines according
to the demo accounting rules. - Reconciliation compares
statement/imported records against ERP transactions and marks
matched/unmatched/exception.

### Reports

GET /reports/catalog POST /reports/run GET /reports/runs GET
/reports/runs/:id POST /reports/export POST /reports/schedules PATCH
/reports/schedules/:id GET /reports/quick GET /reports/scheduled

Report engine: report definition -\> permission -\> filters -\> query
adapter -\> calculation -\> formatting -\> result/file. All report
categories use the same filter engine.

### Settings

GET/PATCH /settings/profile GET/PATCH /settings/organization
GET/POST/PATCH /settings/users GET/POST/PATCH /settings/roles GET/PATCH
/settings/stores GET/PATCH /settings/products GET/PATCH
/settings/partners GET/PATCH /settings/finance GET/PATCH
/settings/notifications GET/PATCH /settings/reports GET/PATCH
/settings/system GET/PATCH /settings/security GET/POST /settings/support

## 5. Frontend-backend-database mapping

Dashboard: - Total Sales -\> /dashboard/overview -\> sales_orders -
Total Orders -\> /dashboard/overview -\> sales_orders - Active Stores
-\> /dashboard/overview -\> stores - Inventory Value -\>
/dashboard/overview -\> inventory + products - Recent Transactions -\>
/dashboard/transactions -\> financial_transactions - Alerts -\>
/dashboard/alerts -\> notifications/store_alerts

Inventory: - Product card -\> /inventory/products -\> products - Stock
-\> /inventory/stock -\> inventory - Movement -\> /inventory/movements
-\> inventory_movements - Supplier -\> /inventory/suppliers -\>
business_partners

Stores: - Map -\> /stores/map -\> stores + locations - Performance -\>
/stores/:id/performance -\> stores + sales_orders + inventory -
Facilities -\> /stores/:id -\> store_facilities - Alerts -\>
/stores/:id/alerts -\> store_alerts

Partners: - Partner list -\> /partners -\> business_partners - Top
partners -\> /partners/top -\> partners + sales_orders - Performance -\>
/partners/:id/performance -\> partner_metrics + orders/payments -
Onboarding -\> /partners/:id/onboarding -\> workflow tables + partner
record

Ledger: - Transaction row -\> /ledger/transactions -\>
financial_transactions - Accounts -\> /ledger/accounts -\>
chart_of_accounts - Journal -\> /ledger/journals -\> journal_entries +
lines - Reconciliation -\> /ledger/reconciliation -\>
financial_transactions + reconciliation state

Reports: - Report catalog -\> /reports/catalog -\> report_definitions -
Generated report -\> /reports/run -\> report_runs - Schedule -\>
/reports/schedules -\> scheduled_reports - Saved filter -\>
/reports/filters -\> saved_filters

Settings: - Profile -\> /settings/profile -\> users/user_security -
Organization -\> /settings/organization -\>
organizations/business_units/regions - Users/roles -\>
/settings/users,/roles -\> users/roles/permissions - Inventory rules -\>
/settings/products -\> products/categories/inventory configuration -
Finance -\> /settings/finance -\> tax/payment/COA/financial_periods -
Notifications -\> /settings/notifications -\> notification_preferences -
Security -\> /settings/security -\> user_security/audit_logs

## 6. Event map

SALE_COMPLETED -\> inventory movement + ledger posting + analytics
invalidation + notification check + audit. PURCHASE_RECEIVED -\>
inventory increase + payable/ledger effect + supplier metrics + audit.
STOCK_THRESHOLD_REACHED -\> notification + alert. PARTNER_APPROVED -\>
activate partner + onboarding completion + notification. JOURNAL_POSTED
-\> account balance refresh + audit. REPORT_COMPLETED -\> report run
update + notification. STORE_STATUS_CHANGED -\> dashboard/store cache
invalidation + alert if required. USER_PERMISSION_CHANGED -\> permission
cache invalidation + audit.

## 7. MVP implementation simplifications

-   PostgreSQL is enough; no microservices required.
-   Redis is optional; use in-memory cache for a small local demo if
    needed.
-   File storage can be local during the demo; use an abstraction so S3
    can be added later.
-   Scheduled reports can be implemented with one backend
    scheduler/cron.
-   Charts can be generated from API aggregates.
-   Use seeded data rather than live external Walmart systems.
-   Use mock weather/hero content if the visual needs it; it is not ERP
    source-of-truth data.
-   No need for distributed event infrastructure; an internal event
    dispatcher is enough for the MVP.

## 8. Seed data requirements

Seed enough data to make every screen look populated: - 1 organization -
4--8 regions - 20--50 stores - 100--500 products - 8--15 categories -
20--50 partners - 100+ customers - 500+ sales orders - 100+ purchase
orders - 1,000+ inventory movements - 500+ financial transactions - 20+
report definitions - 10+ scheduled reports - 20+ notifications -
representative users/roles/permissions.

The exact numbers are flexible; consistency is mandatory.

## 9. Transaction integrity

For any operation that changes multiple entities, use a database
transaction: sale -\> order + items + inventory movement + ledger entry.
purchase receiving -\> PO receipt + inventory movement + payable entry.
journal posting -\> journal header + balanced lines + financial
transaction records.

## 10. Final MVP principle

Build the smallest implementation that makes the seven screenshots
behave like one coherent ERP. Reuse common services and components; keep
domain calculations in domain modules; keep PostgreSQL as the source of
truth; expose stable DTOs to the frontend.
