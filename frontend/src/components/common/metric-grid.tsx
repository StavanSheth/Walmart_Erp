import * as React from "react";
import { cn } from "@/lib/cn";

export interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
}

export function MetricGrid({
  columns = 5,
  children,
  className,
  ...props
}: MetricGridProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
  };

  return (
    <div
      className={cn("grid gap-3.5", colClasses[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
}
