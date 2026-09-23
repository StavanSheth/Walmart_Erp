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
