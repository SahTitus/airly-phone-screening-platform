"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils/cn";

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: "default" | "compact";
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      size = "default",
      startAdornment,
      endAdornment,
      containerClassName,
      inputClassName,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <div
        className={cn(
          "relative flex min-w-0 max-w-full items-center border border-border-default bg-bg-surface transition-colors",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          disabled && "cursor-not-allowed opacity-60",
          containerClassName,
        )}
        style={{
          borderRadius: "var(--radius-control)",
          height:
            size === "compact"
              ? "var(--control-height-compact)"
              : "var(--control-height)",
        }}
      >
        {startAdornment && (
          <span className="pointer-events-none absolute left-3 flex shrink-0 items-center text-muted-foreground">
            {startAdornment}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "h-full min-w-0 w-full bg-transparent px-3 text-sm text-popover-foreground outline-none placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed",
            startAdornment && "pl-9",
            endAdornment && "pr-9",
            inputClassName,
          )}
          {...props}
        />
        {endAdornment && (
          <span className="absolute right-3 flex max-w-[45%] shrink-0 items-center truncate text-muted-foreground">
            {endAdornment}
          </span>
        )}
      </div>
    );
  },
);
