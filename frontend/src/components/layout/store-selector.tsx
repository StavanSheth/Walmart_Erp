"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { StoreIcon, ChevronDownIcon, CheckIcon } from "../ui/icons";
import { Dropdown } from "../ui/dropdown";
import { cn } from "@/lib/cn";
import type { StoreInfo } from "@/types/store";

export function StoreSelector({ className }: { className?: string }) {
  const { currentStore, setCurrentStore, stores } = useShell();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectStore = (store: StoreInfo) => {
    setCurrentStore(store);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <Dropdown
        align="left"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        contentClassName="w-72 sm:w-80 p-2"
        trigger={
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surface-subtle transition-colors shadow-xs text-left">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-sky text-brand-primary shrink-0">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 pr-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[130px] sm:max-w-[160px]">
                  {currentStore.name}
                </span>
                <span className="text-[10px] font-mono tabular-nums px-1 rounded bg-surface-muted text-slate-500 font-medium">
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
                isOpen && "rotate-180 text-brand-primary"
              )}
            />
          </div>
        }
      >
        <div className="px-2.5 py-1.5 border-b border-border-subtle mb-1">
          <p className="type-label text-slate-400">
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
                  "w-full flex items-center justify-between p-2 rounded-md text-left transition-colors",
                  isSelected
                    ? "bg-brand-sky/80 text-brand-navy font-semibold"
                    : "hover:bg-surface-subtle text-slate-700"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      isSelected ? "bg-brand-primary" : "bg-slate-300"
                    )}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium truncate">{store.name}</span>
                      <span className="text-[10px] font-mono tabular-nums px-1 rounded bg-surface-muted text-slate-500">
                        {store.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {store.city}, {store.state}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <CheckIcon className="w-4 h-4 text-brand-primary shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </Dropdown>
    </div>
  );
}
