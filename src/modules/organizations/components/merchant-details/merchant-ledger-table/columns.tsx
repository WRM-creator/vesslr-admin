import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerItem } from "./types";

export const merchantLedgerColumns: ColumnDef<LedgerItem>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => <span className="font-mono">{row.original.id}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div
        className={`text-right font-medium ${
          row.original.amount.startsWith("+")
            ? "text-green-600"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {row.original.amount}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge variant="outline">{row.original.status}</Badge>
      </div>
    ),
  },
];
