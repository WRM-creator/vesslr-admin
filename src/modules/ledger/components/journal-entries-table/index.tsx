import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { ColumnDef, ExpandedState, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import type { JournalEntry, EntryType, JournalEntryStatus } from "../../types";
import { journalColumns } from "./columns";
import { JournalEntryDetail } from "./journal-entry-detail";
import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton";

const entryTypeOptions: { value: EntryType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Types" },
  { value: "ESCROW_FUND", label: "Escrow Funded" },
  { value: "ESCROW_RELEASE", label: "Escrow Released" },
  { value: "ESCROW_RELEASE_CONFIRM", label: "Release Confirmed" },
  { value: "ESCROW_RELEASE_FAIL", label: "Release Failed" },
  { value: "ESCROW_REFUND", label: "Escrow Refund" },
  { value: "ESCROW_REFUND_CONFIRM", label: "Refund Confirmed" },
  { value: "WALLET_FUND", label: "Wallet Funded" },
  { value: "WALLET_DISBURSE", label: "Disbursement" },
  { value: "WALLET_TO_ESCROW", label: "Wallet → Escrow" },
  { value: "ESCROW_MILESTONE_RELEASE", label: "Milestone Release" },
  { value: "PLATFORM_FEE_CAPTURE", label: "Fee Captured" },
  { value: "MANUAL_ADJUSTMENT", label: "Manual Adjustment" },
  { value: "REVERSAL", label: "Reversal" },
];

const statusOptions: { value: JournalEntryStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "POSTED", label: "Posted" },
  { value: "REVERSED", label: "Reversed" },
];

interface JournalEntriesTableProps {
  data: JournalEntry[];
  isLoading?: boolean;
  onReverse?: (entryId: string) => void;
}

export function JournalEntriesTable({
  data,
  isLoading,
  onReverse,
}: JournalEntriesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const filteredData = React.useMemo(() => {
    let result = data;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e._id.toLowerCase().includes(q) ||
          e.idempotencyKey.toLowerCase().includes(q) ||
          e.metadata.transactionId?.toLowerCase().includes(q) ||
          e.metadata.escrowId?.toLowerCase().includes(q) ||
          e.metadata.providerRef?.toLowerCase().includes(q),
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter((e) => e.entryType === typeFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((e) => e.status === statusFilter);
    }

    return result;
  }, [data, search, typeFilter, statusFilter]);

  const hasActiveFilters = search || typeFilter !== "ALL" || statusFilter !== "ALL";

  const table = useReactTable({
    data: filteredData,
    columns: journalColumns,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row._id,
    state: { sorting, expanded },
  });

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Entry Type" />
          </SelectTrigger>
          <SelectContent>
            {entryTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <XIcon className="mr-1.5 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <ScrollArea className="w-full">
        <div className="bg-card overflow-hidden rounded-lg border">
          <Table>
            {(isLoading || filteredData.length > 0) && (
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
                  columns={journalColumns as ColumnDef<unknown>[]}
                  rowCount={5}
                />
              ) : !table.getRowModel().rows.length ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={journalColumns.length}
                    className="h-24 py-8 text-center"
                  >
                    No journal entries found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className={cn(
                        "h-15 cursor-pointer",
                        row.getIsExpanded() && "bg-muted/50",
                      )}
                      onClick={() => row.toggleExpanded()}
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
                          colSpan={journalColumns.length}
                          className="bg-muted/30 p-0"
                        >
                          <JournalEntryDetail
                            entry={row.original}
                            onReverse={onReverse}
                          />
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
    </div>
  );
}
