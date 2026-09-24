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
          {/* Top Banner Image (ONLY behind header, search, and greeting - KPI cards sit below banner) */}
          {isDashboard && (
            <div className="absolute top-0 left-0 right-0 h-[210px] sm:h-[230px] lg:h-[250px] overflow-hidden pointer-events-none z-0">
              <Image
                src={ASSETS.dashboard.banner}
                alt="Walmart Supercenter Twilight Banner"
                fill
                priority
                unoptimized
                sizes="(max-width: 1536px) 100vw, 1536px"
                className="object-cover object-[75%_35%]"
              />
              {/* Subtle translucent dark wash for text contrast with NO solid background block */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />

              {/* Bottom smooth fade into normal #F4F6F9 canvas right above the KPI cards */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F6F9] via-[#F4F6F9]/80 to-transparent" />
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
