type StatusTone = "success" | "warning" | "medium" | "danger";

interface StatusPillProps {
  label: string;
  tone: StatusTone;
}

const toneClassNames: Record<StatusTone, string> = {
  success: "bg-status-success-soft text-status-success",
  warning: "bg-status-warning-soft text-status-warning",
  medium: "bg-status-medium-soft text-status-medium",
  danger: "bg-status-danger-soft text-status-danger",
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <span
      className={`inline-flex min-w-30 items-center justify-center px-2 py-0.5 text-[11px] font-medium ${toneClassNames[tone]}`}
      style={{ borderRadius: "var(--radius-pill)" }}
    >
      {label}
    </span>
  );
}
