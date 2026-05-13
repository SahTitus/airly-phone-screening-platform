import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../../utils/cn";

export function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center justify-start", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />;
}

export interface PaginationLinkProps extends React.ComponentProps<"button"> {
  isActive?: boolean;
  size?: "icon" | "default";
}

export function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center border font-medium text-[12px] transition-colors disabled:pointer-events-none disabled:opacity-50",
        size === "icon" ? "h-8 w-8" : "h-8 px-3 gap-1.5",
        isActive
          ? "border-brand-primary bg-brand-primary text-white"
          : "border-border-default bg-bg-surface text-text-secondary hover:border-brand-primary hover:text-brand-primary",
        className,
      )}
      style={{ borderRadius: "var(--radius-control)" }}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  ...props
}: Omit<PaginationLinkProps, "size">) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1", className)}
      {...props}
    >
      <ChevronLeft className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  ...props
}: Omit<PaginationLinkProps, "size">) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1", className)}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="h-3.5 w-3.5" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-8 w-8 items-center justify-center text-text-muted",
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPrevNext?: boolean;
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  className,
  showPrevNext = true,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const pageNumbers: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push("ellipsis");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (page < totalPages - 2) pageNumbers.push("ellipsis");
    pageNumbers.push(totalPages);
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        {showPrevNext && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            />
          </PaginationItem>
        )}

        {pageNumbers.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {showPrevNext && (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
