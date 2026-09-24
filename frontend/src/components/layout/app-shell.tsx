"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShellProvider } from "@/context/shell-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileBottomNav, MobileDrawer } from "./mobile-nav";
import { GlobalSearchModal } from "./global-search";
import { ASSETS } from "@/lib/assets";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname === "/";

  return (
    <ShellProvider>
      <div className="min-h-screen flex antialiased bg-[#F4F6F9] text-slate-900">
        {/* Desktop / Tablet Sidebar (hidden on mobile) - solid navy, NO banner image */}
        <Sidebar className="hidden md:flex shrink-0 sticky top-0" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Top 20-30% Banner Image (ONLY at top of main content on Dashboard, behind header, search, greeting, and KPI cards) */}
          {isDashboard && (
            <div className="absolute top-0 left-0 right-0 h-[460px] sm:h-[480px] lg:h-[500px] overflow-hidden pointer-events-none z-0">
              <Image
                src={ASSETS.dashboard.banner}
                alt="Walmart Supercenter Twilight Banner"
                fill
                priority
                unoptimized
                sizes="(max-width: 1536px) 100vw, 1536px"
                className="object-cover object-[center_35%]"
              />
              {/* Dark navy overlay on left behind search bar and greeting text, leaving store building visible on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#021526]/90 via-[#021526]/40 to-transparent" />
              {/* Subtle top shade for header controls contrast */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#021526]/60 to-transparent" />
              {/* Bottom smooth fade into normal #F4F6F9 canvas right below the KPI cards */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F4F6F9] via-[#F4F6F9]/85 to-transparent" />
            </div>
          )}

          {/* Header sits directly over the top banner */}
          <Header isDashboard={isDashboard} />

          {/* Page Content Slot: pb-24 on mobile accommodates fixed floating bottom nav */}
          <main className="flex-1 pb-24 md:pb-8 relative z-10">
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
