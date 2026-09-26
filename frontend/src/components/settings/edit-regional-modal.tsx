"use client";

import * as React from "react";
import type { RegionalSettings } from "@/types/settings";

interface EditRegionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  regional?: RegionalSettings;
  onSubmit: (data: Partial<RegionalSettings>) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditRegionalModal({
  isOpen,
  onClose,
  regional,
  onSubmit,
  isSubmitting
}: EditRegionalModalProps) {
  const [defaultRegion, setDefaultRegion] = React.useState(regional?.defaultRegion || "United States");
  const [timezone, setTimezone] = React.useState(regional?.timezone || "(UTC-05:00) America/New_York (EST)");
  const [currency, setCurrency] = React.useState(regional?.currency || "USD - US Dollar ($)");
  const [dateFormat, setDateFormat] = React.useState(regional?.dateFormat || "MM/DD/YYYY");
  const [language, setLanguage] = React.useState(regional?.language || "English (US)");

  React.useEffect(() => {
    if (regional) {
      setDefaultRegion(regional.defaultRegion || "United States");
      setTimezone(regional.timezone || "(UTC-05:00) America/New_York (EST)");
      setCurrency(regional.currency || "USD - US Dollar ($)");
      setDateFormat(regional.dateFormat || "MM/DD/YYYY");
      setLanguage(regional.language || "English (US)");
    }
  }, [regional]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      defaultRegion,
      timezone,
      currency,
      dateFormat,
      language
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Edit Regional & System Defaults
            </h3>
            <p className="text-xs text-slate-500">
              Administrative configuration of central localization and calendar parameters
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Default Region</label>
            <select
              value={defaultRegion}
              onChange={(e) => setDefaultRegion(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900 bg-white"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900 bg-white"
            >
              <option value="(UTC+05:30) Asia/Kolkata">(UTC+05:30) Asia/Kolkata</option>
              <option value="(UTC-06:00) Central Time">(UTC-06:00) Central Time</option>
              <option value="(UTC-05:00) Eastern Time">(UTC-05:00) Eastern Time</option>
              <option value="(UTC+00:00) UTC / London">(UTC+00:00) UTC / London</option>
              <option value="(UTC+08:00) Singapore / Perth">(UTC+08:00) Singapore / Perth</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900 bg-white"
              >
                <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                <option value="EUR - Euro (€)">EUR - Euro (€)</option>
                <option value="GBP - British Pound (£)">GBP - British Pound (£)</option>
                <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900 bg-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900 bg-white"
            >
              <option value="English (India)">English (India)</option>
              <option value="English (US)">English (US)</option>
              <option value="English (UK)">English (UK)</option>
              <option value="Hindi (India)">Hindi (India)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0071DC] hover:bg-[#005bb5] transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Apply Defaults"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
