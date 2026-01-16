import { api } from "@/lib/api";
import { DataTable } from "@/components/shared/data-table";
import { productColumns, type Product } from "./columns";

interface CategoryProductsTableProps {
  categoryId?: string;
}

export function CategoryProductsTable({ categoryId }: CategoryProductsTableProps) {
  const { data, isLoading } = api.products.list.useQuery({
    query: { category: categoryId },
  });

  const products = (data?.data?.docs ?? []) as Product[];

  return (
    <DataTable
      columns={productColumns}
      data={products}
      isLoading={isLoading}
      emptyContent={
        <div className="py-12 text-center text-muted-foreground">
          No products found in this category.
        </div>
      }
    />
  );
}
