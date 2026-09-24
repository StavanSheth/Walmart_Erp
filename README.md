# Walmart ERP MVP — Phase 1 Project Foundation

A production-ready foundation and development infrastructure for a Walmart-style ERP MVP.

## Tech Stack (Phase 1)

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query, Zod, Lucide Icons
- **Backend**: Fastify 5, TypeScript, Prisma ORM, Zod, `@fastify/cors`
- **Database**: PostgreSQL (Prisma connector)
- **Monorepo**: npm workspaces (`frontend`, `backend`)

---

## 1. Requirements

- **Node.js**: `v20+` or `v22+` (tested on Node v22.20.0)
- **npm**: `v10+` (tested on npm 10.9.3)
- **PostgreSQL**: `v15+` (local or hosted instance)

---

## 2. Install Dependencies

Install all root, backend, and frontend dependencies via npm workspaces:

```bash
npm install
```

---

## 3. Environment Setup

Copy example environment files:

```bash
# Root example
cp .env.example .env

# Backend environment
cp .env.example backend/.env

# Frontend environment
cp .env.example frontend/.env.local
```

### Environment Variables Overview

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/walmart_erp?schema=public` |
| `PORT` | Fastify backend port | `4000` |
| `HOST` | Fastify host bind | `0.0.0.0` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Frontend API client base URL | `http://localhost:4000/api` |

---

## 4. Database Setup & Validation

Generate and validate the Prisma Client:

```bash
# Validate schema
npm --workspace=backend run prisma:validate

# Generate Prisma Client
npm --workspace=backend run prisma:generate
```

---

## 5. Development Flow

Run both backend and frontend concurrently:

```bash
npm run dev
```

Or run services independently:

```bash
# Run Fastify backend (:4000)
npm run dev:backend

# Run Next.js frontend (:3000)
npm run dev:frontend
```

---

## 6. Verification Endpoints

- **Frontend Home**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Health Check Endpoint**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

Response:
```json
{
  "success": true,
  "service": "walmart-erp-backend",
  "status": "ok"
}
```

---

## 7. Build & Quality Commands

```bash
# Build all workspaces (TypeScript compilation & Next.js production build)
npm run build

# Run linting across backend and frontend
npm run lint
```
