import { DataTable } from "@/components/shared/data-table";
import type { Row } from "@tanstack/react-table";
import type { CmsPageRow } from "./columns";
import { createPagesColumns } from "./columns";
import { Filters, type CmsPageFilters } from "./filters";
import { useMemo } from "react";

interface PagesTableProps {
  data: CmsPageRow[];
  isLoading?: boolean;
  onRowClick?: (row: Row<CmsPageRow>) => void;
  filters: CmsPageFilters;
  onFilterChange: (key: keyof CmsPageFilters, value: string) => void;
  onReset: () => void;
  onDelete: (id: string) => void;
}

export function PagesTable({
  data,
  isLoading,
  onRowClick,
  filters,
  onFilterChange,
  onReset,
  onDelete,
}: PagesTableProps) {
  const columns = useMemo(() => createPagesColumns(onDelete), [onDelete]);

  return (
    <div className="space-y-4">
      <Filters
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={onRowClick}
        emptyContent={
          <div className="py-6 text-center">No pages found</div>
        }
      />
    </div>
  );
}
