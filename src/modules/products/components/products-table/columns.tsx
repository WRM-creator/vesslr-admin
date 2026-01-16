import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Thumbnail } from "@/components/shared/thumbnail";
import { formatCurrency } from "@/lib/utils";

export interface Product {
  _id?: string;
  title?: string;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  price?: number;
  image?: string;
  availableQuantity?: number;
  condition?: "new" | "used";
  currency?: string;
  seller?: {
    _id?: string;
    email?: string;
  };
  createdAt?: string;
}

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => {
      const { title, image } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Thumbnail src={image} alt={title ?? "Product"} />
          <Link to={`/products/${row.original._id}`} className="font-medium hover:underline">
            {title}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return <span>{category?.name ?? "-"}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return <span className="tabular-nums">{formatCurrency(row.original.price)}</span>;
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.original.condition;
      if (!condition) return <span>-</span>;
      return (
        <Badge variant={condition === "new" ? "default" : "secondary"}>
          {condition.charAt(0).toUpperCase() + condition.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "availableQuantity",
    header: "Stock",
    cell: ({ row }) => {
      const quantity = row.original.availableQuantity;
      return <span className="tabular-nums">{quantity ?? 0}</span>;
    },
  },
];
