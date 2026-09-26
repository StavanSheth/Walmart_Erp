"use client";

import * as React from "react";
import type { ReconcileResult } from "@/types/ledger";
import { XIcon, RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/ui/icons";

interface ReconcileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReconcile: () => Promise<ReconcileResult>;
}

export function ReconcileModal({ isOpen, onClose, onReconcile }: ReconcileModalProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [result, setResult] = React.useState<ReconcileResult | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      runAudit();
    }
  }, [isOpen]);

  const runAudit = async () => {
    try {
      setIsRunning(true);
      const res = await onReconcile();
      setResult(res);
    } catch (err) {
      console.error("Reconciliation error", err);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <RefreshCwIcon className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Account Reconciliation</h3>
              <p className="text-xs text-slate-500">Live Double-Entry General Ledger Balance Audit</p>
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
          {isRunning ? (
            <div className="text-center py-8 space-y-3">
              <RefreshCwIcon className="w-8 h-8 text-[#0071DC] animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Auditing PostgreSQL Journal Entries & Account Balances...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  result.isBalanced
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                {result.isBalanced ? (
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {result.reconciliationStatus === "RECONCILED" ? "Status: Reconciled & Balanced" : "Discrepancy Detected"}
                  </h4>
                  <p className="text-xs mt-1 text-slate-600">{result.message}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 divide-y divide-slate-200 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Total Ledger Debits:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${result.totalDebits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Total Ledger Credits:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${result.totalCredits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Net Discrepancy:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ${result.discrepancy.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Pending Unposted Transactions:</span>
                  <span className="font-bold text-amber-700">{result.pendingItemsCount} item(s)</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={runAudit}
              disabled={isRunning}
              className="text-xs font-semibold text-[#0071DC] hover:underline flex items-center gap-1"
            >
              <RefreshCwIcon className="w-3 h-3" />
              <span>Re-run Audit</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
