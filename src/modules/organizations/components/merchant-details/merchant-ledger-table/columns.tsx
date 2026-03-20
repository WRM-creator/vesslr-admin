import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerEntry } from "./types";

const entryTypeLabels: Record<string, string> = {
  ESCROW_FUND: "Escrow Funded",
  ESCROW_RELEASE: "Escrow Released",
  ESCROW_RELEASE_CONFIRM: "Release Confirmed",
  ESCROW_RELEASE_FAIL: "Release Failed",
  ESCROW_REFUND: "Escrow Refund",
  ESCROW_REFUND_CONFIRM: "Refund Confirmed",
  ESCROW_REFUND_FAIL: "Refund Failed",
  WALLET_FUND: "Wallet Funded",
  WALLET_DISBURSE: "Disbursement",
  WALLET_TO_ESCROW: "Wallet → Escrow",
  INVOICE_PAYMENT: "Invoice Payment",
  REVERSAL: "Reversal",
  MANUAL_ADJUSTMENT: "Manual Adjustment",
};

function getEntryTypeLabel(type: string) {
  return entryTypeLabels[type] ?? type.replace(/_/g, " ");
}

function getStatusClasses(status: string) {
  switch (status) {
    case "POSTED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "REVERSED":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

export const merchantLedgerColumns: ColumnDef<LedgerEntry>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.description}</div>
        <div className="text-muted-foreground text-xs">
          {getEntryTypeLabel(row.original.entryType)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "credit",
    header: () => <div className="text-right">Credit</div>,
    cell: ({ row }) => {
      const credit = row.original.credit;
      if (credit == null || credit === 0) return <div className="text-right">—</div>;
      return (
        <div className="text-right font-medium text-green-600 dark:text-green-400">
          +{formatCurrency(credit, row.original.currency, { maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "debit",
    header: () => <div className="text-right">Debit</div>,
    cell: ({ row }) => {
      const debit = row.original.debit;
      if (debit == null || debit === 0) return <div className="text-right">—</div>;
      return (
        <div className="text-right font-medium">
          {formatCurrency(debit, row.original.currency, { maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge variant="outline" className={getStatusClasses(row.original.status)}>
          {row.original.status === "POSTED" ? "Posted" : "Reversed"}
        </Badge>
      </div>
    ),
  },
];
