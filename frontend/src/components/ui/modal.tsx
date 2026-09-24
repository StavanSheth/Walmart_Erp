"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { XIcon } from "./icons";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
  showCloseButton = true,
  hideHeader = false
}: ModalProps) {
  // Close on Escape key
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

  // Lock body scroll when open
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

  const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl"
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity anim-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div
        className={cn(
          "relative w-full rounded-xl sm:rounded-2xl bg-surface shadow-xl border border-border p-5 sm:p-6 z-10 anim-scale-in",
          sizeClasses[size],
          className
        )}
      >
        {!hideHeader && (title || showCloseButton) && (
          <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
            <div>
              {title ? (
                <h2 className="type-card-title text-slate-900">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="type-body-secondary mt-1">{description}</p>
              ) : null}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className={cn(!hideHeader && "mt-4")}>{children}</div>
      </div>
    </div>
  );
}

export const Dialog = Modal;
export type DialogProps = ModalProps;
