"use client";

import * as React from "react";
import type { StoreInfo } from "@/types/store";
import type { ShellContextType } from "@/types/navigation";
import { apiClient } from "@/lib/api/client";

import { DEMO_STORES, DEFAULT_STORE } from "@/lib/config/stores";

const ShellContext = React.createContext<ShellContextType | null>(null);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState<boolean>(false);
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState<boolean>(false);
  const [stores, setStores] = React.useState<StoreInfo[]>(DEMO_STORES);
  const [currentStore, setCurrentStore] = React.useState<StoreInfo>(DEFAULT_STORE);

  // Fetch real stores live from PostgreSQL database
  React.useEffect(() => {
    let active = true;
    async function loadStores() {
      try {
        const res = await apiClient.get<StoreInfo[]>("/api/stores");
        const raw = res as any;
        const list: StoreInfo[] = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.data?.data)
          ? raw.data.data
          : Array.isArray(raw)
          ? raw
          : [];
        if (active && list.length > 0) {
          setStores(list);
          setCurrentStore((prev) => {
            const exists = list.find((s: StoreInfo) => s.id === prev.id || s.code === prev.code);
            return exists || list[0];
          });
        }
      } catch (err) {
        if (active) {
          console.error("Failed to load stores from API:", err instanceof Error ? err.message : err);
        }
      }
    }
    void loadStores();

    return () => {
      active = false;
    };
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
