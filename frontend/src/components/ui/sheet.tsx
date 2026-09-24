"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
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
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sideClasses = {
    left: "inset-y-0 left-0 h-full w-72 sm:w-80 shadow-2xl border-r border-border anim-drawer-left",
    right: "inset-y-0 right-0 h-full w-80 sm:w-96 shadow-2xl border-l border-border anim-drawer-right",
    bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl shadow-2xl border-t border-border anim-drawer-bottom"
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-drawer overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity anim-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Panel */}
      <div
        className={cn(
          "fixed bg-surface z-10 flex flex-col focus-visible:outline-none",
          sideClasses[side],
          className
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle shrink-0">
          <h2 className="type-card-title text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
