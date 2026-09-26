"use client";

import * as React from "react";
import {
  ComputerIcon,
  CartIcon,
  TruckIcon,
  AccountingIcon,
  LinkIcon,
  ChevronRightIcon
} from "@/components/ui/icons";
import type { IntegrationsSummary } from "@/types/settings";

interface IntegrationsCardProps {
  summary?: IntegrationsSummary;
  onSelectIntegration?: (id: string) => void;
  isLoading?: boolean;
}

export function IntegrationsCard({
  summary: _summary,
  onSelectIntegration,
  isLoading: _isLoading
}: IntegrationsCardProps) {
  const items = [
    {
      id: "pos",
      title: "POS Systems",
      description: "Store POS integration",
      icon: <ComputerIcon className="w-3.5 h-3.5 text-blue-600" />,
      bg: "bg-blue-50 text-blue-600 border-blue-200/80"
    },
    {
      id: "ecommerce",
      title: "E-commerce Platforms",
      description: "Marketplace & online store sync",
      icon: <CartIcon className="w-3.5 h-3.5 text-sky-600" />,
      bg: "bg-sky-50 text-sky-600 border-sky-200/80"
    },
    {
      id: "shipping",
      title: "Shipping & Logistics",
      description: "Carrier integrations (FedEx, UPS, etc.)",
      icon: <TruckIcon className="w-3.5 h-3.5 text-amber-600" />,
      bg: "bg-amber-50 text-amber-600 border-amber-200/80"
    },
    {
      id: "accounting",
      title: "Accounting Systems",
      description: "ERP, tax and financial integrations",
      icon: <AccountingIcon className="w-3.5 h-3.5 text-emerald-600" />,
      bg: "bg-emerald-50 text-emerald-600 border-emerald-200/80"
    },
    {
      id: "apiWebhooks",
      title: "APIs & Webhooks",
      description: "Manage API keys and webhooks",
      icon: <LinkIcon className="w-3.5 h-3.5 text-purple-600" />,
      bg: "bg-purple-50 text-purple-600 border-purple-200/80"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between min-h-[285px] h-full sm:h-[285px]">
      {/* Header */}
      <div className="pb-1.5 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
          Integrations
        </h3>
        <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
          Connect with external systems
        </p>
      </div>

      {/* 5 Rows */}
      <div className="space-y-1 text-xs py-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectIntegration?.(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectIntegration?.(item.id);
              }
            }}
            className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-slate-50/60 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200/60 transition-all cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${item.bg} group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-800 text-[11px] block leading-tight group-hover:text-blue-700 transition-colors">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate block leading-tight">
                  {item.description}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
