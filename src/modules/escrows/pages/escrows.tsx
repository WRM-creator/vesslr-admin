import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { EscrowStats } from "../components/escrow-stats";
import { EscrowsTable } from "../components/escrows-table";

export default function EscrowsPage() {
  const { data, isLoading } = api.admin.escrows.list.useQuery({});

  const paginatedData = data as unknown as {
    data?: {
      docs?: any[];
      totalDocs?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  } | undefined;

  const escrows = (paginatedData?.data?.docs ?? []).map((e: any) => ({
    id: e._id,
    transactionDisplayId: e.transaction?.displayId,
    transactionId: e.transaction?._id,
    transactionStatus: e.transaction?.status,
    sellerName: e.sellerOrganization?.name || "Unknown",
    buyerName: e.buyerOrganization?.name || "Unknown",
    productTitle: e.productTitle,
    amount: e.amount || 0,
    sellerAmount: e.sellerAmount || 0,
    serviceFeeAmount: e.serviceFeeAmount || 0,
    currency: e.currency || "NGN",
    status: e.status || "FUNDED",
    referenceId: e.referenceId,
    fundedAt: e.fundedAt,
    releasedAt: e.releasedAt,
    refundedAt: e.refundedAt,
    createdAt: e.createdAt || new Date().toISOString(),
  }));

  return (
    <Page>
      <PageHeader
        title="Escrows"
        description="Manage escrow transactions and disputes."
      />
      <EscrowStats />
      <EscrowsTable data={escrows} isLoading={isLoading} />
    </Page>
  );
}
