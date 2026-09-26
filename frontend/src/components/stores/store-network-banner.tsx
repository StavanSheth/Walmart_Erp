"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";

interface StoreNetworkBannerProps {
  onActionClick?: () => void;
  className?: string;
}

export function StoreNetworkBanner({
  onActionClick,
  className = ""
}: StoreNetworkBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs flex flex-row items-stretch bg-gradient-to-r from-[#17488B] via-[#0E356C] to-[#0A2958] min-h-[105px] sm:min-h-[130px] ${className}`}
    >
      {/* Left Image of Walmart Supercenter */}
      <div className="relative w-[42%] sm:w-1/2 shrink-0 overflow-hidden">
        <Image
          src="/images/banners/walmart-supercenter-twilight.png"
          alt="Walmart Supercenter at Twilight"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 45vw, 50vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0E356C]/30 to-[#0E356C] pointer-events-none" />
      </div>

      {/* Right Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-center items-start z-10">
        <h3 className="text-xs sm:text-base lg:text-lg font-bold tracking-tight text-white leading-tight">
          Stronger Stores.<br />Brighter Communities.
        </h3>

        {onActionClick && (
          <button
            type="button"
            onClick={onActionClick}
            className="mt-2 px-3 py-1.5 bg-[#0071DC] hover:bg-[#005bb5] text-white rounded-full text-[10px] sm:text-xs font-semibold shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>View Store Network</span>
            <ArrowRightIcon className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
