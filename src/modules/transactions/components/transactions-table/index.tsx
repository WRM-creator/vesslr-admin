"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/shared/data-table";
import { type Transaction, transactionsColumns } from "./columns";

export { transactionsColumns };
export type { Transaction };

interface TransactionsTableProps {
  data: Transaction[];
  isLoading?: boolean;
}

export function TransactionsTable({ data, isLoading }: TransactionsTableProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return data;
    return data.filter((transaction) => transaction.state === activeTab);
  }, [data, activeTab]);

  const emptyContent = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 mb-3 rounded-full p-4">
        <div className="bg-muted size-8 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold">No transactions found</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Transactions will appear here once they are processed.
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
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
        emptyContent={emptyContent}
        onRowClick={(row) => navigate(`/transactions/${row.original.id}`)}
      />
    </div>
  );
}
