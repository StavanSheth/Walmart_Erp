"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useShell } from "@/context/shell-context";
import { Breadcrumbs } from "./breadcrumb";
import { StoreSelector } from "./store-selector";
import { GlobalSearchTrigger } from "./global-search";
import { NotificationMenu } from "./notifications";
import { UserMenu } from "./user-menu";
import { MenuIcon, SearchIcon, SparkIcon } from "../ui/icons";
import { cn } from "@/lib/cn";

export interface HeaderProps {
  className?: string;
  isDashboard?: boolean;
}

export function Header({ className, isDashboard = true }: HeaderProps) {
  const pathname = usePathname();
  const { setMobileDrawerOpen, setSearchOpen } = useShell();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-header flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 transition-all duration-200",
        isDashboard
          ? isScrolled
            ? "bg-[#06182c]/85 backdrop-blur-xl border-b border-white/20 shadow-lg text-white"
            : "bg-transparent border-b border-white/10 text-white"
          : "glass-subtle border-b border-border shadow-xs text-slate-900",
        className
      )}
    >
      {/* Left: Mobile & Tablet hamburger & Brand / Desktop Search */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
          className={cn(
            "flex lg:hidden items-center justify-center p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
            isDashboard
              ? "text-white/80 hover:bg-white/10"
              : "text-slate-600 hover:bg-surface-muted"
          )}
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Mobile & Tablet brand spark logo */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <SparkIcon className="w-5 h-5" />
          <span
            className={cn(
              "text-sm font-bold tracking-tight",
              isDashboard ? "text-white" : "text-brand-navy"
            )}
          >
            Walmart
          </span>
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden md:block w-72 lg:w-96">
          <GlobalSearchTrigger
            isDashboard={isDashboard}
            className="w-full"
          />
        </div>

        {/* Desktop Breadcrumbs (fallback if not dashboard or inventory) */}
        {!isDashboard && pathname !== "/inventory" && (
          <div className="hidden lg:block truncate ml-4">
            <Breadcrumbs />
          </div>
        )}
      </div>

      {/* Right: Store Selector, Weather Widget, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search ERP"
          className={cn(
            "flex md:hidden items-center justify-center w-9 h-9 rounded-full transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
            isDashboard
              ? "bg-white/15 border border-white/20 text-white hover:bg-white/25 backdrop-blur-md"
              : "border border-border bg-surface text-slate-600 hover:bg-surface-subtle"
          )}
        >
          <SearchIcon className="w-4 h-4" />
        </button>

        {/* Store Selector (Desktop & Tablet) */}
        <div className="hidden sm:block">
          <StoreSelector isDashboard={isDashboard} />
        </div>

        {/* Weather Widget (Desktop) */}
        {isDashboard && (
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full text-white text-xs backdrop-blur-md bg-white/15 border border-white/20">
            <span className="text-base">☀️</span>
            <div className="leading-tight">
              <span className="font-bold">26°C</span>
              <span className="text-blue-100 ml-1">New York, NY</span>
              <p className="text-[10px] text-blue-200">Clear Skies</p>
            </div>
          </div>
        )}

        {/* Notifications Dropdown */}
        <NotificationMenu isDashboard={isDashboard} />

        {/* User / Avatar Dropdown */}
        <UserMenu isDashboard={isDashboard} />
      </div>
    </header>
  );
}
