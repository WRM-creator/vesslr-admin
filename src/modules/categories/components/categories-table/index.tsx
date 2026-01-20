"use client";

import { DataTable } from "@/components/shared/data-table";
import { useNavigate } from "react-router-dom";
import { getCategoriesColumns, type CategoryTableItem } from "./columns";

interface CategoriesTableProps {
  data: CategoryTableItem[];
  isLoading?: boolean;
}

export function CategoriesTable({ data, isLoading }: CategoriesTableProps) {
  const navigate = useNavigate();
  const columns = getCategoriesColumns(navigate);

  const emptyContent = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 mb-3 rounded-full p-4">
        {/* Placeholder icon */}
        <div className="bg-muted size-8 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold">No categories found</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Get started by creating your first product category.
      </p>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyContent={emptyContent}
      onRowClick={(row) => navigate(`/categories/${row.original.id}`)}
    />
  );
}
