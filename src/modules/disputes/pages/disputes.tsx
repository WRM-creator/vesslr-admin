import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { getDisputes } from "@/lib/api/disputes";
import { useQuery } from "@tanstack/react-query";
import { DisputeStats } from "../components/dispute-stats";
import { DisputesTable } from "../components/disputes-table";

export default function DisputesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["disputes"],
    queryFn: () => getDisputes({ page: 1, limit: 10 }), // TODO: Add pagination state
  });

  return (
    <Page>
      <PageHeader
        title="Disputes"
        description="Manage and resolve transaction disputes."
      />
      <DisputeStats />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DisputesTable data={data?.data.docs || []} />
      )}
    </Page>
  );
}
