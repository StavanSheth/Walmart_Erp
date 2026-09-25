"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useShell } from "@/context/shell-context";
import { MAIN_NAV_ITEMS } from "@/lib/config/navigation";
import { ASSETS } from "@/lib/assets";
import {
  NavIconByName,
  SparkIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronRightIcon
} from "../ui/icons";
import { Tooltip } from "../ui/tooltip";
import { cn } from "@/lib/cn";

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useShell();

  return (
    <aside
      aria-label="Main Navigation"
      className={cn(
        "relative flex-col h-screen transition-all duration-200 z-header select-none shrink-0",
        "bg-[#0B1E36] text-white border-r border-slate-800/80 shadow-xl",
        sidebarCollapsed ? "lg:w-20" : "lg:w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-md p-1"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors shrink-0">
            <SparkIcon className="w-5 h-5" />
          </div>
          <div
            className={cn(
              "flex-col min-w-0 transition-opacity duration-150",
              sidebarCollapsed ? "hidden" : "hidden lg:flex"
            )}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white leading-tight">
                Walmart
              </span>
              <span className="text-xs font-bold text-brand-yellow tracking-wider">ERP</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal leading-tight">
              People. Products. A Better Tomorrow.
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
        aria-label="Modules Navigation"
      >
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && item.href !== "/" && pathname.startsWith(item.href));

          const navContent = (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                isActive
                  ? "bg-brand-primary text-white shadow-md font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center shrink-0">
                <NavIconByName
                  name={item.iconName}
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
              </div>

              {/* Section Name: hidden on tablet and collapsed desktop */}
              <div
                className={cn(
                  "min-w-0 flex-1 truncate",
                  sidebarCollapsed ? "hidden" : "hidden lg:block"
                )}
              >
                <span className="truncate leading-tight">{item.name}</span>
              </div>
            </Link>
          );

          return (
            <div key={item.name}>
              {/* On tablet or collapsed desktop, provide tooltip */}
              <div className={cn(!sidebarCollapsed && "lg:hidden")}>
                <Tooltip content={item.name} side="right">
                  {navContent}
                </Tooltip>
              </div>
              {/* On expanded desktop, render directly */}
              {!sidebarCollapsed && <div className="hidden lg:block">{navContent}</div>}
            </div>
          );
        })}
      </nav>

      {/* Bottom Promo Card: "Stronger Communities Everyday." */}
      {!sidebarCollapsed && (
        <div className="hidden lg:block px-3 py-2 shrink-0">
          <div className="relative overflow-hidden p-3 rounded-xl border border-white/15 flex items-center justify-between shadow-md group">
            {/* Centered slice of the banner image - showing only the centered portion that fits */}
            <div className="absolute inset-0 z-0">
              <Image
                src={ASSETS.dashboard.banner}
                alt="Walmart Supercenter"
                fill
                unoptimized
                sizes="240px"
                className="object-cover object-center scale-110"
              />
              <div className="absolute inset-0 bg-[#091D34]/75 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 flex items-center gap-2 min-w-0">
              <SparkIcon className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-[10px] leading-tight text-slate-200">
                <span className="font-bold text-white block">Stronger</span>
                Communities Everyday.
              </div>
            </div>
            <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 shadow-xs">
              <ChevronRightIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Collapse / Expand Toggle Button (Shown on desktop) */}
      <div className="hidden lg:block px-3 py-2 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
            !sidebarCollapsed && "justify-between px-3"
          )}
        >
          {!sidebarCollapsed && (
            <span className="text-xs font-medium text-slate-400">Collapse</span>
          )}
          {sidebarCollapsed ? (
            <ChevronsRightIcon className="w-4 h-4" />
          ) : (
            <ChevronsLeftIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
