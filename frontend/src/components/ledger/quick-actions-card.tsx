"use client";

import * as React from "react";
import { PlusIcon, UploadIcon, RefreshCwIcon, FileTextIcon } from "@/components/ui/icons";

interface QuickActionsCardProps {
  onNewJournalEntry: () => void;
  onUploadTransactions: () => void;
  onReconcileAccount: () => void;
  onGenerateReport: () => void;
  className?: string;
}

export function QuickActionsCard({
  onNewJournalEntry,
  onUploadTransactions,
  onReconcileAccount,
  onGenerateReport,
  className = ""
}: QuickActionsCardProps) {
  return (
    <div className={`rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Quick Actions
        </h2>
      </div>

      {/* 2x2 Grid of Actions */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-3">
        {/* 1. New Journal Entry — Primary Blue Solid Button */}
        <button
          type="button"
          onClick={onNewJournalEntry}
          className="col-span-1 h-14 sm:h-16 rounded-xl bg-[#0071DC] hover:bg-[#005bb5] active:scale-98 text-white font-semibold text-xs sm:text-sm px-3 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <PlusIcon className="w-4 h-4 text-white" />
          </div>
          <span className="leading-tight text-center">New Journal Entry</span>
        </button>

        {/* 2. Upload Transactions */}
        <button
          type="button"
          onClick={onUploadTransactions}
          className="col-span-1 h-14 sm:h-16 rounded-xl bg-slate-50 hover:bg-blue-50/60 hover:border-blue-200 active:scale-98 border border-slate-200 text-slate-700 hover:text-[#0071DC] font-semibold text-xs sm:text-sm px-3 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200/60 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
            <UploadIcon className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0071DC]" />
          </div>
          <span className="leading-tight text-center">Upload Transactions</span>
        </button>

        {/* 3. Reconcile Account */}
        <button
          type="button"
          onClick={onReconcileAccount}
          className="col-span-1 h-14 sm:h-16 rounded-xl bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-200 active:scale-98 border border-slate-200 text-slate-700 hover:text-emerald-700 font-semibold text-xs sm:text-sm px-3 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200/60 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
            <RefreshCwIcon className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-700" />
          </div>
          <span className="leading-tight text-center">Reconcile Account</span>
        </button>

        {/* 4. Generate Report */}
        <button
          type="button"
          onClick={onGenerateReport}
          className="col-span-1 h-14 sm:h-16 rounded-xl bg-slate-50 hover:bg-purple-50/60 hover:border-purple-200 active:scale-98 border border-slate-200 text-slate-700 hover:text-purple-700 font-semibold text-xs sm:text-sm px-3 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200/60 group-hover:bg-purple-100 flex items-center justify-center shrink-0 transition-colors">
            <FileTextIcon className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-700" />
          </div>
          <span className="leading-tight text-center">Generate Report</span>
        </button>
      </div>
    </div>
  );
}
