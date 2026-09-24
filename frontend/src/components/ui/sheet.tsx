"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "./icons";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right" | "bottom";
  children: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  side = "left",
  children,
  className
}: SheetProps) {
  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sideClasses = {
    left: "inset-y-0 left-0 h-full w-72 sm:w-80 shadow-2xl border-r border-slate-200 animate-in slide-in-from-left duration-200",
    right: "inset-y-0 right-0 h-full w-80 sm:w-96 shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200",
    bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200"
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Panel */}
      <div
        className={cn(
          "fixed bg-white z-10 flex flex-col focus-visible:outline-none",
          sideClasses[side],
          className
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-walmart-blue"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
