"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { Breadcrumbs } from "./breadcrumb";
import { StoreSelector } from "./store-selector";
import { GlobalSearchTrigger } from "./global-search";
import { NotificationMenu } from "./notifications";
import { UserMenu } from "./user-menu";
import { MenuIcon, SearchIcon, SparkIcon } from "../ui/icons";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  const { setMobileDrawerOpen, setSearchOpen } = useShell();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs",
        className
      )}
    >
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open mobile navigation menu"
          className="flex md:hidden items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-walmart-blue"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Mobile brand spark logo */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <SparkIcon className="w-5 h-5 text-walmart-yellow" />
          <span className="text-sm font-bold text-walmart-navy">Walmart</span>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:block truncate">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right: Search, Store Selector, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search trigger (desktop full, mobile icon button) */}
        <div className="hidden sm:block w-44 md:w-56 lg:w-64">
          <GlobalSearchTrigger className="w-full" />
        </div>

        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search ERP"
          className="flex sm:hidden items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <SearchIcon className="w-4 h-4" />
        </button>

        {/* Store Selector (Desktop & Tablet) */}
        <div className="hidden md:block">
          <StoreSelector />
        </div>

        {/* Notifications Dropdown */}
        <NotificationMenu />

        {/* User / Avatar Dropdown */}
        <UserMenu />
      </div>
    </header>
  );
}
