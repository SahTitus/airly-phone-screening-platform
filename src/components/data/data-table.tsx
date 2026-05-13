import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  mobileRender?: (row: T) => ReactNode;
  empty?: ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  mobileRender,
  empty,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return empty ?? null;
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-default">
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-4 text-left text-[13px] font-semibold text-text-secondary",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    !col.align && "text-left",
                    i > 0 && "pl-3",
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="transition-colors hover:bg-bg-muted/30"
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-4 text-[14px] text-text-secondary",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      i > 0 && "pl-3",
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="app-card app-card-padding-compact">
            {mobileRender ? (
              mobileRender(row)
            ) : (
              <div className="space-y-3">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="app-label">{col.header}</span>
                    <span className="text-right text-[13px] text-text-secondary">
                      {col.render(row)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
