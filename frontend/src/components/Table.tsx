import { useState, useEffect, useRef } from "react";
import type { TableProps } from "@shared/types";
import { LucideEllipsisVertical } from "lucide-react";

export default function Table<T extends { id?: string | number }>({
  columns,
  data,
  onSort,
  sortConfig,
}: TableProps<T>) {
  const [openMenuKey, setOpenMenuKey] = useState<string | number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenuKey(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto w-full rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider text-xs">
          <tr>
            {columns.map((column) => {
              const isSorted = sortConfig?.key === column.key;
              const arrow = isSorted
                ? sortConfig.direction === "asc"
                  ? " ▲"
                  : " ▼"
                : "";

              return (
                <th
                  key={String(column.key)}
                  onClick={() =>
                    column.sortable &&
                    column.key !== "actions" &&
                    onSort(column.key as keyof T)
                  }
                  className={`px-6 py-3.5 select-none ${column.sortable && column.key !== "actions" ? "cursor-pointer hover:bg-gray-100 transition-colors" : "cursor-default"}`}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && column.key !== "actions" && (
                      <span className="text-gray-400 font-normal text-[10px]">
                        {arrow || " ↕"}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
          {data.length > 0 ? (
            data.map((row, rowIndex) => {
              const currentRowKey =
                row.id !== undefined && row.id !== "" ? row.id : rowIndex;
              return (
                <tr
                  key={currentRowKey}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {columns.map((column) => {
                    const cellValue =
                      column.key !== "actions"
                        ? row[column.key as keyof T]
                        : undefined;
                    return (
                      <td
                        key={String(column.key)}
                        className="px-6 py-4 whitespace-nowrap align-middle relative"
                      >
                        {column.key === "actions" ? (
                          <div
                            className="flex justify-start items-center"
                            ref={
                              openMenuKey === currentRowKey ? dropdownRef : null
                            }
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuKey(
                                  openMenuKey === currentRowKey
                                    ? null
                                    : currentRowKey,
                                )
                              }
                              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition focus:outline-none"
                            >
                              <LucideEllipsisVertical className="w-5 h-5" />
                            </button>
                            {openMenuKey === currentRowKey && (
                              <div
                                onClick={() => setOpenMenuKey(null)}
                                className="absolute right-6 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-40 py-1 origin-top-right focus:outline-none"
                                style={{ top: "65%" }}
                              >
                                {column.render && column.render(cellValue, row)}
                              </div>
                            )}
                          </div>
                        ) : column.render ? (
                          column.render(cellValue, row)
                        ) : (
                          String(cellValue ?? "")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-sm text-gray-400 font-medium"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
