import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductsTable } from "../components/products-table";
import type { ProductFilters } from "../components/products-table/filters";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const isPending = tab === "pending";

  const filters: ProductFilters = useMemo(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    return {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      merchantId: searchParams.get("merchantId") || "all",
      status: isPending ? "pending" : searchParams.get("status") || "all",
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
  }, [searchParams, isPending]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: String(page),
      limit: "10",
    };
    if (filters.search) params.search = filters.search;
    if (filters.category !== "all") params.category = filters.category;
    if (filters.merchantId !== "all") params.merchant = filters.merchantId;
    if (isPending) {
      params.status = "pending";
    } else if (filters.status !== "all") {
      params.status = filters.status;
    }
    if (filters.transactionType !== "all")
      params.transactionType = filters.transactionType;
    if (filters.minPrice) params["price[gte]"] = filters.minPrice;
    if (filters.maxPrice) params["price[lte]"] = filters.maxPrice;
    if (filters.dateRange?.from)
      params["created[gte]"] = filters.dateRange.from.toISOString();
    if (filters.dateRange?.to)
      params["created[lte]"] = filters.dateRange.to.toISOString();
    return params;
  }, [filters, isPending, page]);

  const { data: productsData, isLoading } = api.admin.products.list.useQuery({
    query: queryParams,
  });

  const { data: pendingCountData } = api.admin.products.list.useQuery({
    query: { status: "pending", limit: "1", page: "1" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProducts = ((productsData as any)?.data?.docs as any[]) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalDocs = (productsData as any)?.data?.totalDocs || 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingCount = (pendingCountData as any)?.data?.totalDocs || 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: any[] = rawProducts.map((p: any) => ({
    id: p._id,
    name: p.title || "Untitled",
    category: p.category?.name || "Uncategorized",
    merchant: p.seller?.name || p.organization?.name || "Unknown",
    status: p.status === "pending" ? "pending_approval" : p.status || "draft",
    created: p.createdAt,
    price: p.price ?? p.pricePerUnit ?? 0,
    transactionType: p.transactionType || p.transactionTypes?.[0] || "purchase",
    currency: p.currency || "USD",
    image: p.image,
    availableQuantity: p.availableQuantity || 0,
    unitOfMeasurement: p.unitOfMeasurement || "unit",
  }));

  const { data: merchantsData } = api.organizations.list.useQuery({
    query: { type: "merchant", limit: "100" },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merchantOptions = (
    ((merchantsData as any)?.data?.docs ?? []) as any[]
  ).map((m: any) => ({
    label: m.name || "Unknown",
    value: m._id || "",
  }));

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    if (isPending && key === "status") return;
    setSearchParams((prev) => {
      prev.delete("page");
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
    setSearchParams((prev) => {
      const currentTab = prev.get("tab");
      const next = new URLSearchParams();
      if (currentTab) next.set("tab", currentTab);
      return next;
    });
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handlePageChange = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  return (
    <Page>
      <PageHeader title="Products" description="Manage your product inventory." />
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending Approval
            {pendingCount > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-4">
        <ProductsTable
          data={products}
          isLoading={isLoading}
          filters={filters}
          merchantOptions={merchantOptions}
          hiddenFilters={isPending ? ["status"] : []}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onRowClick={
            isPending
              ? (row: any) =>
                  navigate(`/products/${row.original.id}?tab=compliance`)
              : undefined
          }
        />
        <DataPagination
          currentPage={page}
          totalItems={totalDocs}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      </div>
    </Page>
  );
}
