"use client";

import * as React from "react";
import type { TransactionRow } from "@/types/ledger";
import { PlusIcon } from "@/components/ui/icons";

interface JournalEntriesTabProps {
  transactions: TransactionRow[];
  onNewEntry: () => void;
}

export function JournalEntriesTab({ transactions, onNewEntry }: JournalEntriesTabProps) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            General Journal Book
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological log of all posted and pending double-entry journal vouchers
          </p>
        </div>
        <button
          type="button"
          onClick={onNewEntry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071DC] hover:bg-[#005bb5] active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Table with Vertical & Horizontal Scrollbar */}
      <div className="overflow-x-auto overflow-y-auto max-h-[540px] erp-scrollbar border border-slate-200/80 rounded-xl">
        <table className="w-full min-w-[760px] text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs shadow-2xs">
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Entry # / Ref</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Account Category</th>
              <th className="py-2.5 px-3 text-right">Debit</th>
              <th className="py-2.5 px-3 text-right">Credit</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <tr key={tx.transactionId} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  {tx.reference}
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                  {tx.transactionTime}
                </td>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  {tx.title}
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">
                  {tx.category || tx.account}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {tx.debitOrCredit === "Debit" ? tx.formattedAmount : "-"}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {tx.debitOrCredit === "Credit" ? tx.formattedAmount : "-"}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      tx.status === "Posted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No journal entries recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
