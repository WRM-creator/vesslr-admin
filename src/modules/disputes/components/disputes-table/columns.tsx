import { Badge } from "@/components/ui/badge";
import type { Dispute } from "@/lib/api/disputes";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const disputesColumns: ColumnDef<Dispute>[] = [
  {
    accessorKey: "_id",
    header: "Dispute ID",
    cell: ({ row }) => {
      const dispute = row.original;
      return (
        <Link
          to={`/transactions/${dispute.transaction?._id}?tab=disputes`}
          className="font-medium hover:underline"
        >
          {dispute._id}
        </Link>
      );
    },
  },
  {
    accessorKey: "transaction.product.title",
    header: "Product",
    cell: ({ row }) => (
      <span
        className="block max-w-[200px] truncate"
        title={row.original.transaction?.product?.title}
      >
        {row.original.transaction?.product?.title || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "initiator",
    header: "Raised By",
    cell: ({ row }) => {
      const initiator = row.original.initiator;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {initiator.firstName} {initiator.lastName}
          </span>
          <span className="text-muted-foreground text-xs">
            {initiator.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "open"
          ? "destructive"
          : status === "resolved_release" || status === "resolved_refund"
            ? "default"
            : "secondary";

      return (
        <Badge
          variant={variant}
          className={`capitalize ${
            status === "resolved_release" || status === "resolved_refund"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : ""
          }`}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "createdAt",
    header: "Date Opened",
    cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
  },
];
