"use client";

import * as React from "react";
import { BellIcon, CheckIcon, AlertTriangleIcon, PackageIcon, AlertCircleIcon } from "../ui/icons";
import { apiClient } from "@/lib/api/client";
import { Dropdown } from "../ui/dropdown";
import { cn } from "@/lib/cn";
import type { NotificationItem } from "@/types/store";
import Link from "next/link";

export function NotificationMenu({
  className,
  isDashboard = false
}: {
  className?: string;
  isDashboard?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  // Fetch live notifications directly from PostgreSQL database
  React.useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await apiClient.get<NotificationItem[]>("/api/notifications");
        if (res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error("Failed to load notifications from API", err);
      }
    }
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        return <AlertTriangleIcon className="w-4 h-4 text-semantic-warning" />;
      case "order":
        return <PackageIcon className="w-4 h-4 text-brand-primary" />;
      case "payment":
        return <CheckIcon className="w-4 h-4 text-semantic-success" />;
      default:
        return <AlertCircleIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className={className}>
      <Dropdown
        align="right"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        closeOnClickInside={false}
        contentClassName="w-80 sm:w-96 p-3"
        trigger={
          <div
            className={cn(
              "relative flex items-center justify-center w-9 h-9 rounded-full transition-colors shadow-xs cursor-pointer",
              isDashboard
                ? "border border-white/20 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md"
                : "border border-border bg-surface hover:bg-surface-subtle text-slate-600 rounded-md"
            )}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <BellIcon className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-pill bg-[#E61C24] text-[10px] font-bold text-white shadow-xs tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>
        }
      >
        <div className="flex items-center justify-between px-2 pb-2.5 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="type-card-title text-slate-900">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-pill text-[10px] font-bold bg-rose-100 text-semantic-danger tabular-nums">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-medium text-brand-primary hover:underline focus-visible:outline-none"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-border-subtle mt-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={cn(
                "p-2.5 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer",
                item.read ? "hover:bg-surface-subtle opacity-80" : "bg-blue-50/40 hover:bg-blue-50/70"
              )}
            >
              <div className="p-1.5 rounded-md bg-surface border border-border shadow-xs shrink-0 mt-0.5">
                {getNotificationIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1 tabular-nums">
                    {item.timestamp}
                  </span>
                </div>
                <p className="type-body-secondary mt-0.5 line-clamp-2">
                  {item.message}
                </p>
                {item.link ? (
                  <Link
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className="inline-block text-[11px] font-medium text-brand-primary hover:underline mt-1"
                  >
                    View details →
                  </Link>
                ) : null}
              </div>
              {!item.read && (
                <span className="w-1.5 h-1.5 rounded-pill bg-brand-primary shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}
