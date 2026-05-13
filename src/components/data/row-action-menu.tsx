"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface RowActionMenuProps {
  actions: RowAction[];
  className?: string;
}

export function RowActionMenu({ actions, className }: RowActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 176;
    let left = rect.right - menuWidth + window.scrollX;
    if (left < 8) left = rect.left + window.scrollX;
    setPosition({
      top: rect.bottom + 4 + window.scrollY,
      left,
    });
    setOpen((prev) => !prev);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          "text-text-muted hover:text-text-primary hover:bg-bg-muted",
          open && "bg-bg-muted text-text-primary",
          className,
        )}
        aria-label="Row actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-9999 min-w-44 overflow-hidden border border-border-default bg-bg-surface py-1"
            style={{
              top: position.top,
              left: position.left,
              borderRadius: "var(--radius-card)",
            }}
          >
            {actions.map((action, i) => (
              <button
                key={i}
                role="menuitem"
                type="button"
                disabled={action.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-[13px] transition-colors text-left",
                  "hover:bg-brand-primary hover:text-white",
                  action.variant === "danger"
                    ? "text-status-danger hover:bg-status-danger hover:text-white"
                    : "text-text-secondary",
                  action.disabled && "pointer-events-none opacity-40",
                )}
              >
                {action.icon && (
                  <span className="h-4 w-4 shrink-0 flex items-center justify-center">
                    {action.icon}
                  </span>
                )}
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
