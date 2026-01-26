"use client";

import { isWithinInterval, parseISO } from "date-fns";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/shared/data-table";
import type { Escrow } from "../../lib/escrow-model";
import { escrowsColumns } from "./columns";
import { type EscrowFilters, Filters } from "./filters";

interface EscrowsTableProps {
  data: Escrow[];
  isLoading?: boolean;
}

export function EscrowsTable({ data, isLoading }: EscrowsTableProps) {
  const navigate = useNavigate();

  const [filters, setFilters] = React.useState<EscrowFilters>({
    search: "",
    status: "all",
  });

  const handleFilterChange = (key: keyof EscrowFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  const filteredData = React.useMemo(() => {
    return data.filter((escrow) => {
      // Search
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        escrow.id.toLowerCase().includes(searchLower) ||
        escrow.transactionReference.toLowerCase().includes(searchLower);

      // Status
      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        escrow.status === filters.status;

      // Merchant Name
      const matchesMerchant =
        !filters.merchantName ||
        escrow.merchantName
          .toLowerCase()
          .includes(filters.merchantName.toLowerCase());

      // Customer Name
      const matchesCustomer =
        !filters.customerName ||
        escrow.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase());

      // Amount Range
      const amount = escrow.amount;
      const matchesMinAmount =
        !filters.minAmount || amount >= parseFloat(filters.minAmount);
      const matchesMaxAmount =
        !filters.maxAmount || amount <= parseFloat(filters.maxAmount);

      // Date Range
      let matchesDate = true;
      if (filters.dateRange?.from) {
        const date = parseISO(escrow.createdAt);
        matchesDate = isWithinInterval(date, {
          start: filters.dateRange.from,
          end: filters.dateRange.to || filters.dateRange.from,
        });
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMerchant &&
        matchesCustomer &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesDate
      );
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
        columns={escrowsColumns}
        data={filteredData}
        isLoading={isLoading}
        emptyContent={<div className="py-6 text-center">No escrows found</div>}
        onRowClick={(row) => navigate(`/escrows/${row.original.id}`)}
      />
    </div>
  );
}
