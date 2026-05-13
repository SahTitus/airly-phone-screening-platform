"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/utils/cn";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(d: Date, start: Date, end: Date) {
  const t = d.getTime();
  return t > start.getTime() && t < end.getTime();
}

function formatShort(d: Date) {
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "default";
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
  size = "default",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [internalRange, setInternalRange] = useState<DateRange>(
    value ?? { from: null, to: null },
  );
  const [hovered, setHovered] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(() => {
    const base = value?.from ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const range = value ?? internalRange;

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleOpen = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const panelWidth = 312;
    let left = rect.left + window.scrollX;
    if (left + panelWidth > window.innerWidth - 8) {
      left = rect.right - panelWidth + window.scrollX;
    }
    setPosition({ top: rect.bottom + 4 + window.scrollY, left });
    setOpen((prev) => !prev);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const handleDayClick = (day: Date) => {
    if (!range.from || (range.from && range.to)) {
      const newRange = { from: day, to: null };
      setInternalRange(newRange);
      onChange?.(newRange);
    } else {
      const newRange: DateRange =
        day < range.from
          ? { from: day, to: range.from }
          : { from: range.from, to: day };
      setInternalRange(newRange);
      onChange?.(newRange);
      setOpen(false);
      setHovered(null);
    }
  };

  const clearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleared = { from: null, to: null };
    setInternalRange(cleared);
    onChange?.(cleared);
  };

  const label = (() => {
    if (range.from && range.to)
      return `${formatShort(range.from)} - ${formatShort(range.to)}`;
    if (range.from) return `${formatShort(range.from)} - select end`;
    return placeholder;
  })();

  const isHighlighted = (day: Date) => {
    if (!range.from) return false;
    if (range.to) return isBetween(day, range.from, range.to);
    if (hovered && hovered > range.from)
      return isBetween(day, range.from, hovered);
    return false;
  };

  const heightCls = size === "sm" ? "h-8" : "h-9";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          heightCls,
          "flex items-center gap-1.5 px-3 border border-border-default bg-bg-surface",
          "text-[12px] text-text-secondary cursor-pointer hover:border-brand-primary transition-colors whitespace-nowrap",
          open && "border-brand-primary ring-2 ring-brand-primary/10",
          className,
        )}
        style={{ borderRadius: "var(--radius-control)" }}
      >
        <CalendarDays className="h-3.5 w-3.5 text-text-muted shrink-0" />
        <span className={cn(!range.from && "text-text-muted")}>{label}</span>
        {(range.from || range.to) && (
          <span
            onClick={clearRange}
            className="ml-auto flex h-4 w-4 items-center justify-center rounded-full hover:bg-bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </button>

      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-9999 w-78 select-none border border-border-default bg-bg-surface"
            style={{
              top: position.top,
              left: position.left,
              borderRadius: "var(--radius-card)",
            }}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-bg-muted transition-colors text-text-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[13px] font-semibold text-text-primary">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-bg-muted transition-colors text-text-secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 px-3">
              {DAY_HEADERS.map((d) => (
                <div
                  key={d}
                  className="h-7 flex items-center justify-center text-[10px] font-semibold text-text-muted uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 px-3 pb-3">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const isFrom = range.from && isSameDay(day, range.from);
                const isTo = range.to && isSameDay(day, range.to);
                const inRange = isHighlighted(day);
                const isToday = isSameDay(day, today);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "h-8 w-full flex items-center justify-center text-[12px] transition-colors relative",
                      isFrom || isTo
                        ? "bg-brand-primary text-white font-semibold rounded-md z-10"
                        : inRange
                          ? "bg-brand-primary/10 text-brand-primary"
                          : isToday
                            ? "font-semibold text-brand-primary hover:bg-bg-muted rounded-md"
                            : "text-text-secondary hover:bg-bg-muted rounded-md",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border-default px-4 py-2.5 flex flex-wrap gap-1.5">
              {[
                { label: "Today", days: 0 },
                { label: "Last 7 days", days: 7 },
                { label: "Last 30 days", days: 30 },
                { label: "This month", days: -1 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const end = new Date();
                    end.setHours(23, 59, 59, 999);
                    let start: Date;
                    if (preset.days === 0) {
                      start = new Date();
                      start.setHours(0, 0, 0, 0);
                    } else if (preset.days === -1) {
                      start = new Date(end.getFullYear(), end.getMonth(), 1);
                    } else {
                      start = new Date();
                      start.setDate(end.getDate() - preset.days);
                      start.setHours(0, 0, 0, 0);
                    }
                    const newRange = { from: start, to: end };
                    setInternalRange(newRange);
                    onChange?.(newRange);
                    setOpen(false);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium border border-border-default rounded-full text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="border-t border-border-default px-4 py-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={clearRange}
                className="text-[12px] text-text-muted hover:text-text-secondary transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[12px] font-semibold text-brand-primary hover:opacity-80 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
