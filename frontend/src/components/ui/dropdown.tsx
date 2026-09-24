"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, children, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicked outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
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

  const alignStyles = {
    left: "left-0",
    right: "right-0"
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100",
            alignStyles[align],
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

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
        "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 transition-colors text-left focus:outline-none focus:bg-slate-100",
        destructive
          ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          : "hover:bg-slate-100 hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px my-1 bg-slate-100 -mx-1" />;
}
