"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

import { cn } from "../../utils/cn";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "../inputs/dropdown";
import { SearchInput } from "../inputs/search-input";

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterBarFilter {
  key: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  searchDebounceMs?: number;
  filters?: FilterBarFilter[];
  trailingContent?: ReactNode;
  onClearFilters?: () => void;
  activeFiltersCount?: number;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  searchDebounceMs = 250,
  filters = [],
  trailingContent,
  onClearFilters,
  activeFiltersCount = 0,
  className,
}: FilterBarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const filterGrid = (
    <div className="flex flex-wrap items-end gap-3">
      {showSearch && (
        <div className="min-w-45 flex-1">
          <SearchInput
            value={searchValue}
            onDebouncedChange={onSearchChange}
            debounceMs={searchDebounceMs}
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      {filters.map((filter) => (
        <div key={filter.key} className={cn("min-w-36", filter.className)}>
          {filter.label && (
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              {filter.label}
            </p>
          )}
          <Dropdown
            value={!filter.value ? "__all__" : filter.value}
            onValueChange={(value: string) =>
              filter.onChange(value === "__all__" ? "" : value)
            }
            disabled={filter.disabled}
          >
            <DropdownTrigger>
              <DropdownValue placeholder={filter.placeholder ?? "All"} />
            </DropdownTrigger>
            <DropdownContent>
              {(filter.clearable ?? true) && (
                <DropdownItem value="__all__">All</DropdownItem>
              )}
              {filter.options.map((option) => (
                <DropdownItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="hidden md:flex md:items-center md:justify-between md:gap-3">
        {filterGrid}

        <div className="flex shrink-0 items-center gap-2">
          {activeFiltersCount > 0 && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-default",
                "bg-bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground",
                "transition-colors hover:border-ring hover:text-ring",
              )}
            >
              <X className="h-3 w-3" />
              Clear {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          )}
          {trailingContent}
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative flex items-center justify-between gap-2">
          {showSearch && (
            <SearchInput
              value={searchValue}
              onDebouncedChange={onSearchChange}
              debounceMs={searchDebounceMs}
              placeholder={searchPlaceholder}
              className="flex-1"
            />
          )}

          <button
            type="button"
            onClick={() => setMobileExpanded((current) => !current)}
            className={cn(
              "relative inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-colors",
              mobileExpanded || activeFiltersCount > 0
                ? "border-ring bg-primary/6 text-ring"
                : "border-border-default bg-bg-surface text-muted-foreground hover:border-ring hover:text-ring",
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                mobileExpanded && "rotate-180",
              )}
            />
          </button>

          {trailingContent && (
            <div className="flex items-center gap-2">{trailingContent}</div>
          )}

          {mobileExpanded && filters.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 flex flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <p className="mb-1.5 text-xs font-medium text-text-secondary">
                    {filter.label ?? filter.placeholder ?? "Filter"}
                  </p>
                  <Dropdown
                    value={!filter.value ? "__all__" : filter.value}
                    onValueChange={(value: string) =>
                      filter.onChange(value === "__all__" ? "" : value)
                    }
                    disabled={filter.disabled}
                  >
                    <DropdownTrigger className="w-full">
                      <DropdownValue
                        placeholder={filter.placeholder ?? "All"}
                      />
                    </DropdownTrigger>
                    <DropdownContent>
                      {(filter.clearable ?? true) && (
                        <DropdownItem value="__all__">All</DropdownItem>
                      )}
                      {filter.options.map((option) => (
                        <DropdownItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </div>
              ))}

              {activeFiltersCount > 0 && onClearFilters && (
                <button
                  type="button"
                  onClick={() => {
                    onClearFilters();
                    setMobileExpanded(false);
                  }}
                  className="mt-1 w-full cursor-pointer rounded-lg border border-border-default py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-ring hover:text-ring"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
