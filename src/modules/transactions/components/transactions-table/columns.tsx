import {
  StatusBadge,
  type StatusVariant,
} from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { type TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { TransactionStatusBadge } from "../transaction-status-badge";

// TODO: Extract the badges into distinct badge components

const paymentStatusStyles: Record<string, StatusVariant> = {
  paid: "success",
  unpaid: "danger",
  partial: "warning",
  refunded: "info",
};

export const transactionsColumns: ColumnDef<TransactionResponseDto>[] = [
  {
    accessorKey: "displayId",
    header: "ID",
    cell: ({ row }) => {
      const displayId = row.original.displayId?.toString() || row.original._id;
      return (
        <Link
          to={`/transactions/${row.original._id}`}
          className="font-mono text-sm hover:underline"
        >
          {displayId.startsWith("#") ? displayId : `#${displayId}`}
        </Link>
      );
    },
  },
  {
    accessorKey: "order.sellerOrganization.name",
    header: "Merchant",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.order.sellerOrganization?.name || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "order.buyerOrganization.name",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.order.buyerOrganization?.name || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "order.totalAmount",
    header: "Value",
    cell: ({ row }) => {
      const value = row.original.order.totalAmount;
      return <div className="font-medium">{formatCurrency(value, row.original.order.currency || "USD")}</div>;
    },
  },
  {
    accessorKey: "order.transactionType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm capitalize">
        {row.original.order.transactionType}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "State",
    cell: ({ row }) => {
      const state = row.original.status;
      if (!state) return <Badge variant="outline">Unknown</Badge>;
      return <TransactionStatusBadge status={state} />;
    },
  },
  {
    accessorFn: (row) => row.order.status,
    id: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      // For now using order status as payment status proxy or checking if we should derive it
      const status = row.original.order.status?.toLowerCase();
      if (!status) return <Badge variant="outline">Unknown</Badge>;

      const variant = paymentStatusStyles[status] || "neutral";

      return <StatusBadge status={status} variant={variant} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.createdAt), "MMM d, yyyy")}
      </div>
    ),
  },
];
