"use client";

import { DataTable } from "@/components/shared/data-table";
import { type Row } from "@tanstack/react-table";
import * as React from "react";
import type { Product } from "../../lib/product-details-model";
import { productsColumns } from "./columns";
import { Filters } from "./filters";

interface ProductsTableProps {
  data: Product[];
  isLoading?: boolean;
  onRowClick?: (row: Row<Product>) => void;
}

export function ProductsTable({
  data,
  isLoading,
  onRowClick,
  filters,
  onFilterChange,
  onReset,
  ...filterProps
}: ProductsTableProps &
  React.ComponentProps<typeof Filters> & { children?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Filters
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onReset}
        {...filterProps}
      />
      <DataTable
        columns={productsColumns}
        data={data}
        isLoading={isLoading}
        onRowClick={onRowClick}
        emptyContent={<div className="py-6 text-center">No products found</div>}
      />
    </div>
  );
}
