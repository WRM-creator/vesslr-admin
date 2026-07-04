import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { DisputeStats } from "../components/dispute-stats";
import { DisputesTable } from "../components/disputes-table";

export default function DisputesPage() {
  const { data: disputesData, isLoading } = api.admin.disputes.list.useQuery({
    query: {
      page: "1",
      limit: "50",
    },
  });

  return (
    <Page>
      <PageHeader
        title="Disputes"
        description="Monitor and resolve transaction disputes."
      />

      <DisputeStats />

      <DisputesTable
        data={disputesData?.data?.docs || []}
        isLoading={isLoading}
      />
    </Page>
  );
}
