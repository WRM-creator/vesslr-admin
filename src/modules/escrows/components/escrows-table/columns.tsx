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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Flag, MoreHorizontal } from "lucide-react";
import type { Escrow } from "../../lib/escrow-model";

const statusStyles: Record<
  Escrow["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  held: "secondary",
  released: "default",
  disputed: "destructive",
  refunded: "outline",
};

export const escrowsColumns: ColumnDef<Escrow>[] = [
  {
    accessorKey: "id",
    header: "Escrow ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "transactionReference",
    header: "Transaction",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.transactionReference}</div>
    ),
  },
  {
    accessorKey: "merchantName",
    header: "Merchant",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Value",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount.toString());
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount);
      return <div className="font-mono font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={statusStyles[status] || "outline"}
          className="capitalize"
        >
          {status}
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
    accessorKey: "riskFlags",
    header: "Risk Flags",
    cell: ({ row }) => {
      const flags = row.original.riskFlags;
      if (flags.length === 0) return null;

      return (
        <div className="flex gap-1">
          {flags.map((flag) => (
            <TooltipProvider key={flag}>
              <Tooltip>
                <TooltipTrigger>
                  {flag === "high_value" && (
                    <Flag className="h-4 w-4 text-blue-500" />
                  )}
                  {flag === "mismatch" && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {flag === "new_account" && (
                    <Flag className="h-4 w-4 text-yellow-500" />
                  )}
                  {flag === "velocity_check" && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{flag.replace(/_/g, " ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      );
    },
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
              <DropdownMenuItem>View details</DropdownMenuItem>
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
