"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled,
  className,
}: ToggleSwitchProps) {
  return (
    <Button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      variant="ghost"
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full p-0 transition-colors",
        "hover:bg-transparent",
        checked
          ? "bg-brand-primary hover:bg-brand-primary/90"
          : "bg-border-default hover:bg-border-default/80",
        className,
      )}
    >
      {label && <span className="sr-only">{label}</span>}
      <span
        className={cn(
          "pointer-events-none absolute top-0.5 inline-block h-4 w-4 rounded-full bg-white ring-0 transition-transform",
          checked ? "translate-x-2.5 border" : "-translate-x-2.5",
        )}
      />
    </Button>
  );
}
