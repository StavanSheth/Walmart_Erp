"use client";

import * as React from "react";
import type { AccountItem, CreateJournalEntryInput } from "@/types/ledger";
import { XIcon, PlusIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/ui/icons";

interface NewJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountItem[];
  onSubmit: (entry: CreateJournalEntryInput) => Promise<void>;
}

export function NewJournalEntryModal({
  isOpen,
  onClose,
  accounts,
  onSubmit
}: NewJournalEntryModalProps) {
  const [description, setDescription] = React.useState("");
  const [referenceNumber, setReferenceNumber] = React.useState("");
  const [entryDate, setEntryDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [lines, setLines] = React.useState<Array<{ accountId: string; debit: string; credit: string }>>([
    { accountId: accounts[0]?.id || "acc-1010", debit: "", credit: "0" },
    { accountId: accounts[1]?.id || "acc-4000", debit: "0", credit: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (accounts.length >= 2 && lines[0].accountId === "") {
      setLines([
        { accountId: accounts[0].id, debit: "", credit: "0" },
        { accountId: accounts[1].id, debit: "0", credit: "" }
      ]);
    }
  }, [accounts]);

  if (!isOpen) return null;

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.01 && totalDebit > 0;

  const handleAddLine = () => {
    setLines([...lines, { accountId: accounts[0]?.id || "", debit: "0", credit: "0" }]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleUpdateLine = (idx: number, field: "accountId" | "debit" | "credit", val: string) => {
    const updated = [...lines];
    updated[idx] = { ...updated[idx], [field]: val };
    setLines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Please enter a transaction description.");
      return;
    }
    if (!isBalanced) {
      setErrorMsg("Double-entry accounting requires Total Debits to equal Total Credits and be greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const payload: CreateJournalEntryInput = {
        description: description.trim(),
        referenceNumber: referenceNumber.trim() || undefined,
        referenceId: referenceNumber.trim() || undefined,
        entryDate: new Date(entryDate).toISOString(),
        lines: lines.map((l) => ({
          accountId: l.accountId,
          debit: parseFloat(l.debit) || 0,
          credit: parseFloat(l.credit) || 0
        }))
      };

      await onSubmit(payload);
      onClose();
      // Reset
      setDescription("");
      setReferenceNumber("");
      setLines([
        { accountId: accounts[0]?.id || "acc-1010", debit: "", credit: "0" },
        { accountId: accounts[1]?.id || "acc-4000", debit: "0", credit: "" }
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record journal entry in database";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">New Journal Entry</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record a double-entry balanced transaction into the PostgreSQL General Ledger
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircleIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Top metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description / Title *
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Sales Revenue - Store #104"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reference Number (Optional)
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. JV-2026-9001 or PO-88410"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-mono"
            />
          </div>

          {/* Double-Entry Lines Table */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Journal Lines (Double-Entry)
              </span>
              <button
                type="button"
                onClick={handleAddLine}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071DC] hover:text-[#005bb5]"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                <span className="col-span-6">Account</span>
                <span className="col-span-3 text-right">Debit ($)</span>
                <span className="col-span-3 text-right">Credit ($)</span>
              </div>

              {lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 px-3 py-2 items-center">
                  <div className="col-span-6">
                    <select
                      value={line.accountId}
                      onChange={(e) => handleUpdateLine(idx, "accountId", e.target.value)}
                      className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] bg-white font-medium truncate"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.code} — {acc.name} ({acc.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={line.debit}
                      onChange={(e) => handleUpdateLine(idx, "debit", e.target.value)}
                      className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] text-right font-mono font-medium"
                    />
                  </div>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={line.credit}
                      onChange={(e) => handleUpdateLine(idx, "credit", e.target.value)}
                      className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] text-right font-mono font-medium"
                    />
                    {lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Line"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Balancing Indicator Footer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                    Balanced Entry
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-bold text-rose-600">
                    <AlertCircleIcon className="w-4 h-4 text-rose-500" />
                    Unbalanced: Diff ${difference.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono font-bold">
                <div>
                  <span className="text-slate-400 font-sans font-normal mr-1">Debits:</span>
                  <span className="text-slate-900">${totalDebit.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans font-normal mr-1">Credits:</span>
                  <span className="text-slate-900">${totalCredit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isBalanced}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                isBalanced && !isSubmitting
                  ? "bg-[#0071DC] hover:bg-[#005bb5] active:scale-95 cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Posting to Database..." : "Post to Ledger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
