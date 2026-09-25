"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShell } from "@/context/shell-context";
import { MOBILE_BOTTOM_NAV_ITEMS, MAIN_NAV_ITEMS } from "@/lib/config/navigation";
import { ASSETS } from "@/lib/assets";
import { NavIconByName, SparkIcon } from "../ui/icons";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import Image from "next/image";

export function MobileBottomNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { setMobileDrawerOpen } = useShell();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={cn(
        "fixed bottom-3 left-4 right-4 z-dropdown md:hidden",
        "glass-nav rounded-2xl px-2 py-1.5 shadow-2xl",
        className
      )}
    >
      <div className="flex items-center justify-around">
        {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
          const isMore = item.name === "More";
          const isActive =
            !isMore &&
            (pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href)));

          if (isMore) {
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-brand-primary transition-all focus-visible:outline-none"
              >
                <NavIconByName name={item.iconName} className="w-5 h-5 text-slate-600" />
                <span className="text-[10px] font-medium text-slate-600 mt-0.5">More</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 focus-visible:outline-none",
                isActive
                  ? "bg-brand-sky text-brand-primary font-bold shadow-xs scale-105"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <NavIconByName
                name={item.iconName}
                className={cn("w-5 h-5", isActive ? "text-brand-primary" : "text-slate-600")}
              />
              <span
                className={cn(
                  "text-[10px] mt-0.5",
                  isActive ? "text-brand-primary font-bold" : "text-slate-600 font-medium"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileDrawer() {
  const pathname = usePathname();
  const { mobileDrawerOpen, setMobileDrawerOpen, currentStore } = useShell();

  return (
    <Sheet
      isOpen={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      title="Walmart ERP"
      side="left"
      variant="glass"
    >
      <div className="space-y-5">
        {/* Active Store Liquid Glass Widget */}
        <div className="relative rounded-2xl overflow-hidden h-28 border border-white/20 shadow-lg group">
          <Image
            src={ASSETS.stores.sidebar}
            alt={currentStore.name}
            fill
            className="object-cover"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06182c]/95 via-[#06182c]/70 to-[#06182c]/30 backdrop-blur-[1px] flex flex-col justify-end p-3.5 text-white">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#FFC220] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC220] animate-pulse shadow-xs" />
              Active Store Outlet
            </span>
            <p className="text-sm font-extrabold text-white truncate drop-shadow-sm mt-0.5">
              {currentStore.name}
            </p>
            <p className="text-[11px] text-blue-100 font-medium">
              {currentStore.city}, {currentStore.state}
            </p>
          </div>
        </div>

        {/* All Navigation Links */}
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold tracking-wider text-blue-200/80 uppercase px-2 mb-2">
            Modules
          </p>
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[#0071DC] text-white shadow-lg shadow-blue-900/50 border border-blue-400/40"
                    : "text-white/80 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/15"
                )}
              >
                <div className="flex items-center gap-3">
                  <NavIconByName
                    name={item.iconName}
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-white" : "text-blue-200"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs",
                      isActive
                        ? "bg-white text-[#0071DC]"
                        : "bg-[#FFC220] text-slate-900"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Promo Card: "Stronger Communities Everyday." */}
        <div className="relative overflow-hidden p-3 rounded-xl border border-white/20 flex items-center justify-between shadow-md">
          <div className="absolute inset-0 z-0">
            <Image
              src={ASSETS.dashboard.banner}
              alt="Walmart Supercenter"
              fill
              unoptimized
              sizes="280px"
              className="object-cover object-center scale-110"
            />
            <div className="absolute inset-0 bg-[#06182c]/80 backdrop-blur-[1px]" />
          </div>
          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <SparkIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[10px] leading-tight text-slate-200">
              <span className="font-bold text-white block">Stronger</span>
              Communities Everyday.
            </div>
          </div>
          <div className="relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-200/80 px-2">
          <div className="flex items-center gap-2">
            <SparkIcon className="w-4 h-4 text-[#FFC220]" />
            <span className="font-bold text-white">Walmart ERP</span>
          </div>
          <span className="tabular-nums font-mono text-[10px] text-blue-200/60">v0.1.0</span>
        </div>
      </div>
    </Sheet>
  );
}
