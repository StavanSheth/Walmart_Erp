"use client";

import * as React from "react";
import type { AccountItem } from "@/types/ledger";
import { RefreshCwIcon, CheckCircleIcon, BankIcon, WalletIcon } from "@/components/ui/icons";

interface ReconciliationTabProps {
  accounts: AccountItem[];
  onOpenReconcileModal: () => void;
}

export function ReconciliationTab({ accounts, onOpenReconcileModal }: ReconciliationTabProps) {
  const bankAccounts = accounts.filter((a) => a.code === "1000" || a.code === "1010");
  const apArAccounts = accounts.filter((a) => a.code === "1100" || a.code === "2000");

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Account Reconciliation & Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify General Ledger balances against statement sources and clearing accounts
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReconcileModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071DC] hover:bg-[#005bb5] active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <RefreshCwIcon className="w-3.5 h-3.5" />
          <span>Run Trial Balance Audit</span>
        </button>
      </div>

      {/* Reconciliation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bank & Cash Reconciliation */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BankIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Cash & Bank Accounts</h3>
              <p className="text-[11px] text-slate-500">Live Operating & Clearing Balances</p>
            </div>
          </div>

          <div className="divide-y divide-slate-200 text-xs">
            {bankAccounts.map((acc) => (
              <div key={acc.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{acc.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Code {acc.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900">{acc.formattedBalance}</p>
                  <span className="text-[10px] text-emerald-600 font-bold inline-flex items-center gap-0.5">
                    <CheckCircleIcon className="w-3 h-3" /> Reconciled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AP & AR Reconciliation */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <WalletIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Receivables & Payables</h3>
              <p className="text-[11px] text-slate-500">Subledger to General Ledger Parity</p>
            </div>
          </div>

          <div className="divide-y divide-slate-200 text-xs">
            {apArAccounts.map((acc) => (
              <div key={acc.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{acc.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Code {acc.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900">{acc.formattedBalance}</p>
                  <span className="text-[10px] text-emerald-600 font-bold inline-flex items-center gap-0.5">
                    <CheckCircleIcon className="w-3 h-3" /> Reconciled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
