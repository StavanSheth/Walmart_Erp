"use client";

import * as React from "react";
import type { RecentInventoryActivityItem } from "@/types/dashboard";
import Link from "next/link";

export interface RecentInventoryActivityProps {
  activities?: RecentInventoryActivityItem[];
  isLoading?: boolean;
}

function ProductVisual({ name }: { name: string }) {
  const n = name.toLowerCase();

  // 1. Coca-Cola / Cola Soft Drink
  if (n.includes("cola")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 2h4a1 1 0 0 1 1 1v2.5a3 3 0 0 1-.8 2l-.2.2v9.8a3.5 3.5 0 0 1-3.5 3.5h-1a3.5 3.5 0 0 1-3.5-3.5V7.7l-.2-.2A3 3 0 0 1 5 5.5V3a1 1 0 0 1 1-1h4zm-2 9a4 4 0 0 0 4 4c.6 0 1.2-.1 1.8-.4l.2 1.4A4 4 0 0 1 12 17a6 6 0 0 1-6-6v-1h2v1z" />
        </svg>
      </div>
    );
  }

  // 2. Tide / Detergent / Liquid Detergent
  if (n.includes("detergent") || n.includes("tide")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 2h4a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1zm3 5a3.5 3.5 0 0 0-3.5 3.5c0 1.2.6 2.3 1.5 2.9l-.5 2.1a1 1 0 0 0 1.5 1l2.5-1.5c1-.6 1.5-1.6 1.5-2.8A3.5 3.5 0 0 0 13 7z" />
        </svg>
      </div>
    );
  }

  // 3. iPhone / Phone / Smartphone / Tablet
  if (n.includes("iphone") || n.includes("phone") || n.includes("tablet") || n.includes("mobile")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V3zm3 1a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H9zm3 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </div>
    );
  }

  // 4. Fresh Apple / Fruits
  if (n.includes("apple") || n.includes("fruit")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c.5 1.5 1.8 2.5 3.5 2.5-.2-1.5-1.3-2.5-2.8-2.5h-.7zm6.7 8.3c-.4-.3-2.1-1.3-2.1-3.6 0-2.8 2.3-3.7 2.4-3.8-1.3-1.9-3.3-2.1-4-2.1-1.7-.2-3.4 1-4.2 1-.9 0-2.2-.9-3.6-.9-1.9 0-3.6 1.1-4.6 2.8-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.6 2.8 1.5-.1 2.1-1 3.8-1 1.7 0 2.3 1 3.8.9 1.6 0 2.6-1.4 3.6-2.8.7-1 1.3-2.2 1.7-3.4-.6-.2-1.2-.6-1.6-1.1z" />
        </svg>
      </div>
    );
  }

  // 5. Samsung TV / Television
  if (n.includes("tv") || n.includes("samsung") || n.includes("screen")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-indigo-900 border border-indigo-700 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-sky-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6v2H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2h-2v-2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3zm0 2h18v10H3V6z" />
        </svg>
      </div>
    );
  }

  // 6. Nail Polish Set
  if (n.includes("nail") || n.includes("polish")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 2h4a1 1 0 0 1 1 1v6h2a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1zm1 2v5h2V4h-2zm-3 8v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6H8z" />
        </svg>
      </div>
    );
  }

  // 7. Waterproof Eyeliner
  if (n.includes("eyeliner")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 2.5a2.1 2.1 0 0 1 3 3L7.5 17.5 3 19l1.5-4.5L16.5 2.5zm1.5 1.5l-1 1 1.5 1.5 1-1-1.5-1.5zM6.5 15.5l-.8 2.3 2.3-.8 8-8-1.5-1.5-8 8z" />
        </svg>
      </div>
    );
  }

  // 8. Moisturising Face Cream
  if (n.includes("cream")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 6h14a2 2 0 0 1 2 2v1H3V8a2 2 0 0 1 2-2zm-2 5h18v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7zm9 2a2 2 0 0 0-2 2c0 1.5 2 3.5 2 3.5s2-2 2-3.5a2 2 0 0 0-2-2z" />
        </svg>
      </div>
    );
  }

  // 9. Matte Lipstick
  if (n.includes("lipstick")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 2l5 3v4H9V2zm-2 9h9v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V11zm2 2v7h5v-7H9z" />
        </svg>
      </div>
    );
  }

  // 10. Sunscreen SPF 50
  if (n.includes("sunscreen")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 5a5 5 0 0 1 5 5v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-7a5 5 0 0 1 5-5zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>
    );
  }

  // 11. Milk / Dairy
  if (n.includes("milk") || n.includes("curd") || n.includes("paneer") || n.includes("dairy") || n.includes("ghee") || n.includes("butter")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 2h6l2 4v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6l2-4zm1 2l-1 2h8l-1-2h-6zm-1 5v11h8V9H9zm4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      </div>
    );
  }

  // 12. Rice / Grains / Dal / Atta / Flour
  if (n.includes("rice") || n.includes("daal") || n.includes("atta") || n.includes("wheat") || n.includes("sugar") || n.includes("salt")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-amber-100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12zm0 5c2 2.5 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4.5 3-7z" />
        </svg>
      </div>
    );
  }

  // 13. Bread / Bakery / Biscuit / Cake
  if (n.includes("bread") || n.includes("bakery") || n.includes("biscuit") || n.includes("cake") || n.includes("rusk")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-amber-200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2a4 4 0 0 1 2 3.5V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7.5A4 4 0 0 1 5 7V5zm2 5a2 2 0 0 0-2 2v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a2 2 0 0 0-2-2H7z" />
        </svg>
      </div>
    );
  }

  // 14. Earbuds / Headphones / Audio
  if (n.includes("earbud") || n.includes("headphone") || n.includes("audio") || n.includes("speaker")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5v-2a7 7 0 1 1 14 0v2h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3v-7a9 9 0 0 0-9-9z" />
        </svg>
      </div>
    );
  }

  // 15. Appliances / Kitchen
  if (n.includes("microwave") || n.includes("appliances") || n.includes("iron") || n.includes("kettle") || n.includes("cooker") || n.includes("pan") || n.includes("mixer")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 shadow-xs" title={name}>
        <svg className="w-4.5 h-4.5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm2 2v10h11V7H5zm13 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </div>
    );
  }

  // 16. Fallback: "if not found then keep only the icon"
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs" title={name}>
      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
  );
}

