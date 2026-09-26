"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "@/components/ui/icons";

interface StoresSearchProps {
  value: string;
  onChange: (search: string) => void;
  className?: string;
}

export function StoresSearch({
  value,
  onChange,
  className = ""
}: StoresSearchProps) {
  const [localValue, setLocalValue] = React.useState(value);

  // Sync external filter changes to local state
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce updates back to parent URL state
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [localValue, value, onChange]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search stores, locations, or manager..."
        className="w-full bg-white border border-slate-200/90 hover:border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-2xs outline-none"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
