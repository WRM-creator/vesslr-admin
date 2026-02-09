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
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

interface ColumnMeta {
  className?: string;
}

interface DataTableClassNames {
  root?: string;
  tableWrapper?: string;
  table?: string;
  header?: string;
  body?: string;
  row?: string;
  cell?: string;
}

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
  getRowClassName?: (row: Row<TData>) => string | undefined;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  classNames?: DataTableClassNames;

  // State control
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  hiddenColumns?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  loadingRowCount = 5,
  emptyContent = "No data.",
  renderAboveTable,
  renderBelowTable,
  onRowClick,
  getRowClassName,
  getRowId,
  getSubRows,
  classNames,
  rowSelection,
  onRowSelectionChange,
  hiddenColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState({});
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  const columnVisibility = React.useMemo(() => {
    if (!hiddenColumns) return {};
    return hiddenColumns.reduce((acc, col) => ({ ...acc, [col]: false }), {});
  }, [hiddenColumns]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onRowSelectionChange: onRowSelectionChange || setInternalRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows,
    getRowId,
    state: {
      sorting,
      expanded,
      rowSelection: rowSelection || internalRowSelection,
      columnVisibility,
    },
  });

  const renderTableBody = () => {
    if (isLoading) {
      return <DataTableSkeleton columns={columns} rowCount={loadingRowCount} />;
    }

    if (!table.getRowModel().rows?.length) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={columns.length} className="h-24 py-8 text-center">
            {emptyContent}
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className={cn(
          "h-15",
          onRowClick && "cursor-pointer",
          getRowClassName?.(row),
          classNames?.row,
        )}
        onClick={() => onRowClick?.(row)}
        role={onRowClick ? "button" : undefined}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={cn(
              (cell.column.columnDef.meta as ColumnMeta | undefined)?.className,
              classNames?.cell,
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={cn("w-full space-y-3", classNames?.root)}>
      {renderAboveTable}

      <ScrollArea className="w-full">
        <div
          className={cn(
            "bg-card overflow-hidden rounded-lg border",
            classNames?.tableWrapper,
          )}
        >
          <Table className={classNames?.table}>
            {(isLoading || data.length > 0) && (
              <TableHeader className={cn("bg-muted h-15", classNames?.header)}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            (
                              header.column.columnDef.meta as
                                | ColumnMeta
                                | undefined
                            )?.className,
                            "text-xs font-medium uppercase",
                            classNames?.cell,
                          )}
                        >
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
            )}
            <TableBody className={classNames?.body}>
              {renderTableBody()}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" className="mx-0.5 mb-0.5" />
      </ScrollArea>

      {renderBelowTable}
    </div>
  );
}
