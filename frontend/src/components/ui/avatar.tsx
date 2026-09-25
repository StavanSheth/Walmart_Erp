import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
}

export function Avatar({
  name,
  src,
  size = "md",
  bordered = true,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  // Extract initials
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm font-semibold"
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-pill font-semibold select-none overflow-hidden",
        bordered ? "border border-border shadow-xs" : "border-0 shadow-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={name}
          fill
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center bg-brand-primary text-white font-medium">
          {initials || "U"}
        </span>
      )}
    </div>
  );
}
