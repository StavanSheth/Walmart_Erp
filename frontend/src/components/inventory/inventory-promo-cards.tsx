"use client";

import * as React from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { SparkIcon } from "@/components/ui/icons";

export function InventoryPromoCards() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 sm:gap-4 h-full">
      {/* Promo Card 1: Dark Glass Warehouse Banner */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white h-full min-h-[160px] flex flex-col justify-between shadow-xs border border-slate-800 bg-slate-900 group">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={ASSETS.banners.store}
            alt="Walmart Warehouse Logistics"
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        {/* Top spark */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-white leading-snug tracking-tight">
              Optimized Inventory.<br />
              Stronger Communities.
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-relaxed">
              Leverage real-time data to reduce waste, improve availability, and serve more customers.
            </p>
          </div>
          <SparkIcon className="w-6 h-6 text-amber-400 shrink-0" />
        </div>

        {/* Bottom Button */}
        <div className="relative z-10 pt-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-sm"
          >
            <span>Learn More</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>

      {/* Promo Card 2: Sustainability Green Box */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-emerald-50/95 to-teal-50/80 border border-emerald-200/70 h-full min-h-[200px] flex flex-col justify-between shadow-2xs">
        <div className="space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-emerald-950 leading-snug">
              Sustainable Supply<br />
              for a Better Tomorrow
            </h4>
            <p className="text-[11px] sm:text-xs text-emerald-800/80 font-medium leading-relaxed">
              Smarter inventory. Less waste. A brighter future.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-100/80 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs transition active:scale-95"
            title="Read Sustainability Initiative"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
