import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { getDisputes } from "@/lib/api/disputes";
import { useQuery } from "@tanstack/react-query";
import { DisputeStats } from "../components/dispute-stats";
import { DisputesTable } from "../components/disputes-table";

export default function DisputesPage() {
  const { data: disputesData, isLoading } = useQuery({
    queryKey: ["disputes", "list"],
    queryFn: () =>
      getDisputes({
        page: 1,
        limit: 50,
      }),
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
