"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { Merchant } from "../../lib/merchant-model";

const statusStyles: Record<
  Merchant["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
};

export const getMerchantsColumns = (
  navigate: NavigateFunction,
): ColumnDef<Merchant>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Account status",
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
    accessorKey: "trustScore",
    header: "Trust score",
    cell: ({ row }) => {
      const score = row.original.trustScore;
      let scoreColor = "text-green-600";
      if (score < 60) scoreColor = "text-red-500";
      else if (score < 80) scoreColor = "text-yellow-600";

      return <span className={`font-semibold ${scoreColor}`}>{score}</span>;
    },
  },
  {
    accessorKey: "dateRegistered",
    header: "Date Registered",
    cell: ({ row }) =>
      format(new Date(row.original.dateRegistered), "MMM d, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/merchants/${row.original.id}`);
          }}
        >
          <ArrowRight className="text-muted-foreground size-4" />
        </Button>
      </div>
    ),
  },
];
