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
          {/* Top 20-30% Banner Image (ONLY at top of main content on Dashboard, behind header, search, and greeting) */}
          {isDashboard && (
            <div className="absolute top-0 left-0 right-0 h-[290px] sm:h-[330px] lg:h-[360px] overflow-hidden pointer-events-none z-0">
              <Image
                src={ASSETS.dashboard.banner}
                alt="Walmart Supercenter Twilight Banner"
                fill
                priority
                sizes="(max-width: 1536px) 100vw, 1536px"
                className="object-cover object-top"
              />
              {/* Atmospheric overlay: dark navy at top for search/icons contrast, fading into normal #F4F6F9 at bottom */}
              <div className="absolute inset-0 bg-linear-to-b from-[#031B33]/85 via-[#04244B]/75 to-[#F4F6F9]" />
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
