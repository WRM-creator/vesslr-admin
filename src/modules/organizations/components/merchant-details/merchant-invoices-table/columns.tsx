import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import type { InvoiceItem } from "./types";

export const merchantInvoicesColumns: ColumnDef<InvoiceItem>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => <span className="font-mono">{row.original.id}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.amount}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge variant="secondary">{row.original.status}</Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: () => (
      <div className="text-right">
        <Button variant="ghost" size="icon">
          <DownloadIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
