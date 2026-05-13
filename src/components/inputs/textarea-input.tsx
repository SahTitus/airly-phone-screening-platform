"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  inputClassName?: string;
}

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps
>(function TextareaInput(
  { containerClassName, inputClassName, disabled, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "relative min-w-0 max-w-full border border-border-default bg-bg-surface transition-colors",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        disabled && "cursor-not-allowed opacity-60",
        containerClassName,
      )}
      style={{ borderRadius: "var(--radius-control)" }}
    >
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "min-w-0 w-full resize-none bg-transparent px-3 py-2.5 text-sm text-popover-foreground outline-none placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed",
          inputClassName,
        )}
        {...props}
      />
    </div>
  );
});
