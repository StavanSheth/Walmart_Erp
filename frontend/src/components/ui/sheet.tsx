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
  variant?: "default" | "glass";
}

export function Sheet({
  isOpen,
  onClose,
  title,
  side = "left",
  children,
  className,
  variant = "default"
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

  const isGlass = variant === "glass";

  const sideClasses = {
    left: isGlass
      ? "inset-y-0 left-0 h-full w-72 sm:w-80 shadow-2xl border-r border-white/20 anim-drawer-left"
      : "inset-y-0 left-0 h-full w-72 sm:w-80 shadow-2xl border-r border-border anim-drawer-left",
    right: isGlass
      ? "inset-y-0 right-0 h-full w-80 sm:w-96 shadow-2xl border-l border-white/20 anim-drawer-right"
      : "inset-y-0 right-0 h-full w-80 sm:w-96 shadow-2xl border-l border-border anim-drawer-right",
    bottom: isGlass
      ? "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl shadow-2xl border-t border-white/20 anim-drawer-bottom"
      : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl shadow-2xl border-t border-border anim-drawer-bottom"
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-drawer overflow-hidden">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 transition-opacity anim-fade-in",
          isGlass
            ? "bg-black/40 backdrop-blur-xs"
            : "bg-slate-900/60 backdrop-blur-xs"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Panel */}
      <div
        className={cn(
          "fixed z-10 flex flex-col focus-visible:outline-none",
          isGlass
            ? "bg-[#06182c]/60 backdrop-blur-xl text-white shadow-2xl"
            : "bg-surface text-slate-900",
          sideClasses[side],
          className
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-5 py-4 shrink-0",
            isGlass
              ? "border-b border-white/15 text-white"
              : "border-b border-border-subtle"
          )}
        >
          <h2
            className={cn(
              isGlass
                ? "text-base font-extrabold tracking-tight text-white"
                : "type-card-title text-slate-900"
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className={cn(
              "p-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary active:scale-95",
              isGlass
                ? "rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                : "rounded-lg text-slate-400 hover:bg-surface-muted hover:text-slate-700"
            )}
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
