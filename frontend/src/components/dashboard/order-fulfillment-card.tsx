"use client";

import * as React from "react";
import type { OrderFulfillmentData } from "@/types/dashboard";
import { formatNumber } from "@/lib/format";

export interface OrderFulfillmentCardProps {
  data?: OrderFulfillmentData;
  isLoading?: boolean;
}

export function OrderFulfillmentCard({ data, isLoading = false }: OrderFulfillmentCardProps) {
  const fulfillmentRate = data ? Math.round(data.fulfillmentRate) : 0;
  const fulfilled = data?.fulfilled ?? 0;
  const pending = data?.pending ?? 0;
  const cancelled = data?.cancelled ?? 0;

  // SVG circular gauge calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fulfillmentRate / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1">
          <span>Order Fulfillment</span>
        </h3>
        <button
          type="button"
          aria-label="View Order Fulfillment details"
          className="text-slate-400 hover:text-slate-600 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4 py-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-slate-200/70" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 bg-slate-200/70 rounded" />
            <div className="h-10 bg-slate-200/70 rounded" />
            <div className="h-10 bg-slate-200/70 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Circular Gauge */}
          <div className="relative w-28 h-28 my-1 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">
                {fulfillmentRate}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Fulfilled
              </span>
            </div>
          </div>

          {/* 3 Metric Summary Columns */}
          <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-slate-100/80 text-center">
            {/* Fulfilled */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                {formatNumber(fulfilled)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Fulfilled
              </span>
            </div>

            {/* Pending */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                {formatNumber(pending)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Pending
              </span>
            </div>

            {/* Cancelled */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-rose-500 mb-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                {formatNumber(cancelled)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Cancelled
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
