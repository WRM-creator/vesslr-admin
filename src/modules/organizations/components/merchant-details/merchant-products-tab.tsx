import { api } from "@/lib/api";
import { ProductsTable } from "@/modules/products/components/products-table";
import type { ProductFilters } from "@/modules/products/components/products-table/filters";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface MerchantProductsTabProps {
  merchantId: string;
}

export function MerchantProductsTab({ merchantId }: MerchantProductsTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = useMemo(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    return {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      merchantId: merchantId,
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
  }, [searchParams, merchantId]);

  // Transform UI filters to API query params
  const queryParams = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {};

    if (filters.search) params.name = filters.search;
    if (filters.category !== "all") params.category = filters.category;
    params.seller = merchantId;
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
  }, [filters, merchantId]);

  const { data: productsData, isLoading } =
    api.products.list.useQuery(queryParams);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (productsData as any)?.data || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setSearchParams((prev) => {
      // Don't allow changing merchantId via UI just in case
      if (key === "merchantId") return prev;

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
    <div className="space-y-4">
      <ProductsTable
        data={products}
        isLoading={isLoading}
        filters={filters}
        merchantOptions={[]}
        hiddenFilters={["merchantId"]}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </div>
  );
}
