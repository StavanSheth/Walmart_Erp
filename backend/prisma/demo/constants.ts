// =============================================================================
// Demo Seed Constants
// All deterministic IDs, codes, and configuration for the demo dataset
// =============================================================================

import { Prisma } from "@prisma/client";

/** Shorthand for creating Prisma Decimal values */
export const D = (v: string | number) => new Prisma.Decimal(String(v));

/** Organization */
export const ORG_ID = "org-walmart-demo";
export const ORG = {
  id: ORG_ID,
  name: "Walmart Demo",
  code: "WALMART-DEMO",
  currency: "INR",
  timezone: "Asia/Kolkata",
};

/** Demo admin user (required for AuditLog.userId FK) */
export const ADMIN_USER_ID = "user-demo-admin";

/** Admin role */
export const ADMIN_ROLE_ID = "role-demo-admin";

/** Regions */
export const REGIONS = [
  { id: "region-north", name: "North India", code: "NORTH" },
  { id: "region-south", name: "South India", code: "SOUTH" },
  { id: "region-west", name: "West India", code: "WEST" },
  { id: "region-east", name: "East India", code: "EAST" },
] as const;

/** Stores — 8 stores across 4 regions */
export const STORES = [
  {
    id: "store-del-001",
    regionId: "region-north",
    code: "WAL-DEL-001",
    name: "Walmart Delhi Connaught Place",
    address: "Block A, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "+91 11 23456701",
    email: "delhi.cp@walmart-demo.in",
    image: "/images/stores/store-delhi.webp",
  },
  {
    id: "store-jpr-001",
    regionId: "region-north",
    code: "WAL-JPR-001",
    name: "Walmart Jaipur MI Road",
    address: "MI Road, Near Panch Batti",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    phone: "+91 141 2345672",
    email: "jaipur.mi@walmart-demo.in",
    image: "/images/stores/store-jaipur.webp",
  },
  {
    id: "store-mum-001",
    regionId: "region-west",
    code: "WAL-MUM-001",
    name: "Walmart Mumbai Andheri",
    address: "Andheri West, Link Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    phone: "+91 22 23456703",
    email: "mumbai.andheri@walmart-demo.in",
    image: "/images/stores/store-mumbai.webp",
  },
  {
    id: "store-pun-001",
    regionId: "region-west",
    code: "WAL-PUN-001",
    name: "Walmart Pune FC Road",
    address: "FC Road, Shivajinagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    phone: "+91 20 23456704",
    email: "pune.fc@walmart-demo.in",
    image: "/images/stores/store-pune.webp",
  },
  {
    id: "store-blr-001",
    regionId: "region-south",
    code: "WAL-BLR-001",
    name: "Walmart Bangalore Koramangala",
    address: "80 Feet Road, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    phone: "+91 80 23456705",
    email: "blr.koramangala@walmart-demo.in",
    image: "/images/stores/store-bangalore.webp",
  },
  {
    id: "store-chn-001",
    regionId: "region-south",
    code: "WAL-CHN-001",
    name: "Walmart Chennai T Nagar",
    address: "Usman Road, T Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600017",
    phone: "+91 44 23456706",
    email: "chennai.tnagar@walmart-demo.in",
    image: "/images/stores/store-chennai.webp",
  },
  {
    id: "store-kol-001",
    regionId: "region-east",
    code: "WAL-KOL-001",
    name: "Walmart Kolkata Park Street",
    address: "Park Street, Near Flury's",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    phone: "+91 33 23456707",
    email: "kolkata.park@walmart-demo.in",
    image: "/images/stores/store-kolkata.webp",
  },
  {
    id: "store-gwh-001",
    regionId: "region-east",
    code: "WAL-GWH-001",
    name: "Walmart Guwahati GS Road",
    address: "GS Road, Dispur",
    city: "Guwahati",
    state: "Assam",
    pincode: "781005",
    phone: "+91 361 2345608",
    email: "guwahati.gs@walmart-demo.in",
    image: "/images/stores/store-guwahati.webp",
  },
] as const;

/** Category hierarchy — parent categories and sub-categories */
export const CATEGORIES = [
  { id: "cat-grocery", code: "GRC", name: "Groceries", parentId: null },
  { id: "cat-beverages", code: "BEV", name: "Beverages", parentId: null },
  { id: "cat-dairy", code: "DRY", name: "Dairy", parentId: null },
  { id: "cat-bakery", code: "BKY", name: "Bakery", parentId: null },
  { id: "cat-personal", code: "PRC", name: "Personal Care", parentId: null },
  { id: "cat-household", code: "HLD", name: "Household", parentId: null },
  { id: "cat-electronics", code: "ELC", name: "Electronics", parentId: null },
  { id: "cat-mobile-acc", code: "MOB", name: "Mobile Accessories", parentId: "cat-electronics" },
  { id: "cat-audio", code: "AUD", name: "Audio", parentId: "cat-electronics" },
  { id: "cat-comp-acc", code: "CMP", name: "Computer Accessories", parentId: "cat-electronics" },
  { id: "cat-appliances", code: "APL", name: "Home Appliances", parentId: null },
  { id: "cat-kitchen", code: "KTN", name: "Kitchen", parentId: null },
  { id: "cat-furniture", code: "FRN", name: "Furniture", parentId: null },
  { id: "cat-clothing", code: "CLT", name: "Clothing", parentId: null },
  { id: "cat-footwear", code: "FTW", name: "Footwear", parentId: null },
  { id: "cat-stationery", code: "STN", name: "Stationery", parentId: null },
  { id: "cat-sports", code: "SPT", name: "Sports", parentId: null },
  { id: "cat-toys", code: "TOY", name: "Toys", parentId: null },
  { id: "cat-beauty", code: "BTY", name: "Beauty", parentId: null },
  { id: "cat-petcare", code: "PET", name: "Pet Care", parentId: null },
] as const;

/** GST tax rates used in India */
export const TAX_RATES = [0, 5, 12, 18, 28] as const;

/** Chart of Accounts */
export const ACCOUNTS = [
  { id: "acc-1000", code: "1000", name: "Cash", type: "ASSET" as const },
  { id: "acc-1010", code: "1010", name: "Bank", type: "ASSET" as const },
  { id: "acc-1100", code: "1100", name: "Accounts Receivable", type: "ASSET" as const },
  { id: "acc-1200", code: "1200", name: "Inventory", type: "ASSET" as const },
  { id: "acc-1300", code: "1300", name: "Input Tax (GST Credit)", type: "ASSET" as const },
  { id: "acc-2000", code: "2000", name: "Accounts Payable", type: "LIABILITY" as const },
  { id: "acc-2100", code: "2100", name: "Tax Payable (GST Output)", type: "LIABILITY" as const },
  { id: "acc-3000", code: "3000", name: "Owner Equity", type: "EQUITY" as const },
  { id: "acc-4000", code: "4000", name: "Sales Revenue", type: "REVENUE" as const },
  { id: "acc-4100", code: "4100", name: "Sales Discount", type: "EXPENSE" as const },
  { id: "acc-5000", code: "5000", name: "Cost of Goods Sold", type: "EXPENSE" as const },
  { id: "acc-5100", code: "5100", name: "Purchase Expense", type: "EXPENSE" as const },
] as const;
