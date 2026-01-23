import type {
  ColumnDef,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableSkeleton } from "./data-table-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  loadingRowCount?: number;
  emptyContent?: React.ReactNode;

  // Customization
  renderAboveTable?: React.ReactNode;
  renderBelowTable?: React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  getRowClassName?: (row: Row<TData>) => string;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  classNames?: {
    container?: string;
    table?: string;
    header?: string;
    body?: string;
    row?: string;
    cell?: string;
  };

  // State control
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  loadingRowCount = 5,
  emptyContent,
  renderAboveTable,
  renderBelowTable,
  onRowClick,
  getRowClassName,
  getRowId,
  classNames,
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: onRowSelectionChange || setInternalRowSelection,
    getRowId,
    state: {
      sorting,
      rowSelection: rowSelection || internalRowSelection,
    },
  });

  return (
    <div className={cn("space-y-4", classNames?.container)}>
      {renderAboveTable}

      <div className="overflow-hidden rounded-md border">
        <Table className={classNames?.table}>
          {!isLoading ? (
            <>
              <TableHeader className={classNames?.header}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted px-3">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className={classNames?.cell}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className={classNames?.body}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        onRowClick && "cursor-pointer",
                        getRowClassName?.(row),
                        classNames?.row,
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn("px-3", classNames?.cell)}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {emptyContent || "No results."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </>
          ) : (
            <DataTableSkeleton
              columnCount={columns.length}
              rowCount={loadingRowCount}
            />
          )}
        </Table>
      </div>

      {renderBelowTable}
    </div>
  );
}
