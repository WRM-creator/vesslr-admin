"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  type Transaction,
  TransactionsTable,
} from "../components/transactions-table";
import type { TransactionFilters } from "../components/transactions-table/filters";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "purchase",
    state: "closed",
    paymentStatus: "paid",
    complianceStatus: "approved",
    merchant: { name: "Acme Corp" },
    customer: { name: "John Doe" },
    value: 120.5,
  },
  {
    id: "tx_002",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    type: "transfer",
    state: "compliance_review",
    paymentStatus: "partial",
    complianceStatus: "pending_review",
    merchant: { name: "Global Industries" },
    customer: { name: "Jane Smith" },
    value: 75.0,
  },
  {
    id: "tx_003",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    type: "refund",
    state: "initiated",
    paymentStatus: "refunded",
    complianceStatus: "flagged",
    merchant: { name: "Tech Solutions" },
    customer: { name: "Bob Johnson" },
    value: 250.0,
  },
];

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TransactionFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
    }),
    [searchParams],
  );

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (filters.search) params.search = filters.search;
    if (filters.status && filters.status !== "all")
      params.status = filters.status;
    return params;
  }, [filters]);

  const { data: transactionsData, isLoading } =
    api.admin.orders.list.useQuery(queryParams);

  const transactions: Transaction[] = (transactionsData?.data?.docs || []).map(
    (doc: any) => ({
      id: doc.id,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      type: "purchase", // Defaulting as API might not have this yet
      state: doc.status as Transaction["state"],
      paymentStatus: doc.paymentStatus as Transaction["paymentStatus"],
      complianceStatus: doc.complianceStatus as Transaction["complianceStatus"],
      merchant: { name: doc.merchant?.name || "Unknown" },
      customer: { name: doc.user?.email || "Unknown" },
      value: doc.total,
    }),
  );

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setSearchParams((prev) => {
      if (!value) {
        prev.delete(key);
      } else {
        prev.set(key, String(value));
      }
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      // Keep status/tab if needed, or clear everything.
      // Based on ProductsPage, it clears everything.
      // But here `status` is managed by `nuqs` in the table (as per my read of table code),
      // or wait, table uses `useQueryState("status")`.
      // If I clear searchParams here, it might clear "status" too if it's in the URL.
      // Let's just clear the filters we know about for now to be safe, or just empty object if we want full reset.
      // ProductsPage does `setSearchParams({})`.
      // Let's do the same for consistency, assuming "status" might be reset to default "all".
      return {};
    });
  };

  return (
    <Page>
      <PageHeader
        title="Transactions"
        description="View and manage customer transactions."
      />

      <TransactionsTable
        data={transactions}
        isLoading={isLoading}
        filters={filters}
        merchantOptions={[]} // TODO: Fetch merchants from API
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </Page>
  );
}
