import * as React from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

export function Section({ className, ...props }: SectionProps) {
  return <section className={cn("space-y-4", className)} {...props} />;
}

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2", className)}
      {...props}
    >
      <div>
        <h2 className="type-section-title">{title}</h2>
        {description ? <p className="type-body-secondary mt-0.5">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">{actions}</div> : null}
    </div>
  );
}
