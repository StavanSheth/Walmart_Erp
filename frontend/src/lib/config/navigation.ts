import type { NavItem } from "@/types/navigation";

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    iconName: "dashboard"
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
    name: "Partners & Customers",
    href: "/partners",
    iconName: "partners",
    description: "Wholesalers, Retailers, Suppliers & Customers"
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
  { name: "Reports", href: "/reports", iconName: "reports" },
  { name: "More", href: "#more", iconName: "more" }
];
