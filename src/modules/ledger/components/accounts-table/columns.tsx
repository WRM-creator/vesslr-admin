import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerAccount } from "../../types";
import { getAccountTypeStyle } from "../../utils";

export const accountsColumns: ColumnDef<LedgerAccount>[] = [
  {
    accessorKey: "accountCode",
    header: "Account",
    cell: ({ row }) => {
      const { accountCode, description } = row.original;
      return (
        <div>
          <div className="font-mono text-sm font-medium">{accountCode}</div>
          <div className="text-muted-foreground text-xs">{description}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "accountType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.accountType;
      const style = getAccountTypeStyle(type);
      return (
        <Badge
          variant="outline"
          className={`${style.bg} ${style.text} font-medium`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "entityType",
    header: "Entity",
    cell: ({ row }) => {
      const { entityType, description } = row.original;
      if (entityType === "ORGANIZATION") {
        // Extract org name from description (e.g., "AgriCorp Nigeria — Wallet")
        const orgName = description.split("—")[0]?.trim() ?? entityType;
        return (
          <div>
            <div className="text-sm font-medium">{orgName}</div>
            <div className="text-muted-foreground text-xs">Organization</div>
          </div>
        );
      }
      return (
        <span className="text-muted-foreground text-sm capitalize">
          {entityType.toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.currency}
      </span>
    ),
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const { balance, currency } = row.original;
      return (
        <div className="text-right font-mono text-sm font-semibold">
          {formatCurrency(balance, currency, { maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${
              row.original.isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span className="text-muted-foreground text-xs">
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    ),
  },
];
