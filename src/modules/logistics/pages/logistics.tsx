import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { FulfillmentsTable } from "../components/fulfillments-table";
import { MOCK_FULFILLMENTS } from "../lib/fulfillment-model";

export default function LogisticsPage() {
  return (
    <Page>
      <PageHeader
        title="Logistics & Fulfilments"
        description="Manage shipping, deliveries, and order fulfilments."
      />
      <FulfillmentsTable data={MOCK_FULFILLMENTS} />
    </Page>
  );
}
