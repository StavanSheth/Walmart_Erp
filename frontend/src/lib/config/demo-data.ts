import type { NotificationItem, SearchResultItem } from "@/types/store";

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "stock",
    title: "Low Stock Alert",
    message: "Amul Butter 500g is below reorder threshold (8 units left) at Mumbai Andheri.",
    timestamp: "10 mins ago",
    read: false,
    priority: "high",
    link: "/inventory"
  },
  {
    id: "notif-2",
    type: "order",
    title: "Purchase Order Confirmed",
    message: "PO-2026-0025 confirmed by Tata Consumer Products (120 cases scheduled).",
    timestamp: "1 hour ago",
    read: false,
    priority: "medium",
    link: "/inventory"
  },
  {
    id: "notif-3",
    type: "payment",
    title: "Payment Reconciliation",
    message: "₹45,200 payment verified for B2B invoice INV-2026-0089.",
    timestamp: "3 hours ago",
    read: true,
    priority: "low",
    link: "/ledger"
  },
  {
    id: "notif-4",
    type: "system",
    title: "Sale Completed",
    message: "Retail counter POS-02 processed order SO-2026-0075 (₹3,450 via UPI).",
    timestamp: "5 hours ago",
    read: true,
    priority: "low",
    link: "/dashboard"
  }
];

export const DEMO_SEARCH_DATA: SearchResultItem[] = [
  // Products
  {
    id: "prod-1",
    category: "Products",
    title: "Aashirvaad Shudh Chakki Atta 5kg",
    subtitle: "SKU: GRO-ATT-001 • FMCG / Staples • ₹280",
    badge: "In Stock",
    href: "/inventory"
  },
  {
    id: "prod-2",
    category: "Products",
    title: "Amul Pasteurised Butter 500g",
    subtitle: "SKU: GRO-DAI-001 • Dairy / Refrig • ₹275",
    badge: "Low Stock",
    href: "/inventory"
  },
  {
    id: "prod-3",
    category: "Products",
    title: "Tata Tea Premium 1kg",
    subtitle: "SKU: BEV-TEA-001 • Beverages • ₹490",
    badge: "In Stock",
    href: "/inventory"
  },
  {
    id: "prod-4",
    category: "Products",
    title: "Samsung 55-inch 4K UHD Smart TV",
    subtitle: "SKU: ELE-TV-001 • Electronics • ₹42,990",
    badge: "In Stock",
    href: "/inventory"
  },
  // Stores
  {
    id: "store-1",
    category: "Stores",
    title: "Walmart Mumbai Andheri",
    subtitle: "WAL-MUM-001 • Andheri West, Mumbai, MH",
    badge: "Supercenter",
    href: "/stores"
  },
  {
    id: "store-2",
    category: "Stores",
    title: "Walmart Delhi Connaught Place",
    subtitle: "WAL-DEL-001 • Connaught Place, New Delhi",
    badge: "Supercenter",
    href: "/stores"
  },
  {
    id: "store-3",
    category: "Stores",
    title: "Walmart Bangalore Indiranagar",
    subtitle: "WAL-BLR-001 • 100 Feet Rd, Bengaluru, KA",
    badge: "Express",
    href: "/stores"
  },
  // Customers
  {
    id: "cust-1",
    category: "Customers",
    title: "Rahul Sharma",
    subtitle: "rahul.sharma@example.in • +91 98201 23456",
    badge: "Retail",
    href: "/partners"
  },
  {
    id: "cust-2",
    category: "Customers",
    title: "Pooja Patel",
    subtitle: "pooja.patel@example.in • +91 98112 34567",
    badge: "Retail",
    href: "/partners"
  },
  // Partners
  {
    id: "part-1",
    category: "Partners",
    title: "Tata Consumer Products Ltd",
    subtitle: "GSTIN: 27AABCT1234F1Z5 • Mumbai, MH",
    badge: "Supplier",
    href: "/partners"
  },
  {
    id: "part-2",
    category: "Partners",
    title: "Amul India (GCMMF)",
    subtitle: "GSTIN: 24AAACG1234D1Z8 • Anand, GJ",
    badge: "Supplier",
    href: "/partners"
  },
  // Orders
  {
    id: "ord-1",
    category: "Orders",
    title: "SO-2026-0075",
    subtitle: "Sales Order • ₹3,450 • Customer: Rahul Sharma",
    badge: "Delivered",
    href: "/dashboard"
  },
  {
    id: "ord-2",
    category: "Orders",
    title: "PO-2026-0025",
    subtitle: "Purchase Order • ₹2,45,000 • Vendor: Tata Consumer",
    badge: "Received",
    href: "/inventory"
  }
];
