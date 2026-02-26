import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductsTable } from "../components/products-table";
import type { ProductFilters } from "../components/products-table/filters";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = useMemo(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    return {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      merchantId: searchParams.get("merchantId") || "all",
      status: searchParams.get("status") || "all",
      transactionType: searchParams.get("transactionType") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      dateRange:
        from && to
          ? { from: new Date(from), to: new Date(to) }
          : from
            ? { from: new Date(from), to: undefined }
            : undefined,
    };
  }, [searchParams]);

  // Transform UI filters to API query params
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (filters.search) params.name = filters.search; // Assuming backend searches by name
    if (filters.category !== "all") params.category = filters.category;
    if (filters.merchantId !== "all") params.merchant = filters.merchantId;
    if (filters.status !== "all") params.status = filters.status;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProducts = ((productsData as any)?.data?.docs as any[]) || [];

  const products: any[] = rawProducts.map((p: any) => ({
    id: p._id,
    name: p.title || "Untitled",
    category: p.category?.name || "Uncategorized", // Assuming category population or modify as needed
    merchant: p.seller || "Unknown", // Assuming seller ID or name
    status: p.status || "draft",
    created: p.createdAt,
    price: p.price || 0,
    transactionType: p.transactionType || "purchase",
    currency: p.currency || "USD",
    availableQuantity: p.availableQuantity || 0,
    unitOfMeasurement: p.unitOfMeasurement || "unit",
  }));

  // Fetch merchants for filter
  const { data: merchantsData } = api.organizations.list.useQuery({
    query: { type: "merchant", limit: "100" },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merchantOptions = (((merchantsData as any)?.data?.docs ?? []) as any[]).map((m) => ({
    label: m.name || "Unknown",
    value: m._id || "",
  }));

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setSearchParams((prev) => {
      if (key === "dateRange") {
        if (value?.from) {
          prev.set("from", value.from.toISOString());
        } else {
          prev.delete("from");
        }
        if (value?.to) {
          prev.set("to", value.to.toISOString());
        } else {
          prev.delete("to");
        }
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
        title="Products"
        description="Manage your product inventory."
      />
      <ProductsTable
        data={products}
        isLoading={isLoading}
        filters={filters}
        merchantOptions={merchantOptions}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </Page>
  );
}
