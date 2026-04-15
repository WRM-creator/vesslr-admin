import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { TINT } from "@/lib/tint";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import type { ReconciliationRun } from "../../../types";
import { getReconStatusVariant } from "../../../utils";

export const runsColumns: ColumnDef<ReconciliationRun>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      const hasDiscrepancies = row.original.discrepancies.length > 0;
      if (!hasDiscrepancies) return null;
      return (
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
      );
    },
    meta: { className: "w-10" },
  },
  {
    accessorKey: "runDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.runDate);
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
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }) => {
      const isExternal = row.original.scope === "EXTERNAL";
      return (
        <Badge
          variant="outline"
          className={isExternal ? TINT.purple : TINT.blue}
        >
          {row.original.scope}
          {row.original.provider && ` (${row.original.provider})`}
        </Badge>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { label, variant } = getReconStatusVariant(
        row.original.summary.status,
      );
      return <StatusBadge status={label} variant={variant} />;
    },
  },
  {
    id: "entriesChecked",
    header: () => <div className="text-right">Checked</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {row.original.summary.entriesChecked}
      </div>
    ),
  },
  {
    id: "backfilled",
    header: () => <div className="text-right">Backfilled</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {row.original.summary.entriesBackfilled}
      </div>
    ),
  },
  {
    id: "discrepancies",
    header: () => <div className="text-right">Discrepancies</div>,
    cell: ({ row }) => {
      const count = row.original.summary.discrepancies;
      return (
        <div
          className={`text-right font-mono text-sm font-semibold ${
            count > 0 ? "text-amber-600" : "text-muted-foreground"
          }`}
        >
          {count}
        </div>
      );
    },
  },
];
