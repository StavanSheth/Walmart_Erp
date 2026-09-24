"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";

export function DashboardPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#001E38] border border-white/10 shadow-xl">
      {/* Background store banner image with dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ASSETS.banners.store}
          alt="Walmart Logistics & Store Network"
          fill
          unoptimized
          sizes="(max-width: 1536px) 100vw, 1536px"
          className="object-cover object-center"
          priority
        />
        {/* Gradients to keep text crisp and match desktop screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001E38]/95 via-[#00284e]/85 to-[#001e38]/70" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 px-6 sm:px-10 py-6 sm:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            Keeping Shelves Full.<br />
            Supporting Communities.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-blue-100/90 font-medium">
            Efficient supply chains. Brighter tomorrows.
          </p>
        </div>

        <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end">
          {/* Walmart Spark branding */}
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Walmart
            </span>
            <svg className="w-6 h-6 text-[#FFC220]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 12 2zm0 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 12 17zm8.5-6.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 1 0-3h3zm-15 0a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 1 0-3h3zm13.14-5.64a1.5 1.5 0 0 1 0 2.12l-2.12 2.12a1.5 1.5 0 1 1-2.12-2.12l2.12-2.12a1.5 1.5 0 0 1 2.12 0zm-10.6 10.6a1.5 1.5 0 0 1 0 2.13l-2.13 2.12a1.5 1.5 0 1 1-2.12-2.12l2.12-2.13a1.5 1.5 0 0 1 2.13 0zm0-10.6a1.5 1.5 0 0 1 2.13 0 1.5 1.5 0 0 1 0 2.12l-2.13 2.12a1.5 1.5 0 1 1-2.12-2.12l2.12-2.12zm10.6 10.6a1.5 1.5 0 0 1 2.12 0 1.5 1.5 0 0 1 0 2.13l-2.12 2.12a1.5 1.5 0 0 1-2.12-2.12l2.12-2.13z" />
            </svg>
          </div>

          {/* View Store Network Button */}
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071DC] hover:bg-[#005fb8] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-900/40 transition active:scale-95"
          >
            <span>View Store Network</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
