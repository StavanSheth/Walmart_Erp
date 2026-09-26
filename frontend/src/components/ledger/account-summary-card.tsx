"use client";

import * as React from "react";
import type { AccountSummaryItem } from "@/types/ledger";
import {
  WalletIcon,
  BankIcon,
  InventoryIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChevronRightIcon
} from "@/components/ui/icons";

interface AccountSummaryCardProps {
  accounts?: AccountSummaryItem[];
  onViewAll?: () => void;
  className?: string;
}

const DEFAULT_ACCOUNTS: AccountSummaryItem[] = [
  {
    id: "acc-ar",
    code: "1100",
    name: "Accounts Receivable",
    balance: "$0.00",
    rawBalance: 0,
    trend: "0%",
    trendDirection: "up",
    icon: "wallet"
  },
  {
    id: "acc-ap",
    code: "2000",
    name: "Accounts Payable",
    balance: "$0.00",
    rawBalance: 0,
    trend: "0%",
    trendDirection: "down",
    icon: "wallet"
  },
  {
    id: "acc-cash-bank",
    code: "1010",
    name: "Cash & Bank",
    balance: "$0.00",
    rawBalance: 0,
    trend: "0%",
    trendDirection: "up",
    icon: "bank"
  },
  {
    id: "acc-inv",
    code: "1200",
    name: "Inventory",
    balance: "$0.00",
    rawBalance: 0,
    trend: "0%",
    trendDirection: "up",
    icon: "box"
  }
];

export function AccountSummaryCard({
  accounts = DEFAULT_ACCOUNTS,
  onViewAll,
  className = ""
}: AccountSummaryCardProps) {
  // Always display the primary 4 accounts from design
  const displayAccounts = accounts && accounts.length >= 4 ? accounts.slice(0, 4) : DEFAULT_ACCOUNTS;

  const getAccountConfig = (acc: AccountSummaryItem) => {
    switch (acc.code) {
      case "1100":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
          icon: <WalletIcon className="w-5 h-5" />
        };
      case "2000":
        return {
          bg: "bg-rose-500/10 text-rose-500 border-rose-100",
          icon: <WalletIcon className="w-5 h-5" />
        };
      case "1010":
      case "1000":
        return {
          bg: "bg-blue-500/10 text-blue-600 border-blue-100",
          icon: <BankIcon className="w-5 h-5" />
        };
      case "1200":
      default:
        return {
          bg: "bg-purple-500/10 text-purple-600 border-purple-100",
          icon: <InventoryIcon className="w-5 h-5" />
        };
    }
  };

  return (
    <div className={`rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Account Summary
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0071DC] hover:text-[#005bb5] transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Account Rows */}
      <div className="divide-y divide-slate-100 mt-1">
        {displayAccounts.map((acc) => {
          const cfg = getAccountConfig(acc);
          const isUp = acc.trendDirection === "up";

          return (
            <div
              key={acc.id || acc.code}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors select-none"
            >
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${cfg.bg}`}
                >
                  {cfg.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {acc.name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono font-medium">
                    Code: {acc.code}
                  </p>
                </div>
              </div>

              {/* Right: Balance & Trend Arrow / Percentage */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-right">
                <span className="text-xs sm:text-sm font-mono font-extrabold text-slate-900 tabular-nums">
                  {acc.balance}
                </span>

                <div
                  className={`flex items-center gap-0.5 text-xs font-bold w-14 justify-end ${
                    isUp ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isUp ? <TrendingUpIcon className="w-3.5 h-3.5" /> : <TrendingDownIcon className="w-3.5 h-3.5" />}
                  <span>{acc.trend.startsWith("↑") || acc.trend.startsWith("↓") ? acc.trend.slice(2) : acc.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
