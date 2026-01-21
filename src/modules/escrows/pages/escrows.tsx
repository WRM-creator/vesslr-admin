import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { EscrowsTable } from "../components/escrows-table";
import { MOCK_ESCROWS } from "../lib/escrow-model";

export default function EscrowsPage() {
  return (
    <Page>
      <PageHeader
        title="Escrows"
        description="Manage escrow transactions and disputes."
      />
      <EscrowsTable data={MOCK_ESCROWS} />
    </Page>
  );
}
