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
    iconName: "inventory"
  },
  {
    name: "Stores",
    href: "/stores",
    iconName: "stores"
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
    iconName: "ledger"
  },
  {
    name: "Reports",
    href: "/reports",
    iconName: "reports"
  },
  {
    name: "Settings",
    href: "/settings",
    iconName: "settings"
  }
];

export const MOBILE_BOTTOM_NAV_ITEMS: { name: string; href: string; iconName: string }[] = [
  { name: "Dashboard", href: "/dashboard", iconName: "dashboard" },
  { name: "Inventory", href: "/inventory", iconName: "inventory" },
  { name: "Stores", href: "/stores", iconName: "stores" },
  { name: "Partners", href: "/partners", iconName: "partners" },
  { name: "More", href: "#more", iconName: "more" }
];
