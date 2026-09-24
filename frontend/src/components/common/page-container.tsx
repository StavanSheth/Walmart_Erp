import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6",
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            {title ? (
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {actions}
            </div>
          ) : null}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
