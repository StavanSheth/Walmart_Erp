"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShell } from "@/context/shell-context";
import { MOBILE_BOTTOM_NAV_ITEMS, MAIN_NAV_ITEMS } from "@/lib/config/navigation";
import { NavIconByName, SparkIcon } from "../ui/icons";
import { Sheet } from "../ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function MobileBottomNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { setMobileDrawerOpen } = useShell();

  return (
    <nav
      aria-label="Mobile Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 md:hidden shadow-lg",
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
                className="flex flex-col items-center justify-center p-1 rounded-lg text-slate-500 hover:text-walmart-blue transition-colors focus:outline-none"
              >
                <NavIconByName name={item.iconName} className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-1">More</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-lg transition-colors focus:outline-none",
                isActive
                  ? "text-walmart-blue font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <NavIconByName
                name={item.iconName}
                className={cn("w-5 h-5", isActive && "text-walmart-blue")}
              />
              <span className="text-[10px] font-medium mt-1">{item.name}</span>
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
        <div className="relative rounded-xl overflow-hidden h-28 border border-slate-200 shadow-xs">
          <Image
            src="/images/stores/store-sidebar.webp"
            alt={currentStore.name}
            fill
            className="object-cover"
            sizes="300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-walmart-navy-dark/95 via-walmart-navy-dark/60 to-transparent flex flex-col justify-end p-3 text-white">
            <span className="text-[9px] font-bold uppercase tracking-wider text-walmart-yellow">
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
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Modules
          </p>
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "bg-walmart-blue text-white shadow-xs font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
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
                      "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      isActive
                        ? "bg-white text-walmart-blue"
                        : "bg-walmart-yellow text-walmart-navy"
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
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 px-2">
          <div className="flex items-center gap-1.5">
            <SparkIcon className="w-4 h-4 text-walmart-yellow" />
            <span className="font-semibold text-slate-600">Walmart ERP</span>
          </div>
          <span>v0.1.0</span>
        </div>
      </div>
    </Sheet>
  );
}
