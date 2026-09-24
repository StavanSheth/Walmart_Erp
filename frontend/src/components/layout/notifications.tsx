"use client";

import * as React from "react";
import { BellIcon, CheckIcon, AlertTriangleIcon, PackageIcon, AlertCircleIcon } from "../ui/icons";
import { DEMO_NOTIFICATIONS } from "@/lib/config/demo-data";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types/store";
import Link from "next/link";

export function NotificationMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "stock":
        return <AlertTriangleIcon className="w-4 h-4 text-amber-600" />;
      case "order":
        return <PackageIcon className="w-4 h-4 text-walmart-blue" />;
      case "payment":
        return <CheckIcon className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertCircleIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications (${unreadCount} unread)`}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-walmart-blue"
      >
        <BellIcon className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label="Notifications Panel"
          className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-walmart-blue hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={cn(
                  "p-2.5 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer",
                  item.read ? "hover:bg-slate-50/60 opacity-80" : "bg-blue-50/40 hover:bg-blue-50/70"
                )}
              >
                <div className="p-1.5 rounded-md bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                    {item.message}
                  </p>
                  {item.link ? (
                    <Link
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-block text-[11px] font-medium text-walmart-blue hover:underline mt-1"
                    >
                      View details →
                    </Link>
                  ) : null}
                </div>
                {!item.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-walmart-blue shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
