"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { StoreIcon, ChevronDownIcon, CheckIcon } from "../ui/icons";
import { cn } from "@/lib/utils";
import type { StoreInfo } from "@/types/store";

export function StoreSelector({ className }: { className?: string }) {
  const { currentStore, setCurrentStore, stores } = useShell();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectStore = (store: StoreInfo) => {
    setCurrentStore(store);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select active retail store"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs text-left focus:outline-none focus:ring-2 focus:ring-walmart-blue"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-walmart-blue-light text-walmart-blue shrink-0">
          <StoreIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 pr-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-900 truncate max-w-[130px] sm:max-w-[160px]">
              {currentStore.name}
            </span>
            <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-500 font-medium">
              {currentStore.code}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
            {currentStore.city}, {currentStore.state}
          </span>
        </div>
        <ChevronDownIcon
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0",
            isOpen && "rotate-180 text-walmart-blue"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 sm:left-0 sm:right-auto z-50 mt-2 w-72 sm:w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Store Network ({stores.length} Outlets)
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {stores.map((store) => {
              const isSelected = store.code === currentStore.code;
              return (
                <button
                  key={store.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectStore(store)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-walmart-blue-light/70 text-walmart-navy font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        isSelected ? "bg-walmart-blue" : "bg-slate-300"
                      )}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium truncate">{store.name}</span>
                        <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-500">
                          {store.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {store.city}, {store.state}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckIcon className="w-4 h-4 text-walmart-blue shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
