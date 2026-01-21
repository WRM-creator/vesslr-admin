"use client";

import { DataTable } from "@/components/shared/data-table";
import type { Product } from "../../lib/product-model";
import { productsColumns } from "./columns";

interface ProductsTableProps {
  data: Product[];
  isLoading?: boolean;
}

export function ProductsTable({ data, isLoading }: ProductsTableProps) {
  return (
    <DataTable
      columns={productsColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={<div className="py-6 text-center">No products found</div>}
    />
  );
}
