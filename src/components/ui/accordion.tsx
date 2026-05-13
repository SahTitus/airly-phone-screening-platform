"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[13.5px] font-semibold text-brand-primary">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "mt-0.5 shrink-0 text-[#6B7280] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-[#F3F4F6] px-5 pb-4 pt-3">
          <p className="text-[12.5px] text-[#4B5563] leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  items: AccordionItemProps[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <AccordionItem key={item.question} {...item} />
      ))}
    </div>
  );
}
