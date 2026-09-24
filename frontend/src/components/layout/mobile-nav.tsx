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
      title="Walmart ERP Navigation"
      side="left"
    >
      <div className="space-y-6">
        {/* Active Store Widget */}
        <div className="relative rounded-xl overflow-hidden h-28 border border-border shadow-xs">
          <Image
            src={ASSETS.stores.sidebar}
            alt={currentStore.name}
            fill
            className="object-cover"
            sizes="300px"
          />
          <div className="absolute inset-0 bg-brand-navy-dark/85 flex flex-col justify-end p-3 text-white">
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-yellow">
              Active Store
            </span>
            <p className="text-xs font-bold truncate">{currentStore.name}</p>
            <p className="text-[10px] text-slate-300">
              {currentStore.city}, {currentStore.state}
            </p>
          </div>
        </div>

        {/* All Navigation Links */}
        <div className="space-y-1">
          <p className="type-label px-2 mb-2 text-slate-400">
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
                  "flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors",
                  isActive
                    ? "bg-brand-primary text-white shadow-xs font-semibold"
                    : "text-slate-700 hover:bg-surface-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <NavIconByName
                    name={item.iconName}
                    className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-pill text-[10px] font-bold",
                      isActive
                        ? "bg-white text-brand-primary"
                        : "bg-brand-yellow text-brand-navy"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Brand Footer */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-slate-400 px-2">
          <div className="flex items-center gap-2">
            <SparkIcon className="w-4 h-4" />
            <span className="font-semibold text-slate-700">Walmart ERP</span>
          </div>
          <span className="tabular-nums">v0.1.0</span>
        </div>
      </div>
    </Sheet>
  );
}
