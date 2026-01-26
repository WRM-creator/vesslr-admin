import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { EscrowStats } from "../components/escrow-stats";
import { EscrowsTable } from "../components/escrows-table";

export default function EscrowsPage() {
  const { data: escrowsData, isLoading } = api.admin.escrows.list.useQuery({
    query: {
      page: 1,
      limit: 50,
    },
  });

  const rawEscrows = escrowsData?.data?.docs || [];
  const escrows = rawEscrows.map((e: any) => ({
    id: e._id,
    transactionReference:
      typeof e.transaction === "string"
        ? e.transaction
        : e.transaction?._id || "N/A",
    merchantName: e.seller?.firstName
      ? `${e.seller.firstName} ${e.seller.lastName}`
      : "Unknown",
    customerName: e.buyer?.firstName
      ? `${e.buyer.firstName} ${e.buyer.lastName}`
      : "Unknown",
    amount: e.totalAmountHeld || 0,
    currency: e.currency || "USD",
    status: e.status || "held",
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
