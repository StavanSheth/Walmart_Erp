"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { Breadcrumbs } from "./breadcrumb";
import { StoreSelector } from "./store-selector";
import { GlobalSearchTrigger } from "./global-search";
import { NotificationMenu } from "./notifications";
import { UserMenu } from "./user-menu";
import { MenuIcon, SearchIcon, SparkIcon } from "../ui/icons";
import { cn } from "@/lib/cn";

export function Header({ className }: { className?: string }) {
  const { setMobileDrawerOpen, setSearchOpen } = useShell();

  return (
    <header
      className={cn(
        "sticky top-0 z-header flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8",
        "glass-subtle border-b border-border shadow-xs",
        className
      )}
    >
      {/* Left: Mobile hamburger & Brand / Desktop Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open mobile navigation menu"
          className="flex md:hidden items-center justify-center p-2 rounded-md text-slate-600 hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Mobile brand spark logo */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <SparkIcon className="w-5 h-5" />
          <span className="text-sm font-bold tracking-tight text-brand-navy">Walmart</span>
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
          className="flex sm:hidden items-center justify-center w-9 h-9 rounded-md border border-border bg-surface text-slate-600 hover:bg-surface-subtle transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
