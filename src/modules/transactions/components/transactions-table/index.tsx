"use client";

import { DataTable } from "@/components/shared/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type TransactionResponseDto } from "@/lib/api/generated";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { transactionsColumns } from "./columns";
import { Filters } from "./filters";

interface TransactionsTableProps {
  data: TransactionResponseDto[];
  isLoading?: boolean;
  hiddenColumns?: string[];
}

export function TransactionsTable({
  data,
  isLoading,
  filters,
  merchantOptions,
  onFilterChange,
  onReset,
}: TransactionsTableProps & React.ComponentProps<typeof Filters>) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return data;
    // Map the tab value to the possible uppercase status
    return data.filter((transaction) => {
      const statusMatch = transaction.status === activeTab.toUpperCase();
      return statusMatch;
    });
  }, [data, activeTab]);

  return (
    <div className="space-y-4">
      <Filters
        filters={filters}
        merchantOptions={merchantOptions}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="initiated">Initiated</TabsTrigger>
          <TabsTrigger value="documents_submitted">Documents</TabsTrigger>
          <TabsTrigger value="compliance_review">Compliance</TabsTrigger>
          <TabsTrigger value="escrow_funded">Escrow</TabsTrigger>
          <TabsTrigger value="logistics_assigned">Logistics</TabsTrigger>
          <TabsTrigger value="in_transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivery_confirmed">Delivered</TabsTrigger>
          <TabsTrigger value="settlement_released">Settled</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>
      <DataTable
        columns={transactionsColumns}
        data={filteredData}
        isLoading={isLoading}
        // hiddenColumns={hiddenColumns}
        onRowClick={(row) => navigate(`/transactions/${row.original._id}`)}
      />
    </div>
  );
}
