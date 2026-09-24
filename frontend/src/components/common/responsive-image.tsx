import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { ASSETS } from "@/lib/assets";

export interface ResponsiveImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  containerClassName?: string;
  aspectRatio?: "video" | "wide" | "square" | "portrait" | "auto";
}

export function ResponsiveImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = "wide",
  fill = true,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px",
  ...props
}: ResponsiveImageProps) {
  const aspectStyles = {
    wide: "aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1]",
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: ""
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-slate-100",
        aspectRatio !== "auto" && aspectStyles[aspectRatio],
        containerClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
        {...props}
      />
    </div>
  );
}

export function BannerImage({
  title = "Walmart India Retail ERP",
  subtitle = "Centralized retail operations management covering inventory replenishment, POS sales, and multi-store logistics.",
  tag = "Omnichannel Supercenter Network",
  className,
  priority = true
}: {
  title?: string;
  subtitle?: string;
  tag?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden border border-border shadow-xs",
        className
      )}
    >
      <Image
        src={ASSETS.banners.store}
        alt="Walmart India Retail Supercenter"
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
        className="object-cover"
      />
      {/* Clean high-contrast overlay without gradients */}
      <div className="absolute inset-0 bg-brand-navy-dark/80 flex flex-col justify-end p-5 sm:p-7 text-white">
        {tag ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-brand-yellow/20 text-brand-yellow text-xs font-semibold backdrop-blur-xs w-fit mb-2 border border-brand-yellow/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
            <span>{tag}</span>
          </div>
        ) : null}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function StoreImage({
  variant = "main",
  alt = "Walmart Retail Store",
  className,
  priority = false
}: {
  variant?: "main" | "sidebar";
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "sidebar" ? ASSETS.stores.sidebar : ASSETS.stores.main;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, 320px"
        className="object-cover"
      />
    </div>
  );
}

export function BrandImage({
  variant = "spark",
  className = "w-6 h-6",
  alt = "Walmart Brand"
}: {
  variant?: "spark" | "sparkWhite";
  className?: string;
  alt?: string;
}) {
  const src = variant === "sparkWhite" ? ASSETS.brand.sparkWhite : ASSETS.brand.spark;

  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-contain"
      />
    </div>
  );
}
