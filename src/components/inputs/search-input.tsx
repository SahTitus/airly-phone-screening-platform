"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { Button } from "../ui/button";
import { TextInput } from "./text-input";

export interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  disabled?: boolean;
  size?: "default" | "compact";
  className?: string;
  inputClassName?: string;
}

export function SearchInput({
  value,
  defaultValue = "",
  onValueChange,
  onDebouncedChange,
  debounceMs = 300,
  placeholder = "Search...",
  disabled = false,
  size = "default",
  className,
  inputClassName,
}: SearchInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const displayValue = isControlled ? value : uncontrolledValue;

  const debouncedValue = useDebouncedValue(displayValue, debounceMs);
  const isFirstRender = useRef(true);
  const onDebouncedChangeRef = useRef(onDebouncedChange);
  const lastEmittedValueRef = useRef<string | null>(null);

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastEmittedValueRef.current = debouncedValue;
      return;
    }

    if (lastEmittedValueRef.current === debouncedValue) {
      return;
    }

    lastEmittedValueRef.current = debouncedValue;
    onDebouncedChangeRef.current?.(debouncedValue);
  }, [debouncedValue]);

  const hasValue = displayValue.trim().length > 0;

  return (
    <TextInput
        type="text"
        placeholder={placeholder}
        value={displayValue}
        disabled={disabled}
        size={size}
        containerClassName={className}
        inputClassName={inputClassName}
        startAdornment={<Search className="size-4" />}
        endAdornment={
          hasValue && !disabled ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!isControlled) setUncontrolledValue("");
                onValueChange?.("");
              }}
              className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </Button>
          ) : null
        }
        onChange={(e) => {
          if (!isControlled) setUncontrolledValue(e.target.value);
          onValueChange?.(e.target.value);
        }}
      />
  );
}
