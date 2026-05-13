import { cn } from "../../utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-text-primary leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[13px] text-text-secondary">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2 mt-2 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
