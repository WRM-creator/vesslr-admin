import { Thumbnail } from "@/components/shared/thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../lib/product-model";

const statusStyles: Record<
  Product["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  draft: "secondary",
  reserved: "outline",
  in_transaction: "default",
  fulfilled: "secondary",
};

export const productsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className="flex items-center gap-3">
          <Thumbnail src={image} alt={row.original.name} />
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-muted-foreground text-xs">
              ID: {row.original.id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "merchant",
    header: "Merchant",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.merchant}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "availableQuantity",
    header: "Stock",
    cell: ({ row }) => {
      const qty = row.original.availableQuantity || 0;
      return (
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              qty > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>
            {qty} {row.original.unitOfMeasurement || "units"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.price.toString());
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
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
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.original.created), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
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
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy product ID
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link to={`/products/${product.id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit product</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
