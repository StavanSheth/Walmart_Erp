"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "link"
    | "icon"
    | "spark";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors select-none " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary " +
      "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] cursor-pointer";

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-brand-primary-active shadow-xs",
      secondary:
        "bg-brand-sky text-brand-primary hover:bg-blue-100/70 active:bg-blue-200/60 border border-blue-200/50",
      outline:
        "border border-border bg-surface text-slate-700 hover:bg-surface-subtle hover:text-slate-900 shadow-xs",
      ghost:
        "text-slate-600 hover:bg-surface-muted hover:text-slate-900 border border-transparent",
      danger:
        "bg-semantic-danger text-white hover:bg-red-600 active:bg-red-700 shadow-xs",
      success:
        "bg-semantic-success text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-xs",
      link:
        "text-brand-primary hover:underline underline-offset-4 p-0 h-auto border-none shadow-none font-normal",
      icon:
        "p-0 border border-border bg-surface text-slate-600 hover:bg-surface-subtle hover:text-slate-900 shadow-xs",
      spark:
        "bg-brand-yellow text-brand-navy hover:bg-brand-yellow-hover font-semibold shadow-xs"
    };

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      xs: "h-7 px-2.5 text-xs gap-1",
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",   /* 36px Standard Desktop */
      lg: "h-10 px-5 text-sm gap-2.5" /* 40px Standard Mobile */
    };

    // If variant is 'icon', enforce square sizing based on size prop
    const iconSizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      xs: "h-7 w-7",
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-10 w-10"
    };

    const appliedSizeStyle = variant === "icon" ? iconSizeStyles[size] : sizeStyles[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "link" && appliedSizeStyle,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
