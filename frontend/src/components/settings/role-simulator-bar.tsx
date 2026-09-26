"use client";

import * as React from "react";
import { ShieldIcon, LockIcon } from "@/components/ui/icons";

interface RoleSimulatorBarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export function RoleSimulatorBar({ currentRole, onRoleChange }: RoleSimulatorBarProps) {
  const isAdmin = currentRole.toLowerCase().includes("admin");

  return (
    <div className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 text-white rounded-xl px-4 py-2.5 border border-white/20 shadow-md backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          {isAdmin ? <ShieldIcon className="w-3.5 h-3.5 text-blue-200" /> : <LockIcon className="w-3.5 h-3.5 text-amber-300" />}
        </div>
        <div>
          <span className="font-bold text-white">Active Session Role: </span>
          <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${isAdmin ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40" : "bg-amber-500/30 text-amber-200 border border-amber-400/40"}`}>
            {currentRole}
          </span>
          <span className="text-blue-200/80 text-[11px] ml-2 hidden sm:inline">
            {isAdmin ? "Full administrative authority to modify system defaults." : "Read-only access. System settings mutations return 403 Forbidden."}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg border border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => onRoleChange("Admin")}
          className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${isAdmin ? "bg-[#0071DC] text-white shadow-xs" : "text-blue-200 hover:text-white"}`}
        >
          Admin (Full Access)
        </button>
        <button
          type="button"
          onClick={() => onRoleChange("Standard User")}
          className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${!isAdmin ? "bg-amber-600 text-white shadow-xs" : "text-blue-200 hover:text-white"}`}
        >
          Simulate Standard User (Protected)
        </button>
      </div>
    </div>
  );
}
