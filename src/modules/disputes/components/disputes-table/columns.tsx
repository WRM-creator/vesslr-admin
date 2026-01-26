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
import type { Dispute } from "@/lib/api/disputes";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles: Record<
  Dispute["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "default",
  under_review: "secondary",
  resolved_release: "outline",
  resolved_refund: "outline",
  dismissed: "default",
};

export const disputesColumns: ColumnDef<Dispute>[] = [
  {
    accessorKey: "_id",
    header: "Dispute ID",
    cell: ({ row }) => (
      <Link
        to={`/disputes/${row.original._id}`}
        className="text-muted-foreground hover:text-primary font-mono text-xs hover:underline"
      >
        {row.original._id.slice(-6)}
      </Link>
    ),
  },
  {
    accessorKey: "transaction",
    header: "Transaction",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">
        {row.original.transaction?._id?.slice(-6) || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium capitalize">
          {row.original.reason.replace(/_/g, " ")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "initiator",
    header: "Initiator",
    cell: ({ row }) => {
      const initiator = row.original.initiator;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {initiator?.firstName} {initiator?.lastName}
          </span>
          <span className="text-muted-foreground text-xs">
            {initiator?.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium">
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(row.original.amount)}
      </span>
    ),
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
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
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
              <Link to={`/disputes/${row.original._id}`}>View details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
