"use client";

import { BriefcaseBusiness } from "lucide-react";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  variant?: "briefcase" | "monogram";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const MARK_SIZES = {
  sm: "size-8",
  md: "size-9",
  lg: "size-11",
};

export function BrandLogo({ variant = "briefcase", showText = true, size = "md", className }: BrandLogoProps) {
  return (
    <div className={cn("inline-flex min-w-0 items-center gap-2.5", className)} aria-label="AutoJobServe">
      {variant === "briefcase" ? <BriefcaseMark size={size} /> : <MonogramMark size={size} />}
      {showText && (
        <span className="min-w-0 text-[21px] font-[750] leading-none tracking-[-0.03em] text-[#10162A]">
          AutoJob<span className={variant === "monogram" ? "text-[#7034F1]" : ""}>Serve</span>
        </span>
      )}
    </div>
  );
}

export function BriefcaseMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-[9px] bg-[linear-gradient(135deg,#7D4BFF,#642EE8)] text-white shadow-[0_10px_24px_rgba(109,59,245,0.24)]",
        MARK_SIZES[size],
      )}
      aria-hidden="true"
    >
      <BriefcaseBusiness className={size === "lg" ? "size-6" : "size-5"} strokeWidth={2.35} />
      <span className="absolute left-1/2 top-1/2 h-[2px] w-[62%] -translate-x-1/2 translate-y-[3px] rounded-full bg-white/80" />
    </span>
  );
}

export function MonogramMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={cn(
        "relative shrink-0",
        size === "lg" ? "size-11" : size === "md" ? "size-9" : "size-8",
      )}
      aria-hidden="true"
    >
      <span className="absolute left-[8%] top-[7%] h-[86%] w-[30%] rotate-[28deg] rounded-full bg-[linear-gradient(180deg,#5220C9,#8B42F4)]" />
      <span className="absolute right-[7%] top-[7%] h-[86%] w-[30%] -rotate-[28deg] rounded-full bg-[linear-gradient(180deg,#8F45F4,#5522CE)]" />
      <span className="absolute left-[36%] top-[46%] h-[24%] w-[31%] -rotate-[18deg] rounded-full bg-[#B095FF]" />
    </span>
  );
}
