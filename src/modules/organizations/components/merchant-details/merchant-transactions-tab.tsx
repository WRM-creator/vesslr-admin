import { api } from "@/lib/api";
import {
  type Transaction,
  TransactionsTable,
} from "@/modules/transactions/components/transactions-table";
import type { TransactionFilters } from "@/modules/transactions/components/transactions-table/filters";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface MerchantTransactionsTabProps {
  merchantId: string;
}

export function MerchantTransactionsTab({
  merchantId,
}: MerchantTransactionsTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {};

    if (filters.search) params.search = filters.search;
    params.seller = merchantId; // Using 'seller' as per implementation plan assumption
    if (filters.status && filters.status !== "all")
      params.status = filters.status;
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.paymentStatus && filters.paymentStatus !== "all")
      params.paymentStatus = filters.paymentStatus;
    if (filters.complianceStatus && filters.complianceStatus !== "all")
      params.complianceStatus = filters.complianceStatus;
    if (filters.customerId) params.customerId = filters.customerId;

    if (filters.dateRange?.from) {
      params["created[gte]"] = filters.dateRange.from.toISOString();
    }
    if (filters.dateRange?.to) {
      params["created[lte]"] = filters.dateRange.to.toISOString();
    }

    return params;
  }, [filters, merchantId]);

  const { data: transactionsData, isLoading } =
    api.admin.transactions.list.useQuery(queryParams);

  const transactions: Transaction[] = (transactionsData?.data?.docs || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc: any) => ({
      id: doc.id,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      type: "purchase", // Defaulting as API might not have this yet
      state: doc.status as Transaction["state"],
      paymentStatus: doc.paymentStatus as Transaction["paymentStatus"],
      complianceStatus: doc.complianceStatus as Transaction["complianceStatus"],
      merchant: {
        name: doc.seller?.firstName
          ? `${doc.seller.firstName} ${doc.seller.lastName}`
          : "Unknown",
      },
      customer: {
        name: doc.buyer?.firstName
          ? `${doc.buyer.firstName} ${doc.buyer.lastName}`
          : "Unknown",
      },
      value: doc.specs?.totalPrice || 0,
    }),
  );

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
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
    <div className="space-y-4">
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
