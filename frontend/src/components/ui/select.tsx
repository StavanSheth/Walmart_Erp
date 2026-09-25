"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  sizeVariant?: "sm" | "md" | "lg";
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      options,
      children,
      id,
      sizeVariant = "md",
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const heightStyles = {
      sm: "h-8 text-xs px-2.5",
      md: "h-9 text-sm px-3",
      lg: "h-10 text-sm px-3.5"
    };

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex w-full appearance-none rounded-md border border-border bg-surface pr-8 text-slate-900 shadow-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-subtle",
              heightStyles[sizeVariant],
              error && "border-semantic-danger focus-visible:ring-semantic-danger",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-semantic-danger font-medium">{error}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
