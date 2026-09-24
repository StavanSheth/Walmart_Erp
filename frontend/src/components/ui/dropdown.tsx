"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Shared hook to dismiss overlays on outside click or Escape key.
 * Used internally by Dropdown, Popover, and custom overlay shells.
 */
export function useOverlayDismiss({
  isOpen,
  onDismiss,
  ref
}: {
  isOpen: boolean;
  onDismiss: () => void;
  ref: React.RefObject<HTMLElement | null>;
}) {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDismiss();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onDismiss, ref]);
}

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  closeOnClickInside?: boolean;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  isOpen: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
  closeOnClickInside = true
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  useOverlayDismiss({
    isOpen: open,
    onDismiss: () => setOpen(false),
    ref: containerRef
  });

  const alignStyles = {
    left: "left-0",
    right: "right-0"
  };

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="menu"
        className="cursor-pointer inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        {trigger}
      </div>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-dropdown mt-2 min-w-[200px] rounded-lg border border-border bg-surface p-1.5 shadow-lg anim-scale-in",
            alignStyles[align],
            contentClassName
          )}
          onClick={() => {
            if (closeOnClickInside) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export const DropdownMenu = Dropdown;

export function DropdownItem({
  children,
  onClick,
  className,
  destructive = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors text-left focus-visible:outline-none focus-visible:bg-surface-muted",
        destructive
          ? "text-semantic-danger hover:bg-red-50 hover:text-red-700"
          : "text-slate-700 hover:bg-surface-muted hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px my-1 bg-border-subtle -mx-1" />;
}

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "left" | "right" | "center";
  className?: string;
}

export function Popover({
  trigger,
  children,
  isOpen: controlledOpen,
  onOpenChange,
  align = "right",
  className
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  useOverlayDismiss({
    isOpen: open,
    onDismiss: () => setOpen(false),
    ref: containerRef
  });

  const alignStyles = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2"
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="cursor-pointer inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        {trigger}
      </div>

      {open && (
        <div
          role="region"
          className={cn(
            "absolute z-popover mt-2 rounded-xl border border-border bg-surface p-3 shadow-lg anim-scale-in",
            alignStyles[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
