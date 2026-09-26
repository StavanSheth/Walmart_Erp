"use client";

import * as React from "react";
import type { TransactionRow } from "@/types/ledger";
import {
  FileTextIcon,
  CartIcon,
  BankIcon,
  TruckIcon,
  BarChartIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  DownloadIcon,
  FilterIcon
} from "@/components/ui/icons";

interface RecentTransactionsSectionProps {
  transactions: TransactionRow[];
  onViewAll?: () => void;
  onSelectTransaction?: (tx: TransactionRow) => void;
  className?: string;
}

export function RecentTransactionsSection({
  transactions,
  onViewAll,
  onSelectTransaction,
  className = ""
}: RecentTransactionsSectionProps) {
  const [filterType, setFilterType] = React.useState<"ALL" | "DEBIT" | "CREDIT">("ALL");
  const [filterStatus, setFilterStatus] = React.useState<"ALL" | "POSTED" | "PENDING">("ALL");

  const filtered = React.useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "ALL" && t.debitOrCredit.toUpperCase() !== filterType) return false;
      if (filterStatus !== "ALL" && t.status.toUpperCase() !== filterStatus) return false;
      return true;
    });
  }, [transactions, filterType, filterStatus]);

  const renderIcon = (type: TransactionRow["icon"]) => {
    switch (type) {
      case "document":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileTextIcon className="w-5 h-5" />
          </div>
        );
      case "cart":
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
            <CartIcon className="w-5 h-5" />
          </div>
        );
      case "bank":
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <BankIcon className="w-5 h-5" />
          </div>
        );
      case "truck":
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <TruckIcon className="w-5 h-5" />
          </div>
        );
      case "chart":
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            <BarChartIcon className="w-5 h-5" />
          </div>
        );
    }
  };

  const handleExportCsv = () => {
    let csv = "Reference,Title,Account,Flow,Amount,Time,Status\n";
    transactions.forEach((tx) => {
      csv += `"${tx.reference}","${tx.title}","${tx.account}","${tx.debitOrCredit}","${tx.formattedAmount}","${tx.transactionTime}","${tx.status}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `walmart_recent_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Showing {filtered.length} of {transactions.length} recorded entries
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Export CSV"
          >
            <DownloadIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0071DC] hover:text-[#005bb5] transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 pl-1">
          <FilterIcon className="w-3 h-3 text-slate-400" />
          <span>Filter:</span>
        </span>

        {(["ALL", "CREDIT", "DEBIT"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filterType === t
                ? "bg-blue-50 text-[#0071DC] border border-blue-200 shadow-2xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            {t === "ALL" ? "All Flows" : t === "CREDIT" ? "Credits" : "Debits"}
          </button>
        ))}

        <span className="text-slate-300">|</span>

        {(["ALL", "POSTED", "PENDING"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filterStatus === s
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            {s === "ALL" ? "All Status" : s === "POSTED" ? "Posted" : "Pending"}
          </button>
        ))}
      </div>

      {/* Mobile & Tablet Card List */}
      <div className="divide-y divide-slate-100 lg:hidden mt-1">
        {filtered.map((tx) => (
          <div
            key={tx.transactionId}
            onClick={() => onSelectTransaction?.(tx)}
            className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
          >
            {/* Left: Icon, Title & Category */}
            <div className="flex items-center gap-3 min-w-0">
              {renderIcon(tx.icon)}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#0071DC] transition-colors">
                  {tx.title}
                </p>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {tx.category || tx.account}
                </p>
              </div>
            </div>

            {/* Middle & Right: Badge, Amount, Time, Status, Chevron */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Debit/Credit Badge */}
              <span
                className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                  tx.debitOrCredit === "Credit"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {tx.debitOrCredit}
              </span>

              {/* Amount & Time */}
              <div className="text-right">
                <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 tabular-nums">
                  {tx.formattedAmount}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                  {tx.transactionTime}
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  tx.status === "Posted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {tx.status}
              </span>

              {/* Chevron */}
              <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No transactions found matching your criteria.
          </div>
        )}
      </div>

      {/* Desktop Responsive Table View with Vertical & Horizontal Scrollbar */}
      <div className="hidden lg:block overflow-x-auto overflow-y-auto max-h-[480px] erp-scrollbar border border-slate-200/80 rounded-xl mt-3">
        <table className="w-full min-w-[820px] text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs shadow-2xs">
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Reference</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Account</th>
              <th className="py-2.5 px-3 text-center">Type</th>
              <th className="py-2.5 px-3 text-right">Debit (INR)</th>
              <th className="py-2.5 px-3 text-right">Credit (INR)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tx) => (
              <tr
                key={tx.transactionId}
                onClick={() => onSelectTransaction?.(tx)}
                className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                  {tx.transactionTime}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                  {tx.reference}
                </td>
                <td className="py-3 px-3 font-bold text-slate-900 group-hover:text-[#0071DC] transition-colors">
                  {tx.title}
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">
                  {tx.account}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      tx.debitOrCredit === "Credit"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {tx.debitOrCredit}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {tx.debitOrCredit === "Debit" ? tx.formattedAmount : "-"}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {tx.debitOrCredit === "Credit" ? tx.formattedAmount : "-"}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      tx.status === "Posted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTransaction?.(tx);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <MoreVerticalIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
