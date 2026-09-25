"use client";

import * as React from "react";
import { UsersIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface PartnersHeroProps {
  className?: string;
}

export function PartnersHero({ className }: PartnersHeroProps) {
  return (
    <div className={cn("relative pt-1 sm:pt-2 pb-1 sm:pb-2", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Hero Content */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl text-white">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/15 text-blue-100 border border-white/20 backdrop-blur-md">
            <UsersIcon className="w-3.5 h-3.5 text-blue-200" />
            <span>PARTNERS & CUSTOMERS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            Partners & Customers
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-blue-100/90 font-normal sm:font-medium drop-shadow-xs max-w-xl">
            Manage wholesalers, retailers, suppliers and end customers – all in one place.
          </p>
        </div>

        {/* Right Section: Desktop Slogan */}
        <div className="hidden lg:block text-right text-white select-none shrink-0">
          <div className="text-sm lg:text-base font-bold tracking-tight text-white/95 leading-snug drop-shadow-sm">
            Stronger<br />Supply Chains.<br />Happier Communities.
          </div>
        </div>
      </div>
    </div>
  );
}
