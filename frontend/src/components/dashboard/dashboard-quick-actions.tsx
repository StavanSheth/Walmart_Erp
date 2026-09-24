"use client";

import * as React from "react";
import Link from "next/link";
import { NavIconByName } from "@/components/ui/icons";

export function DashboardQuickActions() {
  const actions = [
    {
      name: "Inventory",
      href: "/inventory",
      iconName: "inventory",
      bgClass: "bg-blue-500/10 border-blue-200/60 text-blue-600 hover:bg-blue-500/15"
    },
    {
      name: "Stores",
      href: "/stores",
      iconName: "stores",
      bgClass: "bg-emerald-500/10 border-emerald-200/60 text-emerald-600 hover:bg-emerald-500/15"
    },
    {
      name: "Partners",
      href: "/partners",
      iconName: "partners",
      bgClass: "bg-purple-500/10 border-purple-200/60 text-purple-600 hover:bg-purple-500/15"
    },
    {
      name: "Reports",
      href: "/reports",
      iconName: "reports",
      bgClass: "bg-amber-500/10 border-amber-200/60 text-amber-600 hover:bg-amber-500/15"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 md:hidden">
      {actions.map((act) => (
        <Link
          key={act.name}
          href={act.href}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border glass-card transition-all active:scale-95 text-center shadow-xs ${act.bgClass}`}
        >
          <NavIconByName name={act.iconName} className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 tracking-tight">
            {act.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
