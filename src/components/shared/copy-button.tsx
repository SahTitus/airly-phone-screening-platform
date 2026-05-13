"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  iconSize?: number;
}

export function CopyButton({
  value,
  className,
  iconSize = 16,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        title={copied ? "Copied!" : `Copy ${value}`}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className={cn(
          "relative h-9 w-9 shrink-0 p-0",
          copied
            ? "text-status-success"
            : "text-text-muted hover:text-brand-primary",
        )}
      >
        {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
        {copied && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-border-default bg-bg-surface px-2 py-0.5 text-[10px] font-medium text-text-primary">
            Copied
          </span>
        )}
      </Button>
    </span>
  );
}
