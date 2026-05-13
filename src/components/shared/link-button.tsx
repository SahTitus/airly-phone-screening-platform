import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

const variants = {
  primary: "bg-brand-primary !text-white hover:bg-brand-primary-deep",
  outline:
    "border border-border-default bg-bg-surface text-text-primary hover:border-brand-primary hover:text-brand-primary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-muted hover:text-text-primary",
};

const sizes = {
  sm: "h-8 px-3 text-[12px]",
  md: "h-9 px-4 text-[13px]",
  lg: "h-11 px-6 text-[14px]",
};

export function LinkButton({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {startIcon}
      {children}
      {endIcon}
    </Link>
  );
}
