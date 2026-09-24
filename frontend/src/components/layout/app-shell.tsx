"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ShellProvider } from "@/context/shell-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileBottomNav, MobileDrawer } from "./mobile-nav";
import { GlobalSearchModal } from "./global-search";
import { cn } from "@/lib/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname === "/";

  return (
    <ShellProvider>
      <div
        className={cn(
          "min-h-screen flex antialiased transition-colors duration-300",
          isDashboard ? "dashboard-bg text-white" : "bg-surface-page text-slate-900"
        )}
      >
        {/* Desktop / Tablet Sidebar (hidden on mobile) */}
        <Sidebar className="hidden md:flex shrink-0 sticky top-0" isDashboard={isDashboard} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header isDashboard={isDashboard} />

          {/* Page Content Slot: pb-24 on mobile accommodates fixed floating bottom nav */}
          <main className="flex-1 pb-24 md:pb-8">
            {children}
          </main>

          {/* Floating Liquid-Glass Mobile Bottom Navigation */}
          <MobileBottomNav />

          {/* Mobile Drawer (Left Slide-out Sheet) */}
          <MobileDrawer />

          {/* Global Search Dialog (Cmd+K) */}
          <GlobalSearchModal />
        </div>
      </div>
    </ShellProvider>
  );
}
