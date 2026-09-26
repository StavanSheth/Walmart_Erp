import * as React from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { SparkIcon } from "@/components/ui/icons";

export function ReportsPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-lg h-[130px] w-full select-none flex items-center justify-between p-4 group">
      {/* Background Image with Dark Blue Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ASSETS.dashboard.banner}
          alt="Walmart Supercenter Logistics"
          fill
          unoptimized
          sizes="320px"
          className="object-cover object-[80%_40%] group-hover:scale-105 transition-transform duration-500"
        />
        {/* Dark Blue & Spark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001E3D]/95 via-[#00478F]/85 to-[#0071DC]/75" />
      </div>

      {/* Decorative ambient spark glow */}
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#FFC220]/25 blur-xl pointer-events-none group-hover:bg-[#FFC220]/35 transition-all" />

      {/* Text Message */}
      <div className="relative z-10 space-y-1 text-white">
        <div className="flex items-center gap-1.5">
          <SparkIcon className="w-3.5 h-3.5" variant="yellow" />
          <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest leading-none">
            Walmart Insights
          </span>
        </div>
        <div className="text-sm sm:text-base font-extrabold tracking-tight leading-tight drop-shadow-sm">
          From Data<br />
          to a Brighter<br />
          Tomorrow.
        </div>
      </div>

      {/* Button: Learn More → */}
      <div className="relative z-10 shrink-0">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-[#FFC220] hover:bg-yellow-400 border border-yellow-200/60 transition-all duration-200 active:scale-95 cursor-pointer shadow-md hover:shadow-yellow-400/25"
        >
          <span>Learn More</span>
          <span className="text-sm leading-none">→</span>
        </button>
      </div>
    </div>
  );
}
