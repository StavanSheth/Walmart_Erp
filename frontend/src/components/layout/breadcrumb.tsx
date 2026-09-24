"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, HomeIcon } from "../ui/icons";

interface RouteLabelMap {
  [segment: string]: string;
}

const ROUTE_LABELS: RouteLabelMap = {
  dashboard: "Dashboard",
  inventory: "Inventory",
  stores: "Stores",
  partners: "Partners & Customers",
  ledger: "General Ledger",
  reports: "Reports",
  settings: "Settings",
  products: "Products",
  orders: "Orders",
  details: "Details"
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(() => {
    if (!pathname || pathname === "/" || pathname === "/dashboard") {
      return [
        { label: "Walmart ERP", href: "/dashboard" },
        { label: "Dashboard", active: true }
      ];
    }

    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href?: string; active?: boolean }[] = [
      { label: "Walmart ERP", href: "/dashboard" }
    ];

    let accumulatedPath = "";
    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      const label = ROUTE_LABELS[seg.toLowerCase()] || seg.charAt(0).toUpperCase() + seg.slice(1);
      crumbs.push({
        label,
        href: isLast ? undefined : accumulatedPath,
        active: isLast
      });
    });

    return crumbs;
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-xs text-slate-500">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-walmart-blue transition-colors focus:outline-none"
            aria-label="Home"
          >
            <HomeIcon className="w-3.5 h-3.5" />
          </Link>
        </li>
        {breadcrumbs.slice(1).map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRightIcon className="w-3 h-3 text-slate-400 shrink-0" />
            {crumb.active || !crumb.href ? (
              <span className="font-semibold text-slate-800" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-walmart-blue transition-colors font-medium focus:outline-none"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
