"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { SearchIcon } from "./icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sizeVariant?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      id,
      sizeVariant = "md",
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const heightStyles = {
      sm: "h-8 text-xs px-2.5",
      md: "h-9 text-sm px-3",   /* 36px Desktop */
      lg: "h-10 text-sm px-3.5" /* 40px Mobile */
    };

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {startIcon ? (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {startIcon}
            </div>
          ) : null}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              "flex w-full rounded-md border border-border bg-surface text-slate-900 shadow-xs transition-colors",
              "placeholder:text-slate-400",
              /* Focus state */
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
              /* Disabled state */
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-subtle",
              /* Read-only state */
              readOnly && "bg-surface-subtle cursor-default focus-visible:ring-0 focus-visible:border-border",
              heightStyles[sizeVariant],
              startIcon && "pl-9",
              endIcon && "pr-9",
              /* Error state */
              error && "border-semantic-danger focus-visible:ring-semantic-danger",
              className
            )}
            {...props}
          />
          {endIcon ? (
            <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
              {endIcon}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs text-semantic-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "startIcon">>(
  (props, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        startIcon={<SearchIcon className="w-4 h-4" />}
        placeholder="Search..."
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

export const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="number"
        className={cn("tabular-nums", className)}
        {...props}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "startIcon"> & { currencySymbol?: string }
>(({ currencySymbol = "₹", className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="number"
      step="0.01"
      startIcon={<span className="text-xs font-semibold text-slate-500">{currencySymbol}</span>}
      className={cn("tabular-nums", className)}
      {...props}
    />
  );
});
CurrencyInput.displayName = "CurrencyInput";

export const DateInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        className={cn("tabular-nums", className)}
        {...props}
      />
    );
  }
);
DateInput.displayName = "DateInput";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, readOnly, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        ) : null}
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-slate-900 shadow-xs transition-colors",
            "placeholder:text-slate-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-subtle",
            readOnly && "bg-surface-subtle cursor-default focus-visible:ring-0 focus-visible:border-border",
            error && "border-semantic-danger focus-visible:ring-semantic-danger",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-semantic-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

