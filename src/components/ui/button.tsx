"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "../shared/spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const variantMap: Record<string, string> = {
  primary:
    "bg-brand-primary !text-white hover:bg-brand-primary-deep active:bg-brand-primary-deep",
  secondary: "bg-brand-secondary !text-white hover:opacity-90 active:opacity-80",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-muted hover:text-text-primary",
  outline:
    "border border-border-default bg-bg-surface text-text-primary hover:border-brand-primary hover:text-brand-primary",
  danger: "bg-status-danger text-white hover:opacity-90",
};

const sizeMap: Record<string, string> = {
  sm: "h-8 px-3 text-[12px] gap-1.5",
  md: "h-9 px-4 text-[13px] gap-2",
  lg: "h-11 px-6 text-[14px] gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading,
      startIcon,
      endIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors rounded-md",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          variantMap[variant],
          sizeMap[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="border-current border-t-transparent" />
        ) : (
          startIcon
        )}
        {children}
        {!loading && endIcon}
      </button>
    );
  },
);
