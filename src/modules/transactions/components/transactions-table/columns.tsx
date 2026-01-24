"use client";

import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: "purchase" | "refund" | "transfer" | "payout";
  state:
    | "initiated"
    | "documents_submitted"
    | "compliance_review"
    | "escrow_funded"
    | "logistics_assigned"
    | "in_transit"
    | "delivery_confirmed"
    | "settlement_released"
    | "closed";
  paymentStatus: "paid" | "unpaid" | "partial" | "refunded";
  complianceStatus: "approved" | "pending_review" | "flagged" | "rejected";
  merchant: {
    name: string;
  };
  customer: {
    name: string;
  };
  value: number;
}

const paymentStatusStyles: Record<
  Transaction["paymentStatus"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "default",
  unpaid: "destructive",
  partial: "secondary",
  refunded: "outline",
};

const complianceStatusStyles: Record<
  Transaction["complianceStatus"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  approved: "default",
  pending_review: "secondary",
  flagged: "outline",
  rejected: "destructive",
};

const stateStyles: Record<
  Transaction["state"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  initiated: "secondary",
  documents_submitted: "secondary",
  compliance_review: "outline",
  escrow_funded: "default",
  logistics_assigned: "outline",
  in_transit: "outline",
  delivery_confirmed: "default",
  settlement_released: "default",
  closed: "secondary",
};

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => (
      <Link
        to={`/transactions/${row.original.id}`}
        className="font-mono text-sm hover:underline"
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "merchant.name",
    header: "Merchant",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.merchant.name}</span>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.customer.name}</span>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.original.value;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm capitalize">{row.original.type}</span>
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const state = row.original.state;
      return (
        <Badge variant={stateStyles[state]} className="capitalize">
          {state.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      return (
        <Badge variant={paymentStatusStyles[status]} className="capitalize">
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "complianceStatus",
    header: "Compliance Status",
    cell: ({ row }) => {
      const status = row.original.complianceStatus;
      return (
        <Badge variant={complianceStatusStyles[status]} className="capitalize">
          {status.replace("_", " ")}
        </Badge>
      );
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
