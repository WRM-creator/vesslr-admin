import { api } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TransactionsTable,
} from "@/modules/transactions/components/transactions-table";
import type { TransactionFilters } from "@/modules/transactions/components/transactions-table/filters";
import {
  type AdminTransactionsControllerFindAllData,
  type TransactionResponseDto,
} from "@/lib/api/generated";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface MerchantTransactionsTabProps {
  merchantId: string;
}

/** Which side of the trade the org is on; both lists exist for every org. */
type TradeSide = "seller" | "buyer";

export function MerchantTransactionsTab({
  merchantId,
}: MerchantTransactionsTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const side: TradeSide =
    searchParams.get("side") === "buyer" ? "buyer" : "seller";

  const filters: TransactionFilters = useMemo(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    return {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      merchantId: merchantId,
      customerId: searchParams.get("customerId") || "",
      type: searchParams.get("type") || "all",
      paymentStatus: searchParams.get("paymentStatus") || "all",
      complianceStatus: searchParams.get("complianceStatus") || "all",
      dateRange:
        from && to
          ? { from: new Date(from), to: new Date(to) }
          : from
            ? { from: new Date(from), to: undefined }
            : undefined,
    };
  }, [searchParams, merchantId]);

  const queryParams = useMemo(() => {
    const query: NonNullable<AdminTransactionsControllerFindAllData["query"]> =
      side === "buyer" ? { buyer: merchantId } : { seller: merchantId };

    if (filters.search) query.search = filters.search;
    if (filters.status && filters.status !== "all")
      query.status = filters.status;

    return { query };
  }, [filters, merchantId, side]);

  const { data: transactionsData, isLoading } =
    api.admin.transactions.list.useQuery(queryParams);

  const transactions: TransactionResponseDto[] =
    (transactionsData?.data?.docs as TransactionResponseDto[]) || [];

  const handleFilterChange = (
    key: keyof TransactionFilters,
    value: TransactionFilters[keyof TransactionFilters],
  ) => {
    setSearchParams((prev) => {
      if (key === "dateRange") {
        const range = value as TransactionFilters["dateRange"];
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

  const handleSideChange = (value: string) => {
    setSearchParams((prev) => {
      if (value === "buyer") {
        prev.set("side", "buyer");
      } else {
        prev.delete("side");
      }
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams(side === "buyer" ? { side: "buyer" } : {});
  };

  return (
    <div className="space-y-4">
      <Tabs value={side} onValueChange={handleSideChange}>
        <TabsList>
          <TabsTrigger value="seller">As seller</TabsTrigger>
          <TabsTrigger value="buyer">As buyer</TabsTrigger>
        </TabsList>
      </Tabs>
      <TransactionsTable
        data={transactions}
        isLoading={isLoading}
        filters={filters}
        merchantOptions={[]}
        hiddenFilters={["merchantId"]}
        hiddenColumns={["merchant.name"]}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </div>
  );
}
