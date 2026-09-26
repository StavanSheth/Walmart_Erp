# Database Management & Seeding

This directory stores the database seed definitions and static seed fixtures for the Walmart ERP MVP.

## Directory Structure

```
database/
├── seed/
│   ├── products.json     # Product catalog fixture
│   ├── stores.json       # Stores and regional mapping fixture
│   ├── partners.json     # Suppliers and partner fixture
│   └── demo-data.json    # Consolidated demo transactions, accounts & orders
└── README.md
```

## Running Migrations & Seeding

All Prisma migrations and execution scripts live under `backend/prisma`:

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Seed database
npm run db:seed

# Inspect in Prisma Studio
npm run db:studio
```

## Restoring from Complete Database Dump

A complete PostgreSQL database dump with all 120 stores across 10 global countries, products, suppliers, ledger entries, and 30-day realistic sales/purchase waves is provided in `database/walmart_erp.sql`:

```bash
# Restore directly into postgres
psql -U postgres -d walmart_erp < database/walmart_erp.sql
```

