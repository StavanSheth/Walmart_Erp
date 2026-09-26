"use client";

import * as React from "react";
import Image from "next/image";
import {
  BuildingIcon,
  GlobeIcon,
  LocationPinIcon,
  UserIcon,
  EditIcon
} from "@/components/ui/icons";
import type { CompanyInformation } from "@/types/settings";

interface CompanyInformationCardProps {
  company?: CompanyInformation;
  onEdit?: () => void;
  isLoading?: boolean;
}

export function CompanyInformationCard({
  company,
  onEdit,
  isLoading: _isLoading
}: CompanyInformationCardProps) {
  const data = company || {
    name: "Walmart India",
    code: "WM-IN-001",
    subtitle: "Enterprise Retail Operations — India",
    companyId: "WM-IN-001",
    headquarters: "Bengaluru, Karnataka, India",
    industry: "Retail & E-commerce",
    website: "www.walmart.co.in",
    logoUrl: "/brand/walmart-spark.svg"
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between min-h-[285px] h-full sm:h-[285px]">
      {/* Header: Title & Subtitle */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Company Information
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Manage your organization details
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#0071DC] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <EditIcon className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {/* Company Identity Row */}
        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Image
              src="/brand/walmart-spark.svg"
              alt="Walmart Spark"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight truncate">
              {data.name}
            </h4>
            <p className="text-[11px] font-semibold text-slate-500 truncate">
              {data.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Detail Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* Field 1: Company ID */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
              Company ID
            </span>
            <span className="font-mono font-bold text-slate-800 text-[11px] truncate block leading-tight">
              {data.companyId || data.code}
            </span>
          </div>
        </div>

        {/* Field 2: Headquarters */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="w-6 h-6 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
            <LocationPinIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
              Headquarters
            </span>
            <span className="font-semibold text-slate-800 text-[11px] truncate block leading-tight" title={data.headquarters}>
              {data.headquarters}
            </span>
          </div>
        </div>

        {/* Field 3: Industry */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="w-6 h-6 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center shrink-0">
            <BuildingIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
              Industry
            </span>
            <span className="font-semibold text-slate-800 text-[11px] truncate block leading-tight">
              {data.industry}
            </span>
          </div>
        </div>

        {/* Field 4: Website */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="w-6 h-6 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
            <GlobeIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
              Website
            </span>
            <a
              href={`https://${data.website.replace(/^https?:\/\//, "")}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#0071DC] hover:underline text-[11px] truncate block leading-tight"
            >
              {data.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
