"use client";

import * as React from "react";
import { useShell } from "@/context/shell-context";
import { SearchIcon, XIcon } from "../ui/icons";
import { DEMO_SEARCH_DATA } from "@/lib/config/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
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

  return (
    <Modal
      isOpen={searchOpen}
      onClose={() => setSearchOpen(false)}
      size="xl"
      hideHeader
      className="p-0 overflow-hidden"
    >
      {/* Search Input Bar */}
      <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
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
            aria-label="Clear search query"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <XIcon className="w-4 h-4" />
          </button>
        ) : (
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-surface-muted rounded border border-border">
            ESC
          </span>
        )}
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-surface-subtle border-b border-border overflow-x-auto text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-2.5 py-1 rounded-pill font-medium transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
              selectedCategory === cat
                ? "bg-brand-primary text-white shadow-xs"
                : "text-slate-600 hover:bg-surface-muted hover:text-slate-900"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Results Area */}
      <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border-subtle">
        {filteredResults.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <SearchIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-700">No matching results found</p>
            <p className="text-[11px] mt-0.5">Try searching with a different SKU, name, or category</p>
          </div>
        ) : (
          filteredResults.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setSearchOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-subtle transition-colors group focus-visible:outline-none focus-visible:bg-surface-muted"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-brand-primary transition-colors truncate">
                    {item.title}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-surface-muted text-slate-500 shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="type-body-secondary mt-0.5 truncate">{item.subtitle}</p>
              </div>

              {item.badge ? (
                <StatusBadge status={item.badge} className="shrink-0" />
              ) : null}
            </Link>
          ))
        )}
      </div>

      {/* Footer / Shortcuts Help */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle border-t border-border text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Navigate <kbd className="font-mono font-semibold text-slate-600">↑↓</kbd>
          </span>
          <span>
            Select <kbd className="font-mono font-semibold text-slate-600">↵</kbd>
          </span>
          <span>
            Close <kbd className="font-mono font-semibold text-slate-600">Esc</kbd>
          </span>
        </div>
        <span className="tabular-nums font-mono">{filteredResults.length} results</span>
      </div>
    </Modal>
  );
}

export function GlobalSearchTrigger({ className, isDashboard = false }: { className?: string; isDashboard?: boolean }) {
  const { setSearchOpen } = useShell();

  return (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      aria-label="Open global search (Ctrl+K)"
      className={cn(
        "flex items-center justify-between w-full h-9 px-3 rounded-md transition-colors shadow-xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        isDashboard
          ? "border border-white/20 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md rounded-full text-xs"
          : "border border-border bg-surface text-xs text-slate-400 hover:border-border-strong hover:bg-surface-subtle",
        className
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <SearchIcon
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            isDashboard ? "text-white/80" : "text-slate-400 group-hover:text-slate-600"
          )}
        />
        <span className={cn("truncate text-xs", isDashboard ? "text-white/80" : "text-slate-400")}>
          Search products, SKUs, stores, customers...
        </span>
      </div>
      <kbd
        className={cn(
          "hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded",
          isDashboard
            ? "text-white/90 bg-white/20 border border-white/25"
            : "text-slate-500 bg-surface-muted border border-border"
        )}
      >
        ⌘K
      </kbd>
    </button>
  );
}
