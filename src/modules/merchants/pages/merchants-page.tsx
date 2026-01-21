import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { MerchantsTable } from "../components/merchants-table";
import { MOCK_MERCHANTS } from "../lib/merchant-model";

export default function MerchantsPage() {
  return (
    <Page>
      <PageHeader
        title="Merchants"
        description="Manage merchants and their account settings."
      />

      <MerchantsTable data={MOCK_MERCHANTS} />
    </Page>
  );
}
