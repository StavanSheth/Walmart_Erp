import type { StoreInfo } from "@/types/store";

/**
 * @deprecated All stores are now queried dynamically from PostgreSQL (/api/stores).
 * Static store lists have been removed.
 */
export const DEMO_STORES: StoreInfo[] = [];
export const DEFAULT_STORE: StoreInfo = {
  id: "store-del-001",
  code: "WAL-DEL-001",
  name: "Walmart Delhi Connaught Place",
  city: "New Delhi",
  state: "Delhi",
  address: "Block A, Connaught Place, New Delhi 110001",
  phone: "+91 11 23456701"
};
