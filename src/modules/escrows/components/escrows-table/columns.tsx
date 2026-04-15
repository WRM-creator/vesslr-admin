"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currency";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  FUNDED: "default",
  RELEASE_PENDING: "secondary",
  RELEASED: "outline",
  REFUND_PENDING: "secondary",
  REFUNDED: "outline",
  PARTIALLY_REFUNDED: "destructive",
};

const statusLabels: Record<string, string> = {
  FUNDED: "Funded",
  RELEASE_PENDING: "Releasing",
  RELEASED: "Released",
  REFUND_PENDING: "Refunding",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partial Refund",
};

export const escrowsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "transactionDisplayId",
    header: "Transaction",
    cell: ({ row }) => {
      const displayId = row.original.transactionDisplayId;
      const txId = row.original.transactionId;
      return txId ? (
        <Link
          to={`/transactions/${txId}`}
          className="hover:text-primary font-mono text-xs font-medium hover:underline"
        >
          TXN-{String(displayId).padStart(4, "0")}
        </Link>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    id: "sellerName",
    header: "Seller",
    cell: ({ row }) => <div className="text-sm">{row.original.sellerName}</div>,
  },
  {
    id: "buyerName",
    header: "Buyer",
    cell: ({ row }) => <div className="text-sm">{row.original.buyerName}</div>,
  },
  {
    accessorKey: "amount",
    header: "Escrow Value",
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {formatCurrency(row.original.amount, row.original.currency)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      return (
        <Badge variant={statusStyles[status] || "outline"}>
          {statusLabels[status] || status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Age",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatDistanceToNow(new Date(row.original.createdAt), {
          addSuffix: true,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const txId = row.original.transactionId;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {txId && (
                <DropdownMenuItem asChild>
                  <Link to={`/transactions/${txId}`}>View Transaction</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
