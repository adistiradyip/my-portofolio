"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSize?: number;
};

export function DataTableColumnHeader<TData>({
  column,
  title,
  className,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void };
  title: string;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2 h-8 font-semibold", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  emptyMessage,
  pageSize = 5,
}: DataTableProps<TData, TValue>) {
  const { t } = useAdminLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const columnsWithNumber = useMemo<ColumnDef<TData, TValue>[]>(
    () => [
      {
        id: "rowNumber",
        header: () => <span className="font-semibold">{t.common.rowNumber}</span>,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return (
            <span className="text-muted-foreground">
              {pageIndex * pageSize + row.index + 1}
            </span>
          );
        },
        enableSorting: false,
      },
      ...columns,
    ],
    [columns, t.common.rowNumber],
  );

  const table = useReactTable({
    data,
    columns: columnsWithNumber,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const { pageIndex } = table.getState().pagination;
  const currentPageSize = table.getState().pagination.pageSize;
  const from = totalRows === 0 ? 0 : pageIndex * currentPageSize + 1;
  const to = Math.min((pageIndex + 1) * currentPageSize, totalRows);

  const rowsPerPageSelect = (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="whitespace-nowrap">{t.common.rowsPerPage}</span>
      <select
        value={currentPageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchKey ? (
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder ?? t.common.search}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
              className="pl-9"
            />
          </div>
        ) : (
          <div />
        )}
        {rowsPerPageSelect}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.id === "rowNumber" ? "w-12" : undefined}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-border">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === "rowNumber" ? "w-12 text-center" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithNumber.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage ?? t.common.noData}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalRows > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            {t.common.showing(from, to, totalRows)}
            <span className="mx-2 text-border">·</span>
            {t.common.pageOf(pageIndex + 1, table.getPageCount())}
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:justify-start">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t.common.previous}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="hidden sm:inline">{t.common.next}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
