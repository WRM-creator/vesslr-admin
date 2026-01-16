import type { ColumnDef } from "@tanstack/react-table";
import { Thumbnail } from "@/components/shared/thumbnail";

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  productCount: number;
}

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      const { name, image } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Thumbnail src={image} alt={name} />
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "productCount",
    header: "Number of Products",
    cell: ({ row }) => {
      const count = row.original.productCount;
      return <span className="tabular-nums">{count}</span>;
    },
  },
];
