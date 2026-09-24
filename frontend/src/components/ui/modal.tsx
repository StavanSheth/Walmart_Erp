"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "./icons";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = "md"
}: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
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

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl"
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div
        className={cn(
          "relative w-full rounded-xl bg-white shadow-xl border border-slate-200 p-6 z-10 animate-in fade-in zoom-in-95 duration-150",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-900 leading-tight">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-walmart-blue"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
