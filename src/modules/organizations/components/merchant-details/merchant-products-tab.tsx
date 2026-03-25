import { api } from "@/lib/api";
import type { AdminProductsControllerFindAllData } from "@/lib/api/generated/types.gen";
import { ProductsTable } from "@/modules/products/components/products-table";
import type { ProductFilters } from "@/modules/products/components/products-table/filters";
import type { Product } from "@/modules/products/lib/product-details-model";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";
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
    const params: NonNullable<AdminProductsControllerFindAllData["query"]> = {};

    if (filters.search) params.search = filters.search;
    if (filters.category !== "all") params.category = filters.category;
    params.merchant = merchantId;
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
    api.admin.products.list.useQuery({ query: queryParams });
  const rawProducts = productsData?.data?.docs || [];

  const products: Product[] = rawProducts.map((p) => ({
    id: p._id,
    name: p.title || "Untitled",
    category: p.category?.name || "Uncategorized",
    merchant: p.organization?.name || "Unknown",
    status: p.status === "pending" ? "pending_approval" : (p.status as Product["status"]) || "draft",
    created: p.createdAt || "",
    price: p.pricePerUnit ?? 0,
    transactionType: (p.transactionTypes?.[0]?.toLowerCase().replace(/ /g, "_") as Product["transactionType"]) || "purchase",
    currency: p.currency || "USD",
    image: p.images?.[0],
    availableQuantity: p.availableQuantity || 0,
    unitOfMeasurement: p.unitOfMeasurement || "unit",
  }));

  const handleFilterChange = (key: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]) => {
    setSearchParams((prev) => {
      if (key === "merchantId") return prev;

      if (key === "dateRange") {
        const range = value as DateRange | undefined;
        if (range?.from) {
          prev.set("from", range.from.toISOString());
        } else {
          prev.delete("from");
        }
        if (range?.to) {
          prev.set("to", range.to.toISOString());
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
