"use client";

import * as React from "react";
import { UsersIcon, CalendarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface PartnersHeroProps {
  className?: string;
}

export function PartnersHero({ className }: PartnersHeroProps) {
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }, []);

  return (
    <div className={cn("relative py-2 sm:py-4", className)}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Left Hero Content */}
        <div className="space-y-2 max-w-2xl text-white">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/15 text-blue-100 border border-white/20 backdrop-blur-md">
            <UsersIcon className="w-3.5 h-3.5 text-blue-200" />
            <span>PARTNERS & CUSTOMERS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            Partners & Customers
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-blue-100 font-medium drop-shadow-xs max-w-xl">
            Manage wholesalers, retailers, suppliers and end customers – all in one place.
          </p>

          {/* Controls Row: Date Badge and Status Indicator */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white shadow-xs leading-none shrink-0 whitespace-nowrap">
              <CalendarIcon className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 shadow-xs leading-none shrink-0 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Partner Directory</span>
            </div>
          </div>
        </div>

        {/* Right Section: Desktop Slogan */}
        <div className="hidden lg:block text-right text-white select-none shrink-0 pb-1">
          <div className="text-sm lg:text-base font-bold tracking-tight text-white/95 leading-snug drop-shadow-sm">
            Stronger<br />Supply Chains.<br />Happier Communities.
          </div>
        </div>
      </div>
    </div>
  );
}
