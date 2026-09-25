--
-- PostgreSQL database dump
--

\restrict IwWJTe3lYmjXDqRlE8xKj2qTj0hlkzqHpP2yghr9gI4LWToUDsooenjqbhwLznC

-- Dumped from database version 14.24 (Ubuntu 14.24-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.24 (Ubuntu 14.24-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Store" DROP CONSTRAINT IF EXISTS "Store_regionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Store" DROP CONSTRAINT IF EXISTS "Store_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Store" DROP CONSTRAINT IF EXISTS "Store_managerId_fkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrder" DROP CONSTRAINT IF EXISTS "SalesOrder_storeId_fkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrder" DROP CONSTRAINT IF EXISTS "SalesOrder_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrder" DROP CONSTRAINT IF EXISTS "SalesOrder_customerId_fkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrderItem" DROP CONSTRAINT IF EXISTS "SalesOrderItem_salesOrderId_fkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrderItem" DROP CONSTRAINT IF EXISTS "SalesOrderItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public."RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_permissionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Region" DROP CONSTRAINT IF EXISTS "Region_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrder" DROP CONSTRAINT IF EXISTS "PurchaseOrder_storeId_fkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrder" DROP CONSTRAINT IF EXISTS "PurchaseOrder_partnerId_fkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrder" DROP CONSTRAINT IF EXISTS "PurchaseOrder_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrderItem" DROP CONSTRAINT IF EXISTS "PurchaseOrderItem_purchaseOrderId_fkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrderItem" DROP CONSTRAINT IF EXISTS "PurchaseOrderItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_salesOrderId_fkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Partner" DROP CONSTRAINT IF EXISTS "Partner_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."JournalLine" DROP CONSTRAINT IF EXISTS "JournalLine_journalEntryId_fkey";
ALTER TABLE IF EXISTS ONLY public."JournalLine" DROP CONSTRAINT IF EXISTS "JournalLine_accountId_fkey";
ALTER TABLE IF EXISTS ONLY public."JournalEntry" DROP CONSTRAINT IF EXISTS "JournalEntry_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Inventory" DROP CONSTRAINT IF EXISTS "Inventory_storeId_fkey";
ALTER TABLE IF EXISTS ONLY public."Inventory" DROP CONSTRAINT IF EXISTS "Inventory_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."Inventory" DROP CONSTRAINT IF EXISTS "Inventory_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."InventoryMovement" DROP CONSTRAINT IF EXISTS "InventoryMovement_storeId_fkey";
ALTER TABLE IF EXISTS ONLY public."InventoryMovement" DROP CONSTRAINT IF EXISTS "InventoryMovement_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."InventoryMovement" DROP CONSTRAINT IF EXISTS "InventoryMovement_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Customer" DROP CONSTRAINT IF EXISTS "Customer_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_organizationId_fkey";
DROP INDEX IF EXISTS public."User_organizationId_status_idx";
DROP INDEX IF EXISTS public."User_organizationId_email_key";
DROP INDEX IF EXISTS public."Store_organizationId_status_idx";
DROP INDEX IF EXISTS public."Store_organizationId_regionId_idx";
DROP INDEX IF EXISTS public."Store_organizationId_code_key";
DROP INDEX IF EXISTS public."SalesOrder_status_idx";
DROP INDEX IF EXISTS public."SalesOrder_organizationId_storeId_createdAt_idx";
DROP INDEX IF EXISTS public."SalesOrder_organizationId_orderNumber_key";
DROP INDEX IF EXISTS public."SalesOrder_organizationId_customerId_idx";
DROP INDEX IF EXISTS public."SalesOrderItem_salesOrderId_idx";
DROP INDEX IF EXISTS public."SalesOrderItem_productId_idx";
DROP INDEX IF EXISTS public."Role_name_key";
DROP INDEX IF EXISTS public."Region_organizationId_status_idx";
DROP INDEX IF EXISTS public."Region_organizationId_code_key";
DROP INDEX IF EXISTS public."PurchaseOrder_status_idx";
DROP INDEX IF EXISTS public."PurchaseOrder_organizationId_storeId_createdAt_idx";
DROP INDEX IF EXISTS public."PurchaseOrder_organizationId_partnerId_idx";
DROP INDEX IF EXISTS public."PurchaseOrder_organizationId_orderNumber_key";
DROP INDEX IF EXISTS public."PurchaseOrderItem_purchaseOrderId_idx";
DROP INDEX IF EXISTS public."PurchaseOrderItem_productId_idx";
DROP INDEX IF EXISTS public."Product_organizationId_status_idx";
DROP INDEX IF EXISTS public."Product_organizationId_sku_key";
DROP INDEX IF EXISTS public."Product_organizationId_name_idx";
DROP INDEX IF EXISTS public."Product_organizationId_categoryId_idx";
DROP INDEX IF EXISTS public."Product_organizationId_barcode_key";
DROP INDEX IF EXISTS public."Permission_code_key";
DROP INDEX IF EXISTS public."Payment_salesOrderId_idx";
DROP INDEX IF EXISTS public."Payment_paidAt_idx";
DROP INDEX IF EXISTS public."Payment_organizationId_status_idx";
DROP INDEX IF EXISTS public."Partner_organizationId_type_idx";
DROP INDEX IF EXISTS public."Partner_organizationId_status_idx";
DROP INDEX IF EXISTS public."Organization_status_idx";
DROP INDEX IF EXISTS public."Organization_name_idx";
DROP INDEX IF EXISTS public."Organization_code_key";
DROP INDEX IF EXISTS public."JournalLine_journalEntryId_idx";
DROP INDEX IF EXISTS public."JournalLine_accountId_idx";
DROP INDEX IF EXISTS public."JournalEntry_referenceType_referenceId_idx";
DROP INDEX IF EXISTS public."JournalEntry_organizationId_entryDate_idx";
DROP INDEX IF EXISTS public."Inventory_storeId_productId_idx";
DROP INDEX IF EXISTS public."Inventory_productId_idx";
DROP INDEX IF EXISTS public."Inventory_organizationId_storeId_productId_key";
DROP INDEX IF EXISTS public."InventoryMovement_referenceType_referenceId_idx";
DROP INDEX IF EXISTS public."InventoryMovement_organizationId_type_createdAt_idx";
DROP INDEX IF EXISTS public."InventoryMovement_organizationId_storeId_productId_idx";
DROP INDEX IF EXISTS public."Customer_organizationId_status_idx";
DROP INDEX IF EXISTS public."Customer_organizationId_phone_idx";
DROP INDEX IF EXISTS public."Category_organizationId_status_idx";
DROP INDEX IF EXISTS public."Category_organizationId_name_key";
DROP INDEX IF EXISTS public."Category_organizationId_code_key";
DROP INDEX IF EXISTS public."AuditLog_organizationId_userId_idx";
DROP INDEX IF EXISTS public."AuditLog_organizationId_createdAt_idx";
DROP INDEX IF EXISTS public."AuditLog_entity_entityId_idx";
DROP INDEX IF EXISTS public."Account_organizationId_type_idx";
DROP INDEX IF EXISTS public."Account_organizationId_code_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Store" DROP CONSTRAINT IF EXISTS "Store_pkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrder" DROP CONSTRAINT IF EXISTS "SalesOrder_pkey";
ALTER TABLE IF EXISTS ONLY public."SalesOrderItem" DROP CONSTRAINT IF EXISTS "SalesOrderItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Role" DROP CONSTRAINT IF EXISTS "Role_pkey";
ALTER TABLE IF EXISTS ONLY public."RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_pkey";
ALTER TABLE IF EXISTS ONLY public."Region" DROP CONSTRAINT IF EXISTS "Region_pkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrder" DROP CONSTRAINT IF EXISTS "PurchaseOrder_pkey";
ALTER TABLE IF EXISTS ONLY public."PurchaseOrderItem" DROP CONSTRAINT IF EXISTS "PurchaseOrderItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_pkey";
ALTER TABLE IF EXISTS ONLY public."Permission" DROP CONSTRAINT IF EXISTS "Permission_pkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_pkey";
ALTER TABLE IF EXISTS ONLY public."Partner" DROP CONSTRAINT IF EXISTS "Partner_pkey";
ALTER TABLE IF EXISTS ONLY public."Organization" DROP CONSTRAINT IF EXISTS "Organization_pkey";
ALTER TABLE IF EXISTS ONLY public."JournalLine" DROP CONSTRAINT IF EXISTS "JournalLine_pkey";
ALTER TABLE IF EXISTS ONLY public."JournalEntry" DROP CONSTRAINT IF EXISTS "JournalEntry_pkey";
ALTER TABLE IF EXISTS ONLY public."Inventory" DROP CONSTRAINT IF EXISTS "Inventory_pkey";
ALTER TABLE IF EXISTS ONLY public."InventoryMovement" DROP CONSTRAINT IF EXISTS "InventoryMovement_pkey";
ALTER TABLE IF EXISTS ONLY public."Customer" DROP CONSTRAINT IF EXISTS "Customer_pkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Store";
DROP TABLE IF EXISTS public."SalesOrderItem";
DROP TABLE IF EXISTS public."SalesOrder";
DROP TABLE IF EXISTS public."RolePermission";
DROP TABLE IF EXISTS public."Role";
DROP TABLE IF EXISTS public."Region";
DROP TABLE IF EXISTS public."PurchaseOrderItem";
DROP TABLE IF EXISTS public."PurchaseOrder";
DROP TABLE IF EXISTS public."Product";
DROP TABLE IF EXISTS public."Permission";
DROP TABLE IF EXISTS public."Payment";
DROP TABLE IF EXISTS public."Partner";
DROP TABLE IF EXISTS public."Organization";
DROP TABLE IF EXISTS public."JournalLine";
DROP TABLE IF EXISTS public."JournalEntry";
DROP TABLE IF EXISTS public."InventoryMovement";
DROP TABLE IF EXISTS public."Inventory";
DROP TABLE IF EXISTS public."Customer";
DROP TABLE IF EXISTS public."Category";
DROP TABLE IF EXISTS public."AuditLog";
DROP TABLE IF EXISTS public."Account";
DROP TYPE IF EXISTS public."UserStatus";
DROP TYPE IF EXISTS public."StoreStatus";
DROP TYPE IF EXISTS public."RegionStatus";
DROP TYPE IF EXISTS public."PurchaseStatus";
DROP TYPE IF EXISTS public."ProductStatus";
DROP TYPE IF EXISTS public."PaymentStatus";
DROP TYPE IF EXISTS public."PaymentMethod";
DROP TYPE IF EXISTS public."PartnerType";
DROP TYPE IF EXISTS public."PartnerStatus";
DROP TYPE IF EXISTS public."OrganizationStatus";
DROP TYPE IF EXISTS public."OrderStatus";
DROP TYPE IF EXISTS public."InventoryMovementType";
DROP TYPE IF EXISTS public."CustomerType";
DROP TYPE IF EXISTS public."CustomerStatus";
DROP TYPE IF EXISTS public."CategoryStatus";
DROP TYPE IF EXISTS public."AccountType";
--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountType" AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE'
);


ALTER TYPE public."AccountType" OWNER TO postgres;

--
-- Name: CategoryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CategoryStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."CategoryStatus" OWNER TO postgres;

--
-- Name: CustomerStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CustomerStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."CustomerStatus" OWNER TO postgres;

--
-- Name: CustomerType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CustomerType" AS ENUM (
    'RETAIL',
    'BUSINESS'
);


ALTER TYPE public."CustomerType" OWNER TO postgres;

--
-- Name: InventoryMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InventoryMovementType" AS ENUM (
    'OPENING',
    'PURCHASE',
    'SALE',
    'RETURN',
    'ADJUSTMENT',
    'TRANSFER_IN',
    'TRANSFER_OUT'
);


ALTER TYPE public."InventoryMovementType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'DRAFT',
    'CONFIRMED',
    'PROCESSING',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: OrganizationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrganizationStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."OrganizationStatus" OWNER TO postgres;

--
-- Name: PartnerStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PartnerStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."PartnerStatus" OWNER TO postgres;

--
-- Name: PartnerType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PartnerType" AS ENUM (
    'SUPPLIER',
    'WHOLESALER',
    'DISTRIBUTOR',
    'VENDOR'
);


ALTER TYPE public."PartnerType" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'CARD',
    'UPI',
    'BANK_TRANSFER',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'DISCONTINUED'
);


ALTER TYPE public."ProductStatus" OWNER TO postgres;

--
-- Name: PurchaseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PurchaseStatus" AS ENUM (
    'DRAFT',
    'ORDERED',
    'PARTIALLY_RECEIVED',
    'RECEIVED',
    'CANCELLED'
);


ALTER TYPE public."PurchaseStatus" OWNER TO postgres;

--
-- Name: RegionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RegionStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."RegionStatus" OWNER TO postgres;

--
-- Name: StoreStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StoreStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'MAINTENANCE'
);


ALTER TYPE public."StoreStatus" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    type public."AccountType" NOT NULL,
    "parentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "userId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    "oldValue" jsonb,
    "newValue" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "parentId" text,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    status public."CategoryStatus" DEFAULT 'ACTIVE'::public."CategoryStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    name text NOT NULL,
    phone text,
    email text,
    address text,
    "customerType" public."CustomerType" DEFAULT 'RETAIL'::public."CustomerType" NOT NULL,
    "creditLimit" numeric(12,2) DEFAULT 0 NOT NULL,
    status public."CustomerStatus" DEFAULT 'ACTIVE'::public."CustomerStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Inventory" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "storeId" text NOT NULL,
    "productId" text NOT NULL,
    "onHand" integer DEFAULT 0 NOT NULL,
    reserved integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Inventory" OWNER TO postgres;

--
-- Name: InventoryMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryMovement" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "storeId" text NOT NULL,
    "productId" text NOT NULL,
    type public."InventoryMovementType" NOT NULL,
    quantity integer NOT NULL,
    "unitCost" numeric(12,2),
    "referenceType" text,
    "referenceId" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InventoryMovement" OWNER TO postgres;

--
-- Name: JournalEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JournalEntry" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "entryNumber" text,
    "referenceType" text,
    "referenceId" text,
    description text NOT NULL,
    "entryDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."JournalEntry" OWNER TO postgres;

--
-- Name: JournalLine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JournalLine" (
    id text NOT NULL,
    "journalEntryId" text NOT NULL,
    "accountId" text NOT NULL,
    debit numeric(12,2) DEFAULT 0 NOT NULL,
    credit numeric(12,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public."JournalLine" OWNER TO postgres;

--
-- Name: Organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Organization" (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    timezone text DEFAULT 'Asia/Kolkata'::text NOT NULL,
    status public."OrganizationStatus" DEFAULT 'ACTIVE'::public."OrganizationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Organization" OWNER TO postgres;

--
-- Name: Partner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Partner" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    name text NOT NULL,
    type public."PartnerType" NOT NULL,
    phone text,
    email text,
    address text,
    "taxId" text,
    "creditLimit" numeric(12,2) DEFAULT 0 NOT NULL,
    status public."PartnerStatus" DEFAULT 'ACTIVE'::public."PartnerStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Partner" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "salesOrderId" text,
    amount numeric(12,2) NOT NULL,
    method public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    reference text,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "categoryId" text,
    sku text NOT NULL,
    barcode text,
    name text NOT NULL,
    description text,
    unit text DEFAULT 'pcs'::text NOT NULL,
    "costPrice" numeric(12,2) NOT NULL,
    "sellingPrice" numeric(12,2) NOT NULL,
    "taxRate" numeric(5,2) DEFAULT 0 NOT NULL,
    "reorderLevel" integer DEFAULT 0 NOT NULL,
    status public."ProductStatus" DEFAULT 'ACTIVE'::public."ProductStatus" NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrder" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "storeId" text NOT NULL,
    "partnerId" text NOT NULL,
    "orderNumber" text NOT NULL,
    status public."PurchaseStatus" DEFAULT 'DRAFT'::public."PurchaseStatus" NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PurchaseOrder" OWNER TO postgres;

--
-- Name: PurchaseOrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrderItem" (
    id text NOT NULL,
    "purchaseOrderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "unitCost" numeric(12,2) NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) NOT NULL
);


ALTER TABLE public."PurchaseOrderItem" OWNER TO postgres;

--
-- Name: Region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Region" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    status public."RegionStatus" DEFAULT 'ACTIVE'::public."RegionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Region" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: SalesOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalesOrder" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "storeId" text NOT NULL,
    "customerId" text,
    "orderNumber" text NOT NULL,
    status public."OrderStatus" DEFAULT 'DRAFT'::public."OrderStatus" NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0 NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SalesOrder" OWNER TO postgres;

--
-- Name: SalesOrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalesOrderItem" (
    id text NOT NULL,
    "salesOrderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(12,2) NOT NULL,
    discount numeric(12,2) DEFAULT 0 NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) NOT NULL
);


ALTER TABLE public."SalesOrderItem" OWNER TO postgres;

--
-- Name: Store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Store" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "regionId" text,
    name text NOT NULL,
    code text NOT NULL,
    address text,
    city text,
    state text,
    country text DEFAULT 'India'::text NOT NULL,
    pincode text,
    phone text,
    email text,
    "managerId" text,
    status public."StoreStatus" DEFAULT 'ACTIVE'::public."StoreStatus" NOT NULL,
    image text,
    latitude numeric(10,7),
    longitude numeric(10,7),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Store" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "roleId" text,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    "passwordHash" text NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "organizationId", code, name, type, "parentId", "isActive", "createdAt", "updatedAt") FROM stdin;
acc-1000	org-walmart-demo	1000	Cash	ASSET	\N	t	2026-09-24 11:52:08.54	2026-09-24 11:52:08.54
acc-1010	org-walmart-demo	1010	Bank	ASSET	\N	t	2026-09-24 11:52:08.547	2026-09-24 11:52:08.547
acc-1100	org-walmart-demo	1100	Accounts Receivable	ASSET	\N	t	2026-09-24 11:52:08.551	2026-09-24 11:52:08.551
acc-1200	org-walmart-demo	1200	Inventory	ASSET	\N	t	2026-09-24 11:52:08.554	2026-09-24 11:52:08.554
acc-1300	org-walmart-demo	1300	Input Tax (GST Credit)	ASSET	\N	t	2026-09-24 11:52:08.559	2026-09-24 11:52:08.559
acc-2000	org-walmart-demo	2000	Accounts Payable	LIABILITY	\N	t	2026-09-24 11:52:08.563	2026-09-24 11:52:08.563
acc-2100	org-walmart-demo	2100	Tax Payable (GST Output)	LIABILITY	\N	t	2026-09-24 11:52:08.568	2026-09-24 11:52:08.568
acc-3000	org-walmart-demo	3000	Owner Equity	EQUITY	\N	t	2026-09-24 11:52:08.572	2026-09-24 11:52:08.572
acc-4000	org-walmart-demo	4000	Sales Revenue	REVENUE	\N	t	2026-09-24 11:52:08.576	2026-09-24 11:52:08.576
acc-4100	org-walmart-demo	4100	Sales Discount	EXPENSE	\N	t	2026-09-24 11:52:08.58	2026-09-24 11:52:08.58
acc-5000	org-walmart-demo	5000	Cost of Goods Sold	EXPENSE	\N	t	2026-09-24 11:52:08.585	2026-09-24 11:52:08.585
acc-5100	org-walmart-demo	5100	Purchase Expense	EXPENSE	\N	t	2026-09-24 11:52:08.589	2026-09-24 11:52:08.589
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "organizationId", "userId", action, entity, "entityId", "oldValue", "newValue", "createdAt") FROM stdin;
audit-0001	org-walmart-demo	user-demo-admin	ORGANIZATION_CREATED	Organization	org-walmart-demo	null	{"code": "WALMART-DEMO", "name": "Walmart Demo"}	2026-06-26 03:30:00
audit-0002	org-walmart-demo	user-demo-admin	STORE_CREATED	Store	store-del-001	null	{"code": "WAL-DEL-001", "name": "Walmart Delhi Connaught Place"}	2026-06-27 04:47:00
audit-0003	org-walmart-demo	user-demo-admin	STORE_CREATED	Store	store-jpr-001	null	{"code": "WAL-JPR-001", "name": "Walmart Jaipur MI Road"}	2026-06-27 06:04:00
audit-0004	org-walmart-demo	user-demo-admin	PRODUCT_CREATED	Product	prod-0001	null	{"sku": "GRC-RICE-5KG", "name": "Premium Basmati Rice 5kg"}	2026-07-01 07:21:00
audit-0005	org-walmart-demo	user-demo-admin	PRODUCT_CREATED	Product	prod-0008	null	{"sku": "BEV-COLA-500", "name": "Cola Soft Drink 500ml"}	2026-07-01 07:38:00
audit-0006	org-walmart-demo	user-demo-admin	PRODUCT_UPDATED	Product	prod-0001	{"sellingPrice": 450}	{"sellingPrice": 475}	2026-07-26 08:55:00
audit-0007	org-walmart-demo	user-demo-admin	INVENTORY_ADJUSTED	Inventory	store-del-001:prod-0008	null	{"reason": "Damaged goods", "adjustment": -5}	2026-09-09 10:12:00
audit-0008	org-walmart-demo	user-demo-admin	PURCHASE_CREATED	PurchaseOrder	po-0001	null	{"status": "DRAFT", "orderNumber": "PO-000001"}	2026-07-08 11:29:00
audit-0009	org-walmart-demo	user-demo-admin	PURCHASE_RECEIVED	PurchaseOrder	po-0004	null	{"status": "RECEIVED", "orderNumber": "PO-000004"}	2026-07-18 11:46:00
audit-0010	org-walmart-demo	user-demo-admin	SALE_CREATED	SalesOrder	so-0001	null	{"status": "DRAFT", "orderNumber": "SO-000001"}	2026-06-28 13:03:00
audit-0011	org-walmart-demo	user-demo-admin	SALE_COMPLETED	SalesOrder	so-0004	null	{"status": "COMPLETED", "orderNumber": "SO-000004"}	2026-06-30 14:20:00
audit-0012	org-walmart-demo	user-demo-admin	STORE_UPDATED	Store	store-mum-001	{"phone": "+91 22 00000000"}	{"phone": "+91 22 23456703"}	2026-08-10 14:37:00
audit-0013	org-walmart-demo	user-demo-admin	CUSTOMER_CREATED	Customer	cust-0001	null	{"name": "Aarav Sharma"}	2026-07-06 03:54:00
audit-0014	org-walmart-demo	user-demo-admin	PARTNER_CREATED	Partner	partner-0001	null	{"name": "Raj Enterprises", "type": "SUPPLIER"}	2026-07-04 05:11:00
audit-0015	org-walmart-demo	user-demo-admin	PAYMENT_RECEIVED	Payment	pay-0001	null	{"method": "CASH", "status": "PAID"}	2026-06-30 06:28:00
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, "organizationId", "parentId", name, code, description, status, "createdAt", "updatedAt") FROM stdin;
cat-grocery	org-walmart-demo	\N	Groceries	GRC	\N	ACTIVE	2026-09-24 11:52:01.293	2026-09-24 11:52:01.293
cat-beverages	org-walmart-demo	\N	Beverages	BEV	\N	ACTIVE	2026-09-24 11:52:01.306	2026-09-24 11:52:01.306
cat-dairy	org-walmart-demo	\N	Dairy	DRY	\N	ACTIVE	2026-09-24 11:52:01.313	2026-09-24 11:52:01.313
cat-bakery	org-walmart-demo	\N	Bakery	BKY	\N	ACTIVE	2026-09-24 11:52:01.321	2026-09-24 11:52:01.321
cat-personal	org-walmart-demo	\N	Personal Care	PRC	\N	ACTIVE	2026-09-24 11:52:01.326	2026-09-24 11:52:01.326
cat-household	org-walmart-demo	\N	Household	HLD	\N	ACTIVE	2026-09-24 11:52:01.332	2026-09-24 11:52:01.332
cat-electronics	org-walmart-demo	\N	Electronics	ELC	\N	ACTIVE	2026-09-24 11:52:01.338	2026-09-24 11:52:01.338
cat-appliances	org-walmart-demo	\N	Home Appliances	APL	\N	ACTIVE	2026-09-24 11:52:01.344	2026-09-24 11:52:01.344
cat-kitchen	org-walmart-demo	\N	Kitchen	KTN	\N	ACTIVE	2026-09-24 11:52:01.349	2026-09-24 11:52:01.349
cat-furniture	org-walmart-demo	\N	Furniture	FRN	\N	ACTIVE	2026-09-24 11:52:01.356	2026-09-24 11:52:01.356
cat-clothing	org-walmart-demo	\N	Clothing	CLT	\N	ACTIVE	2026-09-24 11:52:01.361	2026-09-24 11:52:01.361
cat-footwear	org-walmart-demo	\N	Footwear	FTW	\N	ACTIVE	2026-09-24 11:52:01.366	2026-09-24 11:52:01.366
cat-stationery	org-walmart-demo	\N	Stationery	STN	\N	ACTIVE	2026-09-24 11:52:01.371	2026-09-24 11:52:01.371
cat-sports	org-walmart-demo	\N	Sports	SPT	\N	ACTIVE	2026-09-24 11:52:01.376	2026-09-24 11:52:01.376
cat-toys	org-walmart-demo	\N	Toys	TOY	\N	ACTIVE	2026-09-24 11:52:01.381	2026-09-24 11:52:01.381
cat-beauty	org-walmart-demo	\N	Beauty	BTY	\N	ACTIVE	2026-09-24 11:52:01.385	2026-09-24 11:52:01.385
cat-petcare	org-walmart-demo	\N	Pet Care	PET	\N	ACTIVE	2026-09-24 11:52:01.392	2026-09-24 11:52:01.392
cat-mobile-acc	org-walmart-demo	cat-electronics	Mobile Accessories	MOB	\N	ACTIVE	2026-09-24 11:52:01.398	2026-09-24 11:52:01.398
cat-audio	org-walmart-demo	cat-electronics	Audio	AUD	\N	ACTIVE	2026-09-24 11:52:01.403	2026-09-24 11:52:01.403
cat-comp-acc	org-walmart-demo	cat-electronics	Computer Accessories	CMP	\N	ACTIVE	2026-09-24 11:52:01.407	2026-09-24 11:52:01.407
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, "organizationId", name, phone, email, address, "customerType", "creditLimit", status, "createdAt", "updatedAt") FROM stdin;
cust-0001	org-walmart-demo	Aarav Sharma	+91 9810000000	aarav.sharma0@example.local	100, Sector 1, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.863	2026-09-24 11:52:01.863
cust-0002	org-walmart-demo	Priya Patel	+91 9810000137	priya.patel1@example.local	101, Sector 2, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.869	2026-09-24 11:52:01.869
cust-0003	org-walmart-demo	Rohan Singh	+91 9810000274	rohan.singh2@example.local	102, Sector 3, Bangalore	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.874	2026-09-24 11:52:01.874
cust-0004	org-walmart-demo	Sneha Kumar	+91 9810000411	sneha.kumar3@example.local	103, Sector 4, Chennai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.878	2026-09-24 11:52:01.878
cust-0005	org-walmart-demo	Vikram Reddy	+91 9810000548	vikram.reddy4@example.local	104, Sector 5, Kolkata	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.882	2026-09-24 11:52:01.882
cust-0006	org-walmart-demo	Ananya Joshi	+91 9810000685	ananya.joshi5@example.local	105, Sector 6, Pune	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.887	2026-09-24 11:52:01.887
cust-0007	org-walmart-demo	Karthik Mehta	+91 9810000822	karthik.mehta6@example.local	106, Sector 7, Jaipur	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.891	2026-09-24 11:52:01.891
cust-0008	org-walmart-demo	Meera Gupta	+91 9810000959	meera.gupta7@example.local	107, Sector 8, Hyderabad	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.896	2026-09-24 11:52:01.896
cust-0009	org-walmart-demo	Arjun Nair	+91 9810001096	arjun.nair8@example.local	108, Sector 9, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.899	2026-09-24 11:52:01.899
cust-0010	org-walmart-demo	Divya Verma	+91 9810001233	divya.verma9@example.local	109, Sector 10, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.903	2026-09-24 11:52:01.903
cust-0011	org-walmart-demo	Rahul Das	+91 9810001370	rahul.das10@example.local	110, Sector 11, Bangalore	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.908	2026-09-24 11:52:01.908
cust-0012	org-walmart-demo	Neha Iyer	+91 9810001507	neha.iyer11@example.local	111, Sector 12, Chennai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.912	2026-09-24 11:52:01.912
cust-0013	org-walmart-demo	Sanjay Shah	+91 9810001644	sanjay.shah12@example.local	112, Sector 13, Kolkata	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.916	2026-09-24 11:52:01.916
cust-0014	org-walmart-demo	Kavita Rao	+91 9810001781	kavita.rao13@example.local	113, Sector 14, Pune	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.92	2026-09-24 11:52:01.92
cust-0015	org-walmart-demo	Amit Mishra	+91 9810001918	amit.mishra14@example.local	114, Sector 15, Jaipur	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.925	2026-09-24 11:52:01.925
cust-0016	org-walmart-demo	Pooja Banerjee	+91 9810002055	pooja.banerjee15@example.local	115, Sector 16, Hyderabad	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.929	2026-09-24 11:52:01.929
cust-0017	org-walmart-demo	Deepak Chauhan	+91 9810002192	deepak.chauhan16@example.local	116, Sector 17, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.933	2026-09-24 11:52:01.933
cust-0018	org-walmart-demo	Shreya Pillai	+91 9810002329	shreya.pillai17@example.local	117, Sector 18, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.937	2026-09-24 11:52:01.937
cust-0019	org-walmart-demo	Rajesh Agarwal	+91 9810002466	rajesh.agarwal18@example.local	118, Sector 19, Bangalore	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.942	2026-09-24 11:52:01.942
cust-0020	org-walmart-demo	Nandini Bhat	+91 9810002603	nandini.bhat19@example.local	119, Sector 20, Chennai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.947	2026-09-24 11:52:01.947
cust-0021	org-walmart-demo	Suresh Sharma	+91 9810002740	suresh.sharma20@example.local	120, Sector 1, Kolkata	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.951	2026-09-24 11:52:01.951
cust-0022	org-walmart-demo	Lakshmi Patel	+91 9810002877	lakshmi.patel21@example.local	121, Sector 2, Pune	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.955	2026-09-24 11:52:01.955
cust-0023	org-walmart-demo	Manoj Singh	+91 9810003014	manoj.singh22@example.local	122, Sector 3, Jaipur	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.96	2026-09-24 11:52:01.96
cust-0024	org-walmart-demo	Anjali Kumar	+91 9810003151	anjali.kumar23@example.local	123, Sector 4, Hyderabad	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.964	2026-09-24 11:52:01.964
cust-0025	org-walmart-demo	Vishal Reddy	+91 9810003288	vishal.reddy24@example.local	124, Sector 5, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.968	2026-09-24 11:52:01.968
cust-0026	org-walmart-demo	Swati Joshi	+91 9810003425	swati.joshi25@example.local	125, Sector 6, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.972	2026-09-24 11:52:01.972
cust-0027	org-walmart-demo	Arun Mehta	+91 9810003562	arun.mehta26@example.local	126, Sector 7, Bangalore	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.976	2026-09-24 11:52:01.976
cust-0028	org-walmart-demo	Isha Gupta	+91 9810003699	isha.gupta27@example.local	127, Sector 8, Chennai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.98	2026-09-24 11:52:01.98
cust-0029	org-walmart-demo	Nitin Nair	+91 9810003836	nitin.nair28@example.local	128, Sector 9, Kolkata	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.984	2026-09-24 11:52:01.984
cust-0030	org-walmart-demo	Ritu Verma	+91 9810003973	ritu.verma29@example.local	129, Sector 10, Pune	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.988	2026-09-24 11:52:01.988
cust-0031	org-walmart-demo	Gaurav Das	+91 9810004110	gaurav.das30@example.local	130, Sector 11, Jaipur	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.993	2026-09-24 11:52:01.993
cust-0032	org-walmart-demo	Pallavi Iyer	+91 9810004247	pallavi.iyer31@example.local	131, Sector 12, Hyderabad	RETAIL	0.00	ACTIVE	2026-09-24 11:52:01.997	2026-09-24 11:52:01.997
cust-0033	org-walmart-demo	Pranav Shah	+91 9810004384	pranav.shah32@example.local	132, Sector 13, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.002	2026-09-24 11:52:02.002
cust-0034	org-walmart-demo	Tanvi Rao	+91 9810004521	tanvi.rao33@example.local	133, Sector 14, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.006	2026-09-24 11:52:02.006
cust-0035	org-walmart-demo	Varun Mishra	+91 9810004658	varun.mishra34@example.local	134, Sector 15, Bangalore	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.011	2026-09-24 11:52:02.011
cust-0036	org-walmart-demo	Aditi Banerjee	+91 9810004795	aditi.banerjee35@example.local	135, Sector 16, Chennai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.015	2026-09-24 11:52:02.015
cust-0037	org-walmart-demo	Siddharth Chauhan	+91 9810004932	siddharth.chauhan36@example.local	136, Sector 17, Kolkata	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.018	2026-09-24 11:52:02.018
cust-0038	org-walmart-demo	Sakshi Pillai	+91 9810005069	sakshi.pillai37@example.local	137, Sector 18, Pune	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.022	2026-09-24 11:52:02.022
cust-0039	org-walmart-demo	Yash Agarwal	+91 9810005206	yash.agarwal38@example.local	138, Sector 19, Jaipur	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.027	2026-09-24 11:52:02.027
cust-0040	org-walmart-demo	Nisha Bhat	+91 9810005343	nisha.bhat39@example.local	139, Sector 20, Hyderabad	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.031	2026-09-24 11:52:02.031
cust-0041	org-walmart-demo	Ajay Sharma	+91 9810005480	ajay.sharma40@example.local	140, Sector 1, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.034	2026-09-24 11:52:02.034
cust-0042	org-walmart-demo	Geeta Patel	+91 9810005617	geeta.patel41@example.local	141, Sector 2, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.038	2026-09-24 11:52:02.038
cust-0043	org-walmart-demo	Ravi Singh	+91 9810005754	ravi.singh42@example.local	142, Sector 3, Bangalore	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.042	2026-09-24 11:52:02.042
cust-0044	org-walmart-demo	Sonali Kumar	+91 9810005891	sonali.kumar43@example.local	143, Sector 4, Chennai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.046	2026-09-24 11:52:02.046
cust-0045	org-walmart-demo	Kunal Reddy	+91 9810006028	kunal.reddy44@example.local	144, Sector 5, Kolkata	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.05	2026-09-24 11:52:02.05
cust-0046	org-walmart-demo	Bhavna Joshi	+91 9810006165	bhavna.joshi45@example.local	145, Sector 6, Pune	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.054	2026-09-24 11:52:02.054
cust-0047	org-walmart-demo	Harsh Mehta	+91 9810006302	harsh.mehta46@example.local	146, Sector 7, Jaipur	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.058	2026-09-24 11:52:02.058
cust-0048	org-walmart-demo	Jaya Gupta	+91 9810006439	jaya.gupta47@example.local	147, Sector 8, Hyderabad	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.062	2026-09-24 11:52:02.062
cust-0049	org-walmart-demo	Manish Nair	+91 9810006576	manish.nair48@example.local	148, Sector 9, Delhi	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.065	2026-09-24 11:52:02.065
cust-0050	org-walmart-demo	Rekha Verma	+91 9810006713	rekha.verma49@example.local	149, Sector 10, Mumbai	RETAIL	0.00	ACTIVE	2026-09-24 11:52:02.069	2026-09-24 11:52:02.069
cust-0051	org-walmart-demo	Aarav Das Enterprises	+91 9810006850	aarav.das50@example.local	150, Sector 11, Bangalore	BUSINESS	350000.00	ACTIVE	2026-09-24 11:52:02.073	2026-09-24 11:52:02.073
cust-0052	org-walmart-demo	Priya Iyer Enterprises	+91 9810006987	priya.iyer51@example.local	151, Sector 12, Chennai	BUSINESS	355000.00	ACTIVE	2026-09-24 11:52:02.077	2026-09-24 11:52:02.077
cust-0053	org-walmart-demo	Rohan Shah Enterprises	+91 9810007124	rohan.shah52@example.local	152, Sector 13, Kolkata	BUSINESS	360000.00	ACTIVE	2026-09-24 11:52:02.081	2026-09-24 11:52:02.081
cust-0054	org-walmart-demo	Sneha Rao Enterprises	+91 9810007261	sneha.rao53@example.local	153, Sector 14, Pune	BUSINESS	365000.00	ACTIVE	2026-09-24 11:52:02.085	2026-09-24 11:52:02.085
cust-0055	org-walmart-demo	Vikram Mishra Enterprises	+91 9810007398	vikram.mishra54@example.local	154, Sector 15, Jaipur	BUSINESS	370000.00	ACTIVE	2026-09-24 11:52:02.089	2026-09-24 11:52:02.089
cust-0056	org-walmart-demo	Ananya Banerjee Enterprises	+91 9810007535	ananya.banerjee55@example.local	155, Sector 16, Hyderabad	BUSINESS	375000.00	ACTIVE	2026-09-24 11:52:02.093	2026-09-24 11:52:02.093
cust-0057	org-walmart-demo	Karthik Chauhan Enterprises	+91 9810007672	karthik.chauhan56@example.local	156, Sector 17, Delhi	BUSINESS	380000.00	ACTIVE	2026-09-24 11:52:02.097	2026-09-24 11:52:02.097
cust-0058	org-walmart-demo	Meera Pillai Enterprises	+91 9810007809	meera.pillai57@example.local	157, Sector 18, Mumbai	BUSINESS	385000.00	ACTIVE	2026-09-24 11:52:02.101	2026-09-24 11:52:02.101
cust-0059	org-walmart-demo	Arjun Agarwal Enterprises	+91 9810007946	arjun.agarwal58@example.local	158, Sector 19, Bangalore	BUSINESS	390000.00	ACTIVE	2026-09-24 11:52:02.106	2026-09-24 11:52:02.106
cust-0060	org-walmart-demo	Divya Bhat Enterprises	+91 9810008083	divya.bhat59@example.local	159, Sector 20, Chennai	BUSINESS	395000.00	ACTIVE	2026-09-24 11:52:02.11	2026-09-24 11:52:02.11
\.


--
-- Data for Name: Inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Inventory" (id, "organizationId", "storeId", "productId", "onHand", reserved, "createdAt", "updatedAt") FROM stdin;
d333e287-32b9-4cd7-a4b4-4255f115af93	org-walmart-demo	store-mum-001	prod-0001	60	6	2026-09-24 11:52:02.127	2026-09-25 16:02:50.273
d7480918-aacf-4dac-a868-e157fa0cdab1	org-walmart-demo	store-pun-001	prod-0001	60	6	2026-09-24 11:52:02.13	2026-09-25 16:02:50.277
1fd5b21b-7820-41ff-b08e-2d3d8407aff2	org-walmart-demo	store-blr-001	prod-0001	90	3	2026-09-24 11:52:02.133	2026-09-25 16:02:50.281
585da701-b75e-46cc-89ea-2494c22bf2eb	org-walmart-demo	store-chn-001	prod-0001	90	3	2026-09-24 11:52:02.135	2026-09-25 16:02:50.285
8b8ce7e2-c608-4309-b503-b3b098750b21	org-walmart-demo	store-kol-001	prod-0001	90	3	2026-09-24 11:52:02.139	2026-09-25 16:02:50.289
5f152ebf-6232-4254-939e-7e18dee0051d	org-walmart-demo	store-gwh-001	prod-0001	90	3	2026-09-24 11:52:02.142	2026-09-25 16:02:50.293
854b826d-c0bb-4bed-9a96-7515dc3a5652	org-walmart-demo	store-del-001	prod-0002	12	0	2026-09-24 11:52:02.145	2026-09-25 16:02:50.297
8f03e4b9-9fc2-47f4-8711-512c5f1a1bfb	org-walmart-demo	store-jpr-001	prod-0002	75	7	2026-09-24 11:52:02.148	2026-09-25 16:02:50.3
c411feb7-83b8-4a0a-b4e7-59b917686a11	org-walmart-demo	store-mum-001	prod-0002	75	7	2026-09-24 11:52:02.151	2026-09-25 16:02:50.304
375d5c9f-4d0f-4f09-aaf9-e5af06a6d599	org-walmart-demo	store-pun-001	prod-0002	112	3	2026-09-24 11:52:02.154	2026-09-25 16:02:50.308
d97eeee7-ddc7-4b59-99c3-834954126234	org-walmart-demo	store-blr-001	prod-0002	112	3	2026-09-24 11:52:02.157	2026-09-25 16:02:50.311
1b77296c-2e68-40b4-b02a-b07190643e5c	org-walmart-demo	store-chn-001	prod-0002	112	3	2026-09-24 11:52:02.16	2026-09-25 16:02:50.315
1ddfd9d3-5916-4984-a33e-4c6a3ead199b	org-walmart-demo	store-kol-001	prod-0002	112	3	2026-09-24 11:52:02.163	2026-09-25 16:02:50.318
24a40348-89e4-43ef-a9fa-566f5761020f	org-walmart-demo	store-gwh-001	prod-0002	112	3	2026-09-24 11:52:02.166	2026-09-25 16:02:50.322
6819bf8e-b52c-445a-ad0a-bb23e47e5bc8	org-walmart-demo	store-del-001	prod-0003	90	9	2026-09-24 11:52:02.169	2026-09-25 16:02:50.326
2e537b77-4b8a-410b-b360-7e06e5ef81b2	org-walmart-demo	store-jpr-001	prod-0003	90	9	2026-09-24 11:52:02.172	2026-09-25 16:02:50.33
c5293b25-e8dc-4b89-bf65-cda5791ec2b8	org-walmart-demo	store-mum-001	prod-0003	135	4	2026-09-24 11:52:02.176	2026-09-25 16:02:50.333
e836b74f-9643-4c97-aede-90bfb6184b40	org-walmart-demo	store-pun-001	prod-0003	135	4	2026-09-24 11:52:02.179	2026-09-25 16:02:50.337
7872cce9-21eb-4080-bb25-ac1d0888ef1f	org-walmart-demo	store-blr-001	prod-0003	135	4	2026-09-24 11:52:02.182	2026-09-25 16:02:50.341
181aa289-94bf-4ff1-b761-950ee97c8662	org-walmart-demo	store-chn-001	prod-0003	135	4	2026-09-24 11:52:02.185	2026-09-25 16:02:50.344
2bda9647-78de-40b7-89ca-4f324bb06b58	org-walmart-demo	store-kol-001	prod-0003	135	4	2026-09-24 11:52:02.189	2026-09-25 16:02:50.348
724a3e2b-e052-4ca8-a2a3-f9c2f1b5b6a6	org-walmart-demo	store-gwh-001	prod-0003	0	0	2026-09-24 11:52:02.192	2026-09-25 16:02:50.351
a93e6fee-85e4-4315-b995-afbac2ba1a9e	org-walmart-demo	store-del-001	prod-0004	60	6	2026-09-24 11:52:02.195	2026-09-25 16:02:50.355
6e37ae69-5baa-42c8-a88c-acda480a6b23	org-walmart-demo	store-jpr-001	prod-0004	90	3	2026-09-24 11:52:02.199	2026-09-25 16:02:50.359
68bfd6c1-2667-4915-99c4-2e5d8cecc37a	org-walmart-demo	store-mum-001	prod-0004	90	3	2026-09-24 11:52:02.202	2026-09-25 16:02:50.362
03e8327c-f72c-4f37-a0fd-d4c158317e4e	org-walmart-demo	store-pun-001	prod-0004	90	3	2026-09-24 11:52:02.205	2026-09-25 16:02:50.366
d863f57a-dfd5-47e6-be6f-0a71ba7348c2	org-walmart-demo	store-blr-001	prod-0004	90	3	2026-09-24 11:52:02.208	2026-09-25 16:02:50.37
b823a1d1-e3db-4719-b4af-052613b2803c	org-walmart-demo	store-chn-001	prod-0004	90	3	2026-09-24 11:52:02.21	2026-09-25 16:02:50.376
520a839d-f878-4d0a-877d-73c6b9a12a89	org-walmart-demo	store-gwh-001	prod-0004	10	0	2026-09-24 11:52:02.217	2026-09-25 16:02:50.383
b67cc138-3c0c-4bf5-923d-91b00358d673	org-walmart-demo	store-del-001	prod-0005	225	7	2026-09-24 11:52:02.22	2026-09-25 16:02:50.387
68c88b0a-6433-48ad-b30e-005879d73522	org-walmart-demo	store-jpr-001	prod-0005	225	7	2026-09-24 11:52:02.222	2026-09-25 16:02:50.393
25095d91-3079-4fb3-8cf8-231f566444e3	org-walmart-demo	store-mum-001	prod-0005	225	7	2026-09-24 11:52:02.226	2026-09-25 16:02:50.397
c04b9335-56c4-4f02-b630-319ea56a388f	org-walmart-demo	store-pun-001	prod-0005	225	7	2026-09-24 11:52:02.229	2026-09-25 16:02:50.4
894fa7aa-e61d-4d11-a965-4a3dce7ddf74	org-walmart-demo	store-blr-001	prod-0005	225	7	2026-09-24 11:52:02.232	2026-09-25 16:02:50.404
53a161b7-2995-435f-985e-98092cd47e44	org-walmart-demo	store-chn-001	prod-0005	0	0	2026-09-24 11:52:02.235	2026-09-25 16:02:50.408
38719aa7-3646-4a99-af9c-21a18f183edb	org-walmart-demo	store-kol-001	prod-0005	25	0	2026-09-24 11:52:02.238	2026-09-25 16:02:50.412
ad52cef4-26bf-4d5b-b5f2-5d1b2dc0351e	org-walmart-demo	store-gwh-001	prod-0005	25	0	2026-09-24 11:52:02.241	2026-09-25 16:02:50.416
7d0d1d6c-7144-4528-b584-6397870acc13	org-walmart-demo	store-del-001	prod-0006	67	2	2026-09-24 11:52:02.244	2026-09-25 16:02:50.42
46e32170-59d5-4bc1-a36d-1dd007127303	org-walmart-demo	store-jpr-001	prod-0006	67	2	2026-09-24 11:52:02.247	2026-09-25 16:02:50.424
76a30e66-5e63-4a39-8cae-ed58b1d3a34c	org-walmart-demo	store-mum-001	prod-0006	67	2	2026-09-24 11:52:02.25	2026-09-25 16:02:50.428
732d371e-2a01-43b2-aeed-99713c9a633f	org-walmart-demo	store-pun-001	prod-0006	67	2	2026-09-24 11:52:02.254	2026-09-25 16:02:50.431
301ab4c1-59ef-4a6c-a1f1-281d8fd8732a	org-walmart-demo	store-blr-001	prod-0006	0	0	2026-09-24 11:52:02.257	2026-09-25 16:02:50.435
3b496ece-7dec-4d26-9ac6-985ef92dfb86	org-walmart-demo	store-chn-001	prod-0006	7	0	2026-09-24 11:52:02.261	2026-09-25 16:02:50.439
e87f1165-aaa5-4bd7-9f42-53ada175b37e	org-walmart-demo	store-kol-001	prod-0006	7	0	2026-09-24 11:52:02.263	2026-09-25 16:02:50.442
6dcdc4a4-7cf6-44c2-b982-f4c92fe7d10c	org-walmart-demo	store-gwh-001	prod-0006	45	4	2026-09-24 11:52:02.267	2026-09-25 16:02:50.446
1f826f98-3065-42d7-9c1b-e215e1b7158d	org-walmart-demo	store-del-001	prod-0007	180	6	2026-09-24 11:52:02.27	2026-09-25 16:02:50.45
6f1613e5-0ed0-49b6-84cc-a87a6db4266c	org-walmart-demo	store-jpr-001	prod-0007	180	6	2026-09-24 11:52:02.272	2026-09-25 16:02:50.453
11c22735-b940-4390-b152-f9d476b231b1	org-walmart-demo	store-mum-001	prod-0007	180	6	2026-09-24 11:52:02.276	2026-09-25 16:02:50.457
7b7c03e6-e668-4756-8afd-14d21b0203af	org-walmart-demo	store-pun-001	prod-0007	0	0	2026-09-24 11:52:02.279	2026-09-25 16:02:50.461
6c12f298-5958-4c3d-86b5-6d21f1c40246	org-walmart-demo	store-blr-001	prod-0007	20	0	2026-09-24 11:52:02.282	2026-09-25 16:02:50.465
af6b949f-3dca-478d-a97a-57c1d8aa8481	org-walmart-demo	store-chn-001	prod-0007	20	0	2026-09-24 11:52:02.285	2026-09-25 16:02:50.469
3773ae11-501e-4576-9289-3ff352159fa1	org-walmart-demo	store-del-001	prod-0008	225	7	2026-09-24 11:52:02.288	2026-09-25 16:02:50.473
7b8994cf-94a3-4538-864f-742532041951	org-walmart-demo	store-jpr-001	prod-0008	225	7	2026-09-24 11:52:02.291	2026-09-25 16:02:50.477
c27614d9-6847-420b-8ff5-a545901026f2	org-walmart-demo	store-mum-001	prod-0008	0	0	2026-09-24 11:52:02.295	2026-09-25 16:02:50.48
4d5e12fd-bb3d-4f6f-98b5-51532486802c	org-walmart-demo	store-pun-001	prod-0008	25	0	2026-09-24 11:52:02.299	2026-09-25 16:02:50.485
7f35ae0c-52de-4024-9e33-1217c1396648	org-walmart-demo	store-blr-001	prod-0008	25	0	2026-09-24 11:52:02.302	2026-09-25 16:02:50.489
22aa4009-a4de-4a99-b913-64cce8c0bd0d	org-walmart-demo	store-chn-001	prod-0008	150	15	2026-09-24 11:52:02.306	2026-09-25 16:02:50.493
6cb4f91d-903e-4fc4-8df6-e62668427672	org-walmart-demo	store-kol-001	prod-0008	150	15	2026-09-24 11:52:02.311	2026-09-25 16:02:50.497
a03e8b81-5bd0-42ae-9cad-c0718a12dbf1	org-walmart-demo	store-jpr-001	prod-0001	10	0	2026-09-24 11:52:02.124	2026-09-25 16:02:50.263
7b476a16-c3a8-46e2-a117-79031f504db3	org-walmart-demo	store-jpr-001	prod-0009	0	0	2026-09-24 11:52:02.321	2026-09-25 16:02:50.509
45d92b9f-f30c-4bbd-a85c-c655875b9535	org-walmart-demo	store-mum-001	prod-0009	15	0	2026-09-24 11:52:02.324	2026-09-25 16:02:50.514
b1fda682-e1aa-406f-ac0a-37a3655fefb6	org-walmart-demo	store-pun-001	prod-0009	15	0	2026-09-24 11:52:02.327	2026-09-25 16:02:50.518
9e8a70e9-db08-4511-9c32-99e2291abe13	org-walmart-demo	store-blr-001	prod-0009	90	9	2026-09-24 11:52:02.33	2026-09-25 16:02:50.522
b7bd4be4-4950-47aa-bf8a-705a6eaf9023	org-walmart-demo	store-chn-001	prod-0009	90	9	2026-09-24 11:52:02.333	2026-09-25 16:02:50.527
7d484571-80a4-4511-8492-12fcc7e97dea	org-walmart-demo	store-kol-001	prod-0009	135	4	2026-09-24 11:52:02.336	2026-09-25 16:02:50.531
1edda6e7-ac2a-4e07-9415-9876fc298182	org-walmart-demo	store-gwh-001	prod-0009	135	4	2026-09-24 11:52:02.339	2026-09-25 16:02:50.535
b010ab9c-242d-41b6-82ae-813ee80740d9	org-walmart-demo	store-del-001	prod-0010	0	0	2026-09-24 11:52:02.342	2026-09-25 16:02:50.539
09a0e0a6-abe4-4a3f-87ef-5cc8b197ce16	org-walmart-demo	store-jpr-001	prod-0010	50	0	2026-09-24 11:52:02.345	2026-09-25 16:02:50.544
1ebb223f-e3d5-48bc-91c5-ff5fc0f1284c	org-walmart-demo	store-mum-001	prod-0010	50	0	2026-09-24 11:52:02.348	2026-09-25 16:02:50.548
46a19df9-3691-4ba3-b800-54c711c083cb	org-walmart-demo	store-pun-001	prod-0010	300	30	2026-09-24 11:52:02.351	2026-09-25 16:02:50.552
c6b5af6d-e154-44ca-846a-da050240202f	org-walmart-demo	store-blr-001	prod-0010	300	30	2026-09-24 11:52:02.354	2026-09-25 16:02:50.557
2e51fb78-7104-46d7-b318-a2c97a547286	org-walmart-demo	store-chn-001	prod-0010	450	15	2026-09-24 11:52:02.357	2026-09-25 16:02:50.561
b39f1f5a-1224-4fcf-8095-65c789ca1f1f	org-walmart-demo	store-kol-001	prod-0010	450	15	2026-09-24 11:52:02.36	2026-09-25 16:02:50.564
412fbe6b-926d-45dd-99b5-c559f91857f1	org-walmart-demo	store-gwh-001	prod-0010	450	15	2026-09-24 11:52:02.364	2026-09-25 16:02:50.568
a6c91a85-110b-4241-91b0-3b0c701509f0	org-walmart-demo	store-del-001	prod-0011	12	0	2026-09-24 11:52:02.367	2026-09-25 16:02:50.573
16068574-d2a6-4649-8f17-61baf3f3090a	org-walmart-demo	store-jpr-001	prod-0011	12	0	2026-09-24 11:52:02.37	2026-09-25 16:02:50.577
8c1cc01b-6826-4807-adef-7d9a51a9ef9c	org-walmart-demo	store-mum-001	prod-0011	75	7	2026-09-24 11:52:02.373	2026-09-25 16:02:50.581
5116c50d-c728-497a-acb0-c77ecd95ea9b	org-walmart-demo	store-pun-001	prod-0011	75	7	2026-09-24 11:52:02.377	2026-09-25 16:02:50.585
63f89496-3be3-41bf-875c-00af103360dc	org-walmart-demo	store-blr-001	prod-0011	112	3	2026-09-24 11:52:02.38	2026-09-25 16:02:50.589
1ab0d61a-76f3-4f37-9ec1-b3d25cd7a8c1	org-walmart-demo	store-chn-001	prod-0011	112	3	2026-09-24 11:52:02.383	2026-09-25 16:02:50.593
818dd066-7d8d-4d9d-a062-5a518bf4dffc	org-walmart-demo	store-del-001	prod-0012	10	0	2026-09-24 11:52:02.386	2026-09-25 16:02:50.597
3b2b5df6-e64a-4f54-b3ba-5f0ac87a4ad6	org-walmart-demo	store-jpr-001	prod-0012	60	6	2026-09-24 11:52:02.389	2026-09-25 16:02:50.6
efc2c044-c126-4366-b78d-210e889dad1a	org-walmart-demo	store-mum-001	prod-0012	60	6	2026-09-24 11:52:02.392	2026-09-25 16:02:50.604
3a202c35-f785-4255-b752-0ae8f4ebb96e	org-walmart-demo	store-pun-001	prod-0012	90	3	2026-09-24 11:52:02.395	2026-09-25 16:02:50.608
91567a44-9615-44bf-b008-11f1eaf5bf5d	org-walmart-demo	store-blr-001	prod-0012	90	3	2026-09-24 11:52:02.399	2026-09-25 16:02:50.612
c8faf566-7331-4571-b81b-7c307eec0cfb	org-walmart-demo	store-chn-001	prod-0012	90	3	2026-09-24 11:52:02.402	2026-09-25 16:02:50.616
04b71629-1df5-4569-836a-808f310b7787	org-walmart-demo	store-del-001	prod-0013	240	24	2026-09-24 11:52:02.405	2026-09-25 16:02:50.62
1872c98b-637d-4aee-815c-78459baa022c	org-walmart-demo	store-mum-001	prod-0013	360	12	2026-09-24 11:52:02.411	2026-09-25 16:02:50.629
85b06c21-c7b1-44a5-885e-909931d5a638	org-walmart-demo	store-pun-001	prod-0013	360	12	2026-09-24 11:52:02.415	2026-09-25 16:02:50.633
22efd432-1dc3-4905-b7e5-cc3d95d6ca45	org-walmart-demo	store-blr-001	prod-0013	360	12	2026-09-24 11:52:02.418	2026-09-25 16:02:50.637
510cebca-269c-40ab-8c13-d82dc4d2c121	org-walmart-demo	store-chn-001	prod-0013	360	12	2026-09-24 11:52:02.421	2026-09-25 16:02:50.641
a353cc66-1926-49e6-9dd7-3fe3573030cc	org-walmart-demo	store-kol-001	prod-0013	360	12	2026-09-24 11:52:02.424	2026-09-25 16:02:50.645
a4c0e6e4-eb4f-4f77-a130-6e45294caeda	org-walmart-demo	store-gwh-001	prod-0013	0	0	2026-09-24 11:52:02.427	2026-09-25 16:02:50.649
16ab0867-6f8a-49fc-a6a1-febb034b5835	org-walmart-demo	store-del-001	prod-0014	180	18	2026-09-24 11:52:02.43	2026-09-25 16:02:50.652
838a4726-79ea-41db-98e9-4406b0a8345e	org-walmart-demo	store-jpr-001	prod-0014	270	9	2026-09-24 11:52:02.433	2026-09-25 16:02:50.656
111ade2b-c5c1-4a97-ba54-d9919d1c32c4	org-walmart-demo	store-mum-001	prod-0014	270	9	2026-09-24 11:52:02.436	2026-09-25 16:02:50.661
15617bea-8227-4153-b589-300bff34c390	org-walmart-demo	store-pun-001	prod-0014	270	9	2026-09-24 11:52:02.439	2026-09-25 16:02:50.664
08d47d5a-9ecc-4d54-a932-155a077e2fb5	org-walmart-demo	store-blr-001	prod-0014	270	9	2026-09-24 11:52:02.442	2026-09-25 16:02:50.668
55f0ba6a-c59a-4bcb-b50f-b7348e3a117b	org-walmart-demo	store-chn-001	prod-0014	270	9	2026-09-24 11:52:02.445	2026-09-25 16:02:50.672
794af2f4-f716-4ce8-a63c-209d183f7d00	org-walmart-demo	store-kol-001	prod-0014	0	0	2026-09-24 11:52:02.448	2026-09-25 16:02:50.677
033b6930-5719-45ec-929e-0e7e02d81730	org-walmart-demo	store-gwh-001	prod-0014	30	0	2026-09-24 11:52:02.451	2026-09-25 16:02:50.68
f11104b1-4fe5-448a-b15c-baed0377bfd2	org-walmart-demo	store-del-001	prod-0015	180	6	2026-09-24 11:52:02.454	2026-09-25 16:02:50.684
cc231290-2b23-481d-b1d9-04fed399a31f	org-walmart-demo	store-jpr-001	prod-0015	180	6	2026-09-24 11:52:02.456	2026-09-25 16:02:50.688
9f0ea9d2-e14c-4430-bd36-84f9d749fc1b	org-walmart-demo	store-mum-001	prod-0015	180	6	2026-09-24 11:52:02.459	2026-09-25 16:02:50.693
3f3a691a-a120-426b-9835-921a18f32e78	org-walmart-demo	store-pun-001	prod-0015	180	6	2026-09-24 11:52:02.463	2026-09-25 16:02:50.696
41edfecf-fbda-458b-bcf6-3567f3eddcb5	org-walmart-demo	store-blr-001	prod-0015	180	6	2026-09-24 11:52:02.465	2026-09-25 16:02:50.7
7a3e966b-4f02-45e8-8746-c070ec090ebd	org-walmart-demo	store-chn-001	prod-0015	0	0	2026-09-24 11:52:02.468	2026-09-25 16:02:50.704
ed672fd7-6292-47d5-90cf-7daf9aebcf0a	org-walmart-demo	store-del-001	prod-0016	67	2	2026-09-24 11:52:02.471	2026-09-25 16:02:50.708
3176b97d-ad2b-4424-bf74-a7741ed69066	org-walmart-demo	store-jpr-001	prod-0016	67	2	2026-09-24 11:52:02.474	2026-09-25 16:02:50.713
5b437360-c9f5-4ccc-a1c6-fcd08c3c6df0	org-walmart-demo	store-mum-001	prod-0016	67	2	2026-09-24 11:52:02.478	2026-09-25 16:02:50.717
258b8dc5-83fb-41ba-861d-4549623ac75a	org-walmart-demo	store-pun-001	prod-0016	67	2	2026-09-24 11:52:02.481	2026-09-25 16:02:50.72
0891360d-f328-45a5-9edb-f9c61effad60	org-walmart-demo	store-blr-001	prod-0016	0	0	2026-09-24 11:52:02.485	2026-09-25 16:02:50.724
75fc67e9-eef0-4216-a3f2-fdf7e1cf2650	org-walmart-demo	store-chn-001	prod-0016	7	0	2026-09-24 11:52:02.488	2026-09-25 16:02:50.728
dfe4da3b-3052-4529-b1b2-0ec50e2a1d58	org-walmart-demo	store-del-001	prod-0017	112	3	2026-09-24 11:52:02.491	2026-09-25 16:02:50.732
5050f7cb-7b4a-497b-8fe6-7675d5338256	org-walmart-demo	store-jpr-001	prod-0017	112	3	2026-09-24 11:52:02.494	2026-09-25 16:02:50.736
da3e4898-0bcd-4669-bf2f-a60c2f192ad7	org-walmart-demo	store-mum-001	prod-0017	112	3	2026-09-24 11:52:02.497	2026-09-25 16:02:50.74
39b03806-e490-4131-8317-bcd6012cf35a	org-walmart-demo	store-pun-001	prod-0017	0	0	2026-09-24 11:52:02.499	2026-09-25 16:02:50.744
d67b6cfa-aa4c-42f3-aaa1-e6cb5b51256b	org-walmart-demo	store-del-001	prod-0009	135	4	2026-09-24 11:52:02.318	2026-09-25 16:02:50.505
d1476b76-f2f5-4680-beb5-5086715f1039	org-walmart-demo	store-del-001	prod-0018	225	7	2026-09-24 11:52:02.508	2026-09-25 16:02:50.755
ed5e512b-6495-4cf8-8196-32cd0a99c0d4	org-walmart-demo	store-jpr-001	prod-0018	225	7	2026-09-24 11:52:02.511	2026-09-25 16:02:50.759
9329fdfc-b6ec-4a83-996b-39025733014a	org-walmart-demo	store-mum-001	prod-0018	0	0	2026-09-24 11:52:02.514	2026-09-25 16:02:50.762
11891d80-28cc-4007-a1ff-90b5a2eccfcc	org-walmart-demo	store-pun-001	prod-0018	25	0	2026-09-24 11:52:02.517	2026-09-25 16:02:50.766
9457f80c-dfd8-448b-bd95-cb8751b492cb	org-walmart-demo	store-blr-001	prod-0018	25	0	2026-09-24 11:52:02.519	2026-09-25 16:02:50.77
235670af-e631-42d0-9949-77d0eed4d640	org-walmart-demo	store-chn-001	prod-0018	150	15	2026-09-24 11:52:02.522	2026-09-25 16:02:50.774
29ddee6a-4bed-415f-a6b6-1d25428adddf	org-walmart-demo	store-kol-001	prod-0018	150	15	2026-09-24 11:52:02.525	2026-09-25 16:02:50.778
4bf73094-7656-4e19-ac13-e10c5db9d0cb	org-walmart-demo	store-gwh-001	prod-0018	225	7	2026-09-24 11:52:02.528	2026-09-25 16:02:50.782
df849503-0d90-4d83-8fdc-9c96e16a68f4	org-walmart-demo	store-del-001	prod-0019	270	9	2026-09-24 11:52:02.531	2026-09-25 16:02:50.786
276991d5-b708-4016-8280-2b02a5482d86	org-walmart-demo	store-jpr-001	prod-0019	0	0	2026-09-24 11:52:02.534	2026-09-25 16:02:50.79
a77143fd-6794-4d54-b387-655116d95ac2	org-walmart-demo	store-mum-001	prod-0019	30	0	2026-09-24 11:52:02.537	2026-09-25 16:02:50.794
6e51de91-04c4-4510-a0cd-6686d84b81bf	org-walmart-demo	store-pun-001	prod-0019	30	0	2026-09-24 11:52:02.54	2026-09-25 16:02:50.798
16a682d8-eab1-41b5-9f27-778998d71c85	org-walmart-demo	store-blr-001	prod-0019	180	18	2026-09-24 11:52:02.544	2026-09-25 16:02:50.801
2ebfd1cb-6f15-47fb-93e5-9e10d0ce22a0	org-walmart-demo	store-chn-001	prod-0019	180	18	2026-09-24 11:52:02.547	2026-09-25 16:02:50.805
0212c084-e012-4f11-96c0-0b372e6c4a83	org-walmart-demo	store-kol-001	prod-0019	270	9	2026-09-24 11:52:02.55	2026-09-25 16:02:50.81
b9f0b2f4-dd01-4a54-8eea-08f1eb745929	org-walmart-demo	store-gwh-001	prod-0019	270	9	2026-09-24 11:52:02.554	2026-09-25 16:02:50.813
96c140c4-10bb-4774-ba63-d279f1d49454	org-walmart-demo	store-del-001	prod-0020	0	0	2026-09-24 11:52:02.557	2026-09-25 16:02:50.816
9dfd6ae1-ab03-4040-9861-98c5639085c7	org-walmart-demo	store-jpr-001	prod-0020	5	0	2026-09-24 11:52:02.559	2026-09-25 16:02:50.82
b07f0d02-c0d9-49a9-99c0-0189aa10c8fa	org-walmart-demo	store-mum-001	prod-0020	5	0	2026-09-24 11:52:02.563	2026-09-25 16:02:50.825
193bc8c1-a799-4300-b4f9-801b88343481	org-walmart-demo	store-pun-001	prod-0020	30	3	2026-09-24 11:52:02.566	2026-09-25 16:02:50.828
932c9be9-fc5c-49ce-b2c9-9c2dd72d0002	org-walmart-demo	store-del-001	prod-0021	20	0	2026-09-24 11:52:02.569	2026-09-25 16:02:50.832
4528d6db-e626-42f8-a6dc-73a68add9a65	org-walmart-demo	store-jpr-001	prod-0021	20	0	2026-09-24 11:52:02.572	2026-09-25 16:02:50.835
a827989b-86b1-440f-93c1-3ad639ba1a74	org-walmart-demo	store-mum-001	prod-0021	120	12	2026-09-24 11:52:02.574	2026-09-25 16:02:50.839
4e086855-ef15-4e9b-aec9-179f0efa7a74	org-walmart-demo	store-pun-001	prod-0021	120	12	2026-09-24 11:52:02.577	2026-09-25 16:02:50.843
88c37e38-cdf4-424c-b9c9-a629d0c04bf9	org-walmart-demo	store-blr-001	prod-0021	180	6	2026-09-24 11:52:02.58	2026-09-25 16:02:50.847
75dcfe04-dfab-4a8b-8b3a-e90a49068e9a	org-walmart-demo	store-chn-001	prod-0021	180	6	2026-09-24 11:52:02.583	2026-09-25 16:02:50.85
8da28cf5-b34b-4ae1-a4be-4b71b8a62979	org-walmart-demo	store-del-001	prod-0022	30	0	2026-09-24 11:52:02.586	2026-09-25 16:02:50.854
28de418e-653a-4e6c-b6af-57efea446bd9	org-walmart-demo	store-jpr-001	prod-0022	180	18	2026-09-24 11:52:02.588	2026-09-25 16:02:50.858
5655ff8a-7a27-4366-a65b-d7efa4c56dc0	org-walmart-demo	store-pun-001	prod-0022	270	9	2026-09-24 11:52:02.595	2026-09-25 16:02:50.866
d2f91acb-617f-41a0-811b-f63b4f4ec1cd	org-walmart-demo	store-blr-001	prod-0022	270	9	2026-09-24 11:52:02.598	2026-09-25 16:02:50.87
90e5712c-a5c1-4375-a0f2-fd6fbe4dd85d	org-walmart-demo	store-chn-001	prod-0022	270	9	2026-09-24 11:52:02.601	2026-09-25 16:02:50.874
6d73495d-3973-48df-b34b-a1032efa6a98	org-walmart-demo	store-kol-001	prod-0022	270	9	2026-09-24 11:52:02.604	2026-09-25 16:02:50.878
73999932-f8a0-48b4-b16a-4660f69d8e5c	org-walmart-demo	store-gwh-001	prod-0022	270	9	2026-09-24 11:52:02.607	2026-09-25 16:02:50.881
338d4fd0-728a-4b04-b4b1-d65ab4eca5b6	org-walmart-demo	store-del-001	prod-0023	90	9	2026-09-24 11:52:02.611	2026-09-25 16:02:50.884
22e8e39a-5544-4db1-854a-25c238863c6d	org-walmart-demo	store-jpr-001	prod-0023	90	9	2026-09-24 11:52:02.615	2026-09-25 16:02:50.888
ce4d0dea-c143-4936-a49d-5acd0a53f4b6	org-walmart-demo	store-mum-001	prod-0023	135	4	2026-09-24 11:52:02.618	2026-09-25 16:02:50.892
b891d41e-8d2e-4770-ac6c-b8be25c4abbd	org-walmart-demo	store-pun-001	prod-0023	135	4	2026-09-24 11:52:02.621	2026-09-25 16:02:50.895
15402984-00f4-4f24-815e-1f64a3a275cf	org-walmart-demo	store-blr-001	prod-0023	135	4	2026-09-24 11:52:02.624	2026-09-25 16:02:50.899
39aa36a7-5de5-41ae-8549-78b163f03fd7	org-walmart-demo	store-chn-001	prod-0023	135	4	2026-09-24 11:52:02.626	2026-09-25 16:02:50.902
9a0ba9e7-d9c0-4fb8-9dcf-c70017b29609	org-walmart-demo	store-kol-001	prod-0023	135	4	2026-09-24 11:52:02.63	2026-09-25 16:02:50.907
b6176d14-72d8-4006-876a-5c029c6c5f9a	org-walmart-demo	store-gwh-001	prod-0023	0	0	2026-09-24 11:52:02.633	2026-09-25 16:02:50.91
39ef39d7-f705-48f0-bf9d-370a5523a6c8	org-walmart-demo	store-del-001	prod-0024	120	12	2026-09-24 11:52:02.636	2026-09-25 16:02:50.913
6fbfee1c-bd1c-4b3b-bcbc-77b7e7810704	org-walmart-demo	store-jpr-001	prod-0024	180	6	2026-09-24 11:52:02.639	2026-09-25 16:02:50.917
9fe37d09-a872-4f60-99a5-81f0b215bed7	org-walmart-demo	store-mum-001	prod-0024	180	6	2026-09-24 11:52:02.642	2026-09-25 16:02:50.92
e82c379f-42e7-470c-896e-300797dbe867	org-walmart-demo	store-pun-001	prod-0024	180	6	2026-09-24 11:52:02.646	2026-09-25 16:02:50.924
08ad3e02-32d8-44f4-bac7-a8604d60a48a	org-walmart-demo	store-blr-001	prod-0024	180	6	2026-09-24 11:52:02.649	2026-09-25 16:02:50.928
aef94a06-9dbb-4652-9c17-fcbca20f6873	org-walmart-demo	store-chn-001	prod-0024	180	6	2026-09-24 11:52:02.652	2026-09-25 16:02:50.931
bbeddb0d-7322-4520-a4b2-22c0a91ca938	org-walmart-demo	store-kol-001	prod-0024	0	0	2026-09-24 11:52:02.655	2026-09-25 16:02:50.935
2df17da1-d16c-499d-9ec6-58e9d8626b34	org-walmart-demo	store-gwh-001	prod-0024	20	0	2026-09-24 11:52:02.658	2026-09-25 16:02:50.939
3aef597a-b9fe-4d7a-89a8-85835440f5dd	org-walmart-demo	store-del-001	prod-0025	90	3	2026-09-24 11:52:02.661	2026-09-25 16:02:50.942
e665098b-cfab-4bca-b6ef-29dec5598998	org-walmart-demo	store-jpr-001	prod-0025	90	3	2026-09-24 11:52:02.664	2026-09-25 16:02:50.946
154e4684-ea6b-467d-871b-5245380d3a9e	org-walmart-demo	store-mum-001	prod-0025	90	3	2026-09-24 11:52:02.668	2026-09-25 16:02:50.949
e08bd9d6-0a7d-4b5c-904e-ff4a11e59578	org-walmart-demo	store-pun-001	prod-0025	90	3	2026-09-24 11:52:02.671	2026-09-25 16:02:50.952
6a86c2a2-aa45-468a-bee9-c371e4772125	org-walmart-demo	store-blr-001	prod-0025	90	3	2026-09-24 11:52:02.674	2026-09-25 16:02:50.956
37296fb6-5605-40f8-8ad2-cb0be7779cc4	org-walmart-demo	store-chn-001	prod-0025	0	0	2026-09-24 11:52:02.677	2026-09-25 16:02:50.96
17088f34-62ca-4e9e-bd1a-517f82977ed8	org-walmart-demo	store-del-001	prod-0026	135	4	2026-09-24 11:52:02.68	2026-09-25 16:02:50.964
08b80714-e454-4e80-a55d-9638fe155104	org-walmart-demo	store-jpr-001	prod-0026	135	4	2026-09-24 11:52:02.684	2026-09-25 16:02:50.967
d6da9be2-37a8-4343-8c1d-388875d35eeb	org-walmart-demo	store-mum-001	prod-0026	135	4	2026-09-24 11:52:02.687	2026-09-25 16:02:50.971
53255d51-3ea8-418b-83d1-8b355d02e4d8	org-walmart-demo	store-chn-001	prod-0017	12	0	2026-09-24 11:52:02.505	2026-09-25 16:02:50.751
6d5557a5-557a-4ad8-84f6-ecb279906a0f	org-walmart-demo	store-chn-001	prod-0026	15	0	2026-09-24 11:52:02.696	2026-09-25 16:02:50.982
7f781a3a-85df-4cac-81f3-39d3bc1fbc30	org-walmart-demo	store-del-001	prod-0027	90	3	2026-09-24 11:52:02.7	2026-09-25 16:02:50.985
036e3a8b-b6f6-4c7d-bb7b-e871711cdc4e	org-walmart-demo	store-jpr-001	prod-0027	90	3	2026-09-24 11:52:02.703	2026-09-25 16:02:50.989
59c8ca2e-76f8-455f-958a-ee8a0c0dffe6	org-walmart-demo	store-mum-001	prod-0027	90	3	2026-09-24 11:52:02.706	2026-09-25 16:02:50.993
05861d2f-c07a-4c98-bf60-7bcea20e7614	org-walmart-demo	store-pun-001	prod-0027	0	0	2026-09-24 11:52:02.709	2026-09-25 16:02:50.997
055a1935-45ee-44ca-8586-585238da4430	org-walmart-demo	store-blr-001	prod-0027	10	0	2026-09-24 11:52:02.713	2026-09-25 16:02:51.001
61e392b4-93f4-40de-8a27-b512a384dd42	org-walmart-demo	store-chn-001	prod-0027	10	0	2026-09-24 11:52:02.715	2026-09-25 16:02:51.004
235f202f-5930-4522-9cf1-a5bc422a0be9	org-walmart-demo	store-kol-001	prod-0027	60	6	2026-09-24 11:52:02.719	2026-09-25 16:02:51.008
609bfe41-67a1-4c38-8ded-fe8cfdf58bd3	org-walmart-demo	store-gwh-001	prod-0027	60	6	2026-09-24 11:52:02.722	2026-09-25 16:02:51.012
49a3f91c-2a10-473e-a41f-59226930b498	org-walmart-demo	store-del-001	prod-0028	112	3	2026-09-24 11:52:02.725	2026-09-25 16:02:51.015
30bb283b-be18-4825-9ff1-5521f317f791	org-walmart-demo	store-jpr-001	prod-0028	112	3	2026-09-24 11:52:02.727	2026-09-25 16:02:51.019
de6fcb46-05f4-4475-af48-940973c49c28	org-walmart-demo	store-mum-001	prod-0028	0	0	2026-09-24 11:52:02.731	2026-09-25 16:02:51.023
e94311eb-13cc-43df-9bb5-8ec26e6e892a	org-walmart-demo	store-pun-001	prod-0028	12	0	2026-09-24 11:52:02.734	2026-09-25 16:02:51.026
c52229bf-6e41-4f18-86ee-9d3d8ffe7ecd	org-walmart-demo	store-blr-001	prod-0028	12	0	2026-09-24 11:52:02.737	2026-09-25 16:02:51.03
7b9ec45a-9829-4d45-8be5-c07a5bb06de2	org-walmart-demo	store-chn-001	prod-0028	75	7	2026-09-24 11:52:02.74	2026-09-25 16:02:51.033
929819ec-0f56-4645-8674-f0a27d244654	org-walmart-demo	store-kol-001	prod-0028	75	7	2026-09-24 11:52:02.743	2026-09-25 16:02:51.037
669f5ae4-0163-4350-b164-399c258635a4	org-walmart-demo	store-gwh-001	prod-0028	112	3	2026-09-24 11:52:02.746	2026-09-25 16:02:51.041
1582ba5e-f70e-40b1-8bac-9cce77d18517	org-walmart-demo	store-del-001	prod-0029	135	4	2026-09-24 11:52:02.75	2026-09-25 16:02:51.044
2970e7be-42aa-4bff-9420-2d13f2c06bf2	org-walmart-demo	store-jpr-001	prod-0029	0	0	2026-09-24 11:52:02.753	2026-09-25 16:02:51.048
4c49e12d-f9b6-4cc7-bc2c-38586b82167b	org-walmart-demo	store-mum-001	prod-0029	15	0	2026-09-24 11:52:02.756	2026-09-25 16:02:51.052
ba6830dd-9eeb-4aeb-bb19-be4287ba4fca	org-walmart-demo	store-pun-001	prod-0029	15	0	2026-09-24 11:52:02.759	2026-09-25 16:02:51.055
246694ef-e024-4471-89f2-6b64d5ca44b8	org-walmart-demo	store-blr-001	prod-0029	90	9	2026-09-24 11:52:02.762	2026-09-25 16:02:51.059
2ca44765-e3a4-4e06-929c-84046dc1fd4a	org-walmart-demo	store-chn-001	prod-0029	90	9	2026-09-24 11:52:02.765	2026-09-25 16:02:51.062
47868502-caa2-4ad1-bbf7-29761e1010c2	org-walmart-demo	store-kol-001	prod-0029	135	4	2026-09-24 11:52:02.769	2026-09-25 16:02:51.066
c5d1a18c-5878-4044-995e-167e8b94c8f7	org-walmart-demo	store-gwh-001	prod-0029	135	4	2026-09-24 11:52:02.772	2026-09-25 16:02:51.069
aa6ddfed-3831-48b8-a4b3-1f0b8ea73e54	org-walmart-demo	store-del-001	prod-0030	0	0	2026-09-24 11:52:02.775	2026-09-25 16:02:51.073
9d8d6d82-2feb-41a2-a32d-8cda7cc685d1	org-walmart-demo	store-jpr-001	prod-0030	12	0	2026-09-24 11:52:02.778	2026-09-25 16:02:51.077
9c5e8c53-f166-4dc6-b57f-b28c73946c7e	org-walmart-demo	store-mum-001	prod-0030	12	0	2026-09-24 11:52:02.782	2026-09-25 16:02:51.081
2457d114-20f0-4913-9f1c-053d08749e13	org-walmart-demo	store-blr-001	prod-0030	75	7	2026-09-24 11:52:02.788	2026-09-25 16:02:51.089
c07b6434-bf94-4689-aced-7e5598a9e567	org-walmart-demo	store-chn-001	prod-0030	112	3	2026-09-24 11:52:02.791	2026-09-25 16:02:51.093
419a9df2-27d1-47b8-b4fc-3b2813f6c932	org-walmart-demo	store-del-001	prod-0031	10	0	2026-09-24 11:52:02.794	2026-09-25 16:02:51.097
9237d5ca-2ec2-4e23-840c-713f57742b30	org-walmart-demo	store-jpr-001	prod-0031	10	0	2026-09-24 11:52:02.797	2026-09-25 16:02:51.1
4ccc5e47-6553-4e4e-9d3c-83ff79468e73	org-walmart-demo	store-mum-001	prod-0031	60	6	2026-09-24 11:52:02.8	2026-09-25 16:02:51.103
0ac1edef-8312-4a24-b685-fd7153883483	org-walmart-demo	store-pun-001	prod-0031	60	6	2026-09-24 11:52:02.803	2026-09-25 16:02:51.108
ce6db807-97b4-4314-9bd6-46958aa030d1	org-walmart-demo	store-blr-001	prod-0031	90	3	2026-09-24 11:52:02.806	2026-09-25 16:02:51.111
59cef4ff-11da-438d-b571-0cbd4b47d892	org-walmart-demo	store-chn-001	prod-0031	90	3	2026-09-24 11:52:02.81	2026-09-25 16:02:51.115
d744bdff-d220-4f85-a14e-c3f01681ea11	org-walmart-demo	store-del-001	prod-0032	7	0	2026-09-24 11:52:02.813	2026-09-25 16:02:51.119
2813b0c5-8666-4480-8a24-6080dfbb043c	org-walmart-demo	store-jpr-001	prod-0032	45	4	2026-09-24 11:52:02.816	2026-09-25 16:02:51.122
ca19628c-fc76-4db0-b66e-15675c401064	org-walmart-demo	store-mum-001	prod-0032	45	4	2026-09-24 11:52:02.82	2026-09-25 16:02:51.126
d57a67e1-cd22-4eff-96a8-3da4d74b6479	org-walmart-demo	store-pun-001	prod-0032	67	2	2026-09-24 11:52:02.823	2026-09-25 16:02:51.13
b08d78ad-931d-47e5-84aa-6841e689d7f9	org-walmart-demo	store-blr-001	prod-0032	67	2	2026-09-24 11:52:02.826	2026-09-25 16:02:51.134
97fc24b5-9cc0-4746-8a89-970f83684862	org-walmart-demo	store-chn-001	prod-0032	67	2	2026-09-24 11:52:02.829	2026-09-25 16:02:51.138
4e1d8dc4-115a-46ea-9a58-29a6b184f1e6	org-walmart-demo	store-del-001	prod-0033	30	3	2026-09-24 11:52:02.832	2026-09-25 16:02:51.142
ab76388b-c5fd-4541-8f4b-63d5f4d0dff4	org-walmart-demo	store-jpr-001	prod-0033	30	3	2026-09-24 11:52:02.835	2026-09-25 16:02:51.145
83caddc4-92df-420c-a326-e925a44c3a86	org-walmart-demo	store-mum-001	prod-0033	45	1	2026-09-24 11:52:02.838	2026-09-25 16:02:51.149
2586b73e-a8dc-4604-889c-2469223cc0fe	org-walmart-demo	store-pun-001	prod-0033	45	1	2026-09-24 11:52:02.841	2026-09-25 16:02:51.153
7da9b4c5-c9b4-4862-8d21-c02ee24a31a5	org-walmart-demo	store-blr-001	prod-0033	45	1	2026-09-24 11:52:02.844	2026-09-25 16:02:51.157
e8e27fe2-3c0f-4804-80f2-d26eb468b035	org-walmart-demo	store-chn-001	prod-0033	45	1	2026-09-24 11:52:02.847	2026-09-25 16:02:51.162
6780fb27-64ca-405f-bdfb-f71fbbca4807	org-walmart-demo	store-del-001	prod-0034	90	9	2026-09-24 11:52:02.85	2026-09-25 16:02:51.165
45c38b6b-03c6-40ef-9711-ad68ae0e3d9d	org-walmart-demo	store-jpr-001	prod-0034	135	4	2026-09-24 11:52:02.853	2026-09-25 16:02:51.169
1301b3ea-fd99-4b2d-88ec-6530df2d4b79	org-walmart-demo	store-mum-001	prod-0034	135	4	2026-09-24 11:52:02.856	2026-09-25 16:02:51.174
55abfcbe-eed9-4fe1-9b45-67123ef62073	org-walmart-demo	store-pun-001	prod-0034	135	4	2026-09-24 11:52:02.859	2026-09-25 16:02:51.178
dc9f1437-99e1-4a8e-97e7-089a803256f5	org-walmart-demo	store-blr-001	prod-0034	135	4	2026-09-24 11:52:02.862	2026-09-25 16:02:51.181
c63e8003-b50c-48fe-b828-4cc24f6297e5	org-walmart-demo	store-chn-001	prod-0034	135	4	2026-09-24 11:52:02.865	2026-09-25 16:02:51.186
8f1ae720-feba-40e1-a495-59cc47c61e84	org-walmart-demo	store-del-001	prod-0035	36	1	2026-09-24 11:52:02.868	2026-09-25 16:02:51.191
729f7051-678d-4ad3-9f10-95d9c5440fbd	org-walmart-demo	store-jpr-001	prod-0035	36	1	2026-09-24 11:52:02.871	2026-09-25 16:02:51.195
a1d7a742-b97e-4b27-9708-caaa79e14f89	org-walmart-demo	store-mum-001	prod-0035	36	1	2026-09-24 11:52:02.874	2026-09-25 16:02:51.2
0890acb5-9bd9-47f1-bcdd-acd70d36d2a3	org-walmart-demo	store-pun-001	prod-0035	36	1	2026-09-24 11:52:02.877	2026-09-25 16:02:51.203
249a53e3-21ba-409b-8503-54b4b130f9e3	org-walmart-demo	store-blr-001	prod-0026	0	0	2026-09-24 11:52:02.693	2026-09-25 16:02:50.978
9d713485-37df-461e-b3e7-f77226140c08	org-walmart-demo	store-mum-001	prod-0036	45	1	2026-09-24 11:52:02.887	2026-09-25 16:02:51.215
5a705529-b479-47cc-b834-8965f1dedfaa	org-walmart-demo	store-pun-001	prod-0036	45	1	2026-09-24 11:52:02.89	2026-09-25 16:02:51.219
4f320b24-8445-4b3d-8ac8-870bd460ccad	org-walmart-demo	store-del-001	prod-0037	22	0	2026-09-24 11:52:02.893	2026-09-25 16:02:51.223
59ae0274-3e89-48f0-9814-465aa2fd42dc	org-walmart-demo	store-jpr-001	prod-0037	22	0	2026-09-24 11:52:02.896	2026-09-25 16:02:51.226
1c66ba80-42e5-43fe-8935-b0b11810e409	org-walmart-demo	store-mum-001	prod-0037	22	0	2026-09-24 11:52:02.899	2026-09-25 16:02:51.23
fc31ef6b-6d09-4759-ae95-5a145bb29caa	org-walmart-demo	store-pun-001	prod-0037	0	0	2026-09-24 11:52:02.903	2026-09-25 16:02:51.233
f2d4757a-979c-48bc-9782-040e1ab53809	org-walmart-demo	store-del-001	prod-0038	22	0	2026-09-24 11:52:02.906	2026-09-25 16:02:51.237
0283b7f2-d70c-4aa5-9959-02d1c7033e80	org-walmart-demo	store-jpr-001	prod-0038	22	0	2026-09-24 11:52:02.909	2026-09-25 16:02:51.241
fb91b750-5eaf-4b48-8361-851c7b4ee531	org-walmart-demo	store-del-001	prod-0039	45	1	2026-09-24 11:52:02.912	2026-09-25 16:02:51.245
47438082-a440-449b-a65f-ae9fe4aa31c8	org-walmart-demo	store-jpr-001	prod-0039	0	0	2026-09-24 11:52:02.915	2026-09-25 16:02:51.248
48920e28-3c21-4e3f-b9ab-052d1abab111	org-walmart-demo	store-mum-001	prod-0039	5	0	2026-09-24 11:52:02.918	2026-09-25 16:02:51.252
1af7003c-a7e6-4b3f-b90f-afd2118ec06d	org-walmart-demo	store-pun-001	prod-0039	5	0	2026-09-24 11:52:02.921	2026-09-25 16:02:51.256
5b19c254-49ef-43fa-a867-29c312378cf2	org-walmart-demo	store-del-001	prod-0040	0	0	2026-09-24 11:52:02.925	2026-09-25 16:02:51.26
da5640b3-082e-4538-8f1c-eef3637ba636	org-walmart-demo	store-jpr-001	prod-0040	4	0	2026-09-24 11:52:02.928	2026-09-25 16:02:51.264
27640f5e-f95c-4e2c-9f3c-b947f310cc95	org-walmart-demo	store-mum-001	prod-0040	4	0	2026-09-24 11:52:02.931	2026-09-25 16:02:51.268
63d36940-5126-43b5-9e27-fff5f980ce2b	org-walmart-demo	store-pun-001	prod-0040	24	2	2026-09-24 11:52:02.934	2026-09-25 16:02:51.273
a7b9975b-5159-44e6-8e3d-a3c624ff2476	org-walmart-demo	store-del-001	prod-0041	5	0	2026-09-24 11:52:02.938	2026-09-25 16:02:51.277
43bae8ad-5709-4c8c-bb0a-6554d6c34f5d	org-walmart-demo	store-jpr-001	prod-0041	5	0	2026-09-24 11:52:02.941	2026-09-25 16:02:51.281
42f4d2c2-94bb-4478-b728-4a2d461f2773	org-walmart-demo	store-del-001	prod-0042	2	0	2026-09-24 11:52:02.944	2026-09-25 16:02:51.285
5be3d920-640a-4089-8986-9fe14bf48a10	org-walmart-demo	store-jpr-001	prod-0042	15	1	2026-09-24 11:52:02.947	2026-09-25 16:02:51.289
9987d871-129c-4c26-becb-21b1832f240d	org-walmart-demo	store-del-001	prod-0043	15	1	2026-09-24 11:52:02.951	2026-09-25 16:02:51.292
22ac0140-9a5f-427c-b6eb-a2804137b0fe	org-walmart-demo	store-jpr-001	prod-0043	15	1	2026-09-24 11:52:02.954	2026-09-25 16:02:51.296
a5f6e526-79a6-494c-940b-0ca6179202ca	org-walmart-demo	store-mum-001	prod-0043	22	0	2026-09-24 11:52:02.957	2026-09-25 16:02:51.299
f7d2ad29-2323-4102-916f-d8c6e86d206d	org-walmart-demo	store-pun-001	prod-0043	22	0	2026-09-24 11:52:02.96	2026-09-25 16:02:51.303
b67aecc8-8cb5-4344-a1d4-0a3f07183ba0	org-walmart-demo	store-del-001	prod-0044	9	0	2026-09-24 11:52:02.963	2026-09-25 16:02:51.307
1cc10a93-82b8-46d1-9f6a-24eabc67f9c6	org-walmart-demo	store-jpr-001	prod-0044	13	0	2026-09-24 11:52:02.966	2026-09-25 16:02:51.311
90179d9f-46cb-4542-9c13-5624773e8476	org-walmart-demo	store-mum-001	prod-0044	13	0	2026-09-24 11:52:02.969	2026-09-25 16:02:51.315
74f4aa61-7726-4831-9a89-2a86d624d519	org-walmart-demo	store-pun-001	prod-0044	13	0	2026-09-24 11:52:02.972	2026-09-25 16:02:51.319
bcc0ec01-dbed-49fc-a58c-27ebf76db034	org-walmart-demo	store-jpr-001	prod-0045	13	0	2026-09-24 11:52:02.978	2026-09-25 16:02:51.326
913c7c70-6e07-4455-9f2d-0c38a67098c3	org-walmart-demo	store-del-001	prod-0046	9	0	2026-09-24 11:52:02.981	2026-09-25 16:02:51.329
e34a666a-d406-475c-ba19-4ac7dba2a319	org-walmart-demo	store-jpr-001	prod-0046	9	0	2026-09-24 11:52:02.985	2026-09-25 16:02:51.333
67d6e6e3-7ee3-463f-9873-79df4d20e3ee	org-walmart-demo	store-del-001	prod-0047	22	0	2026-09-24 11:52:02.987	2026-09-25 16:02:51.336
fdb370e5-602e-42dd-8562-06dbb7111d6c	org-walmart-demo	store-jpr-001	prod-0047	22	0	2026-09-24 11:52:02.99	2026-09-25 16:02:51.34
883b9209-d594-42b5-a072-9b091d26f8d6	org-walmart-demo	store-mum-001	prod-0047	22	0	2026-09-24 11:52:02.993	2026-09-25 16:02:51.344
f3859e7b-2597-4442-b780-ce01f61bbced	org-walmart-demo	store-pun-001	prod-0047	0	0	2026-09-24 11:52:02.996	2026-09-25 16:02:51.348
fed107f9-fdf7-4a5f-9acd-f461f828d635	org-walmart-demo	store-del-001	prod-0048	36	1	2026-09-24 11:52:02.999	2026-09-25 16:02:51.351
97f4d0ea-e655-457e-b4d9-46c936150ce4	org-walmart-demo	store-jpr-001	prod-0048	36	1	2026-09-24 11:52:03.002	2026-09-25 16:02:51.355
7d1d68f8-97c6-4695-b348-0343b950a4e0	org-walmart-demo	store-mum-001	prod-0048	0	0	2026-09-24 11:52:03.006	2026-09-25 16:02:51.359
93b3665b-9e9d-4264-aebb-844b7badc076	org-walmart-demo	store-pun-001	prod-0048	4	0	2026-09-24 11:52:03.009	2026-09-25 16:02:51.362
6b773ca7-90cb-492c-bc94-0c919b752e36	org-walmart-demo	store-blr-001	prod-0048	4	0	2026-09-24 11:52:03.012	2026-09-25 16:02:51.366
d32120b9-d609-424a-a276-200c8d7b0b9e	org-walmart-demo	store-chn-001	prod-0048	24	2	2026-09-24 11:52:03.015	2026-09-25 16:02:51.37
457f8ce5-d735-45c7-a012-92b509d66443	org-walmart-demo	store-del-001	prod-0049	22	0	2026-09-24 11:52:03.018	2026-09-25 16:02:51.374
a1f4c19e-6943-4580-9b4c-adc8cb77eb86	org-walmart-demo	store-jpr-001	prod-0049	0	0	2026-09-24 11:52:03.021	2026-09-25 16:02:51.377
363a5481-1b2f-450c-86c0-4e979de7b0d7	org-walmart-demo	store-mum-001	prod-0049	2	0	2026-09-24 11:52:03.024	2026-09-25 16:02:51.381
51d1a968-3e45-48db-b3f1-ddff28037331	org-walmart-demo	store-pun-001	prod-0049	2	0	2026-09-24 11:52:03.027	2026-09-25 16:02:51.384
ca21447a-d424-4523-8906-b6cebf1de598	org-walmart-demo	store-blr-001	prod-0049	15	1	2026-09-24 11:52:03.031	2026-09-25 16:02:51.388
f0d9ce3b-787d-45b6-90f5-74a6db7341b6	org-walmart-demo	store-chn-001	prod-0049	15	1	2026-09-24 11:52:03.034	2026-09-25 16:02:51.392
08b7615d-46c3-4efe-b79b-b14ceeec3c89	org-walmart-demo	store-del-001	prod-0050	0	0	2026-09-24 11:52:03.037	2026-09-25 16:02:51.396
1d38a2eb-8362-4e17-9a4d-1e49bcc74fa8	org-walmart-demo	store-jpr-001	prod-0050	5	0	2026-09-24 11:52:03.04	2026-09-25 16:02:51.399
5c62f18f-8c4a-4156-b86d-0cc4aea478d7	org-walmart-demo	store-mum-001	prod-0050	5	0	2026-09-24 11:52:03.043	2026-09-25 16:02:51.403
b483fb33-db0a-4b18-9d49-b9ea940d707a	org-walmart-demo	store-pun-001	prod-0050	30	3	2026-09-24 11:52:03.046	2026-09-25 16:02:51.407
a02f7ea0-e091-4c02-8112-05893f98614a	org-walmart-demo	store-del-001	prod-0051	7	0	2026-09-24 11:52:03.049	2026-09-25 16:02:51.41
8e25cb81-85d2-4eee-b7b7-9148fb3530f4	org-walmart-demo	store-jpr-001	prod-0051	7	0	2026-09-24 11:52:03.052	2026-09-25 16:02:51.414
9a85156a-0ab3-40a7-a4b6-33417d83b7df	org-walmart-demo	store-mum-001	prod-0051	45	4	2026-09-24 11:52:03.056	2026-09-25 16:02:51.417
435f6e12-507e-4d2b-b5bd-7c654bb76769	org-walmart-demo	store-pun-001	prod-0051	45	4	2026-09-24 11:52:03.059	2026-09-25 16:02:51.421
86d6a274-0615-4f3c-b3cc-cbfda70d797c	org-walmart-demo	store-blr-001	prod-0051	67	2	2026-09-24 11:52:03.062	2026-09-25 16:02:51.425
78d9abbc-c69c-4187-a06a-c51699208aec	org-walmart-demo	store-chn-001	prod-0051	67	2	2026-09-24 11:52:03.065	2026-09-25 16:02:51.428
4a352abd-ed86-4275-8e56-101560711396	org-walmart-demo	store-del-001	prod-0052	4	0	2026-09-24 11:52:03.069	2026-09-25 16:02:51.432
1e76d197-1d05-489c-bf5a-9f93e6c07d7e	org-walmart-demo	store-jpr-001	prod-0036	45	1	2026-09-24 11:52:02.884	2026-09-25 16:02:51.211
46fbb0ed-0065-4373-8291-27177899c2ed	org-walmart-demo	store-pun-001	prod-0052	36	1	2026-09-24 11:52:03.077	2026-09-25 16:02:51.442
56d64f91-e574-44fe-ae35-1788ebf58283	org-walmart-demo	store-del-001	prod-0053	15	1	2026-09-24 11:52:03.08	2026-09-25 16:02:51.446
5f66f862-55a8-428d-9c15-563ea7578be6	org-walmart-demo	store-jpr-001	prod-0053	15	1	2026-09-24 11:52:03.083	2026-09-25 16:02:51.449
75574ed6-4f94-4b28-b087-4fe3a09e5b99	org-walmart-demo	store-mum-001	prod-0053	22	0	2026-09-24 11:52:03.086	2026-09-25 16:02:51.453
9f770907-3033-4126-bceb-b52eb3b638ee	org-walmart-demo	store-pun-001	prod-0053	22	0	2026-09-24 11:52:03.09	2026-09-25 16:02:51.456
1ea11f9a-a1ed-4e45-8439-52761e11d166	org-walmart-demo	store-del-001	prod-0054	6	0	2026-09-24 11:52:03.093	2026-09-25 16:02:51.461
96bf97af-bc2d-4ee9-b705-720d85cc1ce1	org-walmart-demo	store-jpr-001	prod-0054	9	0	2026-09-24 11:52:03.096	2026-09-25 16:02:51.464
b0f92a62-c98e-4c6e-b233-3c331a4bed6b	org-walmart-demo	store-del-001	prod-0055	9	0	2026-09-24 11:52:03.099	2026-09-25 16:02:51.467
064e9617-a1e1-45ea-927d-77e69205c6eb	org-walmart-demo	store-jpr-001	prod-0055	9	0	2026-09-24 11:52:03.103	2026-09-25 16:02:51.471
c6e2e9dd-e01e-407d-8aa8-23bf5684e6d2	org-walmart-demo	store-del-001	prod-0056	22	0	2026-09-24 11:52:03.106	2026-09-25 16:02:51.475
dc39ff94-1f63-4f13-b531-4f2a863e5928	org-walmart-demo	store-jpr-001	prod-0056	22	0	2026-09-24 11:52:03.109	2026-09-25 16:02:51.478
0527cad6-4d8a-487f-afe6-149671d72115	org-walmart-demo	store-mum-001	prod-0056	22	0	2026-09-24 11:52:03.112	2026-09-25 16:02:51.482
9de1561a-23ac-4bca-a876-f612c02508e9	org-walmart-demo	store-pun-001	prod-0056	22	0	2026-09-24 11:52:03.115	2026-09-25 16:02:51.485
ae9d8887-8ff7-4373-bb34-bda7b3ebe5ed	org-walmart-demo	store-del-001	prod-0057	90	3	2026-09-24 11:52:03.119	2026-09-25 16:02:51.489
467a53f6-3428-4192-aca4-3936d329695e	org-walmart-demo	store-jpr-001	prod-0057	90	3	2026-09-24 11:52:03.122	2026-09-25 16:02:51.493
76854f02-9125-4619-99c4-09ac9752e0a7	org-walmart-demo	store-mum-001	prod-0057	90	3	2026-09-24 11:52:03.125	2026-09-25 16:02:51.497
c7f9320b-98d5-4361-8a85-1fe5d21d391f	org-walmart-demo	store-pun-001	prod-0057	0	0	2026-09-24 11:52:03.128	2026-09-25 16:02:51.5
6173b113-8b32-482b-b874-fe1c96344980	org-walmart-demo	store-blr-001	prod-0057	10	0	2026-09-24 11:52:03.131	2026-09-25 16:02:51.504
6273800c-3beb-4917-918f-5f07f6c20685	org-walmart-demo	store-chn-001	prod-0057	10	0	2026-09-24 11:52:03.135	2026-09-25 16:02:51.508
c4ee5008-7f5d-4eb8-b86f-e4700e040798	org-walmart-demo	store-del-001	prod-0058	45	1	2026-09-24 11:52:03.138	2026-09-25 16:02:51.512
4f8cfe35-d09f-42ac-92c3-5aac2ba51d23	org-walmart-demo	store-jpr-001	prod-0058	45	1	2026-09-24 11:52:03.141	2026-09-25 16:02:51.515
d0a28629-6349-4309-813b-a0eeaa35d33b	org-walmart-demo	store-mum-001	prod-0058	0	0	2026-09-24 11:52:03.144	2026-09-25 16:02:51.519
fb0c6dd6-e69b-428d-82c1-627923348f2d	org-walmart-demo	store-pun-001	prod-0058	5	0	2026-09-24 11:52:03.147	2026-09-25 16:02:51.523
e92b0485-35c3-4c37-bee5-35f3b888e15e	org-walmart-demo	store-blr-001	prod-0058	5	0	2026-09-24 11:52:03.15	2026-09-25 16:02:51.527
1482be26-52c9-4523-a763-35006529e21f	org-walmart-demo	store-chn-001	prod-0058	30	3	2026-09-24 11:52:03.155	2026-09-25 16:02:51.53
c572725d-deb9-4871-9001-730e4878d397	org-walmart-demo	store-del-001	prod-0059	54	1	2026-09-24 11:52:03.158	2026-09-25 16:02:51.534
1dbd980f-5993-4601-b380-5fb181cdf310	org-walmart-demo	store-jpr-001	prod-0059	0	0	2026-09-24 11:52:03.161	2026-09-25 16:02:51.538
bff632ef-2325-4dc0-a107-82405583d6d7	org-walmart-demo	store-mum-001	prod-0059	6	0	2026-09-24 11:52:03.164	2026-09-25 16:02:51.541
83627d53-cfc7-46da-9994-63a776924f75	org-walmart-demo	store-del-001	prod-0060	0	0	2026-09-24 11:52:03.17	2026-09-25 16:02:51.549
c8373590-b9ea-43c4-aa1d-46282767da5f	org-walmart-demo	store-jpr-001	prod-0060	2	0	2026-09-24 11:52:03.173	2026-09-25 16:02:51.552
417d05d0-8249-4634-903a-00f797c89309	org-walmart-demo	store-del-001	prod-0061	15	0	2026-09-24 11:52:03.176	2026-09-25 16:02:51.556
1627b712-5eb8-423c-9314-a4dfdadea530	org-walmart-demo	store-jpr-001	prod-0061	15	0	2026-09-24 11:52:03.179	2026-09-25 16:02:51.559
2274f3ee-2aa8-42d2-980e-07d5e5a8ca15	org-walmart-demo	store-mum-001	prod-0061	90	9	2026-09-24 11:52:03.182	2026-09-25 16:02:51.563
35046d8d-8254-4a54-89db-ba6bd300a7ba	org-walmart-demo	store-pun-001	prod-0061	90	9	2026-09-24 11:52:03.185	2026-09-25 16:02:51.566
39c9252b-028c-4730-8405-77c0c0bdc7b7	org-walmart-demo	store-blr-001	prod-0061	135	4	2026-09-24 11:52:03.188	2026-09-25 16:02:51.57
81e54c29-d43b-40aa-989e-5408fbffc99e	org-walmart-demo	store-chn-001	prod-0061	135	4	2026-09-24 11:52:03.191	2026-09-25 16:02:51.574
44c5bd7f-7c54-4930-b6c7-6ef038a52bdd	org-walmart-demo	store-del-001	prod-0062	5	0	2026-09-24 11:52:03.194	2026-09-25 16:02:51.577
4edd072a-51a3-4ce7-9188-efab51f2a491	org-walmart-demo	store-jpr-001	prod-0062	30	3	2026-09-24 11:52:03.197	2026-09-25 16:02:51.581
60d57409-796e-4662-bab1-6580f6e5d5ab	org-walmart-demo	store-mum-001	prod-0062	30	3	2026-09-24 11:52:03.2	2026-09-25 16:02:51.584
2dcfe7de-61fb-4c52-9318-7a519aacedb2	org-walmart-demo	store-pun-001	prod-0062	45	1	2026-09-24 11:52:03.204	2026-09-25 16:02:51.588
25df2b6a-c8c9-4c43-8b4a-33cf749afde7	org-walmart-demo	store-blr-001	prod-0062	45	1	2026-09-24 11:52:03.207	2026-09-25 16:02:51.592
b581dbd0-3252-44db-b33e-768aa64b8a3f	org-walmart-demo	store-chn-001	prod-0062	45	1	2026-09-24 11:52:03.21	2026-09-25 16:02:51.596
dc06e2b1-4b82-4d53-ae23-499ef2ea16f4	org-walmart-demo	store-del-001	prod-0063	15	1	2026-09-24 11:52:03.213	2026-09-25 16:02:51.6
1ffb1e20-70ee-49d4-a985-c212ca8e79b8	org-walmart-demo	store-jpr-001	prod-0063	15	1	2026-09-24 11:52:03.217	2026-09-25 16:02:51.603
a8511c09-aef1-4abe-a963-fb17a4b526f6	org-walmart-demo	store-mum-001	prod-0063	22	0	2026-09-24 11:52:03.22	2026-09-25 16:02:51.608
95d91b0b-70eb-4ea0-b18a-d4895a9165eb	org-walmart-demo	store-pun-001	prod-0063	22	0	2026-09-24 11:52:03.223	2026-09-25 16:02:51.611
93c7968e-4646-4767-b172-e990d695f37b	org-walmart-demo	store-del-001	prod-0064	60	6	2026-09-24 11:52:03.227	2026-09-25 16:02:51.615
031fbaef-b8fb-4f4a-a3b9-4b972fe9bf20	org-walmart-demo	store-jpr-001	prod-0064	90	3	2026-09-24 11:52:03.23	2026-09-25 16:02:51.618
032db879-74a5-4aec-ae5c-6c55b84fe6fc	org-walmart-demo	store-mum-001	prod-0064	90	3	2026-09-24 11:52:03.233	2026-09-25 16:02:51.622
1a3c5e54-3a5a-4e3c-bf9d-6cb386a7829c	org-walmart-demo	store-pun-001	prod-0064	90	3	2026-09-24 11:52:03.236	2026-09-25 16:02:51.626
8adfe184-339f-45c8-8e48-afd74f50188f	org-walmart-demo	store-blr-001	prod-0064	90	3	2026-09-24 11:52:03.239	2026-09-25 16:02:51.629
d8ba0569-b37c-433b-b8d5-5023573b8fc7	org-walmart-demo	store-chn-001	prod-0064	90	3	2026-09-24 11:52:03.242	2026-09-25 16:02:51.633
b3851e9c-f483-47b9-9a89-dc8f20c54509	org-walmart-demo	store-del-001	prod-0065	22	0	2026-09-24 11:52:03.245	2026-09-25 16:02:51.636
cf07f2e1-7fa0-42f1-a329-bb0bbdad99fa	org-walmart-demo	store-jpr-001	prod-0065	22	0	2026-09-24 11:52:03.248	2026-09-25 16:02:51.64
f7f92fee-50b1-4281-b1e0-c39dc46e3461	org-walmart-demo	store-del-001	prod-0066	135	4	2026-09-24 11:52:03.252	2026-09-25 16:02:51.644
fe0dd530-3627-4e61-9056-c3f26ceae8e2	org-walmart-demo	store-jpr-001	prod-0066	135	4	2026-09-24 11:52:03.255	2026-09-25 16:02:51.65
5fabeae7-1163-4389-98cc-7094358fb55b	org-walmart-demo	store-mum-001	prod-0066	135	4	2026-09-24 11:52:03.258	2026-09-25 16:02:51.655
3a9ca0e4-0ef5-4f00-9c49-34b82d26b071	org-walmart-demo	store-pun-001	prod-0066	135	4	2026-09-24 11:52:03.261	2026-09-25 16:02:51.659
b6d7626b-2461-452e-b4ec-ffe6442fa974	org-walmart-demo	store-mum-001	prod-0052	24	2	2026-09-24 11:52:03.074	2026-09-25 16:02:51.439
288e4b45-ad9a-4ada-8371-cd2529a1b194	org-walmart-demo	store-del-001	prod-0067	180	6	2026-09-24 11:52:03.271	2026-09-25 16:02:51.671
cdd31fa4-aa34-466b-8a27-09502e922e03	org-walmart-demo	store-jpr-001	prod-0067	180	6	2026-09-24 11:52:03.274	2026-09-25 16:02:51.675
d6643d9c-20f4-4839-97f5-5423c5cfc86b	org-walmart-demo	store-mum-001	prod-0067	180	6	2026-09-24 11:52:03.277	2026-09-25 16:02:51.678
99c10e64-b58a-4e5f-aef5-f8adaeb6f477	org-walmart-demo	store-pun-001	prod-0067	0	0	2026-09-24 11:52:03.28	2026-09-25 16:02:51.681
0c25f941-c700-44a4-a7eb-76e6c88bd5b2	org-walmart-demo	store-blr-001	prod-0067	20	0	2026-09-24 11:52:03.283	2026-09-25 16:02:51.685
0757e395-a658-48e6-9a13-c7320c874294	org-walmart-demo	store-chn-001	prod-0067	20	0	2026-09-24 11:52:03.287	2026-09-25 16:02:51.689
b31192da-e01b-4d2c-9b79-910826865d24	org-walmart-demo	store-del-001	prod-0068	90	3	2026-09-24 11:52:03.29	2026-09-25 16:02:51.692
c4a3b0c6-3d3b-412c-a446-f6063a1e6c3e	org-walmart-demo	store-jpr-001	prod-0068	90	3	2026-09-24 11:52:03.293	2026-09-25 16:02:51.696
96e780c2-e672-4496-bbdd-ced5b70819c2	org-walmart-demo	store-mum-001	prod-0068	0	0	2026-09-24 11:52:03.296	2026-09-25 16:02:51.699
24da479d-316f-438f-a9c4-4f35527ac4f0	org-walmart-demo	store-pun-001	prod-0068	10	0	2026-09-24 11:52:03.299	2026-09-25 16:02:51.702
9c08d938-a169-4c86-9126-0f8eaaf65d60	org-walmart-demo	store-del-001	prod-0069	67	2	2026-09-24 11:52:03.302	2026-09-25 16:02:51.706
3d009b2c-19de-4efe-8475-a0abc4e7307b	org-walmart-demo	store-jpr-001	prod-0069	0	0	2026-09-24 11:52:03.305	2026-09-25 16:02:51.71
85d5b60d-95d2-4f16-8765-208136b1fa89	org-walmart-demo	store-mum-001	prod-0069	7	0	2026-09-24 11:52:03.308	2026-09-25 16:02:51.715
268b1c42-85e4-4c0a-a6f1-bf9f478d6f55	org-walmart-demo	store-pun-001	prod-0069	7	0	2026-09-24 11:52:03.311	2026-09-25 16:02:51.719
ac12831f-a3c7-4b7d-8ab4-05648b0a242e	org-walmart-demo	store-del-001	prod-0070	0	0	2026-09-24 11:52:03.314	2026-09-25 16:02:51.723
75e4c774-d5a2-411b-b0d3-45067677ca7d	org-walmart-demo	store-jpr-001	prod-0070	2	0	2026-09-24 11:52:03.317	2026-09-25 16:02:51.727
bbbf45f6-d84f-4a7d-ac3d-517572f02602	org-walmart-demo	store-mum-001	prod-0070	2	0	2026-09-24 11:52:03.321	2026-09-25 16:02:51.732
140891b4-45c2-4514-a98f-fc5ff332b2f2	org-walmart-demo	store-pun-001	prod-0070	15	1	2026-09-24 11:52:03.324	2026-09-25 16:02:51.736
3ebd0247-c3f1-4cce-9eb4-caef5eb9b8a9	org-walmart-demo	store-del-001	prod-0071	4	0	2026-09-24 11:52:03.327	2026-09-25 16:02:51.742
806de328-9a01-457e-a309-29b9f4d69d46	org-walmart-demo	store-jpr-001	prod-0071	4	0	2026-09-24 11:52:03.331	2026-09-25 16:02:51.746
82145b95-48db-44db-b8e5-63830d1071a3	org-walmart-demo	store-mum-001	prod-0071	24	2	2026-09-24 11:52:03.334	2026-09-25 16:02:51.751
285cec6c-46d3-4a1a-b661-5a8017a4d7bb	org-walmart-demo	store-pun-001	prod-0071	24	2	2026-09-24 11:52:03.337	2026-09-25 16:02:51.756
dfb9a78d-2735-4578-9841-489e7dabfa1a	org-walmart-demo	store-del-001	prod-0072	5	0	2026-09-24 11:52:03.34	2026-09-25 16:02:51.76
16dd8206-bcb6-46fe-9215-5a2feb70d4e6	org-walmart-demo	store-jpr-001	prod-0072	30	3	2026-09-24 11:52:03.343	2026-09-25 16:02:51.763
44a22094-4236-4139-984c-43a5c4aeeb40	org-walmart-demo	store-mum-001	prod-0072	30	3	2026-09-24 11:52:03.346	2026-09-25 16:02:51.767
0e3e8254-d1f5-40f7-9772-7c951206437c	org-walmart-demo	store-pun-001	prod-0072	45	1	2026-09-24 11:52:03.349	2026-09-25 16:02:51.771
47db40e0-e83c-42fa-9fe9-b583ea6af1ac	org-walmart-demo	store-blr-001	prod-0072	45	1	2026-09-24 11:52:03.352	2026-09-25 16:02:51.777
a7ea2565-6dbb-4042-8ca6-468e02a45635	org-walmart-demo	store-chn-001	prod-0072	45	1	2026-09-24 11:52:03.356	2026-09-25 16:02:51.781
ef185066-72b4-4fd2-a8b4-7f248ec5be92	org-walmart-demo	store-jpr-001	prod-0073	45	4	2026-09-24 11:52:03.362	2026-09-25 16:02:51.788
9eb3b112-56d2-417a-b2d9-f15dec81a332	org-walmart-demo	store-mum-001	prod-0073	67	2	2026-09-24 11:52:03.365	2026-09-25 16:02:51.792
8da45614-4cf5-4dd0-b1f1-f3356e6a9e2b	org-walmart-demo	store-pun-001	prod-0073	67	2	2026-09-24 11:52:03.368	2026-09-25 16:02:51.796
d5ad76a6-d109-4ff6-9dfa-19806e443eef	org-walmart-demo	store-del-001	prod-0074	45	4	2026-09-24 11:52:03.374	2026-09-25 16:02:51.8
8a8b1bfc-91de-4b45-a9ba-ac020f18bd78	org-walmart-demo	store-jpr-001	prod-0074	67	2	2026-09-24 11:52:03.378	2026-09-25 16:02:51.804
cd4bdd1d-6ac1-47ad-af5c-9ad38c56463b	org-walmart-demo	store-mum-001	prod-0074	67	2	2026-09-24 11:52:03.381	2026-09-25 16:02:51.808
299b3104-7d41-43f3-95a6-a59230c83ad9	org-walmart-demo	store-pun-001	prod-0074	67	2	2026-09-24 11:52:03.385	2026-09-25 16:02:51.812
f148c190-c4cc-4ab1-bfc1-861e3a9b918b	org-walmart-demo	store-blr-001	prod-0074	67	2	2026-09-24 11:52:03.389	2026-09-25 16:02:51.816
a2ab9bb6-9103-4d24-ae70-0a3dbd6ec139	org-walmart-demo	store-chn-001	prod-0074	67	2	2026-09-24 11:52:03.392	2026-09-25 16:02:51.819
d506c59d-35dc-432e-b4ee-b2e504524f3c	org-walmart-demo	store-del-001	prod-0075	36	1	2026-09-24 11:52:03.395	2026-09-25 16:02:51.823
26359cfd-befb-4d16-9180-b319e71d32f8	org-walmart-demo	store-jpr-001	prod-0075	36	1	2026-09-24 11:52:03.398	2026-09-25 16:02:51.827
9c590b8d-b2cd-4618-a48c-025ae132483b	org-walmart-demo	store-mum-001	prod-0075	36	1	2026-09-24 11:52:03.401	2026-09-25 16:02:51.831
50a6af75-966d-41a4-accb-2d3c1329277d	org-walmart-demo	store-pun-001	prod-0075	36	1	2026-09-24 11:52:03.404	2026-09-25 16:02:51.835
926afcb5-df9e-47f9-8150-b84ff28091d6	org-walmart-demo	store-del-001	prod-0076	45	1	2026-09-24 11:52:03.407	2026-09-25 16:02:51.839
dabd9f78-4765-497f-8241-c56a51e792f6	org-walmart-demo	store-jpr-001	prod-0076	45	1	2026-09-24 11:52:03.41	2026-09-25 16:02:51.843
5357ba30-2034-4404-a50a-c56f51a5e0a6	org-walmart-demo	store-mum-001	prod-0076	45	1	2026-09-24 11:52:03.413	2026-09-25 16:02:51.846
b9c5a79e-8255-49e8-aa7b-be485dd8ee27	org-walmart-demo	store-pun-001	prod-0076	45	1	2026-09-24 11:52:03.416	2026-09-25 16:02:51.85
9679ffb5-994f-44eb-bc69-a265cf576ccb	org-walmart-demo	store-del-001	prod-0077	22	0	2026-09-24 11:52:03.419	2026-09-25 16:02:51.854
413eaf80-9c46-430a-9c28-35bfcefefccd	org-walmart-demo	store-jpr-001	prod-0077	22	0	2026-09-24 11:52:03.423	2026-09-25 16:02:51.858
ce88ad95-f1c4-4a95-a861-9e1af1156662	org-walmart-demo	store-mum-001	prod-0077	22	0	2026-09-24 11:52:03.426	2026-09-25 16:02:51.862
f047d66b-6b17-409f-8549-67c9a6008cd9	org-walmart-demo	store-pun-001	prod-0077	0	0	2026-09-24 11:52:03.428	2026-09-25 16:02:51.865
4150dce5-a157-4fe1-b903-bd20cac479e5	org-walmart-demo	store-del-001	prod-0078	54	1	2026-09-24 11:52:03.431	2026-09-25 16:02:51.869
c9ccf728-b02b-466c-9da5-dbd8f7c1ef7d	org-walmart-demo	store-jpr-001	prod-0078	54	1	2026-09-24 11:52:03.435	2026-09-25 16:02:51.873
3eb55924-f109-44f0-be76-a5df29bc8bd7	org-walmart-demo	store-mum-001	prod-0078	0	0	2026-09-24 11:52:03.439	2026-09-25 16:02:51.877
e927831a-15be-469a-b95f-9f7b5fb582c6	org-walmart-demo	store-pun-001	prod-0078	6	0	2026-09-24 11:52:03.441	2026-09-25 16:02:51.88
b35cd522-ca45-46e7-aec1-bd7d4f4580a0	org-walmart-demo	store-blr-001	prod-0078	6	0	2026-09-24 11:52:03.444	2026-09-25 16:02:51.884
9226d2f8-200f-4a21-8af3-c07ccb9b99ff	org-walmart-demo	store-chn-001	prod-0078	36	3	2026-09-24 11:52:03.447	2026-09-25 16:02:51.887
acda26e7-2050-44d8-83e7-61c9525927fb	org-walmart-demo	store-del-001	prod-0079	90	3	2026-09-24 11:52:03.45	2026-09-25 16:02:51.891
ad7464bf-b43d-4f82-a128-d52ef435f2c8	org-walmart-demo	store-jpr-001	prod-0079	0	0	2026-09-24 11:52:03.453	2026-09-25 16:02:51.895
73b75f96-bfb9-46d8-9653-a8c74859fa47	org-walmart-demo	store-mum-001	prod-0079	10	0	2026-09-24 11:52:03.456	2026-09-25 16:02:51.899
c84ff147-412f-4dbc-a0ba-9eb1f998d6a3	org-walmart-demo	store-chn-001	prod-0066	15	0	2026-09-24 11:52:03.267	2026-09-25 16:02:51.667
3a63dbb0-50d1-41f2-9814-27da47ea5d1b	org-walmart-demo	store-blr-001	prod-0079	60	6	2026-09-24 11:52:03.462	2026-09-25 16:02:51.906
8dc591b2-82ef-4949-a79d-5689f6b87c44	org-walmart-demo	store-chn-001	prod-0079	60	6	2026-09-24 11:52:03.465	2026-09-25 16:02:51.91
b2fc88a4-d8da-439c-a62c-968e57df5bad	org-walmart-demo	store-del-001	prod-0080	0	0	2026-09-24 11:52:03.468	2026-09-25 16:02:51.914
d6d2fac1-ed03-46d7-a0a9-dacd428b67b7	org-walmart-demo	store-jpr-001	prod-0080	7	0	2026-09-24 11:52:03.471	2026-09-25 16:02:51.918
5e4b0ba5-4335-4ee3-aa06-dd09af8632cc	org-walmart-demo	store-mum-001	prod-0080	7	0	2026-09-24 11:52:03.474	2026-09-25 16:02:51.922
76817d2a-e02d-462f-b62c-a7cd5f67dc8c	org-walmart-demo	store-pun-001	prod-0080	45	4	2026-09-24 11:52:03.477	2026-09-25 16:02:51.926
6929a6ce-a232-435c-8e26-232d70901358	org-walmart-demo	store-blr-001	prod-0080	45	4	2026-09-24 11:52:03.48	2026-09-25 16:02:51.93
c5acc59e-f21b-46d3-9972-bdbf5cb91fd3	org-walmart-demo	store-chn-001	prod-0080	67	2	2026-09-24 11:52:03.483	2026-09-25 16:02:51.934
25f8e4fc-cd44-49eb-ab23-41d445f9c822	org-walmart-demo	store-del-001	prod-0081	5	0	2026-09-24 11:52:03.486	2026-09-25 16:02:51.938
d8feddfb-0b38-42df-ae45-82a11a85b9f2	org-walmart-demo	store-jpr-001	prod-0081	5	0	2026-09-24 11:52:03.489	2026-09-25 16:02:51.942
d7c7271f-a0f4-41d9-9f05-7b3abd5e09ac	org-walmart-demo	store-mum-001	prod-0081	30	3	2026-09-24 11:52:03.492	2026-09-25 16:02:51.946
395213e2-afc8-475e-98be-ca8e427e11a0	org-walmart-demo	store-pun-001	prod-0081	30	3	2026-09-24 11:52:03.495	2026-09-25 16:02:51.95
055701a3-b928-4076-aeaf-5cfb62e1664a	org-walmart-demo	store-del-001	prod-0082	7	0	2026-09-24 11:52:03.498	2026-09-25 16:02:51.954
10a049ab-6e6f-4fcf-8871-4b9ec8e5d2b2	org-walmart-demo	store-jpr-001	prod-0082	45	4	2026-09-24 11:52:03.501	2026-09-25 16:02:51.959
3538a6f2-7ec9-4806-b996-b2678b5ad53b	org-walmart-demo	store-mum-001	prod-0082	45	4	2026-09-24 11:52:03.505	2026-09-25 16:02:51.963
ef1847e5-3925-4075-8133-fc43d1627433	org-walmart-demo	store-pun-001	prod-0082	67	2	2026-09-24 11:52:03.508	2026-09-25 16:02:51.967
c1b91a70-4ac1-4ddf-b0a2-39bdc5442ea6	org-walmart-demo	store-del-001	prod-0083	60	6	2026-09-24 11:52:03.511	2026-09-25 16:02:51.971
48ee42da-3132-4dec-96d6-3892bbc51015	org-walmart-demo	store-jpr-001	prod-0083	60	6	2026-09-24 11:52:03.515	2026-09-25 16:02:51.975
a194c8f1-8703-470c-b35e-ac9898b187e1	org-walmart-demo	store-mum-001	prod-0083	90	3	2026-09-24 11:52:03.518	2026-09-25 16:02:51.979
79812514-a180-4754-9c2c-1c84c39d992d	org-walmart-demo	store-pun-001	prod-0083	90	3	2026-09-24 11:52:03.522	2026-09-25 16:02:51.983
2e113431-4e3f-42e7-8a81-a8d7f8a2e0f9	org-walmart-demo	store-blr-001	prod-0083	90	3	2026-09-24 11:52:03.525	2026-09-25 16:02:51.988
0a8cc8b1-c513-4887-b0dc-4949dd58be42	org-walmart-demo	store-chn-001	prod-0083	90	3	2026-09-24 11:52:03.528	2026-09-25 16:02:51.992
0723a41d-23fb-4ec3-b0a9-63fdf0c44bde	org-walmart-demo	store-del-001	prod-0084	24	2	2026-09-24 11:52:03.531	2026-09-25 16:02:51.997
2cc68a7e-0fe8-42e8-9e52-04a7140c5192	org-walmart-demo	store-jpr-001	prod-0084	36	1	2026-09-24 11:52:03.534	2026-09-25 16:02:52.001
f2197c0d-0512-4630-a3bc-a0036094dbe5	org-walmart-demo	store-mum-001	prod-0084	36	1	2026-09-24 11:52:03.538	2026-09-25 16:02:52.005
7502c1f3-f32a-48e3-96c2-c376770b25dd	org-walmart-demo	store-pun-001	prod-0084	36	1	2026-09-24 11:52:03.541	2026-09-25 16:02:52.01
18ddc4dd-118e-4466-81ac-028c9da301c5	org-walmart-demo	store-del-001	prod-0085	36	1	2026-09-24 11:52:03.544	2026-09-25 16:02:52.014
fe31bf0a-e1fb-4769-96ae-563635be880c	org-walmart-demo	store-jpr-001	prod-0085	36	1	2026-09-24 11:52:03.547	2026-09-25 16:02:52.018
d951650f-b6a5-45fa-a83f-f52a6d221fb5	org-walmart-demo	store-mum-001	prod-0085	36	1	2026-09-24 11:52:03.551	2026-09-25 16:02:52.022
a6c141ea-c0d4-4b4c-8415-ddf9ca51ede8	org-walmart-demo	store-pun-001	prod-0085	36	1	2026-09-24 11:52:03.554	2026-09-25 16:02:52.026
c2825e59-6dc0-4c13-9dad-8ba1c5c8e47a	org-walmart-demo	store-del-001	prod-0086	45	1	2026-09-24 11:52:03.557	2026-09-25 16:02:52.03
ab92dd41-8e0a-4d3c-bc66-f9281430066e	org-walmart-demo	store-jpr-001	prod-0086	45	1	2026-09-24 11:52:03.56	2026-09-25 16:02:52.034
11d74925-9859-4bc3-b25d-7d2983df2f15	org-walmart-demo	store-del-001	prod-0087	45	1	2026-09-24 11:52:03.563	2026-09-25 16:02:52.038
ee6aafde-2c38-4e56-8ed4-64b9b47b7682	org-walmart-demo	store-jpr-001	prod-0087	45	1	2026-09-24 11:52:03.566	2026-09-25 16:02:52.042
f7cad833-e550-4d3e-b45c-2a5776cc9de1	org-walmart-demo	store-del-001	prod-0088	9	0	2026-09-24 11:52:03.569	2026-09-25 16:02:52.046
f4fbd13a-2f8c-406c-8205-bd541cae6c05	org-walmart-demo	store-jpr-001	prod-0088	9	0	2026-09-24 11:52:03.573	2026-09-25 16:02:52.05
20368b8f-72c0-47f1-9c8e-4a2d1f7bfcfa	org-walmart-demo	store-del-001	prod-0089	9	0	2026-09-24 11:52:03.576	2026-09-25 16:02:52.054
40d5ca95-d20b-40e6-8ff4-5a650214a4a7	org-walmart-demo	store-jpr-001	prod-0089	0	0	2026-09-24 11:52:03.579	2026-09-25 16:02:52.058
6eeb66c4-adb4-4ec0-b4ba-955a1b1e954e	org-walmart-demo	store-del-001	prod-0090	0	0	2026-09-24 11:52:03.582	2026-09-25 16:02:52.062
73e4da2a-8a59-4635-b2c1-2d93e6e35928	org-walmart-demo	store-jpr-001	prod-0090	1	0	2026-09-24 11:52:03.586	2026-09-25 16:02:52.066
c7127c17-256d-4454-9cfe-dd1db0820318	org-walmart-demo	store-del-001	prod-0001	10	0	2026-09-24 11:52:02.117	2026-09-25 16:02:50.249
7f4c84f9-9279-4244-a031-e0a9b5e37460	org-walmart-demo	store-kol-001	prod-0004	0	0	2026-09-24 11:52:02.214	2026-09-25 16:02:50.38
1b73089b-d505-40bd-b2a3-a55ddcf04f9f	org-walmart-demo	store-gwh-001	prod-0008	225	7	2026-09-24 11:52:02.314	2026-09-25 16:02:50.501
06e081de-75c8-4c19-b22e-2000f61de71d	org-walmart-demo	store-jpr-001	prod-0013	240	24	2026-09-24 11:52:02.408	2026-09-25 16:02:50.624
1478ea08-5b01-4d1a-afa9-3a37f5c2bec0	org-walmart-demo	store-blr-001	prod-0017	12	0	2026-09-24 11:52:02.502	2026-09-25 16:02:50.747
7059c1ca-02f6-45db-bc57-a21fe7599a97	org-walmart-demo	store-mum-001	prod-0022	180	18	2026-09-24 11:52:02.591	2026-09-25 16:02:50.862
9ec216e4-cfcb-4593-b980-69e094ff5207	org-walmart-demo	store-pun-001	prod-0026	135	4	2026-09-24 11:52:02.69	2026-09-25 16:02:50.975
90bc0235-37f6-4e8f-b760-ea25557a9c6d	org-walmart-demo	store-pun-001	prod-0030	75	7	2026-09-24 11:52:02.785	2026-09-25 16:02:51.084
f2b9b46e-8cf0-47ac-b0b9-81686b66ca94	org-walmart-demo	store-del-001	prod-0036	45	1	2026-09-24 11:52:02.88	2026-09-25 16:02:51.207
948569ce-9922-4270-8e12-67b4784f9985	org-walmart-demo	store-del-001	prod-0045	13	0	2026-09-24 11:52:02.975	2026-09-25 16:02:51.322
73482c05-4d3a-4529-85b5-f5436c95f335	org-walmart-demo	store-jpr-001	prod-0052	24	2	2026-09-24 11:52:03.072	2026-09-25 16:02:51.435
e89857a4-8a15-418f-b902-9890b7302140	org-walmart-demo	store-pun-001	prod-0059	6	0	2026-09-24 11:52:03.167	2026-09-25 16:02:51.545
6ca8d133-a506-463b-ab49-71ec61f8f377	org-walmart-demo	store-blr-001	prod-0066	0	0	2026-09-24 11:52:03.264	2026-09-25 16:02:51.663
6304eacf-f14e-4e9c-8188-7e15f2e494e2	org-walmart-demo	store-del-001	prod-0073	45	4	2026-09-24 11:52:03.359	2026-09-25 16:02:51.784
b20d2a4c-d3fd-4ab3-88d9-29297ed4206a	org-walmart-demo	store-pun-001	prod-0079	10	0	2026-09-24 11:52:03.459	2026-09-25 16:02:51.902
\.


--
-- Data for Name: InventoryMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryMovement" (id, "organizationId", "storeId", "productId", type, quantity, "unitCost", "referenceType", "referenceId", notes, "createdAt") FROM stdin;
mv-0001	org-walmart-demo	store-del-001	prod-0001	OPENING	10	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0002	org-walmart-demo	store-jpr-001	prod-0001	OPENING	10	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0003	org-walmart-demo	store-mum-001	prod-0001	OPENING	60	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0004	org-walmart-demo	store-pun-001	prod-0001	OPENING	60	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0005	org-walmart-demo	store-blr-001	prod-0001	OPENING	90	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0006	org-walmart-demo	store-chn-001	prod-0001	OPENING	90	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0007	org-walmart-demo	store-kol-001	prod-0001	OPENING	90	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0008	org-walmart-demo	store-gwh-001	prod-0001	OPENING	90	390.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0009	org-walmart-demo	store-del-001	prod-0002	OPENING	12	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0010	org-walmart-demo	store-jpr-001	prod-0002	OPENING	75	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0011	org-walmart-demo	store-mum-001	prod-0002	OPENING	75	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0012	org-walmart-demo	store-pun-001	prod-0002	OPENING	112	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0013	org-walmart-demo	store-blr-001	prod-0002	OPENING	112	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0014	org-walmart-demo	store-chn-001	prod-0002	OPENING	112	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0015	org-walmart-demo	store-kol-001	prod-0002	OPENING	112	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0016	org-walmart-demo	store-gwh-001	prod-0002	OPENING	112	340.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0017	org-walmart-demo	store-del-001	prod-0003	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0018	org-walmart-demo	store-jpr-001	prod-0003	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0019	org-walmart-demo	store-mum-001	prod-0003	OPENING	135	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0020	org-walmart-demo	store-pun-001	prod-0003	OPENING	135	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0021	org-walmart-demo	store-blr-001	prod-0003	OPENING	135	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0022	org-walmart-demo	store-chn-001	prod-0003	OPENING	135	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0023	org-walmart-demo	store-kol-001	prod-0003	OPENING	135	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0024	org-walmart-demo	store-del-001	prod-0004	OPENING	60	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0025	org-walmart-demo	store-jpr-001	prod-0004	OPENING	90	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0026	org-walmart-demo	store-mum-001	prod-0004	OPENING	90	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0027	org-walmart-demo	store-pun-001	prod-0004	OPENING	90	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0028	org-walmart-demo	store-blr-001	prod-0004	OPENING	90	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0029	org-walmart-demo	store-chn-001	prod-0004	OPENING	90	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0030	org-walmart-demo	store-gwh-001	prod-0004	OPENING	10	195.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0031	org-walmart-demo	store-del-001	prod-0005	OPENING	225	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0032	org-walmart-demo	store-jpr-001	prod-0005	OPENING	225	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0033	org-walmart-demo	store-mum-001	prod-0005	OPENING	225	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0034	org-walmart-demo	store-pun-001	prod-0005	OPENING	225	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0035	org-walmart-demo	store-blr-001	prod-0005	OPENING	225	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0036	org-walmart-demo	store-kol-001	prod-0005	OPENING	25	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0037	org-walmart-demo	store-gwh-001	prod-0005	OPENING	25	18.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0038	org-walmart-demo	store-del-001	prod-0006	OPENING	67	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0039	org-walmart-demo	store-jpr-001	prod-0006	OPENING	67	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0040	org-walmart-demo	store-mum-001	prod-0006	OPENING	67	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0041	org-walmart-demo	store-pun-001	prod-0006	OPENING	67	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0042	org-walmart-demo	store-chn-001	prod-0006	OPENING	7	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0043	org-walmart-demo	store-kol-001	prod-0006	OPENING	7	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0044	org-walmart-demo	store-gwh-001	prod-0006	OPENING	45	580.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0045	org-walmart-demo	store-del-001	prod-0007	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0046	org-walmart-demo	store-jpr-001	prod-0007	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0047	org-walmart-demo	store-mum-001	prod-0007	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0048	org-walmart-demo	store-blr-001	prod-0007	OPENING	20	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0049	org-walmart-demo	store-chn-001	prod-0007	OPENING	20	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0050	org-walmart-demo	store-del-001	prod-0008	OPENING	225	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0051	org-walmart-demo	store-jpr-001	prod-0008	OPENING	225	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0052	org-walmart-demo	store-pun-001	prod-0008	OPENING	25	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0053	org-walmart-demo	store-blr-001	prod-0008	OPENING	25	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0054	org-walmart-demo	store-chn-001	prod-0008	OPENING	150	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0055	org-walmart-demo	store-kol-001	prod-0008	OPENING	150	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0056	org-walmart-demo	store-gwh-001	prod-0008	OPENING	225	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0057	org-walmart-demo	store-del-001	prod-0009	OPENING	135	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0058	org-walmart-demo	store-mum-001	prod-0009	OPENING	15	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0059	org-walmart-demo	store-pun-001	prod-0009	OPENING	15	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0060	org-walmart-demo	store-blr-001	prod-0009	OPENING	90	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0061	org-walmart-demo	store-chn-001	prod-0009	OPENING	90	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0062	org-walmart-demo	store-kol-001	prod-0009	OPENING	135	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0063	org-walmart-demo	store-gwh-001	prod-0009	OPENING	135	72.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0064	org-walmart-demo	store-jpr-001	prod-0010	OPENING	50	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0065	org-walmart-demo	store-mum-001	prod-0010	OPENING	50	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0066	org-walmart-demo	store-pun-001	prod-0010	OPENING	300	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0067	org-walmart-demo	store-blr-001	prod-0010	OPENING	300	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0068	org-walmart-demo	store-chn-001	prod-0010	OPENING	450	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0069	org-walmart-demo	store-kol-001	prod-0010	OPENING	450	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0070	org-walmart-demo	store-gwh-001	prod-0010	OPENING	450	12.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0071	org-walmart-demo	store-del-001	prod-0011	OPENING	12	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0072	org-walmart-demo	store-jpr-001	prod-0011	OPENING	12	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0073	org-walmart-demo	store-mum-001	prod-0011	OPENING	75	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0074	org-walmart-demo	store-pun-001	prod-0011	OPENING	75	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0075	org-walmart-demo	store-blr-001	prod-0011	OPENING	112	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0076	org-walmart-demo	store-chn-001	prod-0011	OPENING	112	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0077	org-walmart-demo	store-del-001	prod-0012	OPENING	10	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0078	org-walmart-demo	store-jpr-001	prod-0012	OPENING	60	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0079	org-walmart-demo	store-mum-001	prod-0012	OPENING	60	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0080	org-walmart-demo	store-pun-001	prod-0012	OPENING	90	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0081	org-walmart-demo	store-blr-001	prod-0012	OPENING	90	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0082	org-walmart-demo	store-chn-001	prod-0012	OPENING	90	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0083	org-walmart-demo	store-del-001	prod-0013	OPENING	240	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0084	org-walmart-demo	store-jpr-001	prod-0013	OPENING	240	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0085	org-walmart-demo	store-mum-001	prod-0013	OPENING	360	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0086	org-walmart-demo	store-pun-001	prod-0013	OPENING	360	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0087	org-walmart-demo	store-blr-001	prod-0013	OPENING	360	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0088	org-walmart-demo	store-chn-001	prod-0013	OPENING	360	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0089	org-walmart-demo	store-kol-001	prod-0013	OPENING	360	52.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0090	org-walmart-demo	store-del-001	prod-0014	OPENING	180	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0091	org-walmart-demo	store-jpr-001	prod-0014	OPENING	270	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0092	org-walmart-demo	store-mum-001	prod-0014	OPENING	270	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0093	org-walmart-demo	store-pun-001	prod-0014	OPENING	270	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0094	org-walmart-demo	store-blr-001	prod-0014	OPENING	270	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0095	org-walmart-demo	store-chn-001	prod-0014	OPENING	270	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0096	org-walmart-demo	store-gwh-001	prod-0014	OPENING	30	30.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0097	org-walmart-demo	store-del-001	prod-0015	OPENING	180	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0098	org-walmart-demo	store-jpr-001	prod-0015	OPENING	180	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0099	org-walmart-demo	store-mum-001	prod-0015	OPENING	180	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0100	org-walmart-demo	store-pun-001	prod-0015	OPENING	180	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0101	org-walmart-demo	store-blr-001	prod-0015	OPENING	180	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0102	org-walmart-demo	store-del-001	prod-0016	OPENING	67	420.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0103	org-walmart-demo	store-jpr-001	prod-0016	OPENING	67	420.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0104	org-walmart-demo	store-mum-001	prod-0016	OPENING	67	420.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0105	org-walmart-demo	store-pun-001	prod-0016	OPENING	67	420.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0106	org-walmart-demo	store-chn-001	prod-0016	OPENING	7	420.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0107	org-walmart-demo	store-del-001	prod-0017	OPENING	112	210.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0108	org-walmart-demo	store-jpr-001	prod-0017	OPENING	112	210.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0109	org-walmart-demo	store-mum-001	prod-0017	OPENING	112	210.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0110	org-walmart-demo	store-blr-001	prod-0017	OPENING	12	210.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0111	org-walmart-demo	store-chn-001	prod-0017	OPENING	12	210.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0112	org-walmart-demo	store-del-001	prod-0018	OPENING	225	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0113	org-walmart-demo	store-jpr-001	prod-0018	OPENING	225	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0114	org-walmart-demo	store-pun-001	prod-0018	OPENING	25	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0115	org-walmart-demo	store-blr-001	prod-0018	OPENING	25	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0116	org-walmart-demo	store-chn-001	prod-0018	OPENING	150	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0117	org-walmart-demo	store-kol-001	prod-0018	OPENING	150	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0118	org-walmart-demo	store-gwh-001	prod-0018	OPENING	225	32.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0119	org-walmart-demo	store-del-001	prod-0019	OPENING	270	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0120	org-walmart-demo	store-mum-001	prod-0019	OPENING	30	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0121	org-walmart-demo	store-pun-001	prod-0019	OPENING	30	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0122	org-walmart-demo	store-blr-001	prod-0019	OPENING	180	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0123	org-walmart-demo	store-chn-001	prod-0019	OPENING	180	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0124	org-walmart-demo	store-kol-001	prod-0019	OPENING	270	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0125	org-walmart-demo	store-gwh-001	prod-0019	OPENING	270	20.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0126	org-walmart-demo	store-jpr-001	prod-0020	OPENING	5	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0127	org-walmart-demo	store-mum-001	prod-0020	OPENING	5	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0128	org-walmart-demo	store-pun-001	prod-0020	OPENING	30	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0129	org-walmart-demo	store-del-001	prod-0021	OPENING	20	35.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0130	org-walmart-demo	store-jpr-001	prod-0021	OPENING	20	35.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0131	org-walmart-demo	store-mum-001	prod-0021	OPENING	120	35.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0132	org-walmart-demo	store-pun-001	prod-0021	OPENING	120	35.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0133	org-walmart-demo	store-blr-001	prod-0021	OPENING	180	35.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0134	org-walmart-demo	store-chn-001	prod-0021	OPENING	180	35.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0135	org-walmart-demo	store-del-001	prod-0022	OPENING	30	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0136	org-walmart-demo	store-jpr-001	prod-0022	OPENING	180	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0137	org-walmart-demo	store-mum-001	prod-0022	OPENING	180	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0138	org-walmart-demo	store-pun-001	prod-0022	OPENING	270	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0139	org-walmart-demo	store-blr-001	prod-0022	OPENING	270	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0140	org-walmart-demo	store-chn-001	prod-0022	OPENING	270	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0141	org-walmart-demo	store-kol-001	prod-0022	OPENING	270	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0142	org-walmart-demo	store-gwh-001	prod-0022	OPENING	270	28.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0143	org-walmart-demo	store-del-001	prod-0023	OPENING	90	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0144	org-walmart-demo	store-jpr-001	prod-0023	OPENING	90	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0145	org-walmart-demo	store-mum-001	prod-0023	OPENING	135	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0146	org-walmart-demo	store-pun-001	prod-0023	OPENING	135	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0147	org-walmart-demo	store-blr-001	prod-0023	OPENING	135	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0148	org-walmart-demo	store-chn-001	prod-0023	OPENING	135	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0149	org-walmart-demo	store-kol-001	prod-0023	OPENING	135	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0150	org-walmart-demo	store-del-001	prod-0024	OPENING	120	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0151	org-walmart-demo	store-jpr-001	prod-0024	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0152	org-walmart-demo	store-mum-001	prod-0024	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0153	org-walmart-demo	store-pun-001	prod-0024	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0154	org-walmart-demo	store-blr-001	prod-0024	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0155	org-walmart-demo	store-chn-001	prod-0024	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0156	org-walmart-demo	store-gwh-001	prod-0024	OPENING	20	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0157	org-walmart-demo	store-del-001	prod-0025	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0158	org-walmart-demo	store-jpr-001	prod-0025	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0159	org-walmart-demo	store-mum-001	prod-0025	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0160	org-walmart-demo	store-pun-001	prod-0025	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0161	org-walmart-demo	store-blr-001	prod-0025	OPENING	90	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0162	org-walmart-demo	store-del-001	prod-0026	OPENING	135	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0163	org-walmart-demo	store-jpr-001	prod-0026	OPENING	135	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0164	org-walmart-demo	store-mum-001	prod-0026	OPENING	135	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0165	org-walmart-demo	store-pun-001	prod-0026	OPENING	135	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0166	org-walmart-demo	store-chn-001	prod-0026	OPENING	15	65.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0167	org-walmart-demo	store-del-001	prod-0027	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0168	org-walmart-demo	store-jpr-001	prod-0027	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0169	org-walmart-demo	store-mum-001	prod-0027	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0170	org-walmart-demo	store-blr-001	prod-0027	OPENING	10	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0171	org-walmart-demo	store-chn-001	prod-0027	OPENING	10	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0172	org-walmart-demo	store-kol-001	prod-0027	OPENING	60	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0173	org-walmart-demo	store-gwh-001	prod-0027	OPENING	60	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0174	org-walmart-demo	store-del-001	prod-0028	OPENING	112	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0175	org-walmart-demo	store-jpr-001	prod-0028	OPENING	112	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0176	org-walmart-demo	store-pun-001	prod-0028	OPENING	12	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0177	org-walmart-demo	store-blr-001	prod-0028	OPENING	12	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0178	org-walmart-demo	store-chn-001	prod-0028	OPENING	75	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0179	org-walmart-demo	store-kol-001	prod-0028	OPENING	75	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0180	org-walmart-demo	store-gwh-001	prod-0028	OPENING	112	85.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0181	org-walmart-demo	store-del-001	prod-0029	OPENING	135	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0182	org-walmart-demo	store-mum-001	prod-0029	OPENING	15	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0183	org-walmart-demo	store-pun-001	prod-0029	OPENING	15	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0184	org-walmart-demo	store-blr-001	prod-0029	OPENING	90	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0185	org-walmart-demo	store-chn-001	prod-0029	OPENING	90	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0186	org-walmart-demo	store-kol-001	prod-0029	OPENING	135	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0187	org-walmart-demo	store-gwh-001	prod-0029	OPENING	135	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0188	org-walmart-demo	store-jpr-001	prod-0030	OPENING	12	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0189	org-walmart-demo	store-mum-001	prod-0030	OPENING	12	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0190	org-walmart-demo	store-pun-001	prod-0030	OPENING	75	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0191	org-walmart-demo	store-blr-001	prod-0030	OPENING	75	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0192	org-walmart-demo	store-chn-001	prod-0030	OPENING	112	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0193	org-walmart-demo	store-del-001	prod-0031	OPENING	10	90.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0194	org-walmart-demo	store-jpr-001	prod-0031	OPENING	10	90.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0195	org-walmart-demo	store-mum-001	prod-0031	OPENING	60	90.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0196	org-walmart-demo	store-pun-001	prod-0031	OPENING	60	90.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0197	org-walmart-demo	store-blr-001	prod-0031	OPENING	90	90.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0198	org-walmart-demo	store-chn-001	prod-0031	OPENING	90	90.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0199	org-walmart-demo	store-del-001	prod-0032	OPENING	7	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0200	org-walmart-demo	store-jpr-001	prod-0032	OPENING	45	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0201	org-walmart-demo	store-mum-001	prod-0032	OPENING	45	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0202	org-walmart-demo	store-pun-001	prod-0032	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0203	org-walmart-demo	store-blr-001	prod-0032	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0204	org-walmart-demo	store-chn-001	prod-0032	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0205	org-walmart-demo	store-del-001	prod-0033	OPENING	30	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0206	org-walmart-demo	store-jpr-001	prod-0033	OPENING	30	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0207	org-walmart-demo	store-mum-001	prod-0033	OPENING	45	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0208	org-walmart-demo	store-pun-001	prod-0033	OPENING	45	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0209	org-walmart-demo	store-blr-001	prod-0033	OPENING	45	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0210	org-walmart-demo	store-chn-001	prod-0033	OPENING	45	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0211	org-walmart-demo	store-del-001	prod-0034	OPENING	90	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0212	org-walmart-demo	store-jpr-001	prod-0034	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0213	org-walmart-demo	store-mum-001	prod-0034	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0214	org-walmart-demo	store-pun-001	prod-0034	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0215	org-walmart-demo	store-blr-001	prod-0034	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0216	org-walmart-demo	store-chn-001	prod-0034	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0217	org-walmart-demo	store-del-001	prod-0035	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0218	org-walmart-demo	store-jpr-001	prod-0035	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0219	org-walmart-demo	store-mum-001	prod-0035	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0220	org-walmart-demo	store-pun-001	prod-0035	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0221	org-walmart-demo	store-del-001	prod-0036	OPENING	45	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0222	org-walmart-demo	store-jpr-001	prod-0036	OPENING	45	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0223	org-walmart-demo	store-mum-001	prod-0036	OPENING	45	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0224	org-walmart-demo	store-pun-001	prod-0036	OPENING	45	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0225	org-walmart-demo	store-del-001	prod-0037	OPENING	22	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0226	org-walmart-demo	store-jpr-001	prod-0037	OPENING	22	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0227	org-walmart-demo	store-mum-001	prod-0037	OPENING	22	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0228	org-walmart-demo	store-del-001	prod-0038	OPENING	22	950.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0229	org-walmart-demo	store-jpr-001	prod-0038	OPENING	22	950.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0230	org-walmart-demo	store-del-001	prod-0039	OPENING	45	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0231	org-walmart-demo	store-mum-001	prod-0039	OPENING	5	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0232	org-walmart-demo	store-pun-001	prod-0039	OPENING	5	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0233	org-walmart-demo	store-jpr-001	prod-0040	OPENING	4	680.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0234	org-walmart-demo	store-mum-001	prod-0040	OPENING	4	680.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0235	org-walmart-demo	store-pun-001	prod-0040	OPENING	24	680.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0236	org-walmart-demo	store-del-001	prod-0041	OPENING	5	250.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0237	org-walmart-demo	store-jpr-001	prod-0041	OPENING	5	250.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0238	org-walmart-demo	store-del-001	prod-0042	OPENING	2	1100.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0239	org-walmart-demo	store-jpr-001	prod-0042	OPENING	15	1100.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0240	org-walmart-demo	store-del-001	prod-0043	OPENING	15	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0241	org-walmart-demo	store-jpr-001	prod-0043	OPENING	15	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0242	org-walmart-demo	store-mum-001	prod-0043	OPENING	22	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0243	org-walmart-demo	store-pun-001	prod-0043	OPENING	22	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0244	org-walmart-demo	store-del-001	prod-0044	OPENING	9	2200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0245	org-walmart-demo	store-jpr-001	prod-0044	OPENING	13	2200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0246	org-walmart-demo	store-mum-001	prod-0044	OPENING	13	2200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0247	org-walmart-demo	store-pun-001	prod-0044	OPENING	13	2200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0248	org-walmart-demo	store-del-001	prod-0045	OPENING	13	1400.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0249	org-walmart-demo	store-jpr-001	prod-0045	OPENING	13	1400.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0250	org-walmart-demo	store-del-001	prod-0046	OPENING	9	1800.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0251	org-walmart-demo	store-jpr-001	prod-0046	OPENING	9	1800.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0252	org-walmart-demo	store-del-001	prod-0047	OPENING	22	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0253	org-walmart-demo	store-jpr-001	prod-0047	OPENING	22	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0254	org-walmart-demo	store-mum-001	prod-0047	OPENING	22	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0255	org-walmart-demo	store-del-001	prod-0048	OPENING	36	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0256	org-walmart-demo	store-jpr-001	prod-0048	OPENING	36	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0257	org-walmart-demo	store-pun-001	prod-0048	OPENING	4	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0258	org-walmart-demo	store-blr-001	prod-0048	OPENING	4	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0259	org-walmart-demo	store-chn-001	prod-0048	OPENING	24	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0260	org-walmart-demo	store-del-001	prod-0049	OPENING	22	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0261	org-walmart-demo	store-mum-001	prod-0049	OPENING	2	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0262	org-walmart-demo	store-pun-001	prod-0049	OPENING	2	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0263	org-walmart-demo	store-blr-001	prod-0049	OPENING	15	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0264	org-walmart-demo	store-chn-001	prod-0049	OPENING	15	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0265	org-walmart-demo	store-jpr-001	prod-0050	OPENING	5	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0266	org-walmart-demo	store-mum-001	prod-0050	OPENING	5	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0267	org-walmart-demo	store-pun-001	prod-0050	OPENING	30	350.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0268	org-walmart-demo	store-del-001	prod-0051	OPENING	7	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0269	org-walmart-demo	store-jpr-001	prod-0051	OPENING	7	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0270	org-walmart-demo	store-mum-001	prod-0051	OPENING	45	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0271	org-walmart-demo	store-pun-001	prod-0051	OPENING	45	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0272	org-walmart-demo	store-blr-001	prod-0051	OPENING	67	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0273	org-walmart-demo	store-chn-001	prod-0051	OPENING	67	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0274	org-walmart-demo	store-del-001	prod-0052	OPENING	4	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0275	org-walmart-demo	store-jpr-001	prod-0052	OPENING	24	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0276	org-walmart-demo	store-mum-001	prod-0052	OPENING	24	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0277	org-walmart-demo	store-pun-001	prod-0052	OPENING	36	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0278	org-walmart-demo	store-del-001	prod-0053	OPENING	15	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0279	org-walmart-demo	store-jpr-001	prod-0053	OPENING	15	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0280	org-walmart-demo	store-mum-001	prod-0053	OPENING	22	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0281	org-walmart-demo	store-pun-001	prod-0053	OPENING	22	550.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0282	org-walmart-demo	store-del-001	prod-0054	OPENING	6	1800.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0283	org-walmart-demo	store-jpr-001	prod-0054	OPENING	9	1800.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0284	org-walmart-demo	store-del-001	prod-0055	OPENING	9	2200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0285	org-walmart-demo	store-jpr-001	prod-0055	OPENING	9	2200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0286	org-walmart-demo	store-del-001	prod-0056	OPENING	22	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0287	org-walmart-demo	store-jpr-001	prod-0056	OPENING	22	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0288	org-walmart-demo	store-mum-001	prod-0056	OPENING	22	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0289	org-walmart-demo	store-pun-001	prod-0056	OPENING	22	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0290	org-walmart-demo	store-del-001	prod-0057	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0291	org-walmart-demo	store-jpr-001	prod-0057	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0292	org-walmart-demo	store-mum-001	prod-0057	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0293	org-walmart-demo	store-blr-001	prod-0057	OPENING	10	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0294	org-walmart-demo	store-chn-001	prod-0057	OPENING	10	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0295	org-walmart-demo	store-del-001	prod-0058	OPENING	45	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0296	org-walmart-demo	store-jpr-001	prod-0058	OPENING	45	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0297	org-walmart-demo	store-pun-001	prod-0058	OPENING	5	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0298	org-walmart-demo	store-blr-001	prod-0058	OPENING	5	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0299	org-walmart-demo	store-chn-001	prod-0058	OPENING	30	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0300	org-walmart-demo	store-del-001	prod-0059	OPENING	54	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0301	org-walmart-demo	store-mum-001	prod-0059	OPENING	6	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0302	org-walmart-demo	store-pun-001	prod-0059	OPENING	6	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0303	org-walmart-demo	store-jpr-001	prod-0060	OPENING	2	1800.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0304	org-walmart-demo	store-del-001	prod-0061	OPENING	15	75.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0305	org-walmart-demo	store-jpr-001	prod-0061	OPENING	15	75.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0306	org-walmart-demo	store-mum-001	prod-0061	OPENING	90	75.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0307	org-walmart-demo	store-pun-001	prod-0061	OPENING	90	75.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0308	org-walmart-demo	store-blr-001	prod-0061	OPENING	135	75.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0309	org-walmart-demo	store-chn-001	prod-0061	OPENING	135	75.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0310	org-walmart-demo	store-del-001	prod-0062	OPENING	5	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0311	org-walmart-demo	store-jpr-001	prod-0062	OPENING	30	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0312	org-walmart-demo	store-mum-001	prod-0062	OPENING	30	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0313	org-walmart-demo	store-pun-001	prod-0062	OPENING	45	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0314	org-walmart-demo	store-blr-001	prod-0062	OPENING	45	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0315	org-walmart-demo	store-chn-001	prod-0062	OPENING	45	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0316	org-walmart-demo	store-del-001	prod-0063	OPENING	15	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0317	org-walmart-demo	store-jpr-001	prod-0063	OPENING	15	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0318	org-walmart-demo	store-mum-001	prod-0063	OPENING	22	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0319	org-walmart-demo	store-pun-001	prod-0063	OPENING	22	1200.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0320	org-walmart-demo	store-del-001	prod-0064	OPENING	60	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0321	org-walmart-demo	store-jpr-001	prod-0064	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0322	org-walmart-demo	store-mum-001	prod-0064	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0323	org-walmart-demo	store-pun-001	prod-0064	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0324	org-walmart-demo	store-blr-001	prod-0064	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0325	org-walmart-demo	store-chn-001	prod-0064	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0326	org-walmart-demo	store-del-001	prod-0065	OPENING	22	1500.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0327	org-walmart-demo	store-jpr-001	prod-0065	OPENING	22	1500.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0328	org-walmart-demo	store-del-001	prod-0066	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0329	org-walmart-demo	store-jpr-001	prod-0066	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0330	org-walmart-demo	store-mum-001	prod-0066	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0331	org-walmart-demo	store-pun-001	prod-0066	OPENING	135	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0332	org-walmart-demo	store-chn-001	prod-0066	OPENING	15	45.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0333	org-walmart-demo	store-del-001	prod-0067	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0334	org-walmart-demo	store-jpr-001	prod-0067	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0335	org-walmart-demo	store-mum-001	prod-0067	OPENING	180	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0336	org-walmart-demo	store-blr-001	prod-0067	OPENING	20	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0337	org-walmart-demo	store-chn-001	prod-0067	OPENING	20	55.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0338	org-walmart-demo	store-del-001	prod-0068	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0339	org-walmart-demo	store-jpr-001	prod-0068	OPENING	90	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0340	org-walmart-demo	store-pun-001	prod-0068	OPENING	10	80.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0341	org-walmart-demo	store-del-001	prod-0069	OPENING	67	95.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0342	org-walmart-demo	store-mum-001	prod-0069	OPENING	7	95.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0343	org-walmart-demo	store-pun-001	prod-0069	OPENING	7	95.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0344	org-walmart-demo	store-jpr-001	prod-0070	OPENING	2	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0345	org-walmart-demo	store-mum-001	prod-0070	OPENING	2	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0346	org-walmart-demo	store-pun-001	prod-0070	OPENING	15	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0347	org-walmart-demo	store-del-001	prod-0071	OPENING	4	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0348	org-walmart-demo	store-jpr-001	prod-0071	OPENING	4	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0349	org-walmart-demo	store-mum-001	prod-0071	OPENING	24	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0350	org-walmart-demo	store-pun-001	prod-0071	OPENING	24	380.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0351	org-walmart-demo	store-del-001	prod-0072	OPENING	5	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0352	org-walmart-demo	store-jpr-001	prod-0072	OPENING	30	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0353	org-walmart-demo	store-mum-001	prod-0072	OPENING	30	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0354	org-walmart-demo	store-pun-001	prod-0072	OPENING	45	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0355	org-walmart-demo	store-blr-001	prod-0072	OPENING	45	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0356	org-walmart-demo	store-chn-001	prod-0072	OPENING	45	320.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0357	org-walmart-demo	store-del-001	prod-0073	OPENING	45	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0358	org-walmart-demo	store-jpr-001	prod-0073	OPENING	45	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0359	org-walmart-demo	store-mum-001	prod-0073	OPENING	67	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0360	org-walmart-demo	store-pun-001	prod-0073	OPENING	67	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0361	org-walmart-demo	store-del-001	prod-0074	OPENING	45	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0362	org-walmart-demo	store-jpr-001	prod-0074	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0363	org-walmart-demo	store-mum-001	prod-0074	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0364	org-walmart-demo	store-pun-001	prod-0074	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0365	org-walmart-demo	store-blr-001	prod-0074	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0366	org-walmart-demo	store-chn-001	prod-0074	OPENING	67	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0367	org-walmart-demo	store-del-001	prod-0075	OPENING	36	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0368	org-walmart-demo	store-jpr-001	prod-0075	OPENING	36	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0369	org-walmart-demo	store-mum-001	prod-0075	OPENING	36	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0370	org-walmart-demo	store-pun-001	prod-0075	OPENING	36	450.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0371	org-walmart-demo	store-del-001	prod-0076	OPENING	45	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0372	org-walmart-demo	store-jpr-001	prod-0076	OPENING	45	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0373	org-walmart-demo	store-mum-001	prod-0076	OPENING	45	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0374	org-walmart-demo	store-pun-001	prod-0076	OPENING	45	280.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0375	org-walmart-demo	store-del-001	prod-0077	OPENING	22	680.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0376	org-walmart-demo	store-jpr-001	prod-0077	OPENING	22	680.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0377	org-walmart-demo	store-mum-001	prod-0077	OPENING	22	680.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0378	org-walmart-demo	store-del-001	prod-0078	OPENING	54	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0379	org-walmart-demo	store-jpr-001	prod-0078	OPENING	54	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0380	org-walmart-demo	store-pun-001	prod-0078	OPENING	6	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0381	org-walmart-demo	store-blr-001	prod-0078	OPENING	6	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0382	org-walmart-demo	store-chn-001	prod-0078	OPENING	36	120.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0383	org-walmart-demo	store-del-001	prod-0079	OPENING	90	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0384	org-walmart-demo	store-mum-001	prod-0079	OPENING	10	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0385	org-walmart-demo	store-pun-001	prod-0079	OPENING	10	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0386	org-walmart-demo	store-blr-001	prod-0079	OPENING	60	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0387	org-walmart-demo	store-chn-001	prod-0079	OPENING	60	150.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0388	org-walmart-demo	store-jpr-001	prod-0080	OPENING	7	220.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0389	org-walmart-demo	store-mum-001	prod-0080	OPENING	7	220.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0390	org-walmart-demo	store-pun-001	prod-0080	OPENING	45	220.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0391	org-walmart-demo	store-blr-001	prod-0080	OPENING	45	220.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0392	org-walmart-demo	store-chn-001	prod-0080	OPENING	67	220.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0393	org-walmart-demo	store-del-001	prod-0081	OPENING	5	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0394	org-walmart-demo	store-jpr-001	prod-0081	OPENING	5	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0395	org-walmart-demo	store-mum-001	prod-0081	OPENING	30	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0396	org-walmart-demo	store-pun-001	prod-0081	OPENING	30	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0397	org-walmart-demo	store-del-001	prod-0082	OPENING	7	130.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0398	org-walmart-demo	store-jpr-001	prod-0082	OPENING	45	130.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0399	org-walmart-demo	store-mum-001	prod-0082	OPENING	45	130.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0400	org-walmart-demo	store-pun-001	prod-0082	OPENING	67	130.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0401	org-walmart-demo	store-del-001	prod-0083	OPENING	60	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0402	org-walmart-demo	store-jpr-001	prod-0083	OPENING	60	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0403	org-walmart-demo	store-mum-001	prod-0083	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0404	org-walmart-demo	store-pun-001	prod-0083	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0405	org-walmart-demo	store-blr-001	prod-0083	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0406	org-walmart-demo	store-chn-001	prod-0083	OPENING	90	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0407	org-walmart-demo	store-del-001	prod-0084	OPENING	24	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0408	org-walmart-demo	store-jpr-001	prod-0084	OPENING	36	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0409	org-walmart-demo	store-mum-001	prod-0084	OPENING	36	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0410	org-walmart-demo	store-pun-001	prod-0084	OPENING	36	850.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0411	org-walmart-demo	store-del-001	prod-0085	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0412	org-walmart-demo	store-jpr-001	prod-0085	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0413	org-walmart-demo	store-mum-001	prod-0085	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0414	org-walmart-demo	store-pun-001	prod-0085	OPENING	36	650.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0415	org-walmart-demo	store-del-001	prod-0086	OPENING	45	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0416	org-walmart-demo	store-jpr-001	prod-0086	OPENING	45	180.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0417	org-walmart-demo	store-del-001	prod-0087	OPENING	45	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0418	org-walmart-demo	store-jpr-001	prod-0087	OPENING	45	140.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0419	org-walmart-demo	store-del-001	prod-0088	OPENING	9	5500.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0420	org-walmart-demo	store-jpr-001	prod-0088	OPENING	9	5500.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0421	org-walmart-demo	store-del-001	prod-0089	OPENING	9	8500.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0422	org-walmart-demo	store-jpr-001	prod-0090	OPENING	1	6500.00	OPENING	\N	Initial opening stock	2026-06-26 03:30:00
mv-0423	org-walmart-demo	store-mum-001	prod-0015	PURCHASE	20	65.00	PURCHASE	po-0003	Purchase order received	2026-07-12 06:04:00
mv-0424	org-walmart-demo	store-mum-001	prod-0016	PURCHASE	25	420.00	PURCHASE	po-0003	Purchase order received	2026-07-12 06:04:00
mv-0425	org-walmart-demo	store-mum-001	prod-0017	PURCHASE	30	210.00	PURCHASE	po-0003	Purchase order received	2026-07-12 06:04:00
mv-0426	org-walmart-demo	store-mum-001	prod-0018	PURCHASE	35	32.00	PURCHASE	po-0003	Purchase order received	2026-07-12 06:04:00
mv-0427	org-walmart-demo	store-pun-001	prod-0022	PURCHASE	25	28.00	PURCHASE	po-0004	Purchase order received	2026-07-15 07:21:00
mv-0428	org-walmart-demo	store-pun-001	prod-0023	PURCHASE	30	140.00	PURCHASE	po-0004	Purchase order received	2026-07-15 07:21:00
mv-0429	org-walmart-demo	store-pun-001	prod-0024	PURCHASE	35	55.00	PURCHASE	po-0004	Purchase order received	2026-07-15 07:21:00
mv-0430	org-walmart-demo	store-pun-001	prod-0025	PURCHASE	40	120.00	PURCHASE	po-0004	Purchase order received	2026-07-15 07:21:00
mv-0431	org-walmart-demo	store-pun-001	prod-0026	PURCHASE	45	65.00	PURCHASE	po-0004	Purchase order received	2026-07-15 07:21:00
mv-0432	org-walmart-demo	store-blr-001	prod-0029	PURCHASE	30	55.00	PURCHASE	po-0005	Purchase order received	2026-07-18 07:38:00
mv-0433	org-walmart-demo	store-blr-001	prod-0030	PURCHASE	35	140.00	PURCHASE	po-0005	Purchase order received	2026-07-18 07:38:00
mv-0434	org-walmart-demo	store-blr-001	prod-0031	PURCHASE	40	90.00	PURCHASE	po-0005	Purchase order received	2026-07-18 07:38:00
mv-0435	org-walmart-demo	store-blr-001	prod-0032	PURCHASE	45	120.00	PURCHASE	po-0005	Purchase order received	2026-07-18 07:38:00
mv-0436	org-walmart-demo	store-blr-001	prod-0033	PURCHASE	50	350.00	PURCHASE	po-0005	Purchase order received	2026-07-18 07:38:00
mv-0437	org-walmart-demo	store-blr-001	prod-0034	PURCHASE	55	45.00	PURCHASE	po-0005	Purchase order received	2026-07-18 07:38:00
mv-0438	org-walmart-demo	store-chn-001	prod-0036	PURCHASE	35	850.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0439	org-walmart-demo	store-chn-001	prod-0037	PURCHASE	40	1200.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0440	org-walmart-demo	store-chn-001	prod-0038	PURCHASE	45	950.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0441	org-walmart-demo	store-chn-001	prod-0039	PURCHASE	50	380.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0442	org-walmart-demo	store-chn-001	prod-0040	PURCHASE	55	680.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0443	org-walmart-demo	store-chn-001	prod-0041	PURCHASE	60	250.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0444	org-walmart-demo	store-chn-001	prod-0042	PURCHASE	65	1100.00	PURCHASE	po-0006	Purchase order received	2026-07-21 08:55:00
mv-0445	org-walmart-demo	store-jpr-001	prod-0064	PURCHASE	55	80.00	PURCHASE	po-0010	Purchase order received	2026-08-02 13:03:00
mv-0446	org-walmart-demo	store-jpr-001	prod-0065	PURCHASE	60	1500.00	PURCHASE	po-0010	Purchase order received	2026-08-02 13:03:00
mv-0447	org-walmart-demo	store-jpr-001	prod-0066	PURCHASE	65	45.00	PURCHASE	po-0010	Purchase order received	2026-08-02 13:03:00
mv-0448	org-walmart-demo	store-jpr-001	prod-0067	PURCHASE	70	55.00	PURCHASE	po-0010	Purchase order received	2026-08-02 13:03:00
mv-0449	org-walmart-demo	store-mum-001	prod-0071	PURCHASE	60	380.00	PURCHASE	po-0011	Purchase order received	2026-08-05 14:20:00
mv-0450	org-walmart-demo	store-mum-001	prod-0072	PURCHASE	65	320.00	PURCHASE	po-0011	Purchase order received	2026-08-05 14:20:00
mv-0451	org-walmart-demo	store-mum-001	prod-0073	PURCHASE	70	150.00	PURCHASE	po-0011	Purchase order received	2026-08-05 14:20:00
mv-0452	org-walmart-demo	store-mum-001	prod-0074	PURCHASE	75	120.00	PURCHASE	po-0011	Purchase order received	2026-08-05 14:20:00
mv-0453	org-walmart-demo	store-mum-001	prod-0075	PURCHASE	80	450.00	PURCHASE	po-0011	Purchase order received	2026-08-05 14:20:00
mv-0454	org-walmart-demo	store-pun-001	prod-0078	PURCHASE	65	120.00	PURCHASE	po-0012	Purchase order received	2026-08-08 14:37:00
mv-0455	org-walmart-demo	store-pun-001	prod-0079	PURCHASE	70	150.00	PURCHASE	po-0012	Purchase order received	2026-08-08 14:37:00
mv-0456	org-walmart-demo	store-pun-001	prod-0080	PURCHASE	75	220.00	PURCHASE	po-0012	Purchase order received	2026-08-08 14:37:00
mv-0457	org-walmart-demo	store-pun-001	prod-0081	PURCHASE	80	180.00	PURCHASE	po-0012	Purchase order received	2026-08-08 14:37:00
mv-0458	org-walmart-demo	store-pun-001	prod-0082	PURCHASE	85	130.00	PURCHASE	po-0012	Purchase order received	2026-08-08 14:37:00
mv-0459	org-walmart-demo	store-pun-001	prod-0083	PURCHASE	90	180.00	PURCHASE	po-0012	Purchase order received	2026-08-08 14:37:00
mv-0460	org-walmart-demo	store-blr-001	prod-0085	PURCHASE	70	650.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0461	org-walmart-demo	store-blr-001	prod-0086	PURCHASE	75	180.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0462	org-walmart-demo	store-blr-001	prod-0087	PURCHASE	80	140.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0463	org-walmart-demo	store-blr-001	prod-0088	PURCHASE	85	5500.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0464	org-walmart-demo	store-blr-001	prod-0089	PURCHASE	90	8500.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0465	org-walmart-demo	store-blr-001	prod-0090	PURCHASE	95	6500.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0466	org-walmart-demo	store-blr-001	prod-0001	PURCHASE	100	390.00	PURCHASE	po-0013	Purchase order received	2026-08-11 03:54:00
mv-0467	org-walmart-demo	store-del-001	prod-0023	PURCHASE	90	140.00	PURCHASE	po-0017	Purchase order received	2026-08-23 08:02:00
mv-0468	org-walmart-demo	store-del-001	prod-0024	PURCHASE	95	55.00	PURCHASE	po-0017	Purchase order received	2026-08-23 08:02:00
mv-0469	org-walmart-demo	store-del-001	prod-0025	PURCHASE	100	120.00	PURCHASE	po-0017	Purchase order received	2026-08-23 08:02:00
mv-0470	org-walmart-demo	store-del-001	prod-0026	PURCHASE	105	65.00	PURCHASE	po-0017	Purchase order received	2026-08-23 08:02:00
mv-0471	org-walmart-demo	store-jpr-001	prod-0030	PURCHASE	95	140.00	PURCHASE	po-0018	Purchase order received	2026-08-26 09:19:00
mv-0472	org-walmart-demo	store-jpr-001	prod-0031	PURCHASE	100	90.00	PURCHASE	po-0018	Purchase order received	2026-08-26 09:19:00
mv-0473	org-walmart-demo	store-jpr-001	prod-0032	PURCHASE	105	120.00	PURCHASE	po-0018	Purchase order received	2026-08-26 09:19:00
mv-0474	org-walmart-demo	store-jpr-001	prod-0033	PURCHASE	110	350.00	PURCHASE	po-0018	Purchase order received	2026-08-26 09:19:00
mv-0475	org-walmart-demo	store-jpr-001	prod-0034	PURCHASE	115	45.00	PURCHASE	po-0018	Purchase order received	2026-08-26 09:19:00
mv-0476	org-walmart-demo	store-mum-001	prod-0037	PURCHASE	100	1200.00	PURCHASE	po-0019	Purchase order received	2026-08-29 09:36:00
mv-0477	org-walmart-demo	store-mum-001	prod-0038	PURCHASE	105	950.00	PURCHASE	po-0019	Purchase order received	2026-08-29 09:36:00
mv-0478	org-walmart-demo	store-mum-001	prod-0039	PURCHASE	110	380.00	PURCHASE	po-0019	Purchase order received	2026-08-29 09:36:00
mv-0479	org-walmart-demo	store-mum-001	prod-0040	PURCHASE	115	680.00	PURCHASE	po-0019	Purchase order received	2026-08-29 09:36:00
mv-0480	org-walmart-demo	store-mum-001	prod-0041	PURCHASE	120	250.00	PURCHASE	po-0019	Purchase order received	2026-08-29 09:36:00
mv-0481	org-walmart-demo	store-mum-001	prod-0042	PURCHASE	125	1100.00	PURCHASE	po-0019	Purchase order received	2026-08-29 09:36:00
mv-0482	org-walmart-demo	store-pun-001	prod-0044	PURCHASE	105	2200.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0483	org-walmart-demo	store-pun-001	prod-0045	PURCHASE	110	1400.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0484	org-walmart-demo	store-pun-001	prod-0046	PURCHASE	115	1800.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0485	org-walmart-demo	store-pun-001	prod-0047	PURCHASE	120	550.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0486	org-walmart-demo	store-pun-001	prod-0048	PURCHASE	125	450.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0487	org-walmart-demo	store-pun-001	prod-0049	PURCHASE	130	1200.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0488	org-walmart-demo	store-pun-001	prod-0050	PURCHASE	135	350.00	PURCHASE	po-0020	Purchase order received	2026-09-01 10:53:00
mv-0489	org-walmart-demo	store-gwh-001	prod-0072	PURCHASE	125	320.00	PURCHASE	po-0024	Purchase order received	2026-09-13 15:01:00
mv-0490	org-walmart-demo	store-gwh-001	prod-0073	PURCHASE	130	150.00	PURCHASE	po-0024	Purchase order received	2026-09-13 15:01:00
mv-0491	org-walmart-demo	store-gwh-001	prod-0074	PURCHASE	135	120.00	PURCHASE	po-0024	Purchase order received	2026-09-13 15:01:00
mv-0492	org-walmart-demo	store-gwh-001	prod-0075	PURCHASE	140	450.00	PURCHASE	po-0024	Purchase order received	2026-09-13 15:01:00
mv-0493	org-walmart-demo	store-del-001	prod-0079	PURCHASE	130	150.00	PURCHASE	po-0025	Purchase order received	2026-09-16 04:18:00
mv-0494	org-walmart-demo	store-del-001	prod-0080	PURCHASE	135	220.00	PURCHASE	po-0025	Purchase order received	2026-09-16 04:18:00
mv-0495	org-walmart-demo	store-del-001	prod-0081	PURCHASE	140	180.00	PURCHASE	po-0025	Purchase order received	2026-09-16 04:18:00
mv-0496	org-walmart-demo	store-del-001	prod-0082	PURCHASE	145	130.00	PURCHASE	po-0025	Purchase order received	2026-09-16 04:18:00
mv-0497	org-walmart-demo	store-del-001	prod-0083	PURCHASE	150	180.00	PURCHASE	po-0025	Purchase order received	2026-09-16 04:18:00
mv-0498	org-walmart-demo	store-pun-001	prod-0010	SALE	-4	12.00	SALE	so-0004	Sale SO-000004	2026-06-29 07:21:00
mv-0499	org-walmart-demo	store-pun-001	prod-0011	SALE	-5	140.00	SALE	so-0004	Sale SO-000004	2026-06-29 07:21:00
mv-0500	org-walmart-demo	store-pun-001	prod-0012	SALE	-1	280.00	SALE	so-0004	Sale SO-000004	2026-06-29 07:21:00
mv-0501	org-walmart-demo	store-pun-001	prod-0013	SALE	-2	52.00	SALE	so-0004	Sale SO-000004	2026-06-29 07:21:00
mv-0502	org-walmart-demo	store-blr-001	prod-0013	SALE	-5	52.00	SALE	so-0005	Sale SO-000005	2026-06-30 07:38:00
mv-0503	org-walmart-demo	store-blr-001	prod-0014	SALE	-1	30.00	SALE	so-0005	Sale SO-000005	2026-06-30 07:38:00
mv-0504	org-walmart-demo	store-blr-001	prod-0015	SALE	-2	65.00	SALE	so-0005	Sale SO-000005	2026-06-30 07:38:00
mv-0505	org-walmart-demo	store-blr-001	prod-0016	SALE	-3	420.00	SALE	so-0005	Sale SO-000005	2026-06-30 07:38:00
mv-0506	org-walmart-demo	store-blr-001	prod-0017	SALE	-4	210.00	SALE	so-0005	Sale SO-000005	2026-06-30 07:38:00
mv-0507	org-walmart-demo	store-chn-001	prod-0016	SALE	-1	420.00	SALE	so-0006	Sale SO-000006	2026-07-01 08:55:00
mv-0508	org-walmart-demo	store-chn-001	prod-0017	SALE	-2	210.00	SALE	so-0006	Sale SO-000006	2026-07-01 08:55:00
mv-0509	org-walmart-demo	store-chn-001	prod-0018	SALE	-3	32.00	SALE	so-0006	Sale SO-000006	2026-07-01 08:55:00
mv-0510	org-walmart-demo	store-chn-001	prod-0019	SALE	-4	20.00	SALE	so-0006	Sale SO-000006	2026-07-01 08:55:00
mv-0511	org-walmart-demo	store-chn-001	prod-0020	SALE	-5	180.00	SALE	so-0006	Sale SO-000006	2026-07-01 08:55:00
mv-0512	org-walmart-demo	store-chn-001	prod-0021	SALE	-1	35.00	SALE	so-0006	Sale SO-000006	2026-07-01 08:55:00
mv-0513	org-walmart-demo	store-kol-001	prod-0019	SALE	-2	20.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0514	org-walmart-demo	store-kol-001	prod-0020	SALE	-3	180.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0515	org-walmart-demo	store-kol-001	prod-0021	SALE	-4	35.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0516	org-walmart-demo	store-kol-001	prod-0022	SALE	-5	28.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0517	org-walmart-demo	store-kol-001	prod-0023	SALE	-1	140.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0518	org-walmart-demo	store-kol-001	prod-0024	SALE	-2	55.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0519	org-walmart-demo	store-kol-001	prod-0025	SALE	-3	120.00	SALE	so-0007	Sale SO-000007	2026-07-02 10:12:00
mv-0520	org-walmart-demo	store-blr-001	prod-0037	SALE	-3	1200.00	SALE	so-0013	Sale SO-000013	2026-07-08 03:54:00
mv-0521	org-walmart-demo	store-blr-001	prod-0038	SALE	-4	950.00	SALE	so-0013	Sale SO-000013	2026-07-08 03:54:00
mv-0522	org-walmart-demo	store-blr-001	prod-0039	SALE	-5	380.00	SALE	so-0013	Sale SO-000013	2026-07-08 03:54:00
mv-0523	org-walmart-demo	store-blr-001	prod-0040	SALE	-1	680.00	SALE	so-0013	Sale SO-000013	2026-07-08 03:54:00
mv-0524	org-walmart-demo	store-blr-001	prod-0041	SALE	-2	250.00	SALE	so-0013	Sale SO-000013	2026-07-08 03:54:00
mv-0525	org-walmart-demo	store-chn-001	prod-0040	SALE	-4	680.00	SALE	so-0014	Sale SO-000014	2026-07-09 05:11:00
mv-0526	org-walmart-demo	store-chn-001	prod-0041	SALE	-5	250.00	SALE	so-0014	Sale SO-000014	2026-07-09 05:11:00
mv-0527	org-walmart-demo	store-chn-001	prod-0042	SALE	-1	1100.00	SALE	so-0014	Sale SO-000014	2026-07-09 05:11:00
mv-0528	org-walmart-demo	store-chn-001	prod-0043	SALE	-2	850.00	SALE	so-0014	Sale SO-000014	2026-07-09 05:11:00
mv-0529	org-walmart-demo	store-chn-001	prod-0044	SALE	-3	2200.00	SALE	so-0014	Sale SO-000014	2026-07-09 05:11:00
mv-0530	org-walmart-demo	store-chn-001	prod-0045	SALE	-4	1400.00	SALE	so-0014	Sale SO-000014	2026-07-09 05:11:00
mv-0531	org-walmart-demo	store-kol-001	prod-0043	SALE	-5	850.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0532	org-walmart-demo	store-kol-001	prod-0044	SALE	-1	2200.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0533	org-walmart-demo	store-kol-001	prod-0045	SALE	-2	1400.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0534	org-walmart-demo	store-kol-001	prod-0046	SALE	-3	1800.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0535	org-walmart-demo	store-kol-001	prod-0047	SALE	-4	550.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0536	org-walmart-demo	store-kol-001	prod-0048	SALE	-5	450.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0537	org-walmart-demo	store-kol-001	prod-0049	SALE	-1	1200.00	SALE	so-0015	Sale SO-000015	2026-07-10 06:28:00
mv-0538	org-walmart-demo	store-gwh-001	prod-0046	SALE	-1	1800.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0539	org-walmart-demo	store-gwh-001	prod-0047	SALE	-2	550.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0540	org-walmart-demo	store-gwh-001	prod-0048	SALE	-3	450.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0541	org-walmart-demo	store-gwh-001	prod-0049	SALE	-4	1200.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0542	org-walmart-demo	store-gwh-001	prod-0050	SALE	-5	350.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0543	org-walmart-demo	store-gwh-001	prod-0051	SALE	-1	280.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0544	org-walmart-demo	store-gwh-001	prod-0052	SALE	-2	320.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0545	org-walmart-demo	store-gwh-001	prod-0053	SALE	-3	550.00	SALE	so-0016	Sale SO-000016	2026-07-11 06:45:00
mv-0546	org-walmart-demo	store-chn-001	prod-0064	SALE	-2	80.00	SALE	so-0022	Sale SO-000022	2026-07-17 13:27:00
mv-0547	org-walmart-demo	store-chn-001	prod-0065	SALE	-3	1500.00	SALE	so-0022	Sale SO-000022	2026-07-17 13:27:00
mv-0548	org-walmart-demo	store-chn-001	prod-0066	SALE	-4	45.00	SALE	so-0022	Sale SO-000022	2026-07-17 13:27:00
mv-0549	org-walmart-demo	store-chn-001	prod-0067	SALE	-5	55.00	SALE	so-0022	Sale SO-000022	2026-07-17 13:27:00
mv-0550	org-walmart-demo	store-chn-001	prod-0068	SALE	-1	80.00	SALE	so-0022	Sale SO-000022	2026-07-17 13:27:00
mv-0551	org-walmart-demo	store-chn-001	prod-0069	SALE	-2	95.00	SALE	so-0022	Sale SO-000022	2026-07-17 13:27:00
mv-0552	org-walmart-demo	store-kol-001	prod-0067	SALE	-3	55.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0553	org-walmart-demo	store-kol-001	prod-0068	SALE	-4	80.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0554	org-walmart-demo	store-kol-001	prod-0069	SALE	-5	95.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0555	org-walmart-demo	store-kol-001	prod-0070	SALE	-1	850.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0556	org-walmart-demo	store-kol-001	prod-0071	SALE	-2	380.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0557	org-walmart-demo	store-kol-001	prod-0072	SALE	-3	320.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0558	org-walmart-demo	store-kol-001	prod-0073	SALE	-4	150.00	SALE	so-0023	Sale SO-000023	2026-07-18 13:44:00
mv-0559	org-walmart-demo	store-gwh-001	prod-0070	SALE	-4	850.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0560	org-walmart-demo	store-gwh-001	prod-0071	SALE	-5	380.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0561	org-walmart-demo	store-gwh-001	prod-0072	SALE	-1	320.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0562	org-walmart-demo	store-gwh-001	prod-0073	SALE	-2	150.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0563	org-walmart-demo	store-gwh-001	prod-0074	SALE	-3	120.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0564	org-walmart-demo	store-gwh-001	prod-0075	SALE	-4	450.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0565	org-walmart-demo	store-gwh-001	prod-0076	SALE	-5	280.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0566	org-walmart-demo	store-gwh-001	prod-0077	SALE	-1	680.00	SALE	so-0024	Sale SO-000024	2026-07-19 15:01:00
mv-0567	org-walmart-demo	store-del-001	prod-0073	SALE	-5	150.00	SALE	so-0025	Sale SO-000025	2026-07-20 04:18:00
mv-0568	org-walmart-demo	store-kol-001	prod-0001	SALE	-1	390.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0569	org-walmart-demo	store-kol-001	prod-0002	SALE	-2	340.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0570	org-walmart-demo	store-kol-001	prod-0003	SALE	-3	120.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0571	org-walmart-demo	store-kol-001	prod-0004	SALE	-4	195.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0572	org-walmart-demo	store-kol-001	prod-0005	SALE	-5	18.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0573	org-walmart-demo	store-kol-001	prod-0006	SALE	-1	580.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0574	org-walmart-demo	store-kol-001	prod-0007	SALE	-2	55.00	SALE	so-0031	Sale SO-000031	2026-07-26 10:00:00
mv-0575	org-walmart-demo	store-gwh-001	prod-0004	SALE	-2	195.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0576	org-walmart-demo	store-gwh-001	prod-0005	SALE	-3	18.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0577	org-walmart-demo	store-gwh-001	prod-0006	SALE	-4	580.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0578	org-walmart-demo	store-gwh-001	prod-0007	SALE	-5	55.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0579	org-walmart-demo	store-gwh-001	prod-0008	SALE	-1	28.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0580	org-walmart-demo	store-gwh-001	prod-0009	SALE	-2	72.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0581	org-walmart-demo	store-gwh-001	prod-0010	SALE	-3	12.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0582	org-walmart-demo	store-gwh-001	prod-0011	SALE	-4	140.00	SALE	so-0032	Sale SO-000032	2026-07-27 11:17:00
mv-0583	org-walmart-demo	store-del-001	prod-0007	SALE	-3	55.00	SALE	so-0033	Sale SO-000033	2026-07-28 11:34:00
mv-0584	org-walmart-demo	store-jpr-001	prod-0010	SALE	-4	12.00	SALE	so-0034	Sale SO-000034	2026-07-29 12:51:00
mv-0585	org-walmart-demo	store-jpr-001	prod-0011	SALE	-5	140.00	SALE	so-0034	Sale SO-000034	2026-07-29 12:51:00
mv-0586	org-walmart-demo	store-gwh-001	prod-0028	SALE	-5	85.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0587	org-walmart-demo	store-gwh-001	prod-0029	SALE	-1	55.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0588	org-walmart-demo	store-gwh-001	prod-0030	SALE	-2	140.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0589	org-walmart-demo	store-gwh-001	prod-0031	SALE	-3	90.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0590	org-walmart-demo	store-gwh-001	prod-0032	SALE	-4	120.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0591	org-walmart-demo	store-gwh-001	prod-0033	SALE	-5	350.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0592	org-walmart-demo	store-gwh-001	prod-0034	SALE	-1	45.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0593	org-walmart-demo	store-gwh-001	prod-0035	SALE	-2	650.00	SALE	so-0040	Sale SO-000040	2026-08-04 06:33:00
mv-0594	org-walmart-demo	store-del-001	prod-0031	SALE	-1	90.00	SALE	so-0041	Sale SO-000041	2026-08-05 07:50:00
mv-0595	org-walmart-demo	store-jpr-001	prod-0034	SALE	-2	45.00	SALE	so-0042	Sale SO-000042	2026-08-06 09:07:00
mv-0596	org-walmart-demo	store-jpr-001	prod-0035	SALE	-3	650.00	SALE	so-0042	Sale SO-000042	2026-08-06 09:07:00
mv-0597	org-walmart-demo	store-mum-001	prod-0037	SALE	-3	1200.00	SALE	so-0043	Sale SO-000043	2026-08-07 10:24:00
mv-0598	org-walmart-demo	store-mum-001	prod-0038	SALE	-4	950.00	SALE	so-0043	Sale SO-000043	2026-08-07 10:24:00
mv-0599	org-walmart-demo	store-mum-001	prod-0039	SALE	-5	380.00	SALE	so-0043	Sale SO-000043	2026-08-07 10:24:00
mv-0600	org-walmart-demo	store-del-001	prod-0055	SALE	-4	2200.00	SALE	so-0049	Sale SO-000049	2026-08-13 04:06:00
mv-0601	org-walmart-demo	store-jpr-001	prod-0058	SALE	-5	650.00	SALE	so-0050	Sale SO-000050	2026-08-14 05:23:00
mv-0602	org-walmart-demo	store-jpr-001	prod-0059	SALE	-1	380.00	SALE	so-0050	Sale SO-000050	2026-08-14 05:23:00
mv-0603	org-walmart-demo	store-mum-001	prod-0061	SALE	-1	75.00	SALE	so-0051	Sale SO-000051	2026-08-15 05:40:00
mv-0604	org-walmart-demo	store-mum-001	prod-0062	SALE	-2	320.00	SALE	so-0051	Sale SO-000051	2026-08-15 05:40:00
mv-0605	org-walmart-demo	store-mum-001	prod-0063	SALE	-3	1200.00	SALE	so-0051	Sale SO-000051	2026-08-15 05:40:00
mv-0606	org-walmart-demo	store-pun-001	prod-0064	SALE	-2	80.00	SALE	so-0052	Sale SO-000052	2026-08-16 06:57:00
mv-0607	org-walmart-demo	store-pun-001	prod-0065	SALE	-3	1500.00	SALE	so-0052	Sale SO-000052	2026-08-16 06:57:00
mv-0608	org-walmart-demo	store-pun-001	prod-0066	SALE	-4	45.00	SALE	so-0052	Sale SO-000052	2026-08-16 06:57:00
mv-0609	org-walmart-demo	store-pun-001	prod-0067	SALE	-5	55.00	SALE	so-0052	Sale SO-000052	2026-08-16 06:57:00
mv-0610	org-walmart-demo	store-jpr-001	prod-0082	SALE	-3	130.00	SALE	so-0058	Sale SO-000058	2026-08-22 12:39:00
mv-0611	org-walmart-demo	store-jpr-001	prod-0083	SALE	-4	180.00	SALE	so-0058	Sale SO-000058	2026-08-22 12:39:00
mv-0612	org-walmart-demo	store-mum-001	prod-0085	SALE	-4	650.00	SALE	so-0059	Sale SO-000059	2026-08-23 13:56:00
mv-0613	org-walmart-demo	store-mum-001	prod-0086	SALE	-5	180.00	SALE	so-0059	Sale SO-000059	2026-08-23 13:56:00
mv-0614	org-walmart-demo	store-mum-001	prod-0087	SALE	-1	140.00	SALE	so-0059	Sale SO-000059	2026-08-23 13:56:00
mv-0615	org-walmart-demo	store-pun-001	prod-0088	SALE	-5	5500.00	SALE	so-0060	Sale SO-000060	2026-08-24 15:13:00
mv-0616	org-walmart-demo	store-pun-001	prod-0089	SALE	-1	8500.00	SALE	so-0060	Sale SO-000060	2026-08-24 15:13:00
mv-0617	org-walmart-demo	store-pun-001	prod-0090	SALE	-2	6500.00	SALE	so-0060	Sale SO-000060	2026-08-24 15:13:00
mv-0618	org-walmart-demo	store-pun-001	prod-0001	SALE	-3	390.00	SALE	so-0060	Sale SO-000060	2026-08-24 15:13:00
mv-0619	org-walmart-demo	store-blr-001	prod-0001	SALE	-1	390.00	SALE	so-0061	Sale SO-000061	2026-08-25 03:30:00
mv-0620	org-walmart-demo	store-blr-001	prod-0002	SALE	-2	340.00	SALE	so-0061	Sale SO-000061	2026-08-25 03:30:00
mv-0621	org-walmart-demo	store-blr-001	prod-0003	SALE	-3	120.00	SALE	so-0061	Sale SO-000061	2026-08-25 03:30:00
mv-0622	org-walmart-demo	store-blr-001	prod-0004	SALE	-4	195.00	SALE	so-0061	Sale SO-000061	2026-08-25 03:30:00
mv-0623	org-walmart-demo	store-blr-001	prod-0005	SALE	-5	18.00	SALE	so-0061	Sale SO-000061	2026-08-25 03:30:00
mv-0624	org-walmart-demo	store-mum-001	prod-0019	SALE	-2	20.00	SALE	so-0067	Sale SO-000067	2026-08-31 10:12:00
mv-0625	org-walmart-demo	store-mum-001	prod-0020	SALE	-3	180.00	SALE	so-0067	Sale SO-000067	2026-08-31 10:12:00
mv-0626	org-walmart-demo	store-mum-001	prod-0021	SALE	-4	35.00	SALE	so-0067	Sale SO-000067	2026-08-31 10:12:00
mv-0627	org-walmart-demo	store-pun-001	prod-0022	SALE	-3	28.00	SALE	so-0068	Sale SO-000068	2026-09-01 11:29:00
mv-0628	org-walmart-demo	store-pun-001	prod-0023	SALE	-4	140.00	SALE	so-0068	Sale SO-000068	2026-09-01 11:29:00
mv-0629	org-walmart-demo	store-pun-001	prod-0024	SALE	-5	55.00	SALE	so-0068	Sale SO-000068	2026-09-01 11:29:00
mv-0630	org-walmart-demo	store-pun-001	prod-0025	SALE	-1	120.00	SALE	so-0068	Sale SO-000068	2026-09-01 11:29:00
mv-0631	org-walmart-demo	store-blr-001	prod-0025	SALE	-4	120.00	SALE	so-0069	Sale SO-000069	2026-09-02 11:46:00
mv-0632	org-walmart-demo	store-blr-001	prod-0026	SALE	-5	65.00	SALE	so-0069	Sale SO-000069	2026-09-02 11:46:00
mv-0633	org-walmart-demo	store-blr-001	prod-0027	SALE	-1	180.00	SALE	so-0069	Sale SO-000069	2026-09-02 11:46:00
mv-0634	org-walmart-demo	store-blr-001	prod-0028	SALE	-2	85.00	SALE	so-0069	Sale SO-000069	2026-09-02 11:46:00
mv-0635	org-walmart-demo	store-blr-001	prod-0029	SALE	-3	55.00	SALE	so-0069	Sale SO-000069	2026-09-02 11:46:00
mv-0636	org-walmart-demo	store-chn-001	prod-0028	SALE	-5	85.00	SALE	so-0070	Sale SO-000070	2026-09-03 13:03:00
mv-0637	org-walmart-demo	store-chn-001	prod-0029	SALE	-1	55.00	SALE	so-0070	Sale SO-000070	2026-09-03 13:03:00
mv-0638	org-walmart-demo	store-chn-001	prod-0030	SALE	-2	140.00	SALE	so-0070	Sale SO-000070	2026-09-03 13:03:00
mv-0639	org-walmart-demo	store-chn-001	prod-0031	SALE	-3	90.00	SALE	so-0070	Sale SO-000070	2026-09-03 13:03:00
mv-0640	org-walmart-demo	store-chn-001	prod-0032	SALE	-4	120.00	SALE	so-0070	Sale SO-000070	2026-09-03 13:03:00
mv-0641	org-walmart-demo	store-chn-001	prod-0033	SALE	-5	350.00	SALE	so-0070	Sale SO-000070	2026-09-03 13:03:00
mv-0642	org-walmart-demo	store-del-001	prod-0008	ADJUSTMENT	-5	\N	ADJUSTMENT	\N	Damaged goods - cola bottles broken	2026-09-09 10:24:00
mv-0643	org-walmart-demo	store-jpr-001	prod-0022	ADJUSTMENT	10	\N	ADJUSTMENT	\N	Stock recount correction - soap	2026-09-09 10:41:00
mv-0644	org-walmart-demo	store-mum-001	prod-0013	ADJUSTMENT	-8	\N	ADJUSTMENT	\N	Expired milk removed	2026-09-09 11:58:00
mv-0645	org-walmart-demo	store-pun-001	prod-0066	ADJUSTMENT	15	\N	ADJUSTMENT	\N	Recount correction - notebooks	2026-09-09 13:15:00
mv-0646	org-walmart-demo	store-del-001	prod-0001	TRANSFER_OUT	-20	390.00	TRANSFER	\N	Transfer to store-jpr-001	2026-09-14 13:32:00
mv-0647	org-walmart-demo	store-jpr-001	prod-0001	TRANSFER_IN	20	390.00	TRANSFER	\N	Transfer from store-del-001	2026-09-14 14:49:00
mv-0648	org-walmart-demo	store-mum-001	prod-0027	TRANSFER_OUT	-15	180.00	TRANSFER	\N	Transfer to store-pun-001	2026-09-14 04:06:00
mv-0649	org-walmart-demo	store-pun-001	prod-0027	TRANSFER_IN	15	180.00	TRANSFER	\N	Transfer from store-mum-001	2026-09-14 05:23:00
\.


--
-- Data for Name: JournalEntry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JournalEntry" (id, "organizationId", "entryNumber", "referenceType", "referenceId", description, "entryDate", "createdAt") FROM stdin;
je-0001	org-walmart-demo	JE-000001	SALE	so-0004	Sales revenue for SO-000004	2026-06-29 07:21:00	2026-06-29 07:21:00
je-0002	org-walmart-demo	JE-000002	SALE	so-0005	Sales revenue for SO-000005	2026-06-30 07:38:00	2026-06-30 07:38:00
je-0003	org-walmart-demo	JE-000003	SALE	so-0006	Sales revenue for SO-000006	2026-07-01 08:55:00	2026-07-01 08:55:00
je-0004	org-walmart-demo	JE-000004	SALE	so-0007	Sales revenue for SO-000007	2026-07-02 10:12:00	2026-07-02 10:12:00
je-0005	org-walmart-demo	JE-000005	SALE	so-0013	Sales revenue for SO-000013	2026-07-08 03:54:00	2026-07-08 03:54:00
je-0006	org-walmart-demo	JE-000006	SALE	so-0014	Sales revenue for SO-000014	2026-07-09 05:11:00	2026-07-09 05:11:00
je-0007	org-walmart-demo	JE-000007	SALE	so-0015	Sales revenue for SO-000015	2026-07-10 06:28:00	2026-07-10 06:28:00
je-0008	org-walmart-demo	JE-000008	SALE	so-0016	Sales revenue for SO-000016	2026-07-11 06:45:00	2026-07-11 06:45:00
je-0009	org-walmart-demo	JE-000009	SALE	so-0022	Sales revenue for SO-000022	2026-07-17 13:27:00	2026-07-17 13:27:00
je-0010	org-walmart-demo	JE-000010	SALE	so-0023	Sales revenue for SO-000023	2026-07-18 13:44:00	2026-07-18 13:44:00
je-0011	org-walmart-demo	JE-000011	SALE	so-0024	Sales revenue for SO-000024	2026-07-19 15:01:00	2026-07-19 15:01:00
je-0012	org-walmart-demo	JE-000012	SALE	so-0025	Sales revenue for SO-000025	2026-07-20 04:18:00	2026-07-20 04:18:00
je-0013	org-walmart-demo	JE-000013	SALE	so-0031	Sales revenue for SO-000031	2026-07-26 10:00:00	2026-07-26 10:00:00
je-0014	org-walmart-demo	JE-000014	SALE	so-0032	Sales revenue for SO-000032	2026-07-27 11:17:00	2026-07-27 11:17:00
je-0015	org-walmart-demo	JE-000015	SALE	so-0033	Sales revenue for SO-000033	2026-07-28 11:34:00	2026-07-28 11:34:00
je-0016	org-walmart-demo	JE-000016	PURCHASE	po-0004	Purchase order PO-000004 received	2026-07-15 07:21:00	2026-07-15 07:21:00
je-0017	org-walmart-demo	JE-000017	PURCHASE	po-0005	Purchase order PO-000005 received	2026-07-18 07:38:00	2026-07-18 07:38:00
je-0018	org-walmart-demo	JE-000018	PURCHASE	po-0006	Purchase order PO-000006 received	2026-07-21 08:55:00	2026-07-21 08:55:00
je-0019	org-walmart-demo	JE-000019	COGS	so-0004	Cost of goods sold for SO-000004	2026-06-29 07:21:00	2026-06-29 07:21:00
je-0020	org-walmart-demo	JE-000020	COGS	so-0005	Cost of goods sold for SO-000005	2026-06-30 07:38:00	2026-06-30 07:38:00
je-0021	org-walmart-demo	JE-000021	COGS	so-0006	Cost of goods sold for SO-000006	2026-07-01 08:55:00	2026-07-01 08:55:00
je-0022	org-walmart-demo	JE-000022	COGS	so-0007	Cost of goods sold for SO-000007	2026-07-02 10:12:00	2026-07-02 10:12:00
je-0023	org-walmart-demo	JE-000023	COGS	so-0013	Cost of goods sold for SO-000013	2026-07-08 03:54:00	2026-07-08 03:54:00
je-0024	org-walmart-demo	JE-000024	COGS	so-0014	Cost of goods sold for SO-000014	2026-07-09 05:11:00	2026-07-09 05:11:00
je-0025	org-walmart-demo	JE-000025	COGS	so-0015	Cost of goods sold for SO-000015	2026-07-10 06:28:00	2026-07-10 06:28:00
je-0026	org-walmart-demo	JE-000026	COGS	so-0016	Cost of goods sold for SO-000016	2026-07-11 06:45:00	2026-07-11 06:45:00
je-0027	org-walmart-demo	JE-000027	COGS	so-0022	Cost of goods sold for SO-000022	2026-07-17 13:27:00	2026-07-17 13:27:00
je-0028	org-walmart-demo	JE-000028	COGS	so-0023	Cost of goods sold for SO-000023	2026-07-18 13:44:00	2026-07-18 13:44:00
\.


--
-- Data for Name: JournalLine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JournalLine" (id, "journalEntryId", "accountId", debit, credit) FROM stdin;
jl-0011	je-0001	acc-1000	1696.65	0.00
jl-0013	je-0001	acc-4000	0.00	1566.00
jl-0014	je-0001	acc-2100	0.00	130.65
jl-0021	je-0002	acc-1000	3425.51	0.00
jl-0022	je-0002	acc-4100	164.00	0.00
jl-0023	je-0002	acc-4000	0.00	3280.00
jl-0024	je-0002	acc-2100	0.00	309.51
jl-0031	je-0003	acc-1000	3025.80	0.00
jl-0033	je-0003	acc-4000	0.00	2640.00
jl-0034	je-0003	acc-2100	0.00	385.80
jl-0041	je-0004	acc-1000	2547.02	0.00
jl-0043	je-0004	acc-4000	0.00	2114.00
jl-0044	je-0004	acc-2100	0.00	433.02
jl-0051	je-0005	acc-1000	18591.80	0.00
jl-0052	je-0005	acc-4100	829.25	0.00
jl-0053	je-0005	acc-4000	0.00	16585.00
jl-0054	je-0005	acc-2100	0.00	2836.05
jl-0061	je-0006	acc-1000	33843.58	0.00
jl-0063	je-0006	acc-4000	0.00	28681.00
jl-0064	je-0006	acc-2100	0.00	5162.58
jl-0071	je-0007	acc-1000	36201.22	0.00
jl-0073	je-0007	acc-4000	0.00	30679.00
jl-0074	je-0007	acc-2100	0.00	5522.22
jl-0081	je-0008	acc-1000	24106.22	0.00
jl-0083	je-0008	acc-4000	0.00	20429.00
jl-0084	je-0008	acc-2100	0.00	3677.22
jl-0091	je-0009	acc-1000	9873.06	0.00
jl-0093	je-0009	acc-4000	0.00	8367.00
jl-0094	je-0009	acc-2100	0.00	1506.06
jl-0101	je-0010	acc-1000	7809.24	0.00
jl-0103	je-0010	acc-4000	0.00	6618.00
jl-0104	je-0010	acc-2100	0.00	1191.24
jl-0111	je-0011	acc-1000	19263.50	0.00
jl-0113	je-0011	acc-4000	0.00	16325.00
jl-0114	je-0011	acc-2100	0.00	2938.50
jl-0121	je-0012	acc-1000	1395.65	0.00
jl-0122	je-0012	acc-4100	62.25	0.00
jl-0123	je-0012	acc-4000	0.00	1245.00
jl-0124	je-0012	acc-2100	0.00	212.90
jl-0131	je-0013	acc-1000	3912.35	0.00
jl-0133	je-0013	acc-4000	0.00	3732.00
jl-0134	je-0013	acc-2100	0.00	180.35
jl-0141	je-0014	acc-1000	5092.31	0.00
jl-0143	je-0014	acc-4000	0.00	4824.00
jl-0144	je-0014	acc-2100	0.00	268.31
jl-0151	je-0015	acc-1000	236.41	0.00
jl-0152	je-0015	acc-4100	11.85	0.00
jl-0153	je-0015	acc-4000	0.00	237.00
jl-0154	je-0015	acc-2100	0.00	11.26
jl-0161	je-0016	acc-1200	14550.00	0.00
jl-0162	je-0016	acc-1300	3099.00	0.00
jl-0163	je-0016	acc-2000	0.00	17649.00
jl-0171	je-0017	acc-1200	35525.00	0.00
jl-0172	je-0017	acc-1300	6394.50	0.00
jl-0173	je-0017	acc-2000	0.00	41919.50
jl-0181	je-0018	acc-1200	263400.00	0.00
jl-0182	je-0018	acc-1300	47412.00	0.00
jl-0183	je-0018	acc-2000	0.00	310812.00
jl-0191	je-0019	acc-5000	1132.00	0.00
jl-0192	je-0019	acc-1200	0.00	1132.00
jl-0201	je-0020	acc-5000	2520.00	0.00
jl-0202	je-0020	acc-1200	0.00	2520.00
jl-0211	je-0021	acc-5000	1951.00	0.00
jl-0212	je-0021	acc-1200	0.00	1951.00
jl-0221	je-0022	acc-5000	1470.00	0.00
jl-0222	je-0022	acc-1200	0.00	1470.00
jl-0231	je-0023	acc-5000	10480.00	0.00
jl-0232	je-0023	acc-1200	0.00	10480.00
jl-0241	je-0024	acc-5000	18970.00	0.00
jl-0242	je-0024	acc-1200	0.00	18970.00
jl-0251	je-0025	acc-5000	20300.00	0.00
jl-0252	je-0025	acc-1200	0.00	20300.00
jl-0261	je-0026	acc-5000	13370.00	0.00
jl-0262	je-0026	acc-1200	0.00	13370.00
jl-0271	je-0027	acc-5000	5385.00	0.00
jl-0272	je-0027	acc-1200	0.00	5385.00
jl-0281	je-0028	acc-5000	4130.00	0.00
jl-0282	je-0028	acc-1200	0.00	4130.00
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organization" (id, name, code, currency, timezone, status, "createdAt", "updatedAt") FROM stdin;
org-walmart-demo	Walmart Demo	WALMART-DEMO	INR	Asia/Kolkata	ACTIVE	2026-09-24 11:52:01.149	2026-09-24 11:52:01.149
\.


--
-- Data for Name: Partner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Partner" (id, "organizationId", name, type, phone, email, address, "taxId", "creditLimit", status, "createdAt", "updatedAt") FROM stdin;
partner-0001	org-walmart-demo	Raj Enterprises	SUPPLIER	+91 9800000001	raj@suppliers.local	Andheri, Mumbai	27AABCR0001A1Z5	500000.00	ACTIVE	2026-09-24 11:52:01.794	2026-09-24 11:52:01.794
partner-0002	org-walmart-demo	Sharma Distributors	DISTRIBUTOR	+91 9800000002	sharma@dist.local	Karol Bagh, Delhi	07AABCS0002B1Z3	750000.00	ACTIVE	2026-09-24 11:52:01.801	2026-09-24 11:52:01.801
partner-0003	org-walmart-demo	Patel Wholesale	WHOLESALER	+91 9800000003	patel@wholesale.local	SG Highway, Ahmedabad	24AABCP0003C1Z1	600000.00	ACTIVE	2026-09-24 11:52:01.805	2026-09-24 11:52:01.805
partner-0004	org-walmart-demo	Kumar Foods Pvt Ltd	SUPPLIER	+91 9800000004	kumar@foods.local	Koramangala, Bangalore	29AABCK0004D1Z9	400000.00	ACTIVE	2026-09-24 11:52:01.809	2026-09-24 11:52:01.809
partner-0005	org-walmart-demo	Singh Electronics	VENDOR	+91 9800000005	singh@elec.local	Nehru Place, Delhi	07AABCS0005E1Z7	800000.00	ACTIVE	2026-09-24 11:52:01.813	2026-09-24 11:52:01.813
partner-0006	org-walmart-demo	Gupta Textiles	SUPPLIER	+91 9800000006	gupta@textiles.local	Chandni Chowk, Delhi	07AABCG0006F1Z5	350000.00	ACTIVE	2026-09-24 11:52:01.817	2026-09-24 11:52:01.817
partner-0007	org-walmart-demo	Agarwal Home Supplies	WHOLESALER	+91 9800000007	agarwal@home.local	MG Road, Pune	27AABCA0007G1Z3	450000.00	ACTIVE	2026-09-24 11:52:01.821	2026-09-24 11:52:01.821
partner-0008	org-walmart-demo	Reddy FMCG	DISTRIBUTOR	+91 9800000008	reddy@fmcg.local	Jubilee Hills, Hyderabad	36AABCR0008H1Z1	550000.00	ACTIVE	2026-09-24 11:52:01.825	2026-09-24 11:52:01.825
partner-0009	org-walmart-demo	Jain Sports Equipments	VENDOR	+91 9800000009	jain@sports.local	Jayanagar, Bangalore	29AABCJ0009I1Z9	300000.00	ACTIVE	2026-09-24 11:52:01.828	2026-09-24 11:52:01.828
partner-0010	org-walmart-demo	Mehta Dairy Products	SUPPLIER	+91 9800000010	mehta@dairy.local	Anand, Gujarat	24AABCM0010J1Z7	400000.00	ACTIVE	2026-09-24 11:52:01.832	2026-09-24 11:52:01.832
partner-0011	org-walmart-demo	Bose Consumer Goods	WHOLESALER	+91 9800000011	bose@consumer.local	Salt Lake, Kolkata	19AABCB0011K1Z5	500000.00	ACTIVE	2026-09-24 11:52:01.836	2026-09-24 11:52:01.836
partner-0012	org-walmart-demo	Verma Pet Supplies	VENDOR	+91 9800000012	verma@pets.local	Indiranagar, Bangalore	29AABCV0012L1Z3	200000.00	ACTIVE	2026-09-24 11:52:01.841	2026-09-24 11:52:01.841
partner-0013	org-walmart-demo	Nair Cosmetics	SUPPLIER	+91 9800000013	nair@cosmetics.local	T Nagar, Chennai	33AABCN0013M1Z1	350000.00	ACTIVE	2026-09-24 11:52:01.845	2026-09-24 11:52:01.845
partner-0014	org-walmart-demo	Choudhury Bakery Supplies	DISTRIBUTOR	+91 9800000014	choud@bakery.local	Park Street, Kolkata	19AABCC0014N1Z9	250000.00	ACTIVE	2026-09-24 11:52:01.849	2026-09-24 11:52:01.849
partner-0015	org-walmart-demo	Iyer Kitchen Wares	VENDOR	+91 9800000015	iyer@kitchen.local	Mylapore, Chennai	33AABCI0015O1Z7	300000.00	ACTIVE	2026-09-24 11:52:01.853	2026-09-24 11:52:01.853
partner-0016	org-walmart-demo	Banerjee Furniture Co	SUPPLIER	+91 9800000016	baner@furniture.local	Howrah, Kolkata	19AABCB0016P1Z5	600000.00	ACTIVE	2026-09-24 11:52:01.858	2026-09-24 11:52:01.858
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "organizationId", "salesOrderId", amount, method, status, reference, "paidAt", "createdAt") FROM stdin;
pay-0001	org-walmart-demo	so-0002	579.00	UPI	PENDING	REF-PENDING-1	\N	2026-06-27 04:47:00
pay-0002	org-walmart-demo	so-0004	1696.65	UPI	PAID	REF-UPI-2	2026-06-29 07:21:00	2026-06-29 07:21:00
pay-0003	org-walmart-demo	so-0005	3425.51	BANK_TRANSFER	PAID	REF-BANK_TRANSFER-3	2026-06-30 07:38:00	2026-06-30 07:38:00
pay-0004	org-walmart-demo	so-0006	3025.80	UPI	PAID	REF-UPI-4	2026-07-01 08:55:00	2026-07-01 08:55:00
pay-0005	org-walmart-demo	so-0007	2547.02	CASH	PAID	REF-CASH-5	2026-07-02 10:12:00	2026-07-02 10:12:00
pay-0006	org-walmart-demo	so-0009	851.20	CARD	REFUNDED	REF-CARD-6	2026-07-04 11:46:00	2026-07-04 11:46:00
pay-0007	org-walmart-demo	so-0011	2572.40	UPI	PENDING	REF-PENDING-7	\N	2026-07-06 14:20:00
pay-0008	org-walmart-demo	so-0013	18591.80	CARD	PAID	REF-CARD-8	2026-07-08 03:54:00	2026-07-08 03:54:00
pay-0009	org-walmart-demo	so-0014	33843.58	UPI	PAID	REF-UPI-9	2026-07-09 05:11:00	2026-07-09 05:11:00
pay-0010	org-walmart-demo	so-0015	36201.22	BANK_TRANSFER	PAID	REF-BANK_TRANSFER-10	2026-07-10 06:28:00	2026-07-10 06:28:00
pay-0011	org-walmart-demo	so-0016	24106.22	UPI	PAID	REF-UPI-11	2026-07-11 06:45:00	2026-07-11 06:45:00
pay-0012	org-walmart-demo	so-0018	5773.74	CASH	REFUNDED	REF-CASH-12	2026-07-13 09:19:00	2026-07-13 09:19:00
pay-0013	org-walmart-demo	so-0020	12507.60	UPI	PENDING	REF-PENDING-13	\N	2026-07-15 10:53:00
pay-0014	org-walmart-demo	so-0022	9873.06	CASH	PAID	REF-CASH-14	2026-07-17 13:27:00	2026-07-17 13:27:00
pay-0015	org-walmart-demo	so-0023	7809.24	CARD	PAID	REF-CARD-15	2026-07-18 13:44:00	2026-07-18 13:44:00
pay-0016	org-walmart-demo	so-0024	19263.50	UPI	PAID	REF-UPI-16	2026-07-19 15:01:00	2026-07-19 15:01:00
pay-0017	org-walmart-demo	so-0025	1395.65	BANK_TRANSFER	PAID	REF-BANK_TRANSFER-17	2026-07-20 04:18:00	2026-07-20 04:18:00
pay-0018	org-walmart-demo	so-0027	3447.04	UPI	REFUNDED	REF-UPI-18	2026-07-22 05:52:00	2026-07-22 05:52:00
pay-0019	org-walmart-demo	so-0029	68057.05	UPI	PENDING	REF-PENDING-19	\N	2026-07-24 08:26:00
pay-0020	org-walmart-demo	so-0031	3912.35	CARD	PAID	REF-CARD-20	2026-07-26 10:00:00	2026-07-26 10:00:00
pay-0021	org-walmart-demo	so-0032	5092.31	CASH	PAID	REF-CASH-21	2026-07-27 11:17:00	2026-07-27 11:17:00
pay-0022	org-walmart-demo	so-0033	236.41	CARD	PAID	REF-CARD-22	2026-07-28 11:34:00	2026-07-28 11:34:00
pay-0023	org-walmart-demo	so-0034	1118.15	UPI	PAID	REF-UPI-23	2026-07-29 12:51:00	2026-07-29 12:51:00
pay-0024	org-walmart-demo	so-0036	1491.80	BANK_TRANSFER	REFUNDED	REF-BANK_TRANSFER-24	2026-07-31 15:25:00	2026-07-31 15:25:00
pay-0025	org-walmart-demo	so-0038	2904.96	UPI	PENDING	REF-PENDING-25	\N	2026-08-02 04:59:00
pay-0026	org-walmart-demo	so-0040	8431.10	CASH	PAID	REF-CASH-26	2026-08-04 06:33:00	2026-08-04 06:33:00
pay-0027	org-walmart-demo	so-0041	151.34	CARD	PAID	REF-CARD-27	2026-08-05 07:50:00	2026-08-05 07:50:00
pay-0028	org-walmart-demo	so-0042	3770.10	CASH	PAID	REF-CASH-28	2026-08-06 09:07:00	2026-08-06 09:07:00
pay-0029	org-walmart-demo	so-0043	17331.84	CARD	PAID	REF-CARD-29	2026-08-07 10:24:00	2026-08-07 10:24:00
pay-0030	org-walmart-demo	so-0045	28456.60	UPI	REFUNDED	REF-UPI-30	2026-08-09 11:58:00	2026-08-09 11:58:00
pay-0031	org-walmart-demo	so-0047	30302.40	UPI	PENDING	REF-PENDING-31	\N	2026-08-11 13:32:00
pay-0032	org-walmart-demo	so-0049	14792.72	UPI	PAID	REF-UPI-32	2026-08-13 04:06:00	2026-08-13 04:06:00
pay-0033	org-walmart-demo	so-0050	6223.35	CASH	PAID	REF-CASH-33	2026-08-14 05:23:00	2026-08-14 05:23:00
pay-0034	org-walmart-demo	so-0051	8035.55	CARD	PAID	REF-CARD-34	2026-08-15 05:40:00	2026-08-15 05:40:00
pay-0035	org-walmart-demo	so-0052	9369.20	CASH	PAID	REF-CASH-35	2026-08-16 06:57:00	2026-08-16 06:57:00
pay-0036	org-walmart-demo	so-0054	15317.58	CARD	REFUNDED	REF-CARD-36	2026-08-18 08:31:00	2026-08-18 08:31:00
pay-0037	org-walmart-demo	so-0056	9079.18	UPI	PENDING	REF-PENDING-37	\N	2026-08-20 11:05:00
pay-0038	org-walmart-demo	so-0058	2062.16	BANK_TRANSFER	PAID	REF-BANK_TRANSFER-38	2026-08-22 12:39:00	2026-08-22 12:39:00
pay-0039	org-walmart-demo	so-0059	6744.88	UPI	PAID	REF-UPI-39	2026-08-23 13:56:00	2026-08-23 13:56:00
pay-0040	org-walmart-demo	so-0060	87626.81	CASH	PAID	REF-CASH-40	2026-08-24 15:13:00	2026-08-24 15:13:00
pay-0041	org-walmart-demo	so-0061	2861.88	CARD	PAID	REF-CARD-41	2026-08-25 03:30:00	2026-08-25 03:30:00
pay-0042	org-walmart-demo	so-0063	3040.65	CASH	REFUNDED	REF-CASH-42	2026-08-27 06:04:00	2026-08-27 06:04:00
pay-0043	org-walmart-demo	so-0065	323.00	UPI	PENDING	REF-PENDING-43	\N	2026-08-29 07:38:00
pay-0044	org-walmart-demo	so-0067	1191.80	UPI	PAID	REF-UPI-44	2026-08-31 10:12:00	2026-08-31 10:12:00
pay-0045	org-walmart-demo	so-0068	1813.46	BANK_TRANSFER	PAID	REF-BANK_TRANSFER-45	2026-09-01 11:29:00	2026-09-01 11:29:00
pay-0046	org-walmart-demo	so-0069	2204.26	UPI	PAID	REF-UPI-46	2026-09-02 11:46:00	2026-09-02 11:46:00
pay-0047	org-walmart-demo	so-0070	5956.64	CASH	PAID	REF-CASH-47	2026-09-03 13:03:00	2026-09-03 13:03:00
pay-0048	org-walmart-demo	so-0072	30061.68	CARD	REFUNDED	REF-CARD-48	2026-09-05 14:37:00	2026-09-05 14:37:00
pay-0049	org-walmart-demo	so-0074	7541.38	UPI	PENDING	REF-PENDING-49	\N	2026-09-07 05:11:00
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, code, name, description) FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, "organizationId", "categoryId", sku, barcode, name, description, unit, "costPrice", "sellingPrice", "taxRate", "reorderLevel", status, image, "createdAt", "updatedAt") FROM stdin;
prod-0001	org-walmart-demo	cat-grocery	GRC-RICE-5KG	8901000000011	Premium Basmati Rice 5kg	\N	pcs	390.00	475.00	5.00	20	ACTIVE	\N	2026-09-24 11:52:01.412	2026-09-24 11:52:01.412
prod-0002	org-walmart-demo	cat-grocery	GRC-WHEAT-10K	8901000000028	Whole Wheat Atta 10kg	\N	pcs	340.00	425.00	5.00	25	ACTIVE	\N	2026-09-24 11:52:01.423	2026-09-24 11:52:01.423
prod-0003	org-walmart-demo	cat-grocery	GRC-DAAL-1KG	8901000000035	Toor Dal 1kg	\N	pcs	120.00	155.00	5.00	30	ACTIVE	\N	2026-09-24 11:52:01.429	2026-09-24 11:52:01.429
prod-0004	org-walmart-demo	cat-grocery	GRC-SUGAR-5KG	8901000000042	Refined Sugar 5kg	\N	pcs	195.00	240.00	5.00	20	ACTIVE	\N	2026-09-24 11:52:01.435	2026-09-24 11:52:01.435
prod-0005	org-walmart-demo	cat-grocery	GRC-SALT-1KG	8901000000059	Iodised Salt 1kg	\N	pcs	18.00	25.00	0.00	50	ACTIVE	\N	2026-09-24 11:52:01.44	2026-09-24 11:52:01.44
prod-0006	org-walmart-demo	cat-grocery	GRC-OIL-5L	8901000000066	Refined Sunflower Oil 5L	\N	pcs	580.00	699.00	5.00	15	ACTIVE	\N	2026-09-24 11:52:01.444	2026-09-24 11:52:01.444
prod-0007	org-walmart-demo	cat-grocery	GRC-MASALA-100	8901000000073	Garam Masala 100g	\N	pcs	55.00	79.00	5.00	40	ACTIVE	\N	2026-09-24 11:52:01.449	2026-09-24 11:52:01.449
prod-0008	org-walmart-demo	cat-beverages	BEV-COLA-500	8901000000080	Cola Soft Drink 500ml	\N	pcs	28.00	40.00	28.00	50	ACTIVE	\N	2026-09-24 11:52:01.453	2026-09-24 11:52:01.453
prod-0009	org-walmart-demo	cat-beverages	BEV-JUICE-1L	8901000000097	Mixed Fruit Juice 1L	\N	pcs	72.00	99.00	12.00	30	ACTIVE	\N	2026-09-24 11:52:01.457	2026-09-24 11:52:01.457
prod-0010	org-walmart-demo	cat-beverages	BEV-WATER-1L	8901000000104	Mineral Water 1L	\N	pcs	12.00	20.00	18.00	100	ACTIVE	\N	2026-09-24 11:52:01.461	2026-09-24 11:52:01.461
prod-0011	org-walmart-demo	cat-beverages	BEV-TEA-250G	8901000000111	Premium Tea Leaves 250g	\N	pcs	140.00	195.00	5.00	25	ACTIVE	\N	2026-09-24 11:52:01.465	2026-09-24 11:52:01.465
prod-0012	org-walmart-demo	cat-beverages	BEV-COFFEE-200	8901000000128	Instant Coffee 200g	\N	pcs	280.00	375.00	18.00	20	ACTIVE	\N	2026-09-24 11:52:01.469	2026-09-24 11:52:01.469
prod-0013	org-walmart-demo	cat-dairy	DRY-MILK-1L	8901000000135	Full Cream Milk 1L	\N	pcs	52.00	68.00	0.00	80	ACTIVE	\N	2026-09-24 11:52:01.473	2026-09-24 11:52:01.473
prod-0014	org-walmart-demo	cat-dairy	DRY-CURD-400G	8901000000142	Fresh Curd 400g	\N	pcs	30.00	45.00	0.00	60	ACTIVE	\N	2026-09-24 11:52:01.477	2026-09-24 11:52:01.477
prod-0015	org-walmart-demo	cat-dairy	DRY-PANR-200G	8901000000159	Fresh Paneer 200g	\N	pcs	65.00	90.00	0.00	40	ACTIVE	\N	2026-09-24 11:52:01.481	2026-09-24 11:52:01.481
prod-0016	org-walmart-demo	cat-dairy	DRY-GHEE-1L	8901000000166	Pure Desi Ghee 1L	\N	pcs	420.00	545.00	12.00	15	ACTIVE	\N	2026-09-24 11:52:01.485	2026-09-24 11:52:01.485
prod-0017	org-walmart-demo	cat-dairy	DRY-BUTTER-500	8901000000173	Salted Butter 500g	\N	pcs	210.00	270.00	12.00	25	ACTIVE	\N	2026-09-24 11:52:01.49	2026-09-24 11:52:01.49
prod-0018	org-walmart-demo	cat-bakery	BKY-BREAD-WHL	8901000000180	Whole Wheat Bread 400g	\N	pcs	32.00	45.00	0.00	50	ACTIVE	\N	2026-09-24 11:52:01.494	2026-09-24 11:52:01.494
prod-0019	org-walmart-demo	cat-bakery	BKY-BISCUIT-200	8901000000197	Cream Biscuits 200g	\N	pcs	20.00	30.00	18.00	60	ACTIVE	\N	2026-09-24 11:52:01.498	2026-09-24 11:52:01.498
prod-0020	org-walmart-demo	cat-bakery	BKY-CAKE-500	8901000000204	Chocolate Cake 500g	\N	pcs	180.00	250.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.502	2026-09-24 11:52:01.502
prod-0021	org-walmart-demo	cat-bakery	BKY-RUSK-300G	8901000000211	Toast Rusk 300g	\N	pcs	35.00	50.00	18.00	40	ACTIVE	\N	2026-09-24 11:52:01.506	2026-09-24 11:52:01.506
prod-0022	org-walmart-demo	cat-personal	PRC-SOAP-125G	8901000000228	Moisturising Soap 125g	\N	pcs	28.00	42.00	18.00	60	ACTIVE	\N	2026-09-24 11:52:01.511	2026-09-24 11:52:01.511
prod-0023	org-walmart-demo	cat-personal	PRC-SHAMP-200	8901000000235	Anti-Dandruff Shampoo 200ml	\N	pcs	140.00	199.00	18.00	30	ACTIVE	\N	2026-09-24 11:52:01.515	2026-09-24 11:52:01.515
prod-0024	org-walmart-demo	cat-personal	PRC-TOOTH-150	8901000000242	Herbal Toothpaste 150g	\N	pcs	55.00	85.00	18.00	40	ACTIVE	\N	2026-09-24 11:52:01.518	2026-09-24 11:52:01.518
prod-0025	org-walmart-demo	cat-personal	PRC-DEODR-150	8901000000259	Body Deodorant 150ml	\N	pcs	120.00	175.00	28.00	20	ACTIVE	\N	2026-09-24 11:52:01.523	2026-09-24 11:52:01.523
prod-0026	org-walmart-demo	cat-personal	PRC-RAZOR-5PK	8901000000266	Disposable Razor 5-Pack	\N	pcs	65.00	95.00	18.00	30	ACTIVE	\N	2026-09-24 11:52:01.527	2026-09-24 11:52:01.527
prod-0027	org-walmart-demo	cat-household	HLD-DETERG-2L	8901000000273	Liquid Detergent 2L	\N	pcs	180.00	245.00	18.00	20	ACTIVE	\N	2026-09-24 11:52:01.531	2026-09-24 11:52:01.531
prod-0028	org-walmart-demo	cat-household	HLD-FLOOR-1L	8901000000280	Floor Cleaner 1L	\N	pcs	85.00	125.00	18.00	25	ACTIVE	\N	2026-09-24 11:52:01.536	2026-09-24 11:52:01.536
prod-0029	org-walmart-demo	cat-household	HLD-TOILET-500	8901000000297	Toilet Cleaner 500ml	\N	pcs	55.00	79.00	18.00	30	ACTIVE	\N	2026-09-24 11:52:01.54	2026-09-24 11:52:01.54
prod-0030	org-walmart-demo	cat-household	HLD-TISSUE-6PK	8901000000303	Tissue Box 6-Pack	\N	pcs	140.00	199.00	18.00	25	ACTIVE	\N	2026-09-24 11:52:01.544	2026-09-24 11:52:01.544
prod-0031	org-walmart-demo	cat-household	HLD-TRASH-50PK	8901000000310	Garbage Bags 50-Pack	\N	pcs	90.00	135.00	18.00	20	ACTIVE	\N	2026-09-24 11:52:01.548	2026-09-24 11:52:01.548
prod-0032	org-walmart-demo	cat-mobile-acc	MOB-CASE-UNI	8901000000327	Universal Phone Case	\N	pcs	120.00	199.00	18.00	15	ACTIVE	\N	2026-09-24 11:52:01.552	2026-09-24 11:52:01.552
prod-0033	org-walmart-demo	cat-mobile-acc	MOB-CHRG-USBC	8901000000334	USB-C Fast Charger 25W	\N	pcs	350.00	549.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.557	2026-09-24 11:52:01.557
prod-0034	org-walmart-demo	cat-mobile-acc	MOB-SCGRD-TMP	8901000000341	Tempered Glass Screen Guard	\N	pcs	45.00	99.00	18.00	30	ACTIVE	\N	2026-09-24 11:52:01.561	2026-09-24 11:52:01.561
prod-0035	org-walmart-demo	cat-mobile-acc	MOB-PBANK-10K	8901000000358	Power Bank 10000mAh	\N	pcs	650.00	999.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.565	2026-09-24 11:52:01.565
prod-0036	org-walmart-demo	cat-audio	AUD-EARBUD-BT	8901000000365	Wireless Earbuds	\N	pcs	850.00	1299.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.569	2026-09-24 11:52:01.569
prod-0037	org-walmart-demo	cat-audio	AUD-HEADPHN-01	8901000000372	Over-Ear Headphones	\N	pcs	1200.00	1899.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.574	2026-09-24 11:52:01.574
prod-0038	org-walmart-demo	cat-audio	AUD-SPKR-BT-01	8901000000389	Bluetooth Speaker 10W	\N	pcs	950.00	1499.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.577	2026-09-24 11:52:01.577
prod-0039	org-walmart-demo	cat-comp-acc	CMP-MOUSE-WRL	8901000000396	Wireless Mouse	\N	pcs	380.00	599.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.581	2026-09-24 11:52:01.581
prod-0040	org-walmart-demo	cat-comp-acc	CMP-KYBRD-WRL	8901000000402	Wireless Keyboard	\N	pcs	680.00	1099.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.585	2026-09-24 11:52:01.585
prod-0041	org-walmart-demo	cat-comp-acc	CMP-USB-HUB-4	8901000000419	USB Hub 4-Port	\N	pcs	250.00	399.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.589	2026-09-24 11:52:01.589
prod-0042	org-walmart-demo	cat-comp-acc	CMP-WEBCAM-HD	8901000000426	HD Webcam 1080p	\N	pcs	1100.00	1699.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.593	2026-09-24 11:52:01.593
prod-0043	org-walmart-demo	cat-appliances	APL-IRON-1000W	8901000000433	Steam Iron 1000W	\N	pcs	850.00	1299.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.597	2026-09-24 11:52:01.597
prod-0044	org-walmart-demo	cat-appliances	APL-MIXR-750W	8901000000440	Mixer Grinder 750W	\N	pcs	2200.00	3199.00	18.00	3	ACTIVE	\N	2026-09-24 11:52:01.601	2026-09-24 11:52:01.601
prod-0045	org-walmart-demo	cat-appliances	APL-FAN-CEIL	8901000000457	Ceiling Fan 1200mm	\N	pcs	1400.00	2099.00	18.00	3	ACTIVE	\N	2026-09-24 11:52:01.606	2026-09-24 11:52:01.606
prod-0046	org-walmart-demo	cat-appliances	APL-HEATER-01	8901000000464	Room Heater 2000W	\N	pcs	1800.00	2699.00	18.00	2	ACTIVE	\N	2026-09-24 11:52:01.61	2026-09-24 11:52:01.61
prod-0047	org-walmart-demo	cat-appliances	APL-KETTLE-1L	8901000000471	Electric Kettle 1L	\N	pcs	550.00	849.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.614	2026-09-24 11:52:01.614
prod-0048	org-walmart-demo	cat-kitchen	KTN-PAN-NONSTK	8901000000488	Non-Stick Frying Pan 26cm	\N	pcs	450.00	699.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.618	2026-09-24 11:52:01.618
prod-0049	org-walmart-demo	cat-kitchen	KTN-PRESS-5L	8901000000495	Pressure Cooker 5L	\N	pcs	1200.00	1799.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.622	2026-09-24 11:52:01.622
prod-0050	org-walmart-demo	cat-kitchen	KTN-TIFFIN-3T	8901000000501	Stainless Steel Tiffin 3-Tier	\N	pcs	350.00	549.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.627	2026-09-24 11:52:01.627
prod-0051	org-walmart-demo	cat-kitchen	KTN-BOTTLE-1L	8901000000518	Insulated Water Bottle 1L	\N	pcs	280.00	449.00	18.00	15	ACTIVE	\N	2026-09-24 11:52:01.631	2026-09-24 11:52:01.631
prod-0052	org-walmart-demo	cat-kitchen	KTN-CONTAINER-SET	8901000000525	Storage Container Set 5pcs	\N	set	320.00	499.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.634	2026-09-24 11:52:01.634
prod-0053	org-walmart-demo	cat-furniture	FRN-CHAIR-PLST	8901000000532	Plastic Chair (Stackable)	\N	pcs	550.00	849.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.639	2026-09-24 11:52:01.639
prod-0054	org-walmart-demo	cat-furniture	FRN-TABLE-FOLD	8901000000549	Folding Table 4ft	\N	pcs	1800.00	2699.00	18.00	2	ACTIVE	\N	2026-09-24 11:52:01.643	2026-09-24 11:52:01.643
prod-0055	org-walmart-demo	cat-furniture	FRN-SHELF-3T	8901000000556	3-Tier Storage Shelf	\N	pcs	2200.00	3299.00	18.00	2	ACTIVE	\N	2026-09-24 11:52:01.647	2026-09-24 11:52:01.647
prod-0056	org-walmart-demo	cat-furniture	FRN-STOOL-WOD	8901000000563	Wooden Stool	\N	pcs	450.00	699.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.651	2026-09-24 11:52:01.651
prod-0057	org-walmart-demo	cat-clothing	CLT-TSHIRT-M	8901000000570	Cotton T-Shirt (M)	\N	pcs	180.00	299.00	5.00	20	ACTIVE	\N	2026-09-24 11:52:01.655	2026-09-24 11:52:01.655
prod-0058	org-walmart-demo	cat-clothing	CLT-JEANS-32	8901000000587	Denim Jeans (32)	\N	pcs	650.00	999.00	12.00	10	ACTIVE	\N	2026-09-24 11:52:01.659	2026-09-24 11:52:01.659
prod-0059	org-walmart-demo	cat-clothing	CLT-KURTA-L	8901000000594	Cotton Kurta (L)	\N	pcs	380.00	599.00	5.00	12	ACTIVE	\N	2026-09-24 11:52:01.663	2026-09-24 11:52:01.663
prod-0060	org-walmart-demo	cat-clothing	CLT-SAREE-SILK	8901000000600	Silk Saree	\N	pcs	1800.00	2799.00	5.00	5	ACTIVE	\N	2026-09-24 11:52:01.667	2026-09-24 11:52:01.667
prod-0061	org-walmart-demo	cat-clothing	CLT-SOCKS-3PK	8901000000617	Ankle Socks 3-Pack	\N	pcs	75.00	129.00	5.00	30	ACTIVE	\N	2026-09-24 11:52:01.671	2026-09-24 11:52:01.671
prod-0062	org-walmart-demo	cat-footwear	FTW-SANDAL-M9	8901000000624	Casual Sandals (9)	\N	pair	320.00	499.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.675	2026-09-24 11:52:01.675
prod-0063	org-walmart-demo	cat-footwear	FTW-SNEAKER-10	8901000000631	Running Sneakers (10)	\N	pair	1200.00	1899.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.679	2026-09-24 11:52:01.679
prod-0064	org-walmart-demo	cat-footwear	FTW-SLIPPER-8	8901000000648	Bathroom Slippers (8)	\N	pair	80.00	149.00	18.00	20	ACTIVE	\N	2026-09-24 11:52:01.683	2026-09-24 11:52:01.683
prod-0065	org-walmart-demo	cat-footwear	FTW-FORMAL-9	8901000000655	Formal Shoes (9)	\N	pair	1500.00	2299.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.687	2026-09-24 11:52:01.687
prod-0066	org-walmart-demo	cat-stationery	STN-NOTEBOOK-A4	8901000000662	Ruled Notebook A4 200pg	\N	pcs	45.00	75.00	18.00	30	ACTIVE	\N	2026-09-24 11:52:01.691	2026-09-24 11:52:01.691
prod-0067	org-walmart-demo	cat-stationery	STN-PEN-10PK	8901000000679	Ballpoint Pen 10-Pack	\N	pcs	55.00	89.00	18.00	40	ACTIVE	\N	2026-09-24 11:52:01.695	2026-09-24 11:52:01.695
prod-0068	org-walmart-demo	cat-stationery	STN-MARKER-SET	8901000000686	Highlighter Marker Set 5pcs	\N	set	80.00	129.00	18.00	20	ACTIVE	\N	2026-09-24 11:52:01.699	2026-09-24 11:52:01.699
prod-0069	org-walmart-demo	cat-stationery	STN-STAPLER-01	8901000000693	Desktop Stapler	\N	pcs	95.00	149.00	18.00	15	ACTIVE	\N	2026-09-24 11:52:01.703	2026-09-24 11:52:01.703
prod-0070	org-walmart-demo	cat-sports	SPT-CRICKET-BAT	8901000000709	Kashmir Willow Cricket Bat	\N	pcs	850.00	1399.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.707	2026-09-24 11:52:01.707
prod-0071	org-walmart-demo	cat-sports	SPT-FOOTBALL-5	8901000000716	Football Size 5	\N	pcs	380.00	599.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.711	2026-09-24 11:52:01.711
prod-0072	org-walmart-demo	cat-sports	SPT-YOGA-MAT	8901000000723	Yoga Mat 6mm	\N	pcs	320.00	499.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.715	2026-09-24 11:52:01.715
prod-0073	org-walmart-demo	cat-sports	SPT-SHUTTL-12	8901000000730	Badminton Shuttlecock 12-Pack	\N	pcs	150.00	249.00	18.00	15	ACTIVE	\N	2026-09-24 11:52:01.719	2026-09-24 11:52:01.719
prod-0074	org-walmart-demo	cat-sports	SPT-SKIPPING-R	8901000000747	Skipping Rope	\N	pcs	120.00	199.00	18.00	15	ACTIVE	\N	2026-09-24 11:52:01.723	2026-09-24 11:52:01.723
prod-0075	org-walmart-demo	cat-toys	TOY-LEGO-BASIC	8901000000754	Building Blocks Set 100pcs	\N	set	450.00	699.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.727	2026-09-24 11:52:01.727
prod-0076	org-walmart-demo	cat-toys	TOY-PUZZLE-500	8901000000761	Jigsaw Puzzle 500pcs	\N	pcs	280.00	449.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.731	2026-09-24 11:52:01.731
prod-0077	org-walmart-demo	cat-toys	TOY-REMCAR-01	8901000000778	Remote Control Car	\N	pcs	680.00	1099.00	18.00	5	ACTIVE	\N	2026-09-24 11:52:01.735	2026-09-24 11:52:01.735
prod-0078	org-walmart-demo	cat-toys	TOY-BOARD-LUDO	8901000000785	Ludo Board Game	\N	pcs	120.00	199.00	18.00	12	ACTIVE	\N	2026-09-24 11:52:01.739	2026-09-24 11:52:01.739
prod-0079	org-walmart-demo	cat-beauty	BTY-CREAM-50G	8901000000792	Moisturising Face Cream 50g	\N	pcs	150.00	225.00	28.00	20	ACTIVE	\N	2026-09-24 11:52:01.743	2026-09-24 11:52:01.743
prod-0080	org-walmart-demo	cat-beauty	BTY-LIPSTK-01	8901000000808	Matte Lipstick	\N	pcs	220.00	349.00	28.00	15	ACTIVE	\N	2026-09-24 11:52:01.747	2026-09-24 11:52:01.747
prod-0081	org-walmart-demo	cat-beauty	BTY-NAILP-SET	8901000000815	Nail Polish Set 6pcs	\N	set	180.00	299.00	28.00	10	ACTIVE	\N	2026-09-24 11:52:01.751	2026-09-24 11:52:01.751
prod-0082	org-walmart-demo	cat-beauty	BTY-EYELINER-01	8901000000822	Waterproof Eyeliner	\N	pcs	130.00	199.00	28.00	15	ACTIVE	\N	2026-09-24 11:52:01.755	2026-09-24 11:52:01.755
prod-0083	org-walmart-demo	cat-beauty	BTY-SUNSCR-50	8901000000839	Sunscreen SPF 50 100ml	\N	pcs	180.00	275.00	18.00	20	ACTIVE	\N	2026-09-24 11:52:01.76	2026-09-24 11:52:01.76
prod-0084	org-walmart-demo	cat-petcare	PET-DOGFD-5KG	8901000000846	Dog Food Premium 5kg	\N	pcs	850.00	1299.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.764	2026-09-24 11:52:01.764
prod-0085	org-walmart-demo	cat-petcare	PET-CATFD-3KG	8901000000853	Cat Food 3kg	\N	pcs	650.00	999.00	18.00	8	ACTIVE	\N	2026-09-24 11:52:01.768	2026-09-24 11:52:01.768
prod-0086	org-walmart-demo	cat-petcare	PET-LEASH-MED	8901000000860	Dog Leash Medium	\N	pcs	180.00	299.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.773	2026-09-24 11:52:01.773
prod-0087	org-walmart-demo	cat-petcare	PET-SHAMP-500	8901000000877	Pet Shampoo 500ml	\N	pcs	140.00	225.00	18.00	10	ACTIVE	\N	2026-09-24 11:52:01.777	2026-09-24 11:52:01.777
prod-0088	org-walmart-demo	cat-appliances	APL-MICROWAVE-20L	8901000000884	Microwave Oven 20L	\N	pcs	5500.00	7999.00	18.00	2	ACTIVE	\N	2026-09-24 11:52:01.781	2026-09-24 11:52:01.781
prod-0089	org-walmart-demo	cat-electronics	ELC-TABLET-10	8901000000891	Android Tablet 10 inch	\N	pcs	8500.00	12999.00	18.00	2	ACTIVE	\N	2026-09-24 11:52:01.785	2026-09-24 11:52:01.785
prod-0090	org-walmart-demo	cat-appliances	APL-AIRPURIF-01	8901000000907	Air Purifier HEPA	\N	pcs	6500.00	9999.00	18.00	1	ACTIVE	\N	2026-09-24 11:52:01.79	2026-09-24 11:52:01.79
\.


--
-- Data for Name: PurchaseOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseOrder" (id, "organizationId", "storeId", "partnerId", "orderNumber", status, subtotal, tax, total, "createdAt", "updatedAt") FROM stdin;
po-0001	org-walmart-demo	store-del-001	partner-0001	PO-000001	DRAFT	9000.00	450.00	9450.00	2026-07-06 03:30:00	2026-07-06 03:30:00
po-0002	org-walmart-demo	store-jpr-001	partner-0002	PO-000002	ORDERED	2160.00	344.40	2504.40	2026-07-09 04:47:00	2026-07-09 04:47:00
po-0003	org-walmart-demo	store-mum-001	partner-0003	PO-000003	PARTIALLY_RECEIVED	19220.00	2016.00	21236.00	2026-07-12 06:04:00	2026-07-12 06:04:00
po-0004	org-walmart-demo	store-pun-001	partner-0004	PO-000004	RECEIVED	14550.00	3099.00	17649.00	2026-07-15 07:21:00	2026-07-15 07:21:00
po-0005	org-walmart-demo	store-blr-001	partner-0005	PO-000005	RECEIVED	35525.00	6394.50	41919.50	2026-07-18 07:38:00	2026-07-18 07:38:00
po-0006	org-walmart-demo	store-chn-001	partner-0006	PO-000006	RECEIVED	263400.00	47412.00	310812.00	2026-07-21 08:55:00	2026-07-21 08:55:00
po-0007	org-walmart-demo	store-kol-001	partner-0007	PO-000007	CANCELLED	474500.00	85410.00	559910.00	2026-07-24 10:12:00	2026-07-24 10:12:00
po-0008	org-walmart-demo	store-gwh-001	partner-0008	PO-000008	DRAFT	29750.00	5355.00	35105.00	2026-07-27 11:29:00	2026-07-27 11:29:00
po-0009	org-walmart-demo	store-del-001	partner-0009	PO-000009	ORDERED	67550.00	5880.00	73430.00	2026-07-30 11:46:00	2026-07-30 11:46:00
po-0010	org-walmart-demo	store-jpr-001	partner-0010	PO-000010	PARTIALLY_RECEIVED	101175.00	18211.50	119386.50	2026-08-02 13:03:00	2026-08-02 13:03:00
po-0011	org-walmart-demo	store-mum-001	partner-0011	PO-000011	RECEIVED	99100.00	17838.00	116938.00	2026-08-05 14:20:00	2026-08-05 14:20:00
po-0012	org-walmart-demo	store-pun-001	partner-0012	PO-000012	RECEIVED	76450.00	19006.00	95456.00	2026-08-08 14:37:00	2026-08-08 14:37:00
po-0013	org-walmart-demo	store-blr-001	partner-0013	PO-000013	RECEIVED	1959200.00	347586.00	2306786.00	2026-08-11 03:54:00	2026-08-11 03:54:00
po-0014	org-walmart-demo	store-chn-001	partner-0014	PO-000014	CANCELLED	124755.00	7387.35	132142.35	2026-08-14 05:11:00	2026-08-14 05:11:00
po-0015	org-walmart-demo	store-kol-001	partner-0015	PO-000015	DRAFT	6780.00	874.80	7654.80	2026-08-17 06:28:00	2026-08-17 06:28:00
po-0016	org-walmart-demo	store-gwh-001	partner-0016	PO-000016	ORDERED	57640.00	6552.00	64192.00	2026-08-20 06:45:00	2026-08-20 06:45:00
po-0017	org-walmart-demo	store-del-001	partner-0001	PO-000017	PARTIALLY_RECEIVED	36650.00	7797.00	44447.00	2026-08-23 08:02:00	2026-08-23 08:02:00
po-0018	org-walmart-demo	store-jpr-001	partner-0002	PO-000018	RECEIVED	78575.00	14143.50	92718.50	2026-08-26 09:19:00	2026-08-26 09:19:00
po-0019	org-walmart-demo	store-mum-001	partner-0003	PO-000019	RECEIVED	507250.00	91305.00	598555.00	2026-08-29 09:36:00	2026-08-29 09:36:00
po-0020	org-walmart-demo	store-pun-001	partner-0004	PO-000020	RECEIVED	917500.00	165150.00	1082650.00	2026-09-01 10:53:00	2026-09-01 10:53:00
po-0021	org-walmart-demo	store-blr-001	partner-0005	PO-000021	CANCELLED	824800.00	139533.00	964333.00	2026-09-04 12:10:00	2026-09-04 12:10:00
po-0022	org-walmart-demo	store-chn-001	partner-0006	PO-000022	DRAFT	120350.00	11250.00	131600.00	2026-09-07 13:27:00	2026-09-07 13:27:00
po-0023	org-walmart-demo	store-kol-001	partner-0007	PO-000023	ORDERED	192775.00	34699.50	227474.50	2026-09-10 13:44:00	2026-09-10 13:44:00
po-0024	org-walmart-demo	store-gwh-001	partner-0008	PO-000024	PARTIALLY_RECEIVED	138700.00	24966.00	163666.00	2026-09-13 15:01:00	2026-09-13 15:01:00
po-0025	org-walmart-demo	store-del-001	partner-0009	PO-000025	RECEIVED	120250.00	30970.00	151220.00	2026-09-16 04:18:00	2026-09-16 04:18:00
\.


--
-- Data for Name: PurchaseOrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseOrderItem" (id, "purchaseOrderId", "productId", quantity, "unitCost", tax, total) FROM stdin;
a2a01384-d93b-4c59-a480-8a5a95f9bb7f	po-0001	prod-0001	10	390.00	195.00	4095.00
8319c9d5-017e-43e6-817d-befa7d334bb2	po-0001	prod-0002	15	340.00	255.00	5355.00
e180a951-67b5-4602-bb04-99d5499586c9	po-0002	prod-0008	15	28.00	117.60	537.60
055f9ba3-4a36-4bce-afa2-96d35d2ea880	po-0002	prod-0009	20	72.00	172.80	1612.80
2c971b17-b3f0-447c-8ad3-20ca46dfd4e2	po-0002	prod-0010	25	12.00	54.00	354.00
188304b9-2451-4b28-bea8-15da0593e103	po-0003	prod-0015	20	65.00	0.00	1300.00
374802cb-a633-4dd5-880c-6c47d53a5dc6	po-0003	prod-0016	25	420.00	1260.00	11760.00
fe447b7e-04af-4bfb-bf76-0bafdb287973	po-0003	prod-0017	30	210.00	756.00	7056.00
7b9aa669-75bc-451a-95b6-bda8c7a5baa5	po-0003	prod-0018	35	32.00	0.00	1120.00
f6ce9af3-41d9-48a5-aee0-fe82ad333d64	po-0004	prod-0022	25	28.00	126.00	826.00
f6d8f696-a228-4a98-b98f-5fb954273eb6	po-0004	prod-0023	30	140.00	756.00	4956.00
d160e9e4-b4d4-438b-aecc-8ed7da0acf55	po-0004	prod-0024	35	55.00	346.50	2271.50
ce6b7896-4f31-4077-8383-d74500819f3f	po-0004	prod-0025	40	120.00	1344.00	6144.00
704d86c9-e540-4528-b6af-80c0f167fa8e	po-0004	prod-0026	45	65.00	526.50	3451.50
68bfddc0-9574-49b4-9e98-345ee956160d	po-0005	prod-0029	30	55.00	297.00	1947.00
ee1851ce-27a0-49e5-8efd-f62702b71e38	po-0005	prod-0030	35	140.00	882.00	5782.00
8f5a23f2-6adb-4d6d-8fd5-1ee9875ba000	po-0005	prod-0031	40	90.00	648.00	4248.00
0174dd4c-d335-4a1e-8cc0-4bee00cf67fc	po-0005	prod-0032	45	120.00	972.00	6372.00
1b70860f-67ea-4ca7-a05a-c39f60287a18	po-0005	prod-0033	50	350.00	3150.00	20650.00
7ae952f5-45ef-490a-9a4b-bf139ee65ff4	po-0005	prod-0034	55	45.00	445.50	2920.50
2ac6cfa3-f5ed-42d7-b671-b464d201d400	po-0006	prod-0036	35	850.00	5355.00	35105.00
cfbdbbc8-8d5c-4b63-9d61-099411f614ac	po-0006	prod-0037	40	1200.00	8640.00	56640.00
e54749a6-3e57-4a15-86c9-d4e6403022aa	po-0006	prod-0038	45	950.00	7695.00	50445.00
ac99b066-ec2d-4c4e-b360-5d3e978f3cd3	po-0006	prod-0039	50	380.00	3420.00	22420.00
dc42614f-5a38-421d-9394-ddc83a45a833	po-0006	prod-0040	55	680.00	6732.00	44132.00
90c5cd4c-b710-4cdb-8256-23261fc59738	po-0006	prod-0041	60	250.00	2700.00	17700.00
c2effdd8-a80b-4a6c-8292-662b776236c4	po-0006	prod-0042	65	1100.00	12870.00	84370.00
831782ac-f8af-4ec6-bad5-7c961b330963	po-0007	prod-0043	40	850.00	6120.00	40120.00
39ee6930-f07d-40e6-addc-1fd7294fbb56	po-0007	prod-0044	45	2200.00	17820.00	116820.00
aef2d519-7b2d-4489-8e18-c1b2d980131a	po-0007	prod-0045	50	1400.00	12600.00	82600.00
7fd72a82-cefb-4fe7-9e95-230fe163bb66	po-0007	prod-0046	55	1800.00	17820.00	116820.00
4eaaad2f-ce6e-4003-be4e-e507577ce6ff	po-0007	prod-0047	60	550.00	5940.00	38940.00
d4c6e7f7-6930-400f-806d-bd74fe3bb9d3	po-0007	prod-0048	65	450.00	5265.00	34515.00
da37da74-c73b-4b15-95c3-5e5726b8a419	po-0007	prod-0049	70	1200.00	15120.00	99120.00
f3186c3b-0285-4a2c-b720-501185acaca3	po-0007	prod-0050	75	350.00	4725.00	30975.00
309cadc1-2b16-47c8-aa41-89a03ddfa52b	po-0008	prod-0050	45	350.00	2835.00	18585.00
90161aab-d034-4d03-a558-93742bac27fb	po-0008	prod-0051	50	280.00	2520.00	16520.00
2f26b03e-5e10-47f8-9037-5b219f8ecefe	po-0009	prod-0057	50	180.00	450.00	9450.00
5eb3bbf0-f53b-4540-8fb6-3d91b1235fa4	po-0009	prod-0058	55	650.00	4290.00	40040.00
05da0069-9481-4a90-8ff8-effdfdfa93ea	po-0009	prod-0059	60	380.00	1140.00	23940.00
29610f48-37b1-44ad-909c-c3e4d3f5a0d4	po-0010	prod-0064	55	80.00	792.00	5192.00
9f565580-cb8d-4451-a9b9-0512d846c0fe	po-0010	prod-0065	60	1500.00	16200.00	106200.00
b7f8cfc8-8b3e-4a94-ac4b-8fec2edd5222	po-0010	prod-0066	65	45.00	526.50	3451.50
0075c0ad-c713-4020-84c8-92023aeaf733	po-0010	prod-0067	70	55.00	693.00	4543.00
b2a35fa0-6eaa-4a02-96db-1d708838cca3	po-0011	prod-0071	60	380.00	4104.00	26904.00
bba75e29-e897-447e-bbf6-7adfb869162b	po-0011	prod-0072	65	320.00	3744.00	24544.00
7866e3c4-edc6-482d-8dfa-1953ccdc373b	po-0011	prod-0073	70	150.00	1890.00	12390.00
4b51fc9e-9a98-4eaf-97f1-99e2fec25c5f	po-0011	prod-0074	75	120.00	1620.00	10620.00
161d2eae-84ef-4f0f-9751-c1f0ceeee7ff	po-0011	prod-0075	80	450.00	6480.00	42480.00
6e5de9c7-5e5f-489f-99f5-e534ad988784	po-0012	prod-0078	65	120.00	1404.00	9204.00
92b8939f-5126-4aa8-aefc-9361c8f549e1	po-0012	prod-0079	70	150.00	2940.00	13440.00
c2d70db5-2670-41cc-ada2-76aff4cc24fa	po-0012	prod-0080	75	220.00	4620.00	21120.00
88ed7db7-0a60-41d4-af5a-cb55fb3cd0e8	po-0012	prod-0081	80	180.00	4032.00	18432.00
daf3b06f-5e12-46fa-a521-04fd03e6f889	po-0012	prod-0082	85	130.00	3094.00	14144.00
2aa41e12-abc5-41d2-8ce0-097adf7d4851	po-0012	prod-0083	90	180.00	2916.00	19116.00
b7d57034-ef7b-4e0a-b47a-df521f0939c7	po-0013	prod-0085	70	650.00	8190.00	53690.00
15dccd7c-061b-4143-bd93-bda420c4f41e	po-0013	prod-0086	75	180.00	2430.00	15930.00
dfc8bcd5-93e0-414b-987b-51aa6dd40b60	po-0013	prod-0087	80	140.00	2016.00	13216.00
e784ed8b-7dbc-4c9d-a6ca-6159506b46dd	po-0013	prod-0088	85	5500.00	84150.00	551650.00
92097836-9c3a-43de-82e5-f004404d21af	po-0013	prod-0089	90	8500.00	137700.00	902700.00
8d1bf1cf-2514-47f3-acd1-3c16834bfa48	po-0013	prod-0090	95	6500.00	111150.00	728650.00
31d054a2-4f8a-4f75-a6fe-fd499c56817a	po-0013	prod-0001	100	390.00	1950.00	40950.00
3a72752f-4a19-437c-926a-50faf2608840	po-0014	prod-0002	75	340.00	1275.00	26775.00
3dadbbe0-7895-482d-85f2-cd0d6a74feae	po-0014	prod-0003	80	120.00	480.00	10080.00
2b1c1705-5a67-450d-91d0-5fafdcd378ae	po-0014	prod-0004	85	195.00	828.75	17403.75
6bf86b11-c765-4fc1-bc6b-bfadbe1296e8	po-0014	prod-0005	90	18.00	0.00	1620.00
ac246e5d-6be7-449d-b527-261e86f90b4e	po-0014	prod-0006	95	580.00	2755.00	57855.00
3c808abd-10fc-46f1-b18b-b69fddd5c442	po-0014	prod-0007	100	55.00	275.00	5775.00
be9a55ce-7fac-473a-9032-92a7d671c405	po-0014	prod-0008	105	28.00	823.20	3763.20
b89b4760-d67e-4ee1-96cf-fa0f836d5f4a	po-0014	prod-0009	110	72.00	950.40	8870.40
95450d39-ad83-4feb-a2dc-f699dfeb3aaa	po-0015	prod-0009	80	72.00	691.20	6451.20
106ee0e8-20dc-4276-9c18-8b0e13698df3	po-0015	prod-0010	85	12.00	183.60	1203.60
7dcd85fe-af9f-4d24-92df-9baaa1eb4543	po-0016	prod-0016	85	420.00	4284.00	39984.00
9e326655-09ae-450c-8f1c-eb2bfd4d0a89	po-0016	prod-0017	90	210.00	2268.00	21168.00
43216e1e-6cdc-4bf4-b210-5c5da57285fe	po-0016	prod-0018	95	32.00	0.00	3040.00
ab790725-f284-4379-be86-6a9613938ba4	po-0017	prod-0023	90	140.00	2268.00	14868.00
b9bb75cf-8083-4f4d-b9ad-e5506ad6fd7b	po-0017	prod-0024	95	55.00	940.50	6165.50
1cf745b8-0fdb-4b88-a110-ff9339179297	po-0017	prod-0025	100	120.00	3360.00	15360.00
3e78f3c1-834e-4cf1-9c57-e83f2082f949	po-0017	prod-0026	105	65.00	1228.50	8053.50
02c10cf8-1c72-4d99-8b0b-44732b2a3dbf	po-0018	prod-0030	95	140.00	2394.00	15694.00
3f18630e-43d6-4fa1-aac7-b446fcfa934f	po-0018	prod-0031	100	90.00	1620.00	10620.00
308f80cc-fc04-4c31-bdad-324fc667b30e	po-0018	prod-0032	105	120.00	2268.00	14868.00
ff4682bc-5572-437f-856e-b5280a9f87ea	po-0018	prod-0033	110	350.00	6930.00	45430.00
2de9ac3c-2005-4388-8c80-ef92f5873eac	po-0018	prod-0034	115	45.00	931.50	6106.50
f35fadaa-f723-4534-9ca2-71af922d733e	po-0019	prod-0037	100	1200.00	21600.00	141600.00
767e0134-5300-47b3-a4c6-7a246e506b38	po-0019	prod-0038	105	950.00	17955.00	117705.00
d76f2b02-3b92-4ab2-8a97-0d4693ed18bf	po-0019	prod-0039	110	380.00	7524.00	49324.00
879a6219-55f0-40d7-8b07-adb798ffc6f7	po-0019	prod-0040	115	680.00	14076.00	92276.00
8920dcca-6f06-45a8-9300-1123f19ef90d	po-0019	prod-0041	120	250.00	5400.00	35400.00
ee321575-be91-4812-9f25-c930fea96bae	po-0019	prod-0042	125	1100.00	24750.00	162250.00
a4895cbc-cdee-471b-82d4-15b62759b8c2	po-0020	prod-0044	105	2200.00	41580.00	272580.00
da3ac15c-8c11-498f-ba78-c4a3cef446ab	po-0020	prod-0045	110	1400.00	27720.00	181720.00
56068e4c-67fc-4ebf-a263-ac7373c05c99	po-0020	prod-0046	115	1800.00	37260.00	244260.00
8ce5b0e0-1e7a-445c-96a8-9a740163a645	po-0020	prod-0047	120	550.00	11880.00	77880.00
5a0569c4-f369-42b4-a7e1-295f40dead5d	po-0020	prod-0048	125	450.00	10125.00	66375.00
d4891861-6e2e-4613-8b9a-7a725dfcbc23	po-0020	prod-0049	130	1200.00	28080.00	184080.00
ef8c2a8a-28e9-43fa-aef1-731a25e4f071	po-0020	prod-0050	135	350.00	8505.00	55755.00
ce51fbbb-30bb-496d-974b-d5c7970b0039	po-0021	prod-0051	110	280.00	5544.00	36344.00
af791861-23d5-4d9b-b990-8f68b05c2f28	po-0021	prod-0052	115	320.00	6624.00	43424.00
671da3b7-77e4-488a-a4d9-4f82544673a3	po-0021	prod-0053	120	550.00	11880.00	77880.00
6a39e056-b9c4-4fd6-a38a-6958f1c6f5f6	po-0021	prod-0054	125	1800.00	40500.00	265500.00
60286aee-b472-43ca-957e-975dac7c586e	po-0021	prod-0055	130	2200.00	51480.00	337480.00
c0a0c139-c283-4627-b56a-ab47b0433b15	po-0021	prod-0056	135	450.00	10935.00	71685.00
e8419ee5-12a3-40cb-9c50-e064f19043e9	po-0021	prod-0057	140	180.00	1260.00	26460.00
5f31aca2-e438-4a32-8704-da46368bae68	po-0021	prod-0058	145	650.00	11310.00	105560.00
78385ed8-88ea-43f2-8ef6-d95f9a2f2c9e	po-0022	prod-0058	115	650.00	8970.00	83720.00
39452699-30a8-467f-8317-794458e50ab4	po-0022	prod-0059	120	380.00	2280.00	47880.00
db44cca6-ebe3-4a99-b4c2-09ffceff0e70	po-0023	prod-0065	120	1500.00	32400.00	212400.00
14b4f104-3a22-467f-9702-d81289285dee	po-0023	prod-0066	125	45.00	1012.50	6637.50
fb874119-14ac-4594-8cc1-eef35122d484	po-0023	prod-0067	130	55.00	1287.00	8437.00
48f25387-9ecc-41d1-b522-4cbfb8f7e0c8	po-0024	prod-0072	125	320.00	7200.00	47200.00
4d345339-9559-45b1-8617-75a9990a26f4	po-0024	prod-0073	130	150.00	3510.00	23010.00
8f40670d-c13f-43eb-be7d-700fd2250c6c	po-0024	prod-0074	135	120.00	2916.00	19116.00
ffebe06f-1b33-4bfc-b0fc-db9436081fed	po-0024	prod-0075	140	450.00	11340.00	74340.00
11bf8709-fec8-4f0f-99dd-91e4c7033703	po-0025	prod-0079	130	150.00	5460.00	24960.00
22e1d1dc-594e-4d34-a81e-dbe71382acce	po-0025	prod-0080	135	220.00	8316.00	38016.00
8f18f153-6e5d-42df-8d05-32e3d59da772	po-0025	prod-0081	140	180.00	7056.00	32256.00
899f63fe-9f9e-4316-aa7b-aa58eff913d8	po-0025	prod-0082	145	130.00	5278.00	24128.00
40dc47d5-dc26-4bbf-9cc2-f32c87255eaf	po-0025	prod-0083	150	180.00	4860.00	31860.00
\.


--
-- Data for Name: Region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Region" (id, "organizationId", name, code, status, "createdAt", "updatedAt") FROM stdin;
region-north	org-walmart-demo	North India	NORTH	ACTIVE	2026-09-24 11:52:01.217	2026-09-24 11:52:01.217
region-south	org-walmart-demo	South India	SOUTH	ACTIVE	2026-09-24 11:52:01.224	2026-09-24 11:52:01.224
region-west	org-walmart-demo	West India	WEST	ACTIVE	2026-09-24 11:52:01.229	2026-09-24 11:52:01.229
region-east	org-walmart-demo	East India	EAST	ACTIVE	2026-09-24 11:52:01.234	2026-09-24 11:52:01.234
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description, "createdAt", "updatedAt") FROM stdin;
role-demo-admin	Demo Administrator	Full demo access	2026-09-24 11:52:01.2	2026-09-24 11:52:01.2
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" ("roleId", "permissionId") FROM stdin;
\.


--
-- Data for Name: SalesOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SalesOrder" (id, "organizationId", "storeId", "customerId", "orderNumber", status, subtotal, discount, tax, total, "createdAt", "updatedAt") FROM stdin;
so-0001	org-walmart-demo	store-del-001	\N	SO-000001	DRAFT	475.00	23.75	22.56	473.81	2026-06-26 03:30:00	2026-06-26 03:30:00
so-0002	org-walmart-demo	store-jpr-001	cust-0002	SO-000002	CONFIRMED	555.00	0.00	24.00	579.00	2026-06-27 04:47:00	2026-06-27 04:47:00
so-0003	org-walmart-demo	store-mum-001	cust-0003	SO-000003	PROCESSING	892.00	0.00	116.05	1008.05	2026-06-28 06:04:00	2026-06-28 06:04:00
so-0004	org-walmart-demo	store-pun-001	cust-0004	SO-000004	COMPLETED	1566.00	0.00	130.65	1696.65	2026-06-29 07:21:00	2026-06-29 07:21:00
so-0005	org-walmart-demo	store-blr-001	cust-0005	SO-000005	COMPLETED	3280.00	164.00	309.51	3425.51	2026-06-30 07:38:00	2026-06-30 07:38:00
so-0006	org-walmart-demo	store-chn-001	\N	SO-000006	COMPLETED	2640.00	0.00	385.80	3025.80	2026-07-01 08:55:00	2026-07-01 08:55:00
so-0007	org-walmart-demo	store-kol-001	cust-0007	SO-000007	COMPLETED	2114.00	0.00	433.02	2547.02	2026-07-02 10:12:00	2026-07-02 10:12:00
so-0008	org-walmart-demo	store-gwh-001	cust-0008	SO-000008	CANCELLED	3342.00	0.00	619.06	3961.06	2026-07-03 11:29:00	2026-07-03 11:29:00
so-0009	org-walmart-demo	store-del-001	cust-0009	SO-000009	REFUNDED	700.00	35.00	186.20	851.20	2026-07-04 11:46:00	2026-07-04 11:46:00
so-0010	org-walmart-demo	store-jpr-001	cust-0010	SO-000010	DRAFT	704.00	0.00	126.72	830.72	2026-07-05 13:03:00	2026-07-05 13:03:00
so-0011	org-walmart-demo	store-mum-001	\N	SO-000011	CONFIRMED	2180.00	0.00	392.40	2572.40	2026-07-06 14:20:00	2026-07-06 14:20:00
so-0012	org-walmart-demo	store-pun-001	cust-0012	SO-000012	PROCESSING	17886.00	0.00	3219.48	21105.48	2026-07-07 14:37:00	2026-07-07 14:37:00
so-0013	org-walmart-demo	store-blr-001	cust-0013	SO-000013	COMPLETED	16585.00	829.25	2836.05	18591.80	2026-07-08 03:54:00	2026-07-08 03:54:00
so-0014	org-walmart-demo	store-chn-001	cust-0014	SO-000014	COMPLETED	28681.00	0.00	5162.58	33843.58	2026-07-09 05:11:00	2026-07-09 05:11:00
so-0015	org-walmart-demo	store-kol-001	cust-0015	SO-000015	COMPLETED	30679.00	0.00	5522.22	36201.22	2026-07-10 06:28:00	2026-07-10 06:28:00
so-0016	org-walmart-demo	store-gwh-001	\N	SO-000016	COMPLETED	20429.00	0.00	3677.22	24106.22	2026-07-11 06:45:00	2026-07-11 06:45:00
so-0017	org-walmart-demo	store-del-001	cust-0017	SO-000017	CANCELLED	3598.00	179.90	615.26	4033.36	2026-07-12 08:02:00	2026-07-12 08:02:00
so-0018	org-walmart-demo	store-jpr-001	cust-0018	SO-000018	REFUNDED	4893.00	0.00	880.74	5773.74	2026-07-13 09:19:00	2026-07-13 09:19:00
so-0019	org-walmart-demo	store-mum-001	cust-0019	SO-000019	DRAFT	16990.00	0.00	3019.33	20009.33	2026-07-14 09:36:00	2026-07-14 09:36:00
so-0020	org-walmart-demo	store-pun-001	cust-0020	SO-000020	CONFIRMED	11579.00	0.00	928.60	12507.60	2026-07-15 10:53:00	2026-07-15 10:53:00
so-0021	org-walmart-demo	store-blr-001	\N	SO-000021	PROCESSING	18915.00	945.75	3218.55	21187.80	2026-07-16 12:10:00	2026-07-16 12:10:00
so-0022	org-walmart-demo	store-chn-001	cust-0022	SO-000022	COMPLETED	8367.00	0.00	1506.06	9873.06	2026-07-17 13:27:00	2026-07-17 13:27:00
so-0023	org-walmart-demo	store-kol-001	cust-0023	SO-000023	COMPLETED	6618.00	0.00	1191.24	7809.24	2026-07-18 13:44:00	2026-07-18 13:44:00
so-0024	org-walmart-demo	store-gwh-001	cust-0024	SO-000024	COMPLETED	16325.00	0.00	2938.50	19263.50	2026-07-19 15:01:00	2026-07-19 15:01:00
so-0025	org-walmart-demo	store-del-001	cust-0025	SO-000025	COMPLETED	1245.00	62.25	212.90	1395.65	2026-07-20 04:18:00	2026-07-20 04:18:00
so-0026	org-walmart-demo	store-jpr-001	\N	SO-000026	CANCELLED	2647.00	0.00	476.46	3123.46	2026-07-21 04:35:00	2026-07-21 04:35:00
so-0027	org-walmart-demo	store-mum-001	cust-0027	SO-000027	REFUNDED	2693.00	0.00	754.04	3447.04	2026-07-22 05:52:00	2026-07-22 05:52:00
so-0028	org-walmart-demo	store-pun-001	cust-0028	SO-000028	DRAFT	9191.00	0.00	1714.08	10905.08	2026-07-23 07:09:00	2026-07-23 07:09:00
so-0029	org-walmart-demo	store-blr-001	cust-0029	SO-000029	CONFIRMED	60711.00	3035.55	10381.60	68057.05	2026-07-24 08:26:00	2026-07-24 08:26:00
so-0030	org-walmart-demo	store-chn-001	cust-0030	SO-000030	PROCESSING	76892.00	0.00	13333.56	90225.56	2026-07-25 08:43:00	2026-07-25 08:43:00
so-0031	org-walmart-demo	store-kol-001	\N	SO-000031	COMPLETED	3732.00	0.00	180.35	3912.35	2026-07-26 10:00:00	2026-07-26 10:00:00
so-0032	org-walmart-demo	store-gwh-001	cust-0032	SO-000032	COMPLETED	4824.00	0.00	268.31	5092.31	2026-07-27 11:17:00	2026-07-27 11:17:00
so-0033	org-walmart-demo	store-del-001	cust-0033	SO-000033	COMPLETED	237.00	11.85	11.26	236.41	2026-07-28 11:34:00	2026-07-28 11:34:00
so-0034	org-walmart-demo	store-jpr-001	cust-0034	SO-000034	COMPLETED	1055.00	0.00	63.15	1118.15	2026-07-29 12:51:00	2026-07-29 12:51:00
so-0035	org-walmart-demo	store-mum-001	cust-0035	SO-000035	CANCELLED	565.00	0.00	0.00	565.00	2026-07-30 14:08:00	2026-07-30 14:08:00
so-0036	org-walmart-demo	store-pun-001	\N	SO-000036	REFUNDED	1340.00	0.00	151.80	1491.80	2026-07-31 15:25:00	2026-07-31 15:25:00
so-0037	org-walmart-demo	store-blr-001	cust-0037	SO-000037	DRAFT	1419.00	70.95	242.65	1590.70	2026-08-01 03:42:00	2026-08-01 03:42:00
so-0038	org-walmart-demo	store-chn-001	cust-0038	SO-000038	CONFIRMED	2447.00	0.00	457.96	2904.96	2026-08-02 04:59:00	2026-08-02 04:59:00
so-0039	org-walmart-demo	store-kol-001	cust-0039	SO-000039	PROCESSING	3378.00	0.00	678.04	4056.04	2026-08-03 06:16:00	2026-08-03 06:16:00
so-0040	org-walmart-demo	store-gwh-001	cust-0040	SO-000040	COMPLETED	7145.00	0.00	1286.10	8431.10	2026-08-04 06:33:00	2026-08-04 06:33:00
so-0041	org-walmart-demo	store-del-001	\N	SO-000041	COMPLETED	135.00	6.75	23.09	151.34	2026-08-05 07:50:00	2026-08-05 07:50:00
so-0042	org-walmart-demo	store-jpr-001	cust-0042	SO-000042	COMPLETED	3195.00	0.00	575.10	3770.10	2026-08-06 09:07:00	2026-08-06 09:07:00
so-0043	org-walmart-demo	store-mum-001	cust-0043	SO-000043	COMPLETED	14688.00	0.00	2643.84	17331.84	2026-08-07 10:24:00	2026-08-07 10:24:00
so-0044	org-walmart-demo	store-pun-001	cust-0044	SO-000044	CANCELLED	10688.00	0.00	1923.84	12611.84	2026-08-08 10:41:00	2026-08-08 10:41:00
so-0045	org-walmart-demo	store-blr-001	cust-0045	SO-000045	REFUNDED	25385.00	1269.25	4340.85	28456.60	2026-08-09 11:58:00	2026-08-09 11:58:00
so-0046	org-walmart-demo	store-chn-001	\N	SO-000046	DRAFT	16884.00	0.00	3039.12	19923.12	2026-08-10 13:15:00	2026-08-10 13:15:00
so-0047	org-walmart-demo	store-kol-001	cust-0047	SO-000047	CONFIRMED	25680.00	0.00	4622.40	30302.40	2026-08-11 13:32:00	2026-08-11 13:32:00
so-0048	org-walmart-demo	store-gwh-001	cust-0048	SO-000048	PROCESSING	30973.00	0.00	4829.42	35802.42	2026-08-12 14:49:00	2026-08-12 14:49:00
so-0049	org-walmart-demo	store-del-001	cust-0049	SO-000049	COMPLETED	13196.00	659.80	2256.52	14792.72	2026-08-13 04:06:00	2026-08-13 04:06:00
so-0050	org-walmart-demo	store-jpr-001	cust-0050	SO-000050	COMPLETED	5594.00	0.00	629.35	6223.35	2026-08-14 05:23:00	2026-08-14 05:23:00
so-0051	org-walmart-demo	store-mum-001	\N	SO-000051	COMPLETED	6824.00	0.00	1211.55	8035.55	2026-08-15 05:40:00	2026-08-15 05:40:00
so-0052	org-walmart-demo	store-pun-001	cust-0052	SO-000052	COMPLETED	7940.00	0.00	1429.20	9369.20	2026-08-16 06:57:00	2026-08-16 06:57:00
so-0053	org-walmart-demo	store-blr-001	cust-0053	SO-000053	CANCELLED	4125.00	206.25	705.39	4624.14	2026-08-17 08:14:00	2026-08-17 08:14:00
so-0054	org-walmart-demo	store-chn-001	cust-0054	SO-000054	REFUNDED	12981.00	0.00	2336.58	15317.58	2026-08-18 08:31:00	2026-08-18 08:31:00
so-0055	org-walmart-demo	store-kol-001	cust-0055	SO-000055	DRAFT	9805.00	0.00	1787.40	11592.40	2026-08-19 09:48:00	2026-08-19 09:48:00
so-0056	org-walmart-demo	store-gwh-001	\N	SO-000056	CONFIRMED	7411.00	0.00	1668.18	9079.18	2026-08-20 11:05:00	2026-08-20 11:05:00
so-0057	org-walmart-demo	store-del-001	cust-0057	SO-000057	PROCESSING	450.00	22.50	119.70	547.20	2026-08-21 12:22:00	2026-08-21 12:22:00
so-0058	org-walmart-demo	store-jpr-001	cust-0058	SO-000058	COMPLETED	1697.00	0.00	365.16	2062.16	2026-08-22 12:39:00	2026-08-22 12:39:00
so-0059	org-walmart-demo	store-mum-001	cust-0059	SO-000059	COMPLETED	5716.00	0.00	1028.88	6744.88	2026-08-23 13:56:00	2026-08-23 13:56:00
so-0060	org-walmart-demo	store-pun-001	cust-0060	SO-000060	COMPLETED	74417.00	0.00	13209.81	87626.81	2026-08-24 15:13:00	2026-08-24 15:13:00
so-0061	org-walmart-demo	store-blr-001	\N	SO-000061	COMPLETED	2875.00	143.75	130.63	2861.88	2026-08-25 03:30:00	2026-08-25 03:30:00
so-0062	org-walmart-demo	store-chn-001	cust-0002	SO-000062	CANCELLED	3984.00	0.00	218.51	4202.51	2026-08-26 04:47:00	2026-08-26 04:47:00
so-0063	org-walmart-demo	store-kol-001	cust-0003	SO-000063	REFUNDED	2699.00	0.00	341.65	3040.65	2026-08-27 06:04:00	2026-08-27 06:04:00
so-0064	org-walmart-demo	store-gwh-001	cust-0004	SO-000064	DRAFT	5056.00	0.00	490.05	5546.05	2026-08-28 07:21:00	2026-08-28 07:21:00
so-0065	org-walmart-demo	store-del-001	cust-0005	SO-000065	CONFIRMED	340.00	17.00	0.00	323.00	2026-08-29 07:38:00	2026-08-29 07:38:00
so-0066	org-walmart-demo	store-jpr-001	\N	SO-000066	PROCESSING	1085.00	0.00	130.20	1215.20	2026-08-30 08:55:00	2026-08-30 08:55:00
so-0067	org-walmart-demo	store-mum-001	cust-0007	SO-000067	COMPLETED	1010.00	0.00	181.80	1191.80	2026-08-31 10:12:00	2026-08-31 10:12:00
so-0068	org-walmart-demo	store-pun-001	cust-0008	SO-000068	COMPLETED	1522.00	0.00	291.46	1813.46	2026-09-01 11:29:00	2026-09-01 11:29:00
so-0069	org-walmart-demo	store-blr-001	cust-0009	SO-000069	COMPLETED	1907.00	95.35	392.61	2204.26	2026-09-02 11:46:00	2026-09-02 11:46:00
so-0070	org-walmart-demo	store-chn-001	cust-0010	SO-000070	COMPLETED	5048.00	0.00	908.64	5956.64	2026-09-03 13:03:00	2026-09-03 13:03:00
so-0071	org-walmart-demo	store-kol-001	\N	SO-000071	CANCELLED	12668.00	0.00	2280.24	14948.24	2026-09-04 14:20:00	2026-09-04 14:20:00
so-0072	org-walmart-demo	store-gwh-001	cust-0012	SO-000072	REFUNDED	25476.00	0.00	4585.68	30061.68	2026-09-05 14:37:00	2026-09-05 14:37:00
so-0073	org-walmart-demo	store-del-001	cust-0013	SO-000073	DRAFT	5697.00	284.85	974.19	6386.34	2026-09-06 03:54:00	2026-09-06 03:54:00
so-0074	org-walmart-demo	store-jpr-001	cust-0014	SO-000074	CONFIRMED	6391.00	0.00	1150.38	7541.38	2026-09-07 05:11:00	2026-09-07 05:11:00
so-0075	org-walmart-demo	store-mum-001	cust-0015	SO-000075	PROCESSING	13892.00	0.00	2500.56	16392.56	2026-09-08 06:28:00	2026-09-08 06:28:00
\.


--
-- Data for Name: SalesOrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SalesOrderItem" (id, "salesOrderId", "productId", quantity, "unitPrice", discount, tax, total) FROM stdin;
f00dfade-ac25-4d13-a524-2e2c7e7b646c	so-0001	prod-0001	1	475.00	23.75	22.56	473.81
02d0ed90-21a9-48df-ab64-f41d67439a99	so-0002	prod-0004	2	240.00	0.00	24.00	504.00
97ade245-2d44-4512-8197-592bc5f4717a	so-0002	prod-0005	3	25.00	0.00	0.00	75.00
e645cd17-cdd3-4bb0-8385-a963cbedc97f	so-0003	prod-0007	3	79.00	0.00	11.85	248.85
2f502a5d-c627-446c-845e-fe793d3a6a39	so-0003	prod-0008	4	40.00	0.00	44.80	204.80
398c1aba-c11e-4115-ba90-c40a26aaddbe	so-0003	prod-0009	5	99.00	0.00	59.40	554.40
c1670f46-4b5e-4ded-ae57-86771cfd81c0	so-0004	prod-0010	4	20.00	0.00	14.40	94.40
64d43ee5-f18f-49e4-9d23-4438f9513d8f	so-0004	prod-0011	5	195.00	0.00	48.75	1023.75
a854882f-47a9-4b81-b9a5-1dc9a5b59bba	so-0004	prod-0012	1	375.00	0.00	67.50	442.50
43bbd016-032b-4bd0-b378-5e98985dc7ef	so-0004	prod-0013	2	68.00	0.00	0.00	136.00
34b35c2b-c15c-4523-9fbe-37eb9b813b15	so-0005	prod-0013	5	68.00	17.00	0.00	323.00
3c4d7d42-6aa6-4b7e-b02e-52bcfedfc4dc	so-0005	prod-0014	1	45.00	2.25	0.00	42.75
21da64c3-2694-4f8e-9979-1bd5c8266870	so-0005	prod-0015	2	90.00	9.00	0.00	171.00
9d8e17d9-5e45-4cc5-b164-5bb92f11eef8	so-0005	prod-0016	3	545.00	81.75	186.39	1739.64
737f0a85-9d02-461d-a2c5-9c28ef332d45	so-0005	prod-0017	4	270.00	54.00	123.12	1149.12
9164b4a8-14f9-4404-8414-fdf855d3ad94	so-0006	prod-0016	1	545.00	0.00	65.40	610.40
2c779f43-a9a1-4933-8c27-1e7f003b9f37	so-0006	prod-0017	2	270.00	0.00	64.80	604.80
e74fa540-e5bd-451f-9b65-795255b752d1	so-0006	prod-0018	3	45.00	0.00	0.00	135.00
af7a0b02-9eeb-42fc-8152-41e90d116d95	so-0006	prod-0019	4	30.00	0.00	21.60	141.60
be0e497f-17c9-4acd-be24-37cd0afafafb	so-0006	prod-0020	5	250.00	0.00	225.00	1475.00
d609590f-5f42-4e0c-93d6-f101745ed547	so-0006	prod-0021	1	50.00	0.00	9.00	59.00
3b0ea7d2-5dcf-46d4-a75a-d5f5eb5a08e3	so-0007	prod-0019	2	30.00	0.00	10.80	70.80
e60b5987-7cb9-4ef2-9dd6-cda9c669d275	so-0007	prod-0020	3	250.00	0.00	135.00	885.00
0206e2b3-744b-4dc4-acbb-850a2ecdeea9	so-0007	prod-0021	4	50.00	0.00	36.00	236.00
668a8b8d-7ca3-4ccb-b616-289bd943a80c	so-0007	prod-0022	5	42.00	0.00	37.80	247.80
ff3d1caf-e38e-401d-b7c4-dfc1bb3853f6	so-0007	prod-0023	1	199.00	0.00	35.82	234.82
a9a9cf65-5c97-4ff9-a00d-24b80f869768	so-0007	prod-0024	2	85.00	0.00	30.60	200.60
e96d923e-14a9-4292-89b3-f798182fe0b9	so-0007	prod-0025	3	175.00	0.00	147.00	672.00
41e8706e-dfd3-4b95-ae2b-71ba1dca5f90	so-0008	prod-0022	3	42.00	0.00	22.68	148.68
d138ca18-6602-4d1f-a993-3db2b19bbc7a	so-0008	prod-0023	4	199.00	0.00	143.28	939.28
4e776072-3d77-4e8d-addf-fa316bdb3d0e	so-0008	prod-0024	5	85.00	0.00	76.50	501.50
a05c1c73-3c00-499c-a95c-5d3de2da0b86	so-0008	prod-0025	1	175.00	0.00	49.00	224.00
bc863d36-9634-48ce-b03c-ec35be44f919	so-0008	prod-0026	2	95.00	0.00	34.20	224.20
e98b1a35-f715-42c0-b8dd-0f13a9353503	so-0008	prod-0027	3	245.00	0.00	132.30	867.30
f1565c8c-0e6e-401d-b335-6fdff92727ee	so-0008	prod-0028	4	125.00	0.00	90.00	590.00
6941426a-86ba-406c-91b7-1b687da6a7bd	so-0008	prod-0029	5	79.00	0.00	71.10	466.10
adf1acf2-b26c-44fe-975d-e468ef2e4180	so-0009	prod-0025	4	175.00	35.00	186.20	851.20
804598a4-355b-4662-b8c3-372ca87dd1ef	so-0010	prod-0028	5	125.00	0.00	112.50	737.50
d55ea987-c89b-40bc-b44f-f55d5f82c033	so-0010	prod-0029	1	79.00	0.00	14.22	93.22
7859bba9-06b7-4f94-b489-5d37e7ea993e	so-0011	prod-0031	1	135.00	0.00	24.30	159.30
b9d443e7-2865-4127-90ac-8705dc37ca9d	so-0011	prod-0032	2	199.00	0.00	71.64	469.64
0d883e26-f697-45f9-8e1a-a44fe5511f15	so-0011	prod-0033	3	549.00	0.00	296.46	1943.46
aaa81074-d20d-4437-b5a1-d4c4b65304e7	so-0012	prod-0034	2	99.00	0.00	35.64	233.64
dc7c95af-c008-4902-bd3b-c940a32688a8	so-0012	prod-0035	3	999.00	0.00	539.46	3536.46
066515d1-29b2-4bba-bb50-45d4fb9bdb3d	so-0012	prod-0036	4	1299.00	0.00	935.28	6131.28
aed7517f-877f-48cb-be07-9b341bb4a5e7	so-0012	prod-0037	5	1899.00	0.00	1709.10	11204.10
a695dec5-5402-446d-8ba7-10958ee09a74	so-0013	prod-0037	3	1899.00	284.85	974.19	6386.34
f2ffe783-e8bd-48ad-b658-0e37f30ee1eb	so-0013	prod-0038	4	1499.00	299.80	1025.32	6721.52
58e81556-188a-44e9-a099-625d77516907	so-0013	prod-0039	5	599.00	149.75	512.15	3357.40
b7b09c3a-dc4d-4507-9835-b57b53211611	so-0013	prod-0040	1	1099.00	54.95	187.93	1231.98
2d23a386-c1a0-42f9-9b48-3797e3563458	so-0013	prod-0041	2	399.00	39.90	136.46	894.56
50c9d85b-a4d9-4e84-bfcf-5c4e033dd18c	so-0014	prod-0040	4	1099.00	0.00	791.28	5187.28
2f8bae86-fa4b-47ad-8c7c-8be49ddab746	so-0014	prod-0041	5	399.00	0.00	359.10	2354.10
a6da2995-6658-4e82-a5a6-25508393a987	so-0014	prod-0042	1	1699.00	0.00	305.82	2004.82
ee8191e1-e062-4283-9cab-0a1ad579b6aa	so-0014	prod-0043	2	1299.00	0.00	467.64	3065.64
52e97718-4e2f-46b1-b983-1ef1c226a467	so-0014	prod-0044	3	3199.00	0.00	1727.46	11324.46
d1b693ad-8a92-42fa-8568-41aa05ce9530	so-0014	prod-0045	4	2099.00	0.00	1511.28	9907.28
779b2d0d-d55c-4801-a176-a856fc9466d3	so-0015	prod-0043	5	1299.00	0.00	1169.10	7664.10
fa725acb-e9da-47a5-8400-67f8a9bbbcc6	so-0015	prod-0044	1	3199.00	0.00	575.82	3774.82
b8c9da9c-71ff-4f9b-a999-aa9aee9fc9b4	so-0015	prod-0045	2	2099.00	0.00	755.64	4953.64
b861d98d-85bb-4ca7-a1f9-22c84dbea55d	so-0015	prod-0046	3	2699.00	0.00	1457.46	9554.46
edc458a4-3309-4eaa-b7be-d5d7b7a895a2	so-0015	prod-0047	4	849.00	0.00	611.28	4007.28
458cd91f-c5f2-4841-a813-ca50e55c7117	so-0015	prod-0048	5	699.00	0.00	629.10	4124.10
16686305-17e5-4386-9cff-1e8be2cc7613	so-0015	prod-0049	1	1799.00	0.00	323.82	2122.82
fc1c8e20-ead3-4c15-b4ff-14a0ac73d7b1	so-0016	prod-0046	1	2699.00	0.00	485.82	3184.82
0db4e159-43e6-47d0-8397-0f4ecc83dd56	so-0016	prod-0047	2	849.00	0.00	305.64	2003.64
a4f12c6c-21a1-4b7f-86ca-c7395efbaede	so-0016	prod-0048	3	699.00	0.00	377.46	2474.46
4e15f7cf-5f4b-4ab2-8753-4614586da780	so-0016	prod-0049	4	1799.00	0.00	1295.28	8491.28
2c6bd971-72d6-4884-ac6c-2c3cb4dfaea6	so-0016	prod-0050	5	549.00	0.00	494.10	3239.10
5486991d-92ea-4f81-979b-a8ab981a24b1	so-0016	prod-0051	1	449.00	0.00	80.82	529.82
63c13b5f-3394-4838-a918-afb072a30cc3	so-0016	prod-0052	2	499.00	0.00	179.64	1177.64
e537e282-f20d-4042-b82d-bf9a9f6684e4	so-0016	prod-0053	3	849.00	0.00	458.46	3005.46
1b5e92e2-99d6-44b0-b392-993147c10f0a	so-0017	prod-0049	2	1799.00	179.90	615.26	4033.36
9a336838-8e12-42b3-b511-457b9fcc1eac	so-0018	prod-0052	3	499.00	0.00	269.46	1766.46
67348add-c416-4ecd-b72e-a05b43cb5c66	so-0018	prod-0053	4	849.00	0.00	611.28	4007.28
b194d9bd-2797-4176-8636-4cd35add3142	so-0019	prod-0055	4	3299.00	0.00	2375.28	15571.28
866e5d50-e2c2-4f97-832d-fae01cd3af3f	so-0019	prod-0056	5	699.00	0.00	629.10	4124.10
4093a5af-ebe3-4d27-9bd2-a6a44d34f759	so-0019	prod-0057	1	299.00	0.00	14.95	313.95
a95e9a94-7656-4bb2-8aee-fab7e9cf49e1	so-0020	prod-0058	5	999.00	0.00	599.40	5594.40
b1153148-5645-4cde-ad44-7ca8c455cdee	so-0020	prod-0059	1	599.00	0.00	29.95	628.95
dfa0c3ba-0478-44ad-a16e-3c5549efab21	so-0020	prod-0060	2	2799.00	0.00	279.90	5877.90
b1384304-bb80-4989-a74d-ce0f2ba52207	so-0020	prod-0061	3	129.00	0.00	19.35	406.35
be9b0785-b3a2-41e9-9e4c-2419587ab4c0	so-0021	prod-0061	1	129.00	6.45	6.13	128.68
f2056758-b0d2-4446-9396-cee6aaa83b02	so-0021	prod-0062	2	499.00	49.90	170.66	1118.76
a8467f81-513c-4046-92a7-f807004214dd	so-0021	prod-0063	3	1899.00	284.85	974.19	6386.34
c52647d9-7675-4408-8f79-05c38ef78767	so-0021	prod-0064	4	149.00	29.80	101.92	668.12
d5d9cf1c-c90a-400b-84d6-22af650d76a7	so-0021	prod-0065	5	2299.00	574.75	1965.65	12885.90
4e87fde9-9ce6-436e-8fe7-e112e007a0dc	so-0022	prod-0064	2	149.00	0.00	53.64	351.64
7839baef-54a6-4b8a-874f-393ddb1f67b6	so-0022	prod-0065	3	2299.00	0.00	1241.46	8138.46
221c7cc3-ccd3-4cf6-ac7e-d91de7944069	so-0022	prod-0066	4	75.00	0.00	54.00	354.00
c8326e47-b08b-4dfe-930f-a0d36a18d6d5	so-0022	prod-0067	5	89.00	0.00	80.10	525.10
75ef687d-eeb8-462a-9ae4-d49d153052e4	so-0022	prod-0068	1	129.00	0.00	23.22	152.22
88b867c1-40af-4cb3-b43e-640a94f43401	so-0022	prod-0069	2	149.00	0.00	53.64	351.64
c68cfb91-1414-44f1-845e-5abea222052a	so-0023	prod-0067	3	89.00	0.00	48.06	315.06
4e3386e6-7838-4d57-a489-49aae02be4cc	so-0023	prod-0068	4	129.00	0.00	92.88	608.88
d757c1ae-08ef-44eb-b373-f7aa474fe8f6	so-0023	prod-0069	5	149.00	0.00	134.10	879.10
652144a3-4f59-4ef1-b889-469153ef985e	so-0023	prod-0070	1	1399.00	0.00	251.82	1650.82
c5fc6a16-af94-4479-8536-3bbc3350d4f2	so-0023	prod-0071	2	599.00	0.00	215.64	1413.64
a58d38c4-f74a-49ad-b272-311c25100730	so-0023	prod-0072	3	499.00	0.00	269.46	1766.46
c0e5390d-f0e2-4cec-a86f-a4d879dc49c6	so-0023	prod-0073	4	249.00	0.00	179.28	1175.28
b986177d-518f-463d-b567-a94bcebf099c	so-0024	prod-0070	4	1399.00	0.00	1007.28	6603.28
80fa1e9e-5df6-457c-8db6-80712b816ee0	so-0024	prod-0071	5	599.00	0.00	539.10	3534.10
c2ab1209-493e-428a-8c02-d1f3cd623e83	so-0024	prod-0072	1	499.00	0.00	89.82	588.82
f9e129ed-838e-4038-8469-563c0d3941b8	so-0024	prod-0073	2	249.00	0.00	89.64	587.64
947d2d23-975b-45b0-8a57-ca823182f994	so-0024	prod-0074	3	199.00	0.00	107.46	704.46
5d8e3cca-e882-4046-a76e-f6fa57ec6d6b	so-0024	prod-0075	4	699.00	0.00	503.28	3299.28
96972458-bfaf-4aff-bb94-52f591b4e4a3	so-0024	prod-0076	5	449.00	0.00	404.10	2649.10
94c88b1f-029e-4f0d-bbf3-3cf4a5ebc558	so-0024	prod-0077	1	1099.00	0.00	197.82	1296.82
93a8cfdd-1b3c-47b1-8662-e0e10adab816	so-0025	prod-0073	5	249.00	62.25	212.90	1395.65
3044c619-26d1-4206-a053-1f3d3808b9b9	so-0026	prod-0076	1	449.00	0.00	80.82	529.82
f3c8c7f1-c67e-47ca-ab52-5d91c1d1fff0	so-0026	prod-0077	2	1099.00	0.00	395.64	2593.64
1fdafd17-c025-4972-b6f2-40e24c4f28ac	so-0027	prod-0079	2	225.00	0.00	126.00	576.00
476d1e1f-f7bb-487d-85f4-ee0b370f9512	so-0027	prod-0080	3	349.00	0.00	293.16	1340.16
0de83f18-052b-48b3-8ca7-5f77fefd6f65	so-0027	prod-0081	4	299.00	0.00	334.88	1530.88
f0543c8e-121a-4adb-9949-ec23206994e8	so-0028	prod-0082	3	199.00	0.00	167.16	764.16
e57ede77-6a6d-43df-bc8d-1f783809a4e8	so-0028	prod-0083	4	275.00	0.00	198.00	1298.00
b03e55df-aeff-4aa4-8f5f-500746ce0d53	so-0028	prod-0084	5	1299.00	0.00	1169.10	7664.10
074e3a65-a684-4d89-90d6-10942c5fa98b	so-0028	prod-0085	1	999.00	0.00	179.82	1178.82
4d9da1a7-128c-43a7-82a5-8f380cf05e94	so-0029	prod-0085	4	999.00	199.80	683.32	4479.52
88d280e1-d2c8-49fd-befb-1af55d16d211	so-0029	prod-0086	5	299.00	74.75	255.65	1675.90
895f212f-bff6-4f5f-9f1c-2fc93b48ada8	so-0029	prod-0087	1	225.00	11.25	38.48	252.23
da801456-2790-462f-8786-55606f540f39	so-0029	prod-0088	2	7999.00	799.90	2735.66	17933.76
975e36cd-8f83-45b7-a193-a1d5d93b9603	so-0029	prod-0089	3	12999.00	1949.85	6668.49	43715.64
56cce266-7dff-47be-a762-c9530dc24103	so-0030	prod-0088	5	7999.00	0.00	7199.10	47194.10
6d6ab81a-263c-42c6-bf9b-a31e57a683ea	so-0030	prod-0089	1	12999.00	0.00	2339.82	15338.82
7bf1a6bf-59b5-4bc4-8d5e-9064e9fba929	so-0030	prod-0090	2	9999.00	0.00	3599.64	23597.64
3f8e6de2-3291-4250-beb8-6822a1b17cf4	so-0030	prod-0001	3	475.00	0.00	71.25	1496.25
0d78aae4-dbc3-409f-ac91-545defec2544	so-0030	prod-0002	4	425.00	0.00	85.00	1785.00
300baec3-f020-44cc-8263-56b83c2e2f81	so-0030	prod-0003	5	155.00	0.00	38.75	813.75
cb1ad490-e074-4429-8aca-7051cf3748cb	so-0031	prod-0001	1	475.00	0.00	23.75	498.75
678b2660-9707-45e1-b4eb-669f76807535	so-0031	prod-0002	2	425.00	0.00	42.50	892.50
102bf6f4-2410-4c98-b0c1-8b8fb7816084	so-0031	prod-0003	3	155.00	0.00	23.25	488.25
4bd1b85e-942d-4032-99e9-692284df802b	so-0031	prod-0004	4	240.00	0.00	48.00	1008.00
ce6dc6f7-e945-4131-974a-a9a50d66bf66	so-0031	prod-0005	5	25.00	0.00	0.00	125.00
a67c2e08-bc61-492f-a9fe-09c5b602ed06	so-0031	prod-0006	1	699.00	0.00	34.95	733.95
198e27c7-9357-4986-9a37-781fc54b6da0	so-0031	prod-0007	2	79.00	0.00	7.90	165.90
326480b2-0834-42ac-97ec-eb6df19fd16f	so-0032	prod-0004	2	240.00	0.00	24.00	504.00
2fcc312c-2645-45d8-8805-4a127afc7397	so-0032	prod-0005	3	25.00	0.00	0.00	75.00
3fead2e3-7ff4-4b38-b5b7-4b8f9cb67fc4	so-0032	prod-0006	4	699.00	0.00	139.80	2935.80
67fae3dc-aa4b-4f29-8d6d-365b6adba5e9	so-0032	prod-0007	5	79.00	0.00	19.75	414.75
e6f608c7-a3c9-481a-9a97-ff53c363905d	so-0032	prod-0008	1	40.00	0.00	11.20	51.20
c72a937b-50bd-4fff-a69f-d8bd55709a32	so-0032	prod-0009	2	99.00	0.00	23.76	221.76
ce2a58b1-a764-494f-9b19-e174b4f31f1b	so-0032	prod-0010	3	20.00	0.00	10.80	70.80
d76749ff-650e-426a-8a0a-0a075f015e9f	so-0032	prod-0011	4	195.00	0.00	39.00	819.00
0ab45551-e2c7-4510-b05e-2a4995938da5	so-0033	prod-0007	3	79.00	11.85	11.26	236.41
ee38289f-e594-4bb7-abd7-ee0e73e98985	so-0034	prod-0010	4	20.00	0.00	14.40	94.40
bc0593ec-dd22-4d99-9d4f-8904b0ecbbeb	so-0034	prod-0011	5	195.00	0.00	48.75	1023.75
09c9531c-2090-425d-b00c-e9b96ab24b26	so-0035	prod-0013	5	68.00	0.00	0.00	340.00
aa6e76b4-8bbf-4606-9a3f-73a1ecfd69a2	so-0035	prod-0014	1	45.00	0.00	0.00	45.00
e7600e34-7a32-48c0-b2f8-f6f7cbdf49c9	so-0035	prod-0015	2	90.00	0.00	0.00	180.00
c2276803-0935-468f-ac92-240b3ed5c2ef	so-0036	prod-0016	1	545.00	0.00	65.40	610.40
2898afe7-45d5-4bcd-b655-6593934ac619	so-0036	prod-0017	2	270.00	0.00	64.80	604.80
abef9203-3e8b-42ee-bf3b-6e3d31a1e6c9	so-0036	prod-0018	3	45.00	0.00	0.00	135.00
8dd41319-c4ce-43b4-bc73-cd8322110c37	so-0036	prod-0019	4	30.00	0.00	21.60	141.60
f8dd9344-6991-48c9-8be1-e4d1cb4c391a	so-0037	prod-0019	2	30.00	3.00	10.26	67.26
00e94a54-9f1f-4aaf-96f4-8b5efca2208a	so-0037	prod-0020	3	250.00	37.50	128.25	840.75
2c652801-65a7-4370-a6e0-3de06972c66e	so-0037	prod-0021	4	50.00	10.00	34.20	224.20
5907f3bc-14ef-4e84-9fce-5da6033aef40	so-0037	prod-0022	5	42.00	10.50	35.91	235.41
a8185222-a672-4c72-818e-29581b28adf6	so-0037	prod-0023	1	199.00	9.95	34.03	223.08
caec8836-2b9e-43e9-a4fa-e7ac6393d584	so-0038	prod-0022	3	42.00	0.00	22.68	148.68
6168963d-517b-4671-ac0e-5c65ae5adb92	so-0038	prod-0023	4	199.00	0.00	143.28	939.28
2eb9f048-6ff8-4a23-93b5-6dcb75192892	so-0038	prod-0024	5	85.00	0.00	76.50	501.50
8f594497-e3a3-4bea-bf10-93221c644b09	so-0038	prod-0025	1	175.00	0.00	49.00	224.00
0c56a629-fc2a-4443-8dbb-c8b495341994	so-0038	prod-0026	2	95.00	0.00	34.20	224.20
ee78472d-ec8e-40fe-9df1-f68b9bab6677	so-0038	prod-0027	3	245.00	0.00	132.30	867.30
e29efd8b-feb4-4c28-b46f-ee6ae009b234	so-0039	prod-0025	4	175.00	0.00	196.00	896.00
34ea2fa1-387b-4e59-bc7e-4ccaa7f3536c	so-0039	prod-0026	5	95.00	0.00	85.50	560.50
e88ea60f-8a9b-4366-bcc1-89db62a68367	so-0039	prod-0027	1	245.00	0.00	44.10	289.10
98b2785b-49ea-4829-bce1-7299aeeb9a3e	so-0039	prod-0028	2	125.00	0.00	45.00	295.00
54153233-3422-46f6-ad29-2a2ac6ba2c48	so-0039	prod-0029	3	79.00	0.00	42.66	279.66
f912e6d8-6b45-4032-bc41-69463883142c	so-0039	prod-0030	4	199.00	0.00	143.28	939.28
45b27f59-4ca8-4eb3-9f2c-af4e45cd6d07	so-0039	prod-0031	5	135.00	0.00	121.50	796.50
2681c9d6-e727-479f-9f0f-4a147efb1654	so-0040	prod-0028	5	125.00	0.00	112.50	737.50
d4489010-b77c-438a-895e-81ccd9e23101	so-0040	prod-0029	1	79.00	0.00	14.22	93.22
a9135ca9-141f-4f9a-bcc2-1ada31c3b1a1	so-0040	prod-0030	2	199.00	0.00	71.64	469.64
ff948239-8360-4a99-8a37-d835c68dbcfb	so-0040	prod-0031	3	135.00	0.00	72.90	477.90
a2bfb9b5-5864-4b7e-810d-430c282f0f1e	so-0040	prod-0032	4	199.00	0.00	143.28	939.28
a9ac599c-4c02-4c4d-91e4-1134f820e8e4	so-0040	prod-0033	5	549.00	0.00	494.10	3239.10
06e1c59d-192f-4100-a42f-08ea26f9cd9d	so-0040	prod-0034	1	99.00	0.00	17.82	116.82
e053ef9b-4c37-4405-a4c6-2596ac94e20a	so-0040	prod-0035	2	999.00	0.00	359.64	2357.64
bbf830df-f827-4f18-b286-7c8f00bbce8b	so-0041	prod-0031	1	135.00	6.75	23.09	151.34
8c259b36-949f-4ac9-890e-0b94d8708100	so-0042	prod-0034	2	99.00	0.00	35.64	233.64
c0bc87a3-cd8e-42d2-bed9-363509257f56	so-0042	prod-0035	3	999.00	0.00	539.46	3536.46
b128d4a8-3793-40c0-a829-2d2612c8c481	so-0043	prod-0037	3	1899.00	0.00	1025.46	6722.46
1dc9610d-9cab-4efe-a1ed-bcfaffdfb824	so-0043	prod-0038	4	1499.00	0.00	1079.28	7075.28
f792bf4c-1ca4-4984-8940-e44479e28f28	so-0043	prod-0039	5	599.00	0.00	539.10	3534.10
471d0413-924f-450e-b662-ab8d4988ac25	so-0044	prod-0040	4	1099.00	0.00	791.28	5187.28
6cbb4a13-e736-48f8-8049-18f760b385ef	so-0044	prod-0041	5	399.00	0.00	359.10	2354.10
77fb6ce7-9051-49a0-826e-ac1175cb002a	so-0044	prod-0042	1	1699.00	0.00	305.82	2004.82
12f9ba17-3d89-4a6f-95be-332f38f6ed72	so-0044	prod-0043	2	1299.00	0.00	467.64	3065.64
064700dd-e107-4d67-a0a0-081db2298501	so-0045	prod-0043	5	1299.00	324.75	1110.65	7280.90
9de74fde-3bcc-4436-8c36-776fae4de7ae	so-0045	prod-0044	1	3199.00	159.95	547.03	3586.08
ef951a1a-1de7-4672-a2cd-3c2b1c3f07fb	so-0045	prod-0045	2	2099.00	209.90	717.86	4705.96
15105cb5-baad-4e5e-9010-a5af17dc25f0	so-0045	prod-0046	3	2699.00	404.85	1384.59	9076.74
f6702eb3-7411-46dc-80cd-58e247ce829c	so-0045	prod-0047	4	849.00	169.80	580.72	3806.92
7d31ee2f-ef75-4578-8f7b-be8881ea848d	so-0046	prod-0046	1	2699.00	0.00	485.82	3184.82
7e20b34c-445e-4fed-9725-39f80ad092ab	so-0046	prod-0047	2	849.00	0.00	305.64	2003.64
b3a09985-2d2e-4bbb-ba24-85e5ca2ca106	so-0046	prod-0048	3	699.00	0.00	377.46	2474.46
afc83551-7acf-4bf2-b92d-36f825e2bb90	so-0046	prod-0049	4	1799.00	0.00	1295.28	8491.28
4f7ef4ad-e84e-42d2-97ca-49f6cb5f5358	so-0046	prod-0050	5	549.00	0.00	494.10	3239.10
532326c4-3986-404b-bb72-7006108661ff	so-0046	prod-0051	1	449.00	0.00	80.82	529.82
f5b4674c-0073-410f-9bbd-65e8309f71aa	so-0047	prod-0049	2	1799.00	0.00	647.64	4245.64
c2ad9b42-9c8a-4b37-9b13-948a7d6cd577	so-0047	prod-0050	3	549.00	0.00	296.46	1943.46
7e2cf7d4-b397-4e2e-af31-9645315d2d07	so-0047	prod-0051	4	449.00	0.00	323.28	2119.28
95b66968-8ad7-423f-8985-3f1e4743e2ba	so-0047	prod-0052	5	499.00	0.00	449.10	2944.10
bdee564b-4e52-4731-a2b3-df88b57e3822	so-0047	prod-0053	1	849.00	0.00	152.82	1001.82
d6433c10-d8ea-4f1e-b216-ebee2545ecbd	so-0047	prod-0054	2	2699.00	0.00	971.64	6369.64
24b76e1d-7608-4e2c-9f80-3035f54d1fdc	so-0047	prod-0055	3	3299.00	0.00	1781.46	11678.46
be3a61d2-acc7-4053-96ad-8adf79d40989	so-0048	prod-0052	3	499.00	0.00	269.46	1766.46
3309766c-f918-4612-9738-bc4ed523c46d	so-0048	prod-0053	4	849.00	0.00	611.28	4007.28
fe5c32ce-5c5b-4c81-8c0c-6f55e44c50b3	so-0048	prod-0054	5	2699.00	0.00	2429.10	15924.10
ba04b5df-beae-4ed5-b4a5-5eaca80700b9	so-0048	prod-0055	1	3299.00	0.00	593.82	3892.82
f9959b6c-815c-45f4-9654-c8fb61ebd99c	so-0048	prod-0056	2	699.00	0.00	251.64	1649.64
b3bf722e-7cb4-4a05-b208-e267b2819483	so-0048	prod-0057	3	299.00	0.00	44.85	941.85
dad7171c-8380-4b3a-8623-1d6e1ec20038	so-0048	prod-0058	4	999.00	0.00	479.52	4475.52
e75ed8f5-aeba-4c2f-90a1-5e0d1faf9518	so-0048	prod-0059	5	599.00	0.00	149.75	3144.75
47ac7d9c-9fda-4edd-a443-600ea44ebe6c	so-0049	prod-0055	4	3299.00	659.80	2256.52	14792.72
33843e10-5e62-47f3-8f9b-2438d18dfdb7	so-0050	prod-0058	5	999.00	0.00	599.40	5594.40
e1014307-cb09-441c-9350-8246c10ca4f7	so-0050	prod-0059	1	599.00	0.00	29.95	628.95
b2e740a1-c26d-4321-91fc-2d430b7550f1	so-0051	prod-0061	1	129.00	0.00	6.45	135.45
6e4d58a9-91a7-40b3-9563-d7b783f3c843	so-0051	prod-0062	2	499.00	0.00	179.64	1177.64
ba168c59-7c54-4f16-97e6-50d3d0567180	so-0051	prod-0063	3	1899.00	0.00	1025.46	6722.46
d920c5c2-ff75-4a81-8268-815f519fb02b	so-0052	prod-0064	2	149.00	0.00	53.64	351.64
1a4112f9-9bfc-478e-a8ea-27e4b2407c97	so-0052	prod-0065	3	2299.00	0.00	1241.46	8138.46
f9c4c887-a610-4297-a801-5ef7e869d12d	so-0052	prod-0066	4	75.00	0.00	54.00	354.00
260a386d-1a9e-4365-a881-3f5cf8102c78	so-0052	prod-0067	5	89.00	0.00	80.10	525.10
8c4ed62d-e9b8-48d4-8bea-670886fdf652	so-0053	prod-0067	3	89.00	13.35	45.66	299.31
5e7398a1-637e-4c27-af57-7365b450cf20	so-0053	prod-0068	4	129.00	25.80	88.24	578.44
df42aa9b-7d89-4388-a8b8-7778e46e34c3	so-0053	prod-0069	5	149.00	37.25	127.40	835.15
04717c5e-834f-448e-858f-aa9df409041e	so-0053	prod-0070	1	1399.00	69.95	239.23	1568.28
de573392-f224-4a3e-a6bf-fa0d6c015406	so-0053	prod-0071	2	599.00	59.90	204.86	1342.96
ecafe7f5-53ad-4f0d-a181-4d7c04f5add6	so-0054	prod-0070	4	1399.00	0.00	1007.28	6603.28
fdc904e8-94df-41fa-8426-b0ebe0f69530	so-0054	prod-0071	5	599.00	0.00	539.10	3534.10
d2c6d44c-f12d-4f1b-83d3-b0f152858882	so-0054	prod-0072	1	499.00	0.00	89.82	588.82
abbc9991-fc14-460b-8efb-dac6e82a602d	so-0054	prod-0073	2	249.00	0.00	89.64	587.64
b30370d6-f02d-4ad7-851d-d93ba2bb7b6b	so-0054	prod-0074	3	199.00	0.00	107.46	704.46
9fe9a597-7171-4de5-8824-92e58495755e	so-0054	prod-0075	4	699.00	0.00	503.28	3299.28
ea8fd3a2-570c-4e6b-a9c4-3f3b4bf15d6d	so-0055	prod-0073	5	249.00	0.00	224.10	1469.10
3d5fdf5b-50e7-4498-8df5-5413fb8a54e2	so-0055	prod-0074	1	199.00	0.00	35.82	234.82
4d53a0b2-2f97-499b-ae0f-52068d966d39	so-0055	prod-0075	2	699.00	0.00	251.64	1649.64
5be5c03a-4b35-490d-bbb1-4c53530fb481	so-0055	prod-0076	3	449.00	0.00	242.46	1589.46
68117dc2-5005-40ea-8128-cdb5bf5ae755	so-0055	prod-0077	4	1099.00	0.00	791.28	5187.28
63a74ce6-b427-484a-b2a7-a563cf97b095	so-0055	prod-0078	5	199.00	0.00	179.10	1174.10
9d7ffe27-f724-445f-bc47-a90c31342950	so-0055	prod-0079	1	225.00	0.00	63.00	288.00
d62aec1c-5db3-4d6f-9109-69d00ba8b909	so-0056	prod-0076	1	449.00	0.00	80.82	529.82
80301c7a-5d2a-40f3-aad5-92431689e54f	so-0056	prod-0077	2	1099.00	0.00	395.64	2593.64
8ff732e3-85f8-42e8-b788-cf044d33a453	so-0056	prod-0078	3	199.00	0.00	107.46	704.46
5ce80924-3f18-436a-bf6f-34fa6c293c07	so-0056	prod-0079	4	225.00	0.00	252.00	1152.00
f637a31d-06b8-4161-9a92-0a6ea5494d46	so-0056	prod-0080	5	349.00	0.00	488.60	2233.60
da09cfae-26db-4b93-a8b0-0dd7bf74749a	so-0056	prod-0081	1	299.00	0.00	83.72	382.72
c11e1920-348c-4cda-89e0-f830976846e3	so-0056	prod-0082	2	199.00	0.00	111.44	509.44
e07c593f-2a8f-4f97-9165-3160a63e356e	so-0056	prod-0083	3	275.00	0.00	148.50	973.50
59fa1bc8-2f24-4a56-9ab9-73b48c0df905	so-0057	prod-0079	2	225.00	22.50	119.70	547.20
94e29312-f27a-46fe-9633-727beeb106ec	so-0058	prod-0082	3	199.00	0.00	167.16	764.16
8eed9d08-4e43-49c0-a25d-968f4cf0ec3a	so-0058	prod-0083	4	275.00	0.00	198.00	1298.00
d4c20551-b143-4f87-aa34-e202d3b386c4	so-0059	prod-0085	4	999.00	0.00	719.28	4715.28
c57a3172-b678-4913-89f2-3976e7447af1	so-0059	prod-0086	5	299.00	0.00	269.10	1764.10
c3a77802-305e-4d0f-b7de-ceba2308bf4b	so-0059	prod-0087	1	225.00	0.00	40.50	265.50
0442ec65-c7d5-4415-b060-9d0e7bc81e61	so-0060	prod-0088	5	7999.00	0.00	7199.10	47194.10
24717a6c-dd36-4270-a6b9-d6549c5558ac	so-0060	prod-0089	1	12999.00	0.00	2339.82	15338.82
4df61978-75a0-42cc-8caa-3681fb703e9f	so-0060	prod-0090	2	9999.00	0.00	3599.64	23597.64
0fc6893a-5216-4b07-9ad2-a91b916ba469	so-0060	prod-0001	3	475.00	0.00	71.25	1496.25
25a3c8f8-6699-4586-8ffd-47ff0e434430	so-0061	prod-0001	1	475.00	23.75	22.56	473.81
03b9a593-9b22-4285-b07a-91704a3bff44	so-0061	prod-0002	2	425.00	42.50	40.38	847.88
66fe127d-16f4-47e5-9554-857056eac5cd	so-0061	prod-0003	3	155.00	23.25	22.09	463.84
2e0ff0db-3097-4836-9c71-988698584c8c	so-0061	prod-0004	4	240.00	48.00	45.60	957.60
b227e9d3-214d-44c4-a08b-f69d480b4a1a	so-0061	prod-0005	5	25.00	6.25	0.00	118.75
020bc31e-e8a7-4bba-9d97-2e124a0e22bf	so-0062	prod-0004	2	240.00	0.00	24.00	504.00
5376d3cd-cfb2-4c85-94da-007bfc90fd0d	so-0062	prod-0005	3	25.00	0.00	0.00	75.00
80eb6682-4407-4990-a237-bfe088851154	so-0062	prod-0006	4	699.00	0.00	139.80	2935.80
d942e3ca-bae4-4b0c-9693-d36850d37d2a	so-0062	prod-0007	5	79.00	0.00	19.75	414.75
1773c5bc-e45e-4a2f-ae0c-4ea94e21dc9b	so-0062	prod-0008	1	40.00	0.00	11.20	51.20
fb11bd09-b054-4252-8897-672ff4402997	so-0062	prod-0009	2	99.00	0.00	23.76	221.76
9ac0b3f3-3ff3-4682-a8f9-61b36e8f21e3	so-0063	prod-0007	3	79.00	0.00	11.85	248.85
71151d1f-9ab7-4572-86d5-e1aff1544589	so-0063	prod-0008	4	40.00	0.00	44.80	204.80
8b1fedea-cc1d-4846-a54e-91879bda7399	so-0063	prod-0009	5	99.00	0.00	59.40	554.40
c95b2576-0332-479f-b0fb-03ceda81c953	so-0063	prod-0010	1	20.00	0.00	3.60	23.60
e1677926-1f54-4e0b-ae25-7e5c1123453e	so-0063	prod-0011	2	195.00	0.00	19.50	409.50
fff03484-129a-4777-ab76-e41b7cf388a1	so-0063	prod-0012	3	375.00	0.00	202.50	1327.50
6654bb9c-3dda-4df7-8b23-491bb8a8c82d	so-0063	prod-0013	4	68.00	0.00	0.00	272.00
d0afc86e-af0c-45e8-ba97-1578210e4d4a	so-0064	prod-0010	4	20.00	0.00	14.40	94.40
6a97ed93-1f72-4990-8047-84519d878375	so-0064	prod-0011	5	195.00	0.00	48.75	1023.75
bb290167-6c4e-4dc9-8e9b-ae948c124cb5	so-0064	prod-0012	1	375.00	0.00	67.50	442.50
66739fd6-6873-46c5-8d10-36fb05602d07	so-0064	prod-0013	2	68.00	0.00	0.00	136.00
03a9b806-6d0b-4216-8744-8c926a1bd16e	so-0064	prod-0014	3	45.00	0.00	0.00	135.00
d0cfc5d5-314e-487e-8565-835db9624efa	so-0064	prod-0015	4	90.00	0.00	0.00	360.00
0f4231c5-250c-4e8e-9043-74f5c6753d05	so-0064	prod-0016	5	545.00	0.00	327.00	3052.00
3b0b7fb8-06db-4ee7-b92f-ce93adaaa941	so-0064	prod-0017	1	270.00	0.00	32.40	302.40
75812127-11df-424b-9149-8164599a6d7d	so-0065	prod-0013	5	68.00	17.00	0.00	323.00
57e8760d-d8a7-4ed2-acbb-a244971a4eeb	so-0066	prod-0016	1	545.00	0.00	65.40	610.40
62e6f36d-5543-46f4-879d-0b102e25f8cb	so-0066	prod-0017	2	270.00	0.00	64.80	604.80
96b12f11-4606-4e10-8dd7-9477ce934eae	so-0067	prod-0019	2	30.00	0.00	10.80	70.80
5d957fcf-cf58-4de0-aab2-e366fb4bfc20	so-0067	prod-0020	3	250.00	0.00	135.00	885.00
dcec8d8d-c586-46fc-aee4-b54862138078	so-0067	prod-0021	4	50.00	0.00	36.00	236.00
e5f75971-92ee-4716-83be-88366ec0cb8b	so-0068	prod-0022	3	42.00	0.00	22.68	148.68
1d945066-f1e0-4481-b797-64a229f8c1a5	so-0068	prod-0023	4	199.00	0.00	143.28	939.28
1fb2ccd3-bd50-41e0-8688-37d122e7d15b	so-0068	prod-0024	5	85.00	0.00	76.50	501.50
a3eecc0b-9d7b-4b72-9fb6-a35b7693d88c	so-0068	prod-0025	1	175.00	0.00	49.00	224.00
e8c86a7b-fbc1-480d-b4e3-1e56ac7b80b3	so-0069	prod-0025	4	175.00	35.00	186.20	851.20
34211078-b4da-4c3f-a0e1-1908444e952d	so-0069	prod-0026	5	95.00	23.75	81.23	532.48
cdcb8a5b-ad93-41a8-811a-dfce4192ab59	so-0069	prod-0027	1	245.00	12.25	41.90	274.65
09bcdf03-e015-46c6-aaae-d71015de8a7a	so-0069	prod-0028	2	125.00	12.50	42.75	280.25
bf91ce5d-9487-42bf-8817-06385342b24b	so-0069	prod-0029	3	79.00	11.85	40.53	265.68
c1728201-35d5-4803-aba2-7c7a94f87a01	so-0070	prod-0028	5	125.00	0.00	112.50	737.50
d570b042-a259-4c30-925b-f4c49c235a5d	so-0070	prod-0029	1	79.00	0.00	14.22	93.22
102967b8-6ff6-434b-a82f-b5403941fa52	so-0070	prod-0030	2	199.00	0.00	71.64	469.64
79e6d9b2-1ce9-47bd-b6d8-31ff44c81c94	so-0070	prod-0031	3	135.00	0.00	72.90	477.90
74f88b13-9af8-49d2-9c59-71d7070f926a	so-0070	prod-0032	4	199.00	0.00	143.28	939.28
6a5208c0-fa30-4d8f-99b8-2f8e34b0333d	so-0070	prod-0033	5	549.00	0.00	494.10	3239.10
e0179bf5-4ad4-4930-b3e2-021d1116b941	so-0071	prod-0031	1	135.00	0.00	24.30	159.30
378e49d4-5530-47c5-b280-1ae95d3e4fc4	so-0071	prod-0032	2	199.00	0.00	71.64	469.64
ed9fb7bd-686e-4697-97b8-4d4fbbf6d4a2	so-0071	prod-0033	3	549.00	0.00	296.46	1943.46
4ae900b7-5396-4be2-8ac5-50a03ba4f860	so-0071	prod-0034	4	99.00	0.00	71.28	467.28
13b8ea49-971d-4eb8-8b96-07836f8c7824	so-0071	prod-0035	5	999.00	0.00	899.10	5894.10
5861dcd1-79fd-40d4-9375-f7d0ab11121e	so-0071	prod-0036	1	1299.00	0.00	233.82	1532.82
711a576b-9de4-4ace-80a9-bd6a4703f772	so-0071	prod-0037	2	1899.00	0.00	683.64	4481.64
ed38a6c1-ed62-4817-ad81-5f39a7cba3b7	so-0072	prod-0034	2	99.00	0.00	35.64	233.64
b58ae7c9-7c51-4398-b8f6-8ebf41c81728	so-0072	prod-0035	3	999.00	0.00	539.46	3536.46
912dca9f-6c96-4fa0-a6ab-beeb1cfe61b7	so-0072	prod-0036	4	1299.00	0.00	935.28	6131.28
b0ff8e37-efdc-4107-a7f2-7536279255f6	so-0072	prod-0037	5	1899.00	0.00	1709.10	11204.10
c1746252-0bde-4b08-b5d6-c6b549e127f0	so-0072	prod-0038	1	1499.00	0.00	269.82	1768.82
8ca78118-5640-49c7-92b4-b41242137433	so-0072	prod-0039	2	599.00	0.00	215.64	1413.64
3f512591-abfb-4314-9a05-6f10feac402e	so-0072	prod-0040	3	1099.00	0.00	593.46	3890.46
ab3060fb-c2bb-4d42-8e3f-1dade59c5f5e	so-0072	prod-0041	4	399.00	0.00	287.28	1883.28
9bb8a897-90ca-4f9a-8cf6-82dc7e7c02ad	so-0073	prod-0037	3	1899.00	284.85	974.19	6386.34
2e290cb4-7752-4b36-a797-67e1a2a0f74c	so-0074	prod-0040	4	1099.00	0.00	791.28	5187.28
9ca110d6-c6f1-4378-a031-14437e555cd6	so-0074	prod-0041	5	399.00	0.00	359.10	2354.10
f1d47543-c3ea-4492-ab55-4113848092fb	so-0075	prod-0043	5	1299.00	0.00	1169.10	7664.10
fcbcd9c6-7bbf-4545-ab16-2d9934860d4e	so-0075	prod-0044	1	3199.00	0.00	575.82	3774.82
631f517d-df72-4896-9ee1-f3695f8e27d2	so-0075	prod-0045	2	2099.00	0.00	755.64	4953.64
\.


--
-- Data for Name: Store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Store" (id, "organizationId", "regionId", name, code, address, city, state, country, pincode, phone, email, "managerId", status, image, latitude, longitude, "createdAt", "updatedAt") FROM stdin;
store-del-001	org-walmart-demo	region-north	Walmart Delhi Connaught Place	WAL-DEL-001	Block A, Connaught Place	New Delhi	Delhi	India	110001	+91 11 23456701	delhi.cp@walmart-demo.in	\N	ACTIVE	/images/stores/store-delhi.webp	\N	\N	2026-09-24 11:52:01.239	2026-09-24 11:52:01.239
store-jpr-001	org-walmart-demo	region-north	Walmart Jaipur MI Road	WAL-JPR-001	MI Road, Near Panch Batti	Jaipur	Rajasthan	India	302001	+91 141 2345672	jaipur.mi@walmart-demo.in	\N	ACTIVE	/images/stores/store-jaipur.webp	\N	\N	2026-09-24 11:52:01.248	2026-09-24 11:52:01.248
store-mum-001	org-walmart-demo	region-west	Walmart Mumbai Andheri	WAL-MUM-001	Andheri West, Link Road	Mumbai	Maharashtra	India	400053	+91 22 23456703	mumbai.andheri@walmart-demo.in	\N	ACTIVE	/images/stores/store-mumbai.webp	\N	\N	2026-09-24 11:52:01.255	2026-09-24 11:52:01.255
store-pun-001	org-walmart-demo	region-west	Walmart Pune FC Road	WAL-PUN-001	FC Road, Shivajinagar	Pune	Maharashtra	India	411005	+91 20 23456704	pune.fc@walmart-demo.in	\N	ACTIVE	/images/stores/store-pune.webp	\N	\N	2026-09-24 11:52:01.262	2026-09-24 11:52:01.262
store-blr-001	org-walmart-demo	region-south	Walmart Bangalore Koramangala	WAL-BLR-001	80 Feet Road, Koramangala	Bangalore	Karnataka	India	560034	+91 80 23456705	blr.koramangala@walmart-demo.in	\N	ACTIVE	/images/stores/store-bangalore.webp	\N	\N	2026-09-24 11:52:01.267	2026-09-24 11:52:01.267
store-chn-001	org-walmart-demo	region-south	Walmart Chennai T Nagar	WAL-CHN-001	Usman Road, T Nagar	Chennai	Tamil Nadu	India	600017	+91 44 23456706	chennai.tnagar@walmart-demo.in	\N	ACTIVE	/images/stores/store-chennai.webp	\N	\N	2026-09-24 11:52:01.272	2026-09-24 11:52:01.272
store-kol-001	org-walmart-demo	region-east	Walmart Kolkata Park Street	WAL-KOL-001	Park Street, Near Flury's	Kolkata	West Bengal	India	700016	+91 33 23456707	kolkata.park@walmart-demo.in	\N	ACTIVE	/images/stores/store-kolkata.webp	\N	\N	2026-09-24 11:52:01.28	2026-09-24 11:52:01.28
store-gwh-001	org-walmart-demo	region-east	Walmart Guwahati GS Road	WAL-GWH-001	GS Road, Dispur	Guwahati	Assam	India	781005	+91 361 2345608	guwahati.gs@walmart-demo.in	\N	ACTIVE	/images/stores/store-guwahati.webp	\N	\N	2026-09-24 11:52:01.286	2026-09-24 11:52:01.286
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "organizationId", "roleId", name, email, phone, "passwordHash", status, "createdAt", "updatedAt") FROM stdin;
user-demo-admin	org-walmart-demo	role-demo-admin	Demo Admin	admin@walmart-demo.in	+91 9000000001	DEMO_NOT_A_REAL_HASH	ACTIVE	2026-09-24 11:52:01.207	2026-09-24 11:52:01.207
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4a8b34b6-a85f-455f-a0dd-ad95fb3a3c2f	ec4b5a17b7850853dab9ad904d7be6104a6c9cde65d6218542b493f469eede2d	2026-09-24 17:05:22.779471+05:30	20260924101500_init_core_schema	\N	\N	2026-09-24 17:05:21.998873+05:30	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: InventoryMovement InventoryMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY (id);


--
-- Name: Inventory Inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY (id);


--
-- Name: JournalEntry JournalEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_pkey" PRIMARY KEY (id);


--
-- Name: JournalLine JournalLine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalLine"
    ADD CONSTRAINT "JournalLine_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: Partner Partner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partner"
    ADD CONSTRAINT "Partner_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrderItem PurchaseOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (id);


--
-- Name: Region Region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "Region_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SalesOrderItem SalesOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_pkey" PRIMARY KEY (id);


--
-- Name: SalesOrder SalesOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_pkey" PRIMARY KEY (id);


--
-- Name: Store Store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_organizationId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_organizationId_code_key" ON public."Account" USING btree ("organizationId", code);


--
-- Name: Account_organizationId_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_organizationId_type_idx" ON public."Account" USING btree ("organizationId", type);


--
-- Name: AuditLog_entity_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_entity_entityId_idx" ON public."AuditLog" USING btree (entity, "entityId");


--
-- Name: AuditLog_organizationId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_organizationId_createdAt_idx" ON public."AuditLog" USING btree ("organizationId", "createdAt");


--
-- Name: AuditLog_organizationId_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_organizationId_userId_idx" ON public."AuditLog" USING btree ("organizationId", "userId");


--
-- Name: Category_organizationId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_organizationId_code_key" ON public."Category" USING btree ("organizationId", code);


--
-- Name: Category_organizationId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_organizationId_name_key" ON public."Category" USING btree ("organizationId", name);


--
-- Name: Category_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Category_organizationId_status_idx" ON public."Category" USING btree ("organizationId", status);


--
-- Name: Customer_organizationId_phone_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_organizationId_phone_idx" ON public."Customer" USING btree ("organizationId", phone);


--
-- Name: Customer_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_organizationId_status_idx" ON public."Customer" USING btree ("organizationId", status);


--
-- Name: InventoryMovement_organizationId_storeId_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_organizationId_storeId_productId_idx" ON public."InventoryMovement" USING btree ("organizationId", "storeId", "productId");


--
-- Name: InventoryMovement_organizationId_type_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_organizationId_type_createdAt_idx" ON public."InventoryMovement" USING btree ("organizationId", type, "createdAt");


--
-- Name: InventoryMovement_referenceType_referenceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_referenceType_referenceId_idx" ON public."InventoryMovement" USING btree ("referenceType", "referenceId");


--
-- Name: Inventory_organizationId_storeId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Inventory_organizationId_storeId_productId_key" ON public."Inventory" USING btree ("organizationId", "storeId", "productId");


--
-- Name: Inventory_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Inventory_productId_idx" ON public."Inventory" USING btree ("productId");


--
-- Name: Inventory_storeId_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Inventory_storeId_productId_idx" ON public."Inventory" USING btree ("storeId", "productId");


--
-- Name: JournalEntry_organizationId_entryDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JournalEntry_organizationId_entryDate_idx" ON public."JournalEntry" USING btree ("organizationId", "entryDate");


--
-- Name: JournalEntry_referenceType_referenceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JournalEntry_referenceType_referenceId_idx" ON public."JournalEntry" USING btree ("referenceType", "referenceId");


--
-- Name: JournalLine_accountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JournalLine_accountId_idx" ON public."JournalLine" USING btree ("accountId");


--
-- Name: JournalLine_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JournalLine_journalEntryId_idx" ON public."JournalLine" USING btree ("journalEntryId");


--
-- Name: Organization_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Organization_code_key" ON public."Organization" USING btree (code);


--
-- Name: Organization_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Organization_name_idx" ON public."Organization" USING btree (name);


--
-- Name: Organization_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Organization_status_idx" ON public."Organization" USING btree (status);


--
-- Name: Partner_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Partner_organizationId_status_idx" ON public."Partner" USING btree ("organizationId", status);


--
-- Name: Partner_organizationId_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Partner_organizationId_type_idx" ON public."Partner" USING btree ("organizationId", type);


--
-- Name: Payment_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_organizationId_status_idx" ON public."Payment" USING btree ("organizationId", status);


--
-- Name: Payment_paidAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_paidAt_idx" ON public."Payment" USING btree ("paidAt");


--
-- Name: Payment_salesOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_salesOrderId_idx" ON public."Payment" USING btree ("salesOrderId");


--
-- Name: Permission_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_code_key" ON public."Permission" USING btree (code);


--
-- Name: Product_organizationId_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_organizationId_barcode_key" ON public."Product" USING btree ("organizationId", barcode);


--
-- Name: Product_organizationId_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_organizationId_categoryId_idx" ON public."Product" USING btree ("organizationId", "categoryId");


--
-- Name: Product_organizationId_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_organizationId_name_idx" ON public."Product" USING btree ("organizationId", name);


--
-- Name: Product_organizationId_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_organizationId_sku_key" ON public."Product" USING btree ("organizationId", sku);


--
-- Name: Product_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_organizationId_status_idx" ON public."Product" USING btree ("organizationId", status);


--
-- Name: PurchaseOrderItem_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrderItem_productId_idx" ON public."PurchaseOrderItem" USING btree ("productId");


--
-- Name: PurchaseOrderItem_purchaseOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON public."PurchaseOrderItem" USING btree ("purchaseOrderId");


--
-- Name: PurchaseOrder_organizationId_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PurchaseOrder_organizationId_orderNumber_key" ON public."PurchaseOrder" USING btree ("organizationId", "orderNumber");


--
-- Name: PurchaseOrder_organizationId_partnerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_organizationId_partnerId_idx" ON public."PurchaseOrder" USING btree ("organizationId", "partnerId");


--
-- Name: PurchaseOrder_organizationId_storeId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_organizationId_storeId_createdAt_idx" ON public."PurchaseOrder" USING btree ("organizationId", "storeId", "createdAt");


--
-- Name: PurchaseOrder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_status_idx" ON public."PurchaseOrder" USING btree (status);


--
-- Name: Region_organizationId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Region_organizationId_code_key" ON public."Region" USING btree ("organizationId", code);


--
-- Name: Region_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Region_organizationId_status_idx" ON public."Region" USING btree ("organizationId", status);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: SalesOrderItem_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalesOrderItem_productId_idx" ON public."SalesOrderItem" USING btree ("productId");


--
-- Name: SalesOrderItem_salesOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalesOrderItem_salesOrderId_idx" ON public."SalesOrderItem" USING btree ("salesOrderId");


--
-- Name: SalesOrder_organizationId_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalesOrder_organizationId_customerId_idx" ON public."SalesOrder" USING btree ("organizationId", "customerId");


--
-- Name: SalesOrder_organizationId_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SalesOrder_organizationId_orderNumber_key" ON public."SalesOrder" USING btree ("organizationId", "orderNumber");


--
-- Name: SalesOrder_organizationId_storeId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalesOrder_organizationId_storeId_createdAt_idx" ON public."SalesOrder" USING btree ("organizationId", "storeId", "createdAt");


--
-- Name: SalesOrder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalesOrder_status_idx" ON public."SalesOrder" USING btree (status);


--
-- Name: Store_organizationId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Store_organizationId_code_key" ON public."Store" USING btree ("organizationId", code);


--
-- Name: Store_organizationId_regionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Store_organizationId_regionId_idx" ON public."Store" USING btree ("organizationId", "regionId");


--
-- Name: Store_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Store_organizationId_status_idx" ON public."Store" USING btree ("organizationId", status);


--
-- Name: User_organizationId_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_organizationId_email_key" ON public."User" USING btree ("organizationId", email);


--
-- Name: User_organizationId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_organizationId_status_idx" ON public."User" USING btree ("organizationId", status);


--
-- Name: Account Account_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Account Account_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AuditLog AuditLog_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Category Category_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Customer Customer_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryMovement InventoryMovement_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryMovement InventoryMovement_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryMovement InventoryMovement_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Inventory Inventory_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inventory Inventory_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Inventory Inventory_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JournalEntry JournalEntry_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JournalLine JournalLine_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalLine"
    ADD CONSTRAINT "JournalLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JournalLine JournalLine_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalLine"
    ADD CONSTRAINT "JournalLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public."JournalEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Partner Partner_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partner"
    ADD CONSTRAINT "Partner_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_salesOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES public."SalesOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseOrderItem PurchaseOrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrderItem PurchaseOrderItem_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseOrder PurchaseOrder_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrder PurchaseOrder_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public."Partner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrder PurchaseOrder_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Region Region_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "Region_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SalesOrderItem SalesOrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SalesOrderItem SalesOrderItem_salesOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES public."SalesOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SalesOrder SalesOrder_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SalesOrder SalesOrder_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SalesOrder SalesOrder_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Store Store_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Store Store_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Store Store_regionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES public."Region"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict IwWJTe3lYmjXDqRlE8xKj2qTj0hlkzqHpP2yghr9gI4LWToUDsooenjqbhwLznC

