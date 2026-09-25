"use client";

import * as React from "react";
import type { StoreInfo } from "@/types/store";
import type { ShellContextType } from "@/types/navigation";
import { apiClient } from "@/lib/api/client";

const INITIAL_STORE: StoreInfo = {
  id: "store-del-001",
  code: "WAL-DEL-001",
  name: "Walmart Delhi Connaught Place",
  city: "New Delhi",
  state: "Delhi",
  address: "Block A, Connaught Place, New Delhi 110001",
  phone: "+91 11 23456701"
};

const ShellContext = React.createContext<ShellContextType | null>(null);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState<boolean>(false);
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState<boolean>(false);
  const [stores, setStores] = React.useState<StoreInfo[]>([]);
  const [currentStore, setCurrentStore] = React.useState<StoreInfo>(INITIAL_STORE);

  // Fetch real stores live from PostgreSQL database
  React.useEffect(() => {
    async function loadStores() {
      try {
        const res = await apiClient.get<StoreInfo[]>("/api/stores");
        if (res.data && res.data.length > 0) {
          setStores(res.data);
          setCurrentStore((prev) => {
            const exists = res.data?.find((s: StoreInfo) => s.id === prev.id || s.code === prev.code);
            return exists || res.data![0];
          });
        }
      } catch (err) {
        console.error("Failed to load stores from API", err);
      }
    }
    loadStores();
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K for global search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = React.useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed,
      mobileDrawerOpen,
      setMobileDrawerOpen,
      searchOpen,
      setSearchOpen,
      notificationsOpen,
      setNotificationsOpen,
      currentStore,
      setCurrentStore,
      stores
    }),
    [
      sidebarCollapsed,
      toggleSidebar,
      mobileDrawerOpen,
      searchOpen,
      notificationsOpen,
      currentStore,
      stores
    ]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellContextType {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
}
