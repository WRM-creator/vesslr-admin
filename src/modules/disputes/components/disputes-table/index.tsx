"use client";

import { DataTable } from "@/components/shared/data-table";
import type { Dispute } from "@/lib/api/disputes";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { disputesColumns } from "./columns";
import { type DisputeFilters, Filters } from "./filters";

interface DisputesTableProps {
  data: Dispute[];
  isLoading?: boolean;
}

export function DisputesTable({ data, isLoading }: DisputesTableProps) {
  const navigate = useNavigate();

  const [filters, setFilters] = React.useState<DisputeFilters>({
    search: "",
    status: "all",
  });

  const handleFilterChange = (key: keyof DisputeFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  const filteredData = React.useMemo(() => {
    return data.filter((dispute) => {
      // Search (ID or Reason)
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        dispute._id.toLowerCase().includes(searchLower) ||
        dispute.reason.toLowerCase().includes(searchLower);

      // Status
      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        dispute.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  return (
    <div className="space-y-4">
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
      <DataTable
        columns={disputesColumns}
        data={filteredData}
        isLoading={isLoading}
        emptyContent={<div className="py-6 text-center">No disputes found</div>}
        onRowClick={(row) =>
          navigate(
            `/transactions/${row.original.transaction?._id}?tab=disputes`,
          )
        }
      />
    </div>
  );
}