export function RecentInventoryActivity({
  activities = [],
  isLoading = false
}: RecentInventoryActivityProps) {
  const displayActivities = activities.slice(0, 5);

  const getDotColor = (color: RecentInventoryActivityItem["statusColor"]) => {
    switch (color) {
      case "success":
        return "bg-emerald-500";
      case "danger":
        return "bg-rose-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between h-full overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-2 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
          Recent Inventory Activity
        </h3>
        <Link
          href="/inventory"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition shrink-0"
        >
          <span>View All</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200/70 shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <div className="h-3 bg-slate-200/70 rounded w-1/2" />
                <div className="h-2.5 bg-slate-200/70 rounded w-1/4" />
              </div>
              <div className="h-3 bg-slate-200/70 rounded w-16 shrink-0" />
            </div>
          ))}
        </div>
      ) : displayActivities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No recent inventory activity recorded
        </div>
      ) : (
        <div className="divide-y divide-slate-100/70 my-auto">
          {displayActivities.map((act) => (
            <div
              key={act.id}
              className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 sm:gap-3 text-xs min-w-0"
            >
              {/* Product info with product visual thumbnail / icon */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <ProductVisual name={act.productName} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 truncate" title={act.productName}>
                    {act.productName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {act.storeName}
                  </p>
                </div>
              </div>

              {/* Activity Label with dot indicator */}
              <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-white/70 border border-slate-100 text-[10px] sm:text-[11px] max-w-[130px] sm:max-w-[160px] truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColor(act.statusColor)}`} />
                <span className="font-medium text-slate-700 truncate">
                  {act.activityLabel}
                </span>
              </div>

              {/* Time */}
              <div className="text-right text-[10px] sm:text-[11px] font-medium text-slate-400 tabular-nums shrink-0">
                {act.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
