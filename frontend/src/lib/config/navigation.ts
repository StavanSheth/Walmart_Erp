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
    description: "Stocks & Products"
  },
  {
    name: "Stores",
    href: "/stores",
    iconName: "stores",
    description: "Store Management"
  },
  {
    name: "Wholesalers / Retailers / Customers",
    href: "/partners",
    iconName: "partners",
    description: "Partners & Customers"
  },
  {
    name: "Purchases",
    href: "/ledger",
    iconName: "purchases",
    description: "Procurement"
  },
  {
    name: "Sales",
    href: "/dashboard",
    iconName: "sales",
    description: "Order Management"
  },
  {
    name: "Suppliers",
    href: "/partners",
    iconName: "suppliers",
    description: "Vendor Relations"
  },
  {
    name: "Ledger",
    href: "/ledger",
    iconName: "ledger",
    description: "Accounts & Transactions"
  },
  {
    name: "Reports",
    href: "/reports",
    iconName: "reports",
    description: "Analytics & Insights"
  },
  {
    name: "Settings",
    href: "/settings",
    iconName: "settings",
    description: "System Configuration"
  }
];

export const MOBILE_BOTTOM_NAV_ITEMS: { name: string; href: string; iconName: string }[] = [
  { name: "Dashboard", href: "/dashboard", iconName: "dashboard" },
  { name: "Inventory", href: "/inventory", iconName: "inventory" },
  { name: "Stores", href: "/stores", iconName: "stores" },
  { name: "Partners", href: "/partners", iconName: "partners" },
  { name: "More", href: "#more", iconName: "more" }
];
