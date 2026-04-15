import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { ExpandedState, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import type { ReconciliationRun } from "../../../types";
import { getDiscrepancyIssueLabel } from "../../../utils";
import { runsColumns } from "./columns";
import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/status-badge";

interface RunsTableProps {
  data: ReconciliationRun[];
  isLoading?: boolean;
}

function DiscrepancyDetail({ run }: { run: ReconciliationRun }) {
  if (!run.discrepancies.length) return null;

  return (
    <div className="space-y-2 px-4 py-3">
      <h4 className="text-xs font-semibold uppercase text-muted-foreground">
        Discrepancies
      </h4>
      <div className="space-y-2">
        {run.discrepancies.map((d, i) => (
          <div
            key={i}
            className="bg-muted/40 flex items-start gap-3 rounded-md border p-3"
          >
            <Badge
              variant="outline"
              className={
                d.issue === "MISSING_ENTRY"
                  ? TINT.red
                  : d.issue === "AMOUNT_MISMATCH"
                    ? TINT.amber
                    : TINT.gray
              }
            >
              {getDiscrepancyIssueLabel(d.issue)}
            </Badge>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {d.entityType}: {d.entityId}
                </span>
                <StatusBadge
                  status={d.resolved ? "Resolved" : "Unresolved"}
                  variant={d.resolved ? "success" : "warning"}
                />
              </div>
              <p className="text-muted-foreground text-sm">{d.details}</p>
              <p className="text-muted-foreground font-mono text-xs">
                Expected key: {d.expectedKey}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RunsTable({ data, isLoading }: RunsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns: runsColumns,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row._id,
    state: { sorting, expanded },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="bg-card overflow-hidden rounded-lg border">
            <Table>
              {(isLoading || data.length > 0) && (
                <TableHeader className="bg-muted h-15">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "px-4 text-xs font-medium uppercase",
                            (
                              header.column.columnDef.meta as
                                | { className?: string }
                                | undefined
                            )?.className,
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
              )}
              <TableBody>
                {isLoading ? (
                  <DataTableSkeleton
                    columns={runsColumns as ColumnDef<unknown>[]}
                    rowCount={3}
                  />
                ) : !table.getRowModel().rows.length ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={runsColumns.length}
                      className="h-24 py-8 text-center"
                    >
                      No reconciliation runs recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={cn(
                          "h-15",
                          row.original.discrepancies.length > 0 &&
                            "cursor-pointer",
                          row.getIsExpanded() && "bg-muted/50",
                        )}
                        onClick={() => {
                          if (row.original.discrepancies.length > 0) {
                            row.toggleExpanded();
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "px-4",
                              (
                                cell.column.columnDef.meta as
                                  | { className?: string }
                                  | undefined
                              )?.className,
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell
                            colSpan={runsColumns.length}
                            className="bg-muted/30 p-0"
                          >
                            <DiscrepancyDetail run={row.original} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" className="mx-0.5 mb-0.5" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
