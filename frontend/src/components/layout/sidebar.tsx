"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShell } from "@/context/shell-context";
import { MAIN_NAV_ITEMS } from "@/lib/config/navigation";
import { ASSETS } from "@/lib/assets";
import {
  NavIconByName,
  SparkIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from "../ui/icons";
import { Tooltip } from "../ui/tooltip";
import { cn } from "@/lib/cn";
import Image from "next/image";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, currentStore } = useShell();

  return (
    <aside
      aria-label="Main Navigation"
      className={cn(
        "relative flex-col h-screen bg-brand-navy text-white transition-all duration-200 border-r border-slate-800 z-header select-none shrink-0",
        /* Tablet (768-1023px) is always collapsed (w-20). Desktop (>=1024px) is w-64 or w-20 based on toggle */
        sidebarCollapsed ? "md:w-20 lg:w-20" : "md:w-20 lg:w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-slate-800/80 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-md p-1"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors shrink-0">
            <SparkIcon className="w-5 h-5" />
          </div>
          <div
            className={cn(
              "flex-col min-w-0 transition-opacity duration-150",
              sidebarCollapsed ? "hidden" : "hidden lg:flex"
            )}
          >
            <span className="text-base font-bold tracking-tight text-white leading-tight">
              Walmart <span className="text-brand-yellow">ERP</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Enterprise Retail
            </span>
          </div>
        </Link>
      </div>

      {/* Store Banner Preview (Visible only on desktop when expanded) */}
      {!sidebarCollapsed && (
        <div className="hidden lg:block p-3 border-b border-slate-800/80 shrink-0">
          <div className="relative rounded-lg overflow-hidden h-24 border border-white/10 shadow-inner">
            <Image
              src={ASSETS.stores.sidebar}
              alt="Active Retail Supercenter"
              fill
              className="object-cover"
              sizes="240px"
              priority
            />
            <div className="absolute inset-0 bg-brand-navy-dark/85 flex flex-col justify-end p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-yellow">
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5" aria-label="Modules Navigation">
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const navContent = (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                isActive
                  ? "bg-brand-primary text-white shadow-xs font-semibold"
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

              {/* Label: hidden on tablet and collapsed desktop, visible on expanded desktop */}
              <span
                className={cn(
                  "truncate flex-1",
                  sidebarCollapsed ? "hidden" : "hidden lg:inline"
                )}
              >
                {item.name}
              </span>

              {/* Badge: hidden on tablet and collapsed desktop, visible on expanded desktop */}
              {!sidebarCollapsed && item.badge && (
                <span
                  className={cn(
                    "hidden lg:inline-flex px-1.5 py-0.5 rounded-pill text-[10px] font-bold leading-none shrink-0",
                    isActive
                      ? "bg-white text-brand-primary"
                      : "bg-brand-yellow text-brand-navy"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator Bar on collapsed views */}
              {isActive && (
                <span
                  className={cn(
                    "absolute left-0 top-2 bottom-2 w-1 rounded-r bg-brand-yellow",
                    !sidebarCollapsed && "lg:hidden"
                  )}
                />
              )}
            </Link>
          );

          return (
            <div key={item.href}>
              {/* On tablet or collapsed desktop, provide tooltip */}
              <div className={cn(!sidebarCollapsed && "lg:hidden")}>
                <Tooltip content={item.name} side="right">
                  {navContent}
                </Tooltip>
              </div>
              {/* On expanded desktop, render without tooltip */}
              {!sidebarCollapsed && (
                <div className="hidden lg:block">
                  {navContent}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse / Expand Toggle Button (Shown on desktop) */}
      <div className="hidden lg:block p-3 border-t border-slate-800 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
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
