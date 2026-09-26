"use client";

import * as React from "react";
import { XIcon, QrCodeIcon } from "@/components/ui/icons";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (code: string) => void;
}

export function QrScannerModal({ isOpen, onClose, onScanResult }: QrScannerModalProps) {
  const [simulatedCode, setSimulatedCode] = React.useState("");

  if (!isOpen) return null;

  const quickCodes = [
    { label: "Sales Store #101", code: "JV-2026-8921" },
    { label: "Purchase Supplier ABC", code: "PO-77821" },
    { label: "Payment FreshMart", code: "PAY-66219" },
    { label: "Invoice Retailer XYZ", code: "INV-90123" },
    { label: "Monthly Adjustment", code: "JV-2026-8910" }
  ];

  const handleSelectCode = (code: string) => {
    onScanResult(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-[#0071DC]" />
            <h3 className="text-sm font-bold text-slate-900">QR / Barcode Scanner</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Simulation Viewport */}
        <div className="p-5 space-y-4">
          <div className="relative w-full h-44 rounded-xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border border-slate-800">
            {/* Camera targeting reticle */}
            <div className="w-32 h-32 rounded-lg border-2 border-[#0071DC] relative flex items-center justify-center">
              <span className="w-full h-0.5 bg-emerald-400 absolute animate-pulse shadow-md" />
              <div className="text-[11px] font-mono text-white/70">Scanning...</div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Align QR code or reference label inside frame</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Quick Scan from Recent References:
            </label>
            <div className="space-y-1.5">
              {quickCodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectCode(item.code)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 hover:border-[#0071DC] hover:bg-blue-50/50 text-xs font-medium text-slate-700 transition-all text-left"
                >
                  <span className="font-semibold text-slate-900">{item.label}</span>
                  <span className="font-mono text-[11px] text-[#0071DC] font-bold">{item.code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="Or enter reference ID..."
              value={simulatedCode}
              onChange={(e) => setSimulatedCode(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071DC] font-mono"
            />
            <button
              type="button"
              onClick={() => simulatedCode && handleSelectCode(simulatedCode)}
              disabled={!simulatedCode}
              className="px-3.5 py-1.5 rounded-xl bg-[#0071DC] text-white text-xs font-bold hover:bg-[#005bb5] disabled:bg-slate-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
