"use client";

import { cn } from "@/lib/cn";

export type CareerOpsLogoSize = "sm" | "md" | "lg" | "sidebar" | "header" | "mobile" | "large" | number;

const LOGO_SIZES: Record<Exclude<CareerOpsLogoSize, number>, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  sidebar: 32,
  header: 24,
  mobile: 28,
  large: 48,
};

type CareerOpsLogoProps = {
  size?: CareerOpsLogoSize;
  label?: string;
  theme?: "light" | "dark";
  className?: string;
};

export function CareerOpsLogo({ size = "md", label = "Career-Ops", className }: CareerOpsLogoProps) {
  const pixels = typeof size === "number" ? size : LOGO_SIZES[size];

  return (
    <img
      src="/career-ops-logo.svg"
      alt={label}
      width={pixels}
      height={pixels}
      decoding="async"
      draggable={false}
      className={cn("block shrink-0 select-none object-contain", className)}
      style={{ width: pixels, height: pixels }}
    />
  );
}
