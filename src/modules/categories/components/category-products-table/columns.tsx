import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Thumbnail } from "@/components/shared/thumbnail";

// Product type from API
export interface Product {
  _id?: string;
  title?: string;
  price?: number;
  availableQuantity?: number;
  image?: string;
  condition?: "new" | "used";
}

// Columns definition
export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => {
      const { title, image } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Thumbnail src={image} alt={title ?? ""} className="h-10 w-10" />
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.original.condition;
      return (
        <Badge variant={condition === "new" ? "default" : "secondary"}>
          {condition ?? "Unknown"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "availableQuantity",
    header: "Inventory",
    cell: ({ row }) => {
      const quantity = row.original.availableQuantity ?? 0;
      return (
        <span className="tabular-nums">
          {quantity} in stock
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return <span className="font-medium tabular-nums">{formatCurrency(row.original.price)}</span>;
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View product</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Unlink category</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
