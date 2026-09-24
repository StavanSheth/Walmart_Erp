"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShell } from "@/context/shell-context";
import { MAIN_NAV_ITEMS } from "@/lib/config/navigation";
import {
  NavIconByName,
  SparkIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from "../ui/icons";
import { Tooltip } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, currentStore } = useShell();

  return (
    <aside
      aria-label="Main Navigation"
      className={cn(
        "relative flex flex-col h-screen bg-walmart-navy text-white transition-all duration-300 ease-in-out border-r border-slate-800 z-30 select-none",
        sidebarCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-slate-800 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group focus:outline-none"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors shrink-0">
            <SparkIcon className="w-6 h-6 text-walmart-yellow animate-spin-slow" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-base font-bold tracking-tight text-white leading-tight">
                Walmart <span className="text-walmart-yellow">ERP</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Enterprise Retail
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Store Banner Preview (Visible only when expanded) */}
      {!sidebarCollapsed && (
        <div className="p-3 border-b border-slate-800/80 shrink-0">
          <div className="relative rounded-xl overflow-hidden h-24 border border-white/10 shadow-inner group">
            <Image
              src="/images/stores/store-sidebar.webp"
              alt="Active Retail Supercenter"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="240px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-walmart-navy-dark/90 via-walmart-navy-dark/40 to-transparent flex flex-col justify-end p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-walmart-yellow">
                Active Store Outlet
              </span>
              <p className="text-xs font-semibold text-white truncate">
                {currentStore.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const navButton = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-walmart-blue",
                isActive
                  ? "bg-walmart-blue text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center shrink-0">
                <NavIconByName
                  name={item.iconName}
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
              </div>

              {!sidebarCollapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none shrink-0",
                    isActive
                      ? "bg-white text-walmart-blue"
                      : "bg-walmart-yellow text-walmart-navy"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator Bar on collapsed */}
              {sidebarCollapsed && isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-walmart-yellow" />
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href} content={item.name} side="right">
                {navButton}
              </Tooltip>
            );
          }

          return navButton;
        })}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-walmart-blue",
            !sidebarCollapsed && "justify-between px-3"
          )}
        >
          {!sidebarCollapsed && (
            <span className="text-xs font-medium text-slate-400">Collapse menu</span>
          )}
          {sidebarCollapsed ? (
            <ChevronsRightIcon className="w-5 h-5" />
          ) : (
            <ChevronsLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
