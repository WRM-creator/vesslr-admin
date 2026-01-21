import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { DisputesTable } from "../components/disputes-table";
import { MOCK_DISPUTES } from "../lib/dispute-model";

export default function DisputesPage() {
  return (
    <Page>
      <PageHeader
        title="Disputes"
        description="Manage and resolve transaction disputes."
      />
      <DisputesTable data={MOCK_DISPUTES} />
    </Page>
  );
}
