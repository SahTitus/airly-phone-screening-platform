import { cn } from "../../utils/cn";

interface BadgeProps {
  label: string;
  variant?: "default" | "brand" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

const variantMap: Record<string, string> = {
  default: "bg-bg-muted text-text-secondary",
  brand: "bg-brand-primary-soft text-brand-primary",
  success: "bg-status-success-soft text-status-success",
  warning: "bg-status-warning-soft text-status-warning",
  danger: "bg-status-danger-soft text-status-danger",
  outline: "border border-border-default text-text-secondary bg-transparent",
};

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full",
        variantMap[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
