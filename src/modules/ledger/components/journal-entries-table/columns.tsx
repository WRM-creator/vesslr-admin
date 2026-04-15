import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { TINT } from "@/lib/tint";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import type { JournalEntry } from "../../types";
import { getEntryTypeLabel, getTotalAmount } from "../../utils";

function getStatusClasses(status: string) {
  switch (status) {
    case "POSTED":
      return TINT.green;
    case "REVERSED":
      return TINT.yellow;
    default:
      return TINT.gray;
  }
}

function getEntryTypeVariant(type: string): string {
  if (type.includes("FAIL") || type === "REVERSAL") return TINT.red;
  if (type.includes("REFUND")) return TINT.amber;
  if (type.includes("FUND") || type.includes("CONFIRM")) return TINT.green;
  if (type.includes("RELEASE") || type.includes("DISBURSE")) return TINT.blue;
  if (type === "MANUAL_ADJUSTMENT") return TINT.purple;
  return TINT.gray;
}

export const journalColumns: ColumnDef<JournalEntry>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          row.toggleExpanded();
        }}
      >
        {row.getIsExpanded() ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    meta: { className: "w-10" },
  },
  {
    accessorKey: "entryDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.entryDate);
      return (
        <div>
          <div className="font-medium">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-muted-foreground text-xs">
            {date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "entryType",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`font-medium ${getEntryTypeVariant(row.original.entryType)}`}
      >
        {getEntryTypeLabel(row.original.entryType)}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">
        {row.original.description}
      </div>
    ),
  },
  {
    id: "lines",
    header: "Lines",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.lines.length} lines
      </span>
    ),
  },
  {
    id: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const total = getTotalAmount(row.original.lines);
      const currency = row.original.lines[0]?.currency ?? "NGN";
      return (
        <div className="text-right font-mono text-sm font-semibold">
          {formatCurrency(total, currency, { maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge
          variant="outline"
          className={getStatusClasses(row.original.status)}
        >
          {row.original.status === "POSTED" ? "Posted" : "Reversed"}
        </Badge>
      </div>
    ),
  },
];
