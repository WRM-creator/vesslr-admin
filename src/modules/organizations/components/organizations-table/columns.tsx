"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface OrganizationTableItem {
  _id: string;
  name: string;
  email: string; // Business email
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  industrySectors: string[];
  createdAt: string;
  // type: "merchant" | "customer"; // In case we mix them later
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
    accessorKey: "industrySectors",
    header: "Industry",
    cell: ({ row }) => {
      const sectors = row.original.industrySectors;
      return sectors && sectors.length > 0 ? (
        <Badge variant="outline" className="font-normal">
          {sectors[0]}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      );
    },
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
