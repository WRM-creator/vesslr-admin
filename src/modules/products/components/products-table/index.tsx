"use client";

import { DataTable } from "@/components/shared/data-table";
import type { Product } from "../../lib/product-model";
import { productsColumns } from "./columns";
import { Filters } from "./filters";

interface ProductsTableProps {
  data: Product[];
  isLoading?: boolean;
}

export function ProductsTable({
  data,
  isLoading,
  filters,
  onFilterChange,
  onReset,
}: ProductsTableProps &
  React.ComponentProps<typeof Filters> & { children?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Filters
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
      <DataTable
        columns={productsColumns}
        data={data}
        isLoading={isLoading}
        emptyContent={<div className="py-6 text-center">No products found</div>}
      />
    </div>
  );
}
