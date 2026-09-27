"use client";

import * as React from "react";
import Image from "next/image";
import { ShellProvider } from "@/context/shell-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileBottomNav, MobileDrawer } from "./mobile-nav";
import { GlobalSearchModal } from "./global-search";
import { ASSETS } from "@/lib/assets";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hasBanner = true;

  return (
    <ShellProvider>
      <div className="min-h-screen flex antialiased bg-[#F4F6F9] text-slate-900">
        {/* Laptop / Desktop Sidebar (hidden on mobile and tablet) - solid navy, NO banner image */}
        <Sidebar className="hidden lg:flex shrink-0 sticky top-0" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Top Banner Image (Visible behind header and page hero section across all sections) */}
          {hasBanner && (
            <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none z-0 h-[460px] sm:h-[500px] lg:h-[540px] xl:h-[560px]">
              <Image
                src={ASSETS.dashboard.banner}
                alt="Walmart Supercenter Twilight Banner"
                fill
                priority
                unoptimized
                sizes="(max-width: 1536px) 100vw, 1536px"
                className="object-cover object-[70%_20%]"
              />
              {/* Subtle translucent dark wash for text contrast with NO solid background block */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />

              {/* Bottom edge transition into #F4F6F9 canvas */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F4F6F9] via-[#F4F6F9]/60 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Header sits directly over the top banner */}
          <Header isDashboard={hasBanner} />

          {/* Page Content Slot: pb-24 on mobile accommodates fixed floating bottom nav */}
          <main className="flex-1 pb-24 md:pb-8 relative z-10">
            <React.Suspense fallback={null}>
              {children}
            </React.Suspense>
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
