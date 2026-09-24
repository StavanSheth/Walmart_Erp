import type { StoreInfo } from "@/types/store";

export const DEMO_STORES: StoreInfo[] = [
  {
    id: "store-mum-001",
    code: "WAL-MUM-001",
    name: "Walmart Mumbai Andheri",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Andheri West, Mumbai, Maharashtra 400053",
    phone: "+91 22 26789012",
    pincode: "400053",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-del-001",
    code: "WAL-DEL-001",
    name: "Walmart Delhi Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    address: "Block A, Connaught Place, New Delhi 110001",
    phone: "+91 11 23456701",
    pincode: "110001",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-blr-001",
    code: "WAL-BLR-001",
    name: "Walmart Bangalore Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    address: "100 Feet Rd, Indiranagar, Bengaluru 560038",
    phone: "+91 80 23456701",
    pincode: "560038",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-pun-001",
    code: "WAL-PUN-001",
    name: "Walmart Pune Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    address: "North Main Road, Koregaon Park, Pune 411001",
    phone: "+91 20 23456701",
    pincode: "411001",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-chn-001",
    code: "WAL-CHN-001",
    name: "Walmart Chennai T Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Usman Road, T Nagar, Chennai 600017",
    phone: "+91 44 23456701",
    pincode: "600017",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-kol-001",
    code: "WAL-KOL-001",
    name: "Walmart Kolkata Park Street",
    city: "Kolkata",
    state: "West Bengal",
    address: "Park Street, Kolkata 700016",
    phone: "+91 33 23456701",
    pincode: "700016",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-jpr-001",
    code: "WAL-JPR-001",
    name: "Walmart Jaipur MI Road",
    city: "Jaipur",
    state: "Rajasthan",
    address: "MI Road, Near Panch Batti, Jaipur 302001",
    phone: "+91 141 2345672",
    pincode: "302001",
    imageUrl: "/images/stores/store-main.webp"
  },
  {
    id: "store-bhu-001",
    code: "WAL-BHU-001",
    name: "Walmart Bhubaneswar Janpath",
    city: "Bhubaneswar",
    state: "Odisha",
    address: "Janpath, Ashok Nagar, Bhubaneswar 751001",
    phone: "+91 674 2345671",
    pincode: "751001",
    imageUrl: "/images/stores/store-main.webp"
  }
];

export const DEFAULT_STORE = DEMO_STORES[0];
