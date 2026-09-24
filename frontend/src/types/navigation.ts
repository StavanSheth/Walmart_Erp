
export interface NavItem {
  name: string;
  href: string;
  iconName: string;
  badge?: string | number;
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface ShellContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  currentStore: import("./store").StoreInfo;
  setCurrentStore: (store: import("./store").StoreInfo) => void;
  stores: import("./store").StoreInfo[];
}
