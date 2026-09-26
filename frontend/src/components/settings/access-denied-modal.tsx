"use client";

import * as React from "react";
import { LockIcon } from "@/components/ui/icons";

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  settingName?: string;
}

export function AccessDeniedModal({
  isOpen,
  onClose,
  message = "You don't have access to change this setting.",
  settingName
}: AccessDeniedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-rose-200/80 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-denied-title"
      >
        {/* Header Icon + Title */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
            <LockIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 id="access-denied-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Access Denied
            </h3>
            <p className="text-xs text-rose-600 font-semibold mt-0.5">
              403 Forbidden • Authorization Required
            </p>
          </div>
        </div>

        {/* Message Body */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
          <p className="font-semibold text-slate-900 leading-relaxed">
            {message}
          </p>
          {settingName && (
            <p className="text-slate-500 text-[11px]">
              Target setting: <span className="font-mono font-medium text-slate-700">{settingName}</span>
            </p>
          )}
          <p className="text-slate-500 text-[11px] leading-relaxed pt-1 border-t border-slate-200/60">
            Contact your administrator if you need permission. Changes to system and default configurations are restricted to authorized administrative roles.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
