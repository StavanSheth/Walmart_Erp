"use client";

import * as React from "react";
import { Avatar } from "../ui/avatar";
import { UserIcon, SettingsIcon, LogOutIcon, ChevronDownIcon } from "../ui/icons";
import { Dropdown } from "../ui/dropdown";
import { cn } from "@/lib/cn";

export function UserMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={className}>
      <Dropdown
        align="right"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        contentClassName="w-56 p-1.5"
        trigger={
          <div className="flex items-center gap-2 p-1 rounded-md hover:bg-surface-muted transition-colors">
            <Avatar name="Admin User" size="sm" />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">Admin User</span>
              <span className="text-[10px] text-slate-400">Retail Operations</span>
            </div>
            <ChevronDownIcon
              className={cn(
                "hidden xl:block w-3.5 h-3.5 text-slate-400 transition-transform duration-150",
                isOpen && "rotate-180 text-brand-primary"
              )}
            />
          </div>
        }
      >
        {/* User Details Header */}
        <div className="px-3 py-2 border-b border-border-subtle">
          <p className="type-card-title text-xs text-slate-900">Admin User</p>
          <p className="text-[11px] text-slate-500 truncate font-mono">admin@walmart.in</p>
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded-pill text-[10px] font-semibold bg-brand-sky text-brand-primary">
            Demo Account
          </span>
        </div>

        <div className="py-1">
          <button
            type="button"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-surface-subtle rounded-md text-left transition-colors focus-visible:outline-none focus-visible:bg-surface-muted"
          >
            <UserIcon className="w-4 h-4 text-slate-400" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-surface-subtle rounded-md text-left transition-colors focus-visible:outline-none focus-visible:bg-surface-muted"
          >
            <SettingsIcon className="w-4 h-4 text-slate-400" />
            <span>Preferences</span>
          </button>
        </div>

        <div className="border-t border-border-subtle pt-1">
          <button
            type="button"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-semantic-danger hover:bg-red-50 rounded-md text-left transition-colors font-medium focus-visible:outline-none focus-visible:bg-red-50"
          >
            <LogOutIcon className="w-4 h-4 text-semantic-danger" />
            <span>Sign out</span>
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
