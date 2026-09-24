"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { SearchIcon, XIcon } from "../ui/icons";
import { DEMO_SEARCH_DATA } from "@/lib/config/demo-data";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = ["All", "Products", "Stores", "Customers", "Partners", "Orders"] as const;

export function GlobalSearchModal() {
  const { searchOpen, setSearchOpen } = useShell();
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<typeof CATEGORIES[number]>("All");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedCategory("All");
    }
  }, [searchOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  const filteredResults = React.useMemo(() => {
    return DEMO_SEARCH_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesText =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesText;
    });
  }, [query, selectedCategory]);

  if (!searchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <SearchIcon className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, stores, customers, orders, partners..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <XIcon className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
              ESC
            </span>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50/70 border-b border-slate-100 overflow-x-auto text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat
                  ? "bg-walmart-blue text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredResults.length > 0 ? (
            filteredResults.map((res) => (
              <Link
                key={res.id}
                href={res.href}
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-walmart-blue transition-colors truncate">
                      {res.title}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      • {res.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{res.subtitle}</p>
                </div>
                {res.badge ? (
                  <Badge
                    variant={
                      res.badge === "In Stock" || res.badge === "Delivered"
                        ? "success"
                        : res.badge === "Low Stock"
                          ? "warning"
                          : "default"
                    }
                    className="shrink-0"
                  >
                    {res.badge}
                  </Badge>
                ) : null}
              </Link>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">
              No results found for &ldquo;{query}&rdquo; in {selectedCategory}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filteredResults.length} demo results</span>
          <span className="hidden sm:inline">Use ↑ ↓ to navigate, ESC to close</span>
        </div>
      </div>
    </div>
  );
}

export function GlobalSearchTrigger({ className }: { className?: string }) {
  const { setSearchOpen } = useShell();

  return (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      aria-label="Open global search (Ctrl+K)"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors shadow-xs text-xs focus:outline-none focus:ring-2 focus:ring-walmart-blue",
        className
      )}
    >
      <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="hidden sm:inline truncate">Search ERP...</span>
      <span className="hidden md:inline-flex ml-auto pl-2">
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
          ⌘K
        </kbd>
      </span>
    </button>
  );
}
