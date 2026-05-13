"use client";

import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "../../utils/cn";

type DropdownContextValue = {
  value: string;
  open: boolean;
  disabled?: boolean;
  setOpen: (open: boolean) => void;
  selectValue: (value: string) => void;
  registerItem: (value: string, label: string) => void;
  getLabel: (value: string) => string | undefined;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used inside Dropdown.");
  }

  return context;
}

function getText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getText).join(" ").replace(/\s+/g, " ").trim();
  }

  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getText(children.props.children);
  }

  return "";
}

type DropdownProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
};

function Dropdown({
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  children,
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const currentValue = value ?? internalValue;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectValue = useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
      setOpen(false);
    },
    [onValueChange, value],
  );

  const registerItem = useCallback((itemValue: string, label: string) => {
    setLabels((current) =>
      current[itemValue] === label ? current : { ...current, [itemValue]: label },
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      open,
      disabled,
      setOpen,
      selectValue,
      registerItem,
      getLabel: (itemValue: string) => labels[itemValue],
    }),
    [currentValue, disabled, labels, open, registerItem, selectValue],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div ref={rootRef} className="relative min-w-0 max-w-full">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownGroup({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function DropdownValue({
  placeholder = "Select",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { value, getLabel } = useDropdown();
  const label = value ? getLabel(value) ?? value : "";

  return (
    <span
      data-slot="dropdown-value"
      className={cn(
        "min-w-0 flex-1 truncate text-left",
        !label && "text-text-muted",
        className,
      )}
    >
      {label || placeholder}
    </span>
  );
}

function DropdownTrigger({
  className,
  size = "default",
  children,
  ...props
}: ComponentProps<"button"> & {
  size?: "sm" | "default";
}) {
  const { open, setOpen, disabled } = useDropdown();

  return (
    <button
      type="button"
      disabled={disabled || props.disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      data-size={size}
      className={cn(
        "flex min-w-0 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border-default bg-bg-surface px-3 text-sm text-text-primary",
        "outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        className,
      )}
      style={{ borderRadius: "var(--radius-control)" }}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(!open);
      }}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "size-4 shrink-0 text-text-muted transition-transform",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

function DropdownContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { open } = useDropdown();

  return (
    <div
      role="listbox"
      className={cn(
        "absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-lg border border-border-default bg-white p-1 text-text-primary",
        !open && "hidden",
        className,
      )}
      style={{ borderRadius: "var(--radius-card)" }}
    >
      {children}
    </div>
  );
}

function DropdownLabel({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-medium text-text-muted", className)}
      {...props}
    />
  );
}

function DropdownItem({
  className,
  children,
  value,
  disabled,
  ...props
}: ComponentProps<"button"> & {
  value: string;
}) {
  const { value: selectedValue, selectValue, registerItem } = useDropdown();
  const label = getText(children) || value;

  useEffect(() => {
    registerItem(value, label);
  }, [label, registerItem, value]);

  return (
    <button
      type="button"
      role="option"
      aria-selected={selectedValue === value}
      disabled={disabled}
      className={cn(
        "relative flex min-w-0 w-full cursor-pointer items-center gap-2 rounded-md py-2 pl-2 pr-8 text-left text-sm text-text-secondary outline-none transition-colors",
        "hover:bg-bg-muted focus-visible:bg-bg-muted disabled:pointer-events-none disabled:opacity-50",
        selectedValue === value && "bg-brand-primary-soft text-brand-primary",
        className,
      )}
      onClick={(event) => {
        props.onClick?.(event);
        selectValue(value);
      }}
    >
      {children}
      {selectedValue === value && (
        <CheckIcon className="absolute right-2 top-1/2 size-4 -translate-y-1/2" />
      )}
    </button>
  );
}

function DropdownSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("my-1 h-px bg-border-default", className)}
      {...props}
    />
  );
}

function DropdownScrollUpButton() {
  return null;
}

function DropdownScrollDownButton() {
  return null;
}

export {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownScrollDownButton,
  DropdownScrollUpButton,
  DropdownSeparator,
  DropdownTrigger,
  DropdownValue,
};
