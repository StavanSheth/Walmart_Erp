"use client";

import * as React from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export interface PartnerPromoCardProps {
  className?: string;
  onAddPartner?: () => void;
}

export function PartnerPromoCard({ className, onAddPartner }: PartnerPromoCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/30 shadow-sm select-none p-4 sm:p-5 flex flex-col justify-between",
        "bg-[#0A2540] text-white h-full min-h-[145px]",
        className
      )}
    >
      {/* Right side associates cutout with gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-[55%] pointer-events-none overflow-hidden">
        <Image
          src={ASSETS.banners.associates}
          alt="Walmart Associates"
          fill
          unoptimized
          sizes="240px"
          className="object-cover object-top"
        />
        {/* Smooth gradient fade to the navy background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent" />
      </div>

      {/* Content on Left */}
      <div className="relative z-10 max-w-[55%] space-y-1">
        <h3 className="text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug drop-shadow-sm">
          Together<br />for a Brighter<br />Tomorrow.
        </h3>
      </div>

      <div className="relative z-10 pt-2">
        <button
          type="button"
          onClick={onAddPartner}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0071DC] hover:bg-[#005bb5] text-white shadow-md transition active:scale-95 cursor-pointer"
        >
          <span>Add Partner</span>
          <ArrowRightIcon className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
