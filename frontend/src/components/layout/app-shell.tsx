"use client";

import * as React from "react";
import { ShellProvider } from "@/context/shell-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileBottomNav, MobileDrawer } from "./mobile-nav";
import { GlobalSearchModal } from "./global-search";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <div className="min-h-screen bg-walmart-surface text-slate-900 flex antialiased">
        {/* Desktop / Tablet Sidebar (hidden on mobile) */}
        <Sidebar className="hidden md:flex shrink-0 sticky top-0" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          {/* Page Content Slot: pb-20 on mobile accommodates fixed bottom nav */}
          <main className="flex-1 pb-20 md:pb-8">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
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
