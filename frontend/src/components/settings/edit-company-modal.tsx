"use client";

import * as React from "react";
import type { CompanyInformation } from "@/types/settings";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyInformation;
  onSubmit: (data: Partial<CompanyInformation>) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditCompanyModal({
  isOpen,
  onClose,
  company,
  onSubmit,
  isSubmitting
}: EditCompanyModalProps) {
  const [name, setName] = React.useState(company?.name || "Walmart India");
  const [headquarters, setHeadquarters] = React.useState(company?.headquarters || "Bengaluru, Karnataka, India");
  const [industry, setIndustry] = React.useState(company?.industry || "Retail & E-commerce");
  const [website, setWebsite] = React.useState(company?.website || "www.walmart.co.in");

  React.useEffect(() => {
    if (company) {
      setName(company.name || "Walmart India");
      setHeadquarters(company.headquarters || "Bengaluru, Karnataka, India");
      setIndustry(company.industry || "Retail & E-commerce");
      setWebsite(company.website || "www.walmart.co.in");
    }
  }, [company]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, headquarters, industry, website });
    onClose();
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
              Edit Organization Details
            </h3>
            <p className="text-xs text-slate-500">
              Update central tenancy identity and business credentials
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
            <label className="font-bold text-slate-700 block mb-1">Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Headquarters</label>
            <input
              type="text"
              value={headquarters}
              onChange={(e) => setHeadquarters(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-semibold text-slate-900"
              />
            </div>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
