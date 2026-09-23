# Walmart ERP

Enterprise Resource Planning (ERP) platform built with a modern, lightweight, monolithic-friendly stack.

## Tech Stack

- **Frontend**: Next.js + React + TypeScript + Tailwind CSS + shadcn/ui + Recharts
- **Backend**: Fastify + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Data Contract**: TanStack Query + Zod
- **Auth**: Simple JWT/session auth

## Architecture & Design Principles

- **Single Source of Truth (SSOT)**: One PostgreSQL database, one Prisma schema, one set of backend APIs.
- **Frontend-Only Responsiveness**: The database and API responses are identical across mobile, tablet, and desktop viewports.
- **Aggregated Endpoints**: One API request per major view (`/api/dashboard/overview`, `/api/inventory/overview`, etc.) for optimal performance.
- **Server-Side Calculations**: Financial and inventory metrics are computed in backend services, never client-side.

## Repository Structure

```text
walmart-erp/
├── frontend/     # Next.js frontend application
├── backend/      # Fastify API server & Prisma ORM
├── database/     # Seed fixtures & DB documentation
├── docs/         # Specifications & architectural documentation
├── scripts/      # Developer workflows and DB scripts
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Database Setup & Seeding

1. Configure `.env` in `backend/`:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/walmart_erp?schema=public"
   ```

2. Run Prisma migrations and seed:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   ```
