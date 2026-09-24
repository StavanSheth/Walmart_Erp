"use client";

import * as React from "react";
import { Avatar } from "../ui/avatar";
import { UserIcon, SettingsIcon, LogOutIcon, ChevronDownIcon } from "../ui/icons";
import { cn } from "@/lib/utils";

export function UserMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User profile and settings menu"
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-walmart-blue"
      >
        <Avatar name="Admin User" size="sm" />
        <div className="hidden xl:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 leading-tight">Admin User</span>
          <span className="text-[10px] text-slate-400">Store Manager</span>
        </div>
        <ChevronDownIcon
          className={cn(
            "hidden xl:block w-3.5 h-3.5 text-slate-400 transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User Details Header */}
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-900">Admin User</p>
            <p className="text-[11px] text-slate-500 truncate font-mono">admin@walmart.in</p>
            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-walmart-blue-light text-walmart-blue">
              Store Manager • Demo
            </span>
          </div>

          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left transition-colors"
            >
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>Preferences</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left transition-colors font-medium"
            >
              <LogOutIcon className="w-4 h-4 text-rose-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
