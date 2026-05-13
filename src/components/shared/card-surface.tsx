import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "../../utils/cn";

type CardSurfacePadding = "none" | "panel" | "metric" | "compact";

type CardSurfaceProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  padding?: CardSurfacePadding;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const paddingClassNames: Record<CardSurfacePadding, string> = {
  none: "",
  panel: "app-card-padding-panel",
  metric: "app-card-padding-metric",
  compact: "app-card-padding-compact",
};

export function CardSurface<T extends ElementType = "div">({
  as,
  children,
  className,
  padding = "panel",
  ...props
}: CardSurfaceProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component className={cn("app-card", paddingClassNames[padding], className)} {...props}>
      {children}
    </Component>
  );
}
