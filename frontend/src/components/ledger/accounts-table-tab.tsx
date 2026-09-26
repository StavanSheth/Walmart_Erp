"use client";

import * as React from "react";
import type { AccountItem } from "@/types/ledger";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "@/components/ui/icons";

interface AccountsTableTabProps {
  accounts: AccountItem[];
  isLoading?: boolean;
}

export function AccountsTableTab({ accounts, isLoading }: AccountsTableTabProps) {
  const [filterType, setFilterType] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return accounts.filter((acc) => {
      if (filterType !== "ALL" && acc.type !== filterType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return acc.name.toLowerCase().includes(q) || acc.code.includes(q);
      }
      return true;
    });
  }, [accounts, filterType, search]);

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chart of accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {["ALL", "ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${
                filterType === type
                  ? "bg-[#0071DC] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "ALL" ? "All Types" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Table with Vertical & Horizontal Scrollbar */}
      <div className="overflow-x-auto overflow-y-auto max-h-[540px] erp-scrollbar border border-slate-200/80 rounded-xl">
        <table className="w-full min-w-[720px] text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs shadow-2xs">
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Account Title</th>
              <th className="py-2.5 px-3">Classification</th>
              <th className="py-2.5 px-3 text-right">Total Debits</th>
              <th className="py-2.5 px-3 text-right">Total Credits</th>
              <th className="py-2.5 px-3 text-right">Current Balance</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Loading Chart of Accounts from PostgreSQL...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No accounts found.
                </td>
              </tr>
            ) : (
              filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 tabular-nums">
                    {acc.code}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {acc.name}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        acc.type === "ASSET" || acc.type === "REVENUE"
                          ? "success"
                          : acc.type === "LIABILITY"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {acc.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                    ${acc.totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                    ${acc.totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {acc.formattedBalance}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {acc.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
