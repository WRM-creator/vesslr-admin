import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductsTable } from "../components/products-table";
import type { ProductFilters } from "../components/products-table/filters";
import type { Product } from "../lib/product-model";

// Mock data for pending approvals
const MOCK_PENDING_APPROVALS: Product[] = [
  {
    id: "prod_pending_01",
    name: "Unverified Copper Ingots",
    category: "Commodities",
    merchant: "New Age Minerals",
    status: "pending_approval",
    created: "2024-05-20T10:30:00Z",
    price: 35000.0,
    transactionType: "spot_trade",
    currency: "USD",
  },
  {
    id: "prod_pending_02",
    name: "Heavy Lift Crane - Model X",
    category: "Equipment",
    merchant: "Construction Supplies Co",
    status: "pending_approval",
    created: "2024-05-21T14:15:00Z",
    price: 150000.0,
    transactionType: "purchase",
    currency: "USD",
  },
];

export default function ProductApprovalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = useMemo(() => {
    return {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      merchantId: searchParams.get("merchantId") || "all",
      status: "pending_approval", // Locked filter
      transactionType: searchParams.get("transactionType") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      dateRange: undefined,
    };
  }, [searchParams]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      status: "pending_approval",
    };

    if (filters.search) params.name = filters.search;
    if (filters.category !== "all") params.category = filters.category;
    if (filters.merchantId !== "all") params.merchant = filters.merchantId;
    if (filters.transactionType !== "all")
      params.transactionType = filters.transactionType;

    // Price range
    if (filters.minPrice) params["price[gte]"] = filters.minPrice;
    if (filters.maxPrice) params["price[lte]"] = filters.maxPrice;

    // Date range
    if (filters.dateRange?.from) {
      params["created[gte]"] = filters.dateRange.from.toISOString();
    }
    if (filters.dateRange?.to) {
      params["created[lte]"] = filters.dateRange.to.toISOString();
    }

    return params;
  }, [filters]);

  const { data: productsData, isLoading } =
    api.products.list.useQuery(queryParams);
  const products = (productsData as any)?.data || [];

  // Fetch merchants for filter
  const { data: merchantsData } = api.organizations.list.useQuery({
    query: { type: "merchant", limit: 100 },
  });
  const merchantOptions =
    (merchantsData?.data?.docs ?? []).map((m) => ({
      label: m.name || "Unknown",
      value: m._id || "",
    })) || [];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    // Prevent changing status filter
    if (key === "status") return;

    setSearchParams((prev) => {
      if (key === "dateRange") {
        if (value?.from) prev.set("from", value.from.toISOString());
        else prev.delete("from");
        if (value?.to) prev.set("to", value.to.toISOString());
        else prev.delete("to");
      } else if (!value || value === "all") {
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
        title="Product Approvals"
        description="Review and approve new product listings."
      />
      <ProductsTable
        data={products}
        isLoading={isLoading}
        filters={filters}
        merchantOptions={merchantOptions}
        hiddenFilters={["status"]}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </Page>
  );
}
