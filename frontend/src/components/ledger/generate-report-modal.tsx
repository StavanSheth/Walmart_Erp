"use client";

import * as React from "react";
import type { AccountItem } from "@/types/ledger";
import { XIcon, DownloadIcon, FileTextIcon, CheckIcon } from "@/components/ui/icons";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountItem[];
}

export function GenerateReportModal({ isOpen, onClose, accounts }: GenerateReportModalProps) {
  const [reportType, setReportType] = React.useState<"trial" | "balance_sheet" | "income">("trial");
  const [format, setFormat] = React.useState<"csv" | "pdf">("csv");

  if (!isOpen) return null;

  const handleDownload = () => {
    let content = "";
    const filename = `walmart_ledger_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (reportType === "trial") {
      content = "Account Code,Account Name,Classification,Total Debits,Total Credits,Net Balance\n";
      accounts.forEach((acc) => {
        content += `"${acc.code}","${acc.name}","${acc.type}",${acc.totalDebit.toFixed(2)},${acc.totalCredit.toFixed(2)},${acc.balance.toFixed(2)}\n`;
      });
    } else if (reportType === "balance_sheet") {
      content = "Classification,Account Code,Account Name,Balance\n";
      accounts
        .filter((a) => a.type === "ASSET" || a.type === "LIABILITY" || a.type === "EQUITY")
        .forEach((acc) => {
          content += `"${acc.type}","${acc.code}","${acc.name}",${acc.balance.toFixed(2)}\n`;
        });
    } else {
      content = "Type,Account Code,Account Name,Balance\n";
      accounts
        .filter((a) => a.type === "REVENUE" || a.type === "EXPENSE")
        .forEach((acc) => {
          content += `"${acc.type}","${acc.code}","${acc.name}",${acc.balance.toFixed(2)}\n`;
        });
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FileTextIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Generate Financial Report</h3>
              <p className="text-xs text-slate-500">Live Statements from PostgreSQL General Ledger</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Report Type</label>
            <div className="space-y-2">
              {[
                { id: "trial", title: "Trial Balance", desc: "Complete debits, credits, and live net balances for all accounts" },
                { id: "balance_sheet", title: "Balance Sheet Statement", desc: "Assets, Liabilities, and Owner's Equity breakdown" },
                { id: "income", title: "Income Statement (P&L)", desc: "Revenue vs Cost of Goods Sold and Operating Expenses" }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setReportType(opt.id as "trial" | "balance_sheet" | "income")}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    reportType === opt.id
                      ? "border-[#0071DC] bg-blue-50/50 shadow-2xs"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold ${reportType === opt.id ? "text-[#0071DC]" : "text-slate-900"}`}>
                      {opt.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  {reportType === opt.id && (
                    <div className="w-5 h-5 rounded-full bg-[#0071DC] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Export Format</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  format === "csv"
                    ? "bg-[#0071DC] text-white border-[#0071DC] shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                CSV / Excel (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  format === "pdf"
                    ? "bg-[#0071DC] text-white border-[#0071DC] shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Print / PDF
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0071DC] hover:bg-[#005bb5] active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
