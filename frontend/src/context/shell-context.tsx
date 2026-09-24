"use client";

import * as React from "react";
import type { StoreInfo } from "@/types/store";
import type { ShellContextType } from "@/types/navigation";
import { DEMO_STORES, DEFAULT_STORE } from "@/lib/config/stores";

const ShellContext = React.createContext<ShellContextType | null>(null);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState<boolean>(false);
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState<boolean>(false);
  const [currentStore, setCurrentStore] = React.useState<StoreInfo>(DEFAULT_STORE);

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
      stores: DEMO_STORES
    }),
    [
      sidebarCollapsed,
      toggleSidebar,
      mobileDrawerOpen,
      searchOpen,
      notificationsOpen,
      currentStore
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
