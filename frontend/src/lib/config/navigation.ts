import type { NavItem } from "@/types/navigation";

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    iconName: "dashboard",
    description: "Executive KPIs, sales trends, and store summary"
  },
  {
    name: "Inventory",
    href: "/inventory",
    iconName: "inventory",
    description: "Stock levels, replenishment alerts, and movements",
    badge: "12"
  },
  {
    name: "Stores",
    href: "/stores",
    iconName: "stores",
    description: "Store network, regional performance, and registers"
  },
  {
    name: "Partners & Customers",
    href: "/partners",
    iconName: "partners",
    description: "Suppliers, vendors, and retail customer database"
  },
  {
    name: "General Ledger",
    href: "/ledger",
    iconName: "ledger",
    description: "Chart of accounts, journal entries, and balance sheet"
  },
  {
    name: "Reports",
    href: "/reports",
    iconName: "reports",
    description: "Financial analytics, GST summary, and audit reports"
  },
  {
    name: "Settings",
    href: "/settings",
    iconName: "settings",
    description: "Tenant configuration, tax codes, and preferences"
  }
];

export const MOBILE_BOTTOM_NAV_ITEMS: { name: string; href: string; iconName: string }[] = [
  { name: "Home", href: "/dashboard", iconName: "dashboard" },
  { name: "Inventory", href: "/inventory", iconName: "inventory" },
  { name: "Stores", href: "/stores", iconName: "stores" },
  { name: "Reports", href: "/reports", iconName: "reports" },
  { name: "More", href: "#more", iconName: "more" }
];
