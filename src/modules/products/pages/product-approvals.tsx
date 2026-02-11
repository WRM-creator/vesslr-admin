"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsTable } from "../components/products-table";
import type { ProductFilters } from "../components/products-table/filters";

export default function ProductApprovalsPage() {
  const navigate = useNavigate();
  // --- 1. Filter State (URL w/ nuqs) ---
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all"),
  );
  const [merchantId, setMerchantId] = useQueryState(
    "merchantId",
    parseAsString.withDefault("all"),
  );
  const [transactionType, setTransactionType] = useQueryState(
    "transactionType",
    parseAsString.withDefault("all"),
  );
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsString.withDefault(""),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsString.withDefault(""),
  );
  // Date range handling in nuqs can be tricky; mostly people use ISO parsing or separate keys.
  // For simplicity matching existing patterns, we might strip it or strictly use strings 'from' & 'to'.
  // However, the Filters component expects a DateRange object. We'll reconstruct it from simple params.
  const [dateFrom, setDateFrom] = useQueryState("from", parseAsString);
  const [dateTo, setDateTo] = useQueryState("to", parseAsString);

  // Pagination
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // --- 2. Derived Filters Object (for Table/UI) ---
  const filters: ProductFilters = useMemo(
    () => ({
      search,
      category,
      merchantId,
      status: "pending", // Locked to pending
      transactionType,
      minPrice,
      maxPrice,
      dateRange:
        dateFrom || dateTo
          ? {
              from: dateFrom ? new Date(dateFrom) : undefined,
              to: dateTo ? new Date(dateTo) : undefined,
            }
          : undefined,
    }),
    [
      search,
      category,
      merchantId,
      transactionType,
      minPrice,
      maxPrice,
      dateFrom,
      dateTo,
    ],
  );

  // --- 3. API Query ---
  const queryParams = {
    page,
    limit: 10,
    status: "pending" as const, // Strict type match for our patched SDK
    search: search || undefined,
    category: category === "all" ? undefined : category,
    merchant: merchantId === "all" ? undefined : merchantId,
    transactionType: transactionType === "all" ? undefined : transactionType,
    "price[gte]": minPrice || undefined,
    "price[lte]": maxPrice || undefined,
    "created[gte]": dateFrom || undefined,
    "created[lte]": dateTo || undefined,
  };

  const { data: productsData, isLoading } = api.products.list.useQuery({
    query: {
      ...queryParams,
      page: queryParams.page.toString(),
      limit: queryParams.limit.toString(),
    },
  });

  const productsDataList = (productsData?.data?.docs as any[]) || [];
  const products: any[] = productsDataList.map((item) => ({
    id: item._id,
    name: item.title,
    category: item.category?.name || "Uncategorized", // Handle populated category
    merchant: item.seller?.name || "Unknown Merchant", // Start treating seller as object if populated, otherwise string
    status: item.status === "pending" ? "pending_approval" : item.status, // Map backend 'pending' to UI 'pending_approval'
    created: item.createdAt, // Map createdAt to created
    price: item.price,
    transactionType: item.transactionType || "spot_trade",
    currency: item.currency || "USD",
    image: item.image,
    availableQuantity: item.availableQuantity,
    unitOfMeasurement: item.unitOfMeasurement,
  }));
  const totalDocs = productsData?.data?.totalDocs || 0;

  // --- 4. Merchant Options (Sidebar) ---
  const { data: merchantsData } = api.organizations.list.useQuery({
    query: { type: "merchant", limit: 100 },
  });
  const merchantOptions =
    (merchantsData?.data?.docs ?? []).map((m) => ({
      label: m.name || "Unknown",
      value: m._id || "",
    })) || [];

  // --- 5. Handlers ---
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    // Locked status
    if (key === "status") return;

    // Reset pagination on filter change
    setPage(1);

    switch (key) {
      case "search":
        setSearch(value || null);
        break;
      case "category":
        setCategory(value === "all" ? null : value);
        break;
      case "merchantId":
        setMerchantId(value === "all" ? null : value);
        break;
      case "transactionType":
        setTransactionType(value === "all" ? null : value);
        break;
      case "minPrice":
        setMinPrice(value || null);
        break;
      case "maxPrice":
        setMaxPrice(value || null);
        break;
      case "dateRange":
        if (value?.from) setDateFrom(value.from.toISOString());
        else setDateFrom(null);
        if (value?.to) setDateTo(value.to.toISOString());
        else setDateTo(null);
        break;
    }
  };

  const handleReset = () => {
    setSearch(null);
    setCategory(null);
    setMerchantId(null);
    setTransactionType(null);
    setMinPrice(null);
    setMaxPrice(null);
    setDateFrom(null);
    setDateTo(null);
    setPage(1);
  };

  return (
    <Page>
      <PageHeader
        title="Product Approvals"
        description="Review and approve new product listings."
      />
      <div className="space-y-4">
        <ProductsTable
          data={products}
          isLoading={isLoading}
          filters={filters}
          merchantOptions={merchantOptions}
          hiddenFilters={["status"]} // Hide status filter from UI since it's locked
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onRowClick={(row) => {
            navigate(`/products/${row.original.id}?tab=compliance`);
          }}
        />
        <DataPagination
          currentPage={page}
          totalItems={totalDocs}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>
    </Page>
  );
}
