"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeftIcon, LedgerIcon } from "@/components/ui/icons";

interface LedgerHeroHeaderProps {
  onBack?: () => void;
}

export function LedgerHeroHeader({ onBack }: LedgerHeroHeaderProps) {
  return (
    <div className="relative py-2 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-white">
      <div className="flex items-center gap-3">
        {/* Back button */}
        <Link
          href="/dashboard"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center border border-white/25 text-white shadow-xs backdrop-blur-md shrink-0"
        >
          <ChevronLeftIcon className="w-4 h-4 text-white" />
        </Link>

        {/* Ledger Document Icon in soft white translucent rounded badge */}
        <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-sm shrink-0">
          <LedgerIcon className="w-5 h-5 text-white" />
        </div>

        {/* Title and Subtitle */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight truncate">
            General Ledger
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium drop-shadow-xs line-clamp-1">
            Track, manage and reconcile all financial transactions
          </p>
        </div>
      </div>

      {/* Compliance / Status Badge on right (Desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white text-xs font-semibold shadow-xs select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>GAAP & IFRS Compliant • Real-time Balanced</span>
      </div>
    </div>
  );
}
