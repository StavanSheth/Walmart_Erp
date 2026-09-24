import * as React from "react";
import { cn } from "@/lib/cn";
import { PageHeader } from "./page-header";

export { PageHeader, PageTitle, PageDescription, PageActions } from "./page-header";
export { Section, SectionHeader, type SectionProps, type SectionHeaderProps } from "./section";

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
        "w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-7 xl:px-8 py-3 sm:py-4 lg:py-5 space-y-4 sm:space-y-5",
        className
      )}
      {...props}
    >
      {(title || actions || description) && (
        <PageHeader title={title} description={description} actions={actions} />
      )}

      <div>{children}</div>
    </div>
  );
}
