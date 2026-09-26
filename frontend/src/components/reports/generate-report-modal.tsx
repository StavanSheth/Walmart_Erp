"use client";

import * as React from "react";
import { XIcon, DownloadIcon } from "@/components/ui/icons";
import type { GenerateReportInput } from "@/types/reports";

export interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: GenerateReportInput) => void;
  isSubmitting?: boolean;
}

export function GenerateReportModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}: GenerateReportModalProps) {
  const [name, setName] = React.useState("Custom Sales & Revenue Deck");
  const [type, setType] = React.useState<GenerateReportInput["type"]>("Sales");
  const [format, setFormat] = React.useState<GenerateReportInput["format"]>("CSV");
  const [dateRange, setDateRange] = React.useState("Sep 1 – Sep 22, 2026");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      type,
      format,
      dateRange
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Generate ERP Report
            </h3>
            <p className="text-xs text-slate-500">
              Select report type, parameters and export format
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Report Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0071DC]"
              placeholder="e.g. Q3 Regional Performance Deck"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Report Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GenerateReportInput["type"])}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0071DC]"
              >
                <option value="Sales">Sales</option>
                <option value="Inventory">Inventory</option>
                <option value="Store">Store</option>
                <option value="Partner">Partner</option>
                <option value="Financial">Financial</option>
                <option value="Operational">Operational</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as GenerateReportInput["format"])}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0071DC]"
              >
                <option value="CSV">CSV Spreadsheet</option>
                <option value="JSON">JSON Data</option>
                <option value="PDF">PDF Document</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Date Range</label>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0071DC]"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0071DC] hover:bg-[#005bb5] transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <DownloadIcon className="w-3.5 h-3.5 text-white" />
              <span>{isSubmitting ? "Generating..." : "Generate & Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
