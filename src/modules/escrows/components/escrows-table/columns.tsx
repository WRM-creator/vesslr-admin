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
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  unfunded: "secondary",
  partially_funded: "secondary",
  funded: "default",
  releasing: "default",
  released: "default",
  disputed: "destructive",
  refunded: "outline",
};

export const escrowsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Escrow ID",
    cell: ({ row }) => (
      <Link
        to={`/escrows/${row.original.id}`}
        className="hover:text-primary font-mono text-xs font-medium hover:underline"
      >
        {row.original.id?.substring(0, 8) || "N/A"}...
      </Link>
    ),
  },
  {
    accessorKey: "transactionReference",
    header: "Transaction",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.transactionReference?.substring(0, 8) || "N/A"}...
      </div>
    ),
  },
  {
    id: "merchantName",
    header: "Merchant",
    cell: ({ row }) => <div>{row.original.merchantName || "Unknown"}</div>,
  },
  {
    id: "customerName",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.customerName || "Unknown"}</div>,
  },
  {
    accessorKey: "amount",
    header: "Value",
    cell: ({ row }) => {
      const amount = row.original.amount || 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency || "NGN",
      }).format(amount);
      return <div className="font-mono font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      return (
        <Badge
          variant={statusStyles[status] || "outline"}
          className="capitalize"
        >
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Age",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.createdAt), {
          addSuffix: true,
        })}
      </span>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
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
              <DropdownMenuItem asChild>
                <Link to={`/escrows/${row.original.id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Release funds</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Open dispute
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
