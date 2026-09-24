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
            <div className="absolute top-0 left-0 right-0 h-[460px] sm:h-[480px] lg:h-[500px] overflow-hidden pointer-events-none z-0 bg-[#06182c]">
              {/* Shifted to the right: occupies right 70-85% on larger screens, leaving left for dark navy greeting contrast */}
              <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[92%] md:w-[85%] lg:w-[78%] xl:w-[72%]">
                <Image
                  src={ASSETS.dashboard.banner}
                  alt="Walmart Supercenter Twilight Banner"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1536px) 100vw, 1536px"
                  className="object-cover object-[70%_35%]"
                />
                {/* Smooth horizontal gradient blend from left dark navy into the store banner image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#06182c] via-[#06182c]/40 to-transparent" />
              </div>

              {/* Subtle top shade for header controls contrast */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#06182c]/70 to-transparent" />

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
