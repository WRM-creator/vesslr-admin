"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { type TransactionResponseDto } from "@/lib/api/generated";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TransactionsTable } from "../components/transactions-table";
import type { TransactionFilters } from "../components/transactions-table/filters";

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
    return {
      query: {
        page: "1",
        limit: "100", // For now, simple list
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
      },
    };
  }, [filters]);

  const { data: transactionsData, isLoading } =
    api.admin.transactions.list.useQuery(queryParams);

  const transactions = useMemo(() => {
    return (transactionsData?.data?.docs as TransactionResponseDto[]) || [];
  }, [transactionsData]);

  const handleFilterChange = (
    key: keyof TransactionFilters,
    value: string | null,
  ) => {
    setSearchParams((prev) => {
      if (!value || value === "all") {
        prev.delete(key);
      } else {
        prev.set(key, String(value));
      }
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams({});
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
        merchantOptions={[]} // TODO: Fetch merchants from API if needed
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </Page>
  );
}
