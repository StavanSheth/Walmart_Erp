"use client";

import * as React from "react";
import type { CreateJournalEntryInput } from "@/types/ledger";
import { XIcon, UploadIcon, CheckCircleIcon, AlertCircleIcon, FileTextIcon } from "@/components/ui/icons";

interface UploadTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (entries: CreateJournalEntryInput[]) => Promise<void>;
}

export function UploadTransactionsModal({
  isOpen,
  onClose,
  onUpload
}: UploadTransactionsModalProps) {
  const [csvContent, setCsvContent] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const sampleCsv = `Reference,Description,Date,DebitAccount,CreditAccount,Amount
JV-2026-9050,Store #108 Revenue,2026-09-23,acc-1010,acc-4000,14500.00
PO-78010,Supplier Express Inventory,2026-09-23,acc-1200,acc-2000,9200.00
PAY-66300,Fresh Logistics Settlement,2026-09-22,acc-2000,acc-1010,4800.00`;

  const handleLoadSample = () => {
    setCsvContent(sampleCsv);
    setErrorMsg(null);
  };

  const handleUploadSubmit = async () => {
    if (!csvContent.trim()) {
      setErrorMsg("Please provide CSV data or click 'Load Sample CSV'.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      // Parse CSV rows into CreateJournalEntryInput
      const lines = csvContent.trim().split("\n");
      const entries: CreateJournalEntryInput[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [ref, desc, date, debitAcc, creditAcc, amtStr] = line.split(",").map((s) => s.trim());
        const amt = parseFloat(amtStr);
        if (!desc || isNaN(amt) || amt <= 0) continue;

        entries.push({
          referenceNumber: ref || undefined,
          referenceId: ref || undefined,
          description: desc,
          entryDate: date ? new Date(date).toISOString() : new Date().toISOString(),
          lines: [
            { accountId: debitAcc || "acc-1010", debit: amt, credit: 0 },
            { accountId: creditAcc || "acc-4000", debit: 0, credit: amt }
          ]
        });
      }

      if (entries.length === 0) {
        throw new Error("No valid balanced transaction rows parsed from CSV.");
      }

      await onUpload(entries);
      setSuccessMsg(`Successfully uploaded and recorded ${entries.length} journal entries in PostgreSQL!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload transactions";
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Upload Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Batch import balanced journal entries from CSV into the database
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircleIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700 font-semibold">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              CSV Data (Columns: Reference, Description, Date, DebitAccount, CreditAccount, Amount)
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-[#0071DC] hover:underline"
            >
              Load Sample CSV
            </button>
          </div>

          <textarea
            rows={6}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="Paste CSV rows here or click 'Load Sample CSV'..."
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] bg-slate-50/50"
          />

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-600 flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-[#0071DC] shrink-0" />
            <span>Double-entry integrity check runs automatically on every uploaded line before commit.</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={isProcessing || !csvContent.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0071DC] hover:bg-[#005bb5] active:scale-95 disabled:bg-slate-300 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <UploadIcon className="w-3.5 h-3.5" />
              <span>{isProcessing ? "Processing..." : "Import Transactions"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
