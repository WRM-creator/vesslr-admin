"use client";

import { Thumbnail } from "@/components/shared/thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { Category } from "../../lib/category-details-model";

// Valid status types derived from the Category interface
type CategoryStatus = Category["identity"]["status"];

const statusStyles: Record<
  CategoryStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  draft: "secondary",
  deprecated: "destructive",
};

export interface CategoryTableItem extends Category {
  productCount: number; // Mocked field
}

export const getCategoriesColumns = (
  navigate: NavigateFunction,
): ColumnDef<CategoryTableItem>[] => [
  {
    accessorKey: "identity.name",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Thumbnail
            // src={row.original.identity.thumbnail} // Not available yet
            alt={row.original.identity.name}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {row.original.identity.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {row.original.identity.tags.slice(0, 2).join(", ")}
              {row.original.identity.tags.length > 2 && "..."}
            </span>
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
        {row.original.productCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "identity.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.identity.status;
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
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/categories/${row.original.id}`);
            }}
          >
            <ArrowRight className="text-muted-foreground size-4" />
          </Button>
        </div>
      );
    },
  },
];
