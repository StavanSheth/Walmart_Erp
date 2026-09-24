import * as React from "react";
import { cn } from "@/lib/cn";

export { Section, SectionHeader, type SectionProps, type SectionHeaderProps } from "./section";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border",
        className
      )}
      {...props}
    >
      <div>
        {title ? <PageTitle>{title}</PageTitle> : null}
        {description ? <PageDescription>{description}</PageDescription> : null}
        {children}
      </div>
      {actions ? <PageActions>{actions}</PageActions> : null}
    </div>
  );
}

export function PageTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("type-page-title", className)}
      {...props}
    />
  );
}

export function PageDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("type-body-secondary mt-1 max-w-2xl", className)}
      {...props}
    />
  );
}

export function PageActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 self-start sm:self-auto shrink-0", className)}
      {...props}
    />
  );
}
