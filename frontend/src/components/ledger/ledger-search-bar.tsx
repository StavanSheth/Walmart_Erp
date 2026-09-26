"use client";

import * as React from "react";
import { SearchIcon, QrCodeIcon, XIcon } from "@/components/ui/icons";

interface LedgerSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onOpenScanner?: () => void;
  className?: string;
}

export function LedgerSearchBar({
  value,
  onChange,
  onOpenScanner,
  className = ""
}: LedgerSearchBarProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Translucent pill container sitting directly over horizon background */}
      <div className="w-full relative flex items-center rounded-2xl bg-white/20 hover:bg-white/25 focus-within:bg-white/30 backdrop-blur-xl border border-white/30 shadow-md transition-all duration-200">
        {/* Left Search Icon */}
        <div className="pl-4 pr-2 text-white/80 pointer-events-none flex items-center justify-center">
          <SearchIcon className="w-4 h-4 text-white/90" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search transactions, accounts, or reference..."
          aria-label="Search transactions, accounts, or reference"
          className="w-full py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-white placeholder-blue-100/75 bg-transparent border-0 focus:outline-none focus:ring-0 font-medium"
        />

        {/* Clear Button if value present */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 mr-1 text-white/70 hover:text-white transition-colors"
            title="Clear search"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right QR / Scanner Icon Button */}
        <button
          type="button"
          onClick={onOpenScanner}
          aria-label="Scan QR or reference code"
          title="Scan transaction QR code"
          className="pr-3.5 pl-1.5 py-1 text-white/90 hover:text-white active:scale-90 transition-transform flex items-center justify-center"
        >
          <div className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <QrCodeIcon className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
