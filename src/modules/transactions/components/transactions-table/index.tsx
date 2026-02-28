"use client";

import { DataTable } from "@/components/shared/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TransactionResponseDto } from "@/lib/api/generated";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { transactionsColumns } from "./columns";
import { Filters } from "./filters";

export type { TransactionResponseDto as Transaction };

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
      <div className="flex items-center gap-4">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="initiated">Initiated</SelectItem>
            <SelectItem value="documents_submitted">Documents</SelectItem>
            <SelectItem value="compliance_reviewed">Compliance</SelectItem>
            <SelectItem value="escrow_funded">Escrow</SelectItem>
            <SelectItem value="logistics_assigned">Logistics</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="inspection_pending">Inspection</SelectItem>
            <SelectItem value="inspection_under_review">
              Inspection Review
            </SelectItem>
            <SelectItem value="inspection_failed">Inspection Failed</SelectItem>
            <SelectItem value="inspection_price_review">
              Price Review
            </SelectItem>
            <SelectItem value="milestones_in_progress">Milestones</SelectItem>
            <SelectItem value="delivery_confirmed">Delivered</SelectItem>
            <SelectItem value="settlement_released">Settled</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
