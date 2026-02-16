import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { useQueryState } from "nuqs";
import { RequestsTable } from "../components/requests-table";

export default function RequestsPage() {
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("limit", { defaultValue: "10" });
  const [status] = useQueryState("status");
  const [search] = useQueryState("search");

  const query = {
    page,
    limit,
    status: status || undefined,
    // search: search || undefined, // API might not support search yet, check controller
  };

  const { data, isLoading } = api.admin.requests.list.useQuery({
    query: query as any,
  });
  const requests = (data as any)?.data?.docs || [];
  const pageCount = (data as any)?.data?.totalPages || 0;

  return (
    <Page>
      <PageHeader
        title="Requests"
        description="Manage and monitor all incoming requests."
      />
      <div className="flex-1">
        <RequestsTable
          data={requests}
          isLoading={isLoading}
          pageCount={pageCount}
        />
      </div>
    </Page>
  );
}
