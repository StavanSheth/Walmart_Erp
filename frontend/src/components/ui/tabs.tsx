"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface TabsContextValue {
  value: string;
  onChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const activeValue = value !== undefined ? value : internalValue;

  const handleChange = React.useCallback(
    (newVal: string) => {
      setInternalValue(newVal);
      onValueChange?.(newVal);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: activeValue, onChange: handleChange }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-surface-muted rounded-md text-slate-600 text-xs font-medium border border-border",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isSelected = context.value === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      onClick={() => context.onChange(value)}
      className={cn(
        "inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-xs font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        isSelected
          ? "bg-surface text-brand-navy shadow-xs font-semibold"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div role="tabpanel" className={cn("focus-visible:outline-none", className)}>
      {children}
    </div>
  );
}
