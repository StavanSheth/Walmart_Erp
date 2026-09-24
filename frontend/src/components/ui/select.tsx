import * as React from "react";
import { cn } from "@/lib/utils";
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
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={selectId} className="block text-xs font-medium text-slate-700">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-8 py-1 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-walmart-blue focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-rose-500 focus-visible:ring-rose-500",
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
        {error ? <p className="text-xs text-rose-600 font-medium">{error}</p> : null}
      </div>
    );
  }
);

Select.displayName = "Select";
