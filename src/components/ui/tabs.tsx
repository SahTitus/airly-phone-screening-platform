"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../utils/cn";

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center border-b border-border-default w-full gap-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium",
        "text-text-secondary border-b-2 border-transparent -mb-px",
        "transition-colors hover:text-text-primary",
        "data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={cn("mt-4 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
