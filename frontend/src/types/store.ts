export interface StoreInfo {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  pincode?: string;
  imageUrl?: string;
}

export interface NotificationItem {
  id: string;
  type: "stock" | "order" | "payment" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: "low" | "medium" | "high";
  link?: string;
}

export interface SearchResultItem {
  id: string;
  category: "Products" | "Stores" | "Customers" | "Partners" | "Orders";
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
}
