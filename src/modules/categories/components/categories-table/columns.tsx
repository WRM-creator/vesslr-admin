"use client";

import { Thumbnail } from "@/components/shared/thumbnail";
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
  image?: string;
  productCount: number;
  // properties needed for filtering but missing from API
  type?: "equipment-and-products" | "services";
}

export const getCategoriesColumns = (
  navigate: NavigateFunction,
): ColumnDef<CategoryTableItem>[] => [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Thumbnail
            src={row.original.image}
            alt={row.original.name}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{row.original.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productCount",
    header: "Products",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {(row.original.productCount || 0).toLocaleString()}
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
