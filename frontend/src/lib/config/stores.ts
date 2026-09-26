import type { StoreInfo } from "@/types/store";

/**
 * @deprecated All stores are now queried dynamically from PostgreSQL (/api/stores).
 * Static store lists have been removed.
 */
export const DEMO_STORES: StoreInfo[] = [
  {
    id: "store-del-001",
    code: "WAL-DEL-001",
    name: "Walmart Delhi Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    address: "Block A, Connaught Place, New Delhi 110001",
    phone: "+91 11 23456701"
  },
  {
    id: "store-mum-001",
    code: "WAL-MUM-001",
    name: "Walmart Mumbai Andheri",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Andheri West, Link Road",
    phone: "+91 22 23456703"
  },
  {
    id: "store-blr-001",
    code: "WAL-BLR-001",
    name: "Walmart Bengaluru Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    address: "100 Feet Road, Indiranagar",
    phone: "+91 80 23456702"
  },
  {
    id: "store-kol-001",
    code: "WAL-KOL-001",
    name: "Walmart Kolkata Park Street",
    city: "Kolkata",
    state: "West Bengal",
    address: "Park Street, Near Flury's",
    phone: "+91 33 23456707"
  },
  {
    id: "store-hyd-001",
    code: "WAL-HYD-001",
    name: "Walmart Hyderabad Hitec City",
    city: "Hyderabad",
    state: "Telangana",
    address: "Madhapur, Hitec City",
    phone: "+91 40 23456705"
  },
  {
    id: "store-chn-001",
    code: "WAL-CHN-001",
    name: "Walmart Chennai T Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Usman Road, T Nagar",
    phone: "+91 44 23456706"
  },
  {
    id: "store-pun-001",
    code: "WAL-PUN-001",
    name: "Walmart Pune FC Road",
    city: "Pune",
    state: "Maharashtra",
    address: "FC Road, Shivajinagar",
    phone: "+91 20 23456704"
  },
  {
    id: "store-jpr-001",
    code: "WAL-JPR-001",
    name: "Walmart Jaipur MI Road",
    city: "Jaipur",
    state: "Rajasthan",
    address: "MI Road, Near Panch Batti",
    phone: "+91 141 2345672"
  }
];

export const DEFAULT_STORE: StoreInfo = DEMO_STORES[0];

