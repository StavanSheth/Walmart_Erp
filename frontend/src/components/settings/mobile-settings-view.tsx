"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SettingsIcon,
  BuildingIcon,
  UsersGroupIcon,
  StoreNavIcon,
  InventoryIcon,
  HandshakeIcon,
  WalletIcon,
  BarChartIcon,
  ShieldIcon,
  QuestionCircleIcon
} from "@/components/ui/icons";
import { ASSETS } from "@/lib/assets";
import type { SettingsOverviewResponse } from "@/types/settings";

interface MobileSettingsViewProps {
  overview?: SettingsOverviewResponse;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory?: (category: string) => void;
  onManageProfile?: () => void;
  onContactSupport?: () => void;
}

export function MobileSettingsView({
  overview,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onManageProfile,
  onContactSupport
}: MobileSettingsViewProps) {
  const user = overview?.currentUser || {
    name: "Stavan Sheth",
    role: "Admin",
    email: "stavan@walmart.com",
    avatarText: "SS"
  };

  const categories = [
    {
      id: "org",
      name: "Organization Settings",
      description: "Company details, regions, business units",
      icon: <BuildingIcon className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200/80"
    },
    {
      id: "users",
      name: "User Management",
      description: "Add, remove and manage users, roles and permissions",
      icon: <UsersGroupIcon className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-200/80"
    },
    {
      id: "stores",
      name: "Store Management",
      description: "Store details, locations, operating hours",
      icon: <StoreNavIcon className="w-5 h-5 text-teal-600" />,
      bg: "bg-teal-50 border-teal-200/80"
    },
    {
      id: "inventory",
      name: "Product & Inventory Settings",
      description: "Categories, attributes, stock rules",
      icon: <InventoryIcon className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-200/80"
    },
    {
      id: "partners",
      name: "Partner & Customer Settings",
      description: "Wholesalers, retailers, suppliers, customer configuration",
      icon: <HandshakeIcon className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50 border-purple-200/80"
    },
    {
      id: "financial",
      name: "Financial Settings",
      description: "Tax, currency, payment methods, accounting preferences",
      icon: <WalletIcon className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-200/80"
    },
    {
      id: "notifications",
      name: "Notification Settings",
      description: "Alerts, email notifications, system updates",
      icon: <BellIcon className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-50 border-sky-200/80"
    },
    {
      id: "reports",
      name: "Report Preferences",
      description: "Default filters, export settings, scheduled reports",
      icon: <BarChartIcon className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200/80"
    },
    {
      id: "system",
      name: "System Configuration",
      description: "Language, timezone, data retention, integrations",
      icon: <SettingsIcon className="w-5 h-5 text-cyan-600" />,
      bg: "bg-cyan-50 border-cyan-200/80"
    },
    {
      id: "security",
      name: "Security & Compliance",
      description: "Password policies, audit logs, data privacy",
      icon: <ShieldIcon className="w-5 h-5 text-rose-600" />,
      bg: "bg-rose-50 border-rose-200/80"
    },
    {
      id: "support",
      name: "Help & Support",
      description: "Documentation, support tickets, contact us",
      icon: <QuestionCircleIcon className="w-5 h-5 text-teal-600" />,
      bg: "bg-teal-50 border-teal-200/80"
    }
  ];

  const filteredCategories = categories.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-[430px] mx-auto px-3.5 sm:px-4 py-3 space-y-3.5 pb-24 select-none">
      {/* 1. Mobile Header */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <ChevronLeftIcon className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#0071DC] flex items-center justify-center shadow-xs">
              <Image
                src="/brand/walmart-spark.svg"
                alt="Walmart"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-slate-900 block leading-tight">
                Walmart ERP
              </span>
              <span className="text-[9.5px] font-semibold text-slate-400 block leading-none">
                Enterprise Suite
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Notification bell with badge 3 */}
          <div className="relative w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
            <BellIcon className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0071DC] text-white text-[9.5px] font-black flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </div>

          {/* User avatar SS */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071DC] to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user.avatarText}
          </div>
        </div>
      </div>

      {/* Title & Subtitle banner */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0071DC] text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-widest text-[#FFC220] uppercase">
            <SettingsIcon className="w-3.5 h-3.5 text-[#FFC220]" />
            <span>Settings</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-white mt-0.5 leading-tight">
            System Settings
          </h2>
          <p className="text-[11px] text-blue-100 font-medium leading-tight mt-0.5">
            Configure your system and preferences.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <SettingsIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* 2. Mobile Search Input (~55px height) */}
      <div className="relative">
        <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-10 pr-4 text-xs font-semibold rounded-2xl bg-white border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0071DC] text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* 3. Mobile Profile Card (~115px height) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0071DC] to-indigo-700 text-white font-black text-base flex items-center justify-center shadow-sm shrink-0">
            {user.avatarText}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-slate-900 truncate tracking-tight">
                {user.name}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#0071DC] border border-blue-200/70">
                {user.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {user.email}
            </p>
            <button
              type="button"
              onClick={onManageProfile}
              className="text-[11px] font-bold text-[#0071DC] hover:underline mt-1 inline-block cursor-pointer"
            >
              Manage Profile →
            </button>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
          <ChevronRightIcon className="w-4 h-4" />
        </div>
      </div>

      {/* 4. Mobile Settings Categories (11 full-width list cards, ~75–82px each) */}
      <div className="space-y-2">
        <div className="px-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Configuration Modules
          </h4>
        </div>

        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectCategory?.(cat.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectCategory?.(cat.id);
              }
            }}
            className="h-[78px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm p-3 flex items-center justify-between cursor-pointer select-none active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${cat.bg}`}>
                {cat.icon}
              </div>
              <div className="min-w-0">
                <h5 className="text-xs sm:text-[13px] font-black text-slate-900 tracking-tight truncate leading-tight">
                  {cat.name}
                </h5>
                <p className="text-[10.5px] text-slate-400 font-medium truncate leading-tight mt-1">
                  {cat.description}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 ml-2">
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* 5. Mobile Promotional Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 p-4 text-white select-none">
        <div className="absolute inset-0 -z-20">
          <Image
            src={ASSETS.banners.store}
            alt="Walmart Store"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-blue-800/85 backdrop-blur-[1px]" />

        <div className="space-y-2">
          <h4 className="text-sm font-black text-white leading-snug">
            Together for<br />
            a Brighter Tomorrow.
          </h4>
          <p className="text-[11px] text-blue-100 font-medium leading-tight">
            Efficient systems. Stronger communities.
          </p>
          <button
            type="button"
            onClick={onContactSupport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#0071DC] font-bold text-xs shadow-xs hover:bg-blue-50 transition cursor-pointer"
          >
            <span>Contact Support</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
