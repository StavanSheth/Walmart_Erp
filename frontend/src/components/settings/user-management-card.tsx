"use client";

import * as React from "react";
import {
  UsersGroupIcon,
  ShieldIcon,
  ActivityIcon,
  ChevronRightIcon
} from "@/components/ui/icons";
import type { UserManagementSummary } from "@/types/settings";

interface UserManagementCardProps {
  summary?: UserManagementSummary;
  onSelectSection?: (section: string) => void;
  isLoading?: boolean;
}

export function UserManagementCard({
  summary: _summary,
  onSelectSection,
  isLoading: _isLoading
}: UserManagementCardProps) {
  const items = [
    {
      id: "users",
      title: "Users",
      description: "Add, edit or deactivate users",
      icon: <UsersGroupIcon className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50 text-blue-600 border-blue-200/80"
    },
    {
      id: "roles",
      title: "Roles & Permissions",
      description: "Manage access control",
      icon: <ShieldIcon className="w-4 h-4 text-indigo-600" />,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-200/80"
    },
    {
      id: "teams",
      title: "Teams",
      description: "Organize users into teams",
      icon: <UsersGroupIcon className="w-4 h-4 text-teal-600" />,
      bg: "bg-teal-50 text-teal-600 border-teal-200/80"
    },
    {
      id: "activity",
      title: "Activity Logs",
      description: "Track user activity",
      icon: <ActivityIcon className="w-4 h-4 text-purple-600" />,
      bg: "bg-purple-50 text-purple-600 border-purple-200/80"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between min-h-[285px] h-full sm:h-[285px]">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
          User Management
        </h3>
        <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
          Manage users, roles and permissions
        </p>
      </div>

      {/* 4 Rows */}
      <div className="space-y-1.5 text-xs py-1">
        {items.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectSection?.(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectSection?.(item.id);
              }
            }}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200/60 transition-all cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.bg} group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-800 text-xs block leading-tight group-hover:text-blue-700 transition-colors">
                  {item.title}
                </span>
                <span className="text-[10.5px] text-slate-400 font-medium truncate block leading-tight">
                  {item.description}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
