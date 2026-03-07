"use client";

import { TruncatedList } from "@/components/shared/truncated-list";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface OrganizationTableItem {
  _id: string;
  name: string;
  email: string;
  location: string;
  categories: string[];
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  createdAt: string;
}

const statusStyles: Record<
  OrganizationTableItem["verificationStatus"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  verified: "default",
  pending: "secondary",
  unverified: "outline",
  rejected: "destructive",
};

export const columns: ColumnDef<OrganizationTableItem>[] = [
  {
    accessorKey: "name",
    header: "Organization",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) =>
      row.original.location ? (
        <span className="text-sm">{row.original.location}</span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  {
    accessorKey: "categories",
    header: "Category Groups",
    cell: ({ row }) => (
      <TruncatedList items={row.original.categories} maxVisible={2} />
    ),
  },
  {
    accessorKey: "verificationStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.verificationStatus;
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
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.original.createdAt), "MMM d, yyyy")}
      </span>
    ),
  },
];
