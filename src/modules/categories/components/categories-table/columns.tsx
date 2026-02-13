"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

// Valid status types derived from the Category interface
// type CategoryStatus = Category["identity"]["status"];

// const statusStyles: Record<
//   CategoryStatus,
//   "default" | "secondary" | "outline" | "destructive"
// > = {
//   active: "default",
//   draft: "secondary",
//   deprecated: "destructive",
// };

export interface CategoryTableItem {
  _id: string;
  name: string;
  slug: string;
  type?: string;
  isActive: boolean;
}

export const getCategoriesColumns = (
  navigate: NavigateFunction,
): ColumnDef<CategoryTableItem>[] => [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.slug}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm capitalize">
        {(row.original.type || "equipment-and-products").replace(/-/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`rounded-full px-2 py-1 text-xs ${row.original.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/categories/${row.original._id}`);
            }}
          >
            <ArrowRight className="text-muted-foreground size-4" />
          </Button>
        </div>
      );
    },
  },
];
