"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { OrganizationsTable } from "../components/organizations-table";

export default function PendingApprovalsPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("merchant"),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page,
      limit: 10,
      verificationStatus: "pending",
      search: search || undefined,
      type: type === "all" ? undefined : (type as any),
    },
  });

  const organizations = (data?.data?.docs ?? []).map((item) => ({
    _id: item._id!,
    name: item.name!,
    email: item.email!,
    verificationStatus: (item.verificationStatus as any) || "unverified",
    industrySectors: item.industrySectors || [],
    createdAt: item.createdAt!,
  }));

  return (
    <Page>
      <PageHeader title="Registrations" />
      <OrganizationsTable
        data={organizations}
        search={search || ""}
        onSearchChange={setSearch}
        isLoading={isLoading}
        title="Registrations"
        tabs={[
          { label: "Merchants", value: "merchant" },
          { label: "Customers", value: "customer" },
        ]}
        activeTab={type}
        onTabChange={setType}
        onRowClick={(row) => {
          // Determine path based on type if needed, or row data.
          // Assuming row has enough info or we can use the current type filter.
          // Since we know the active tab, we can route accordingly.
          // Or better: the row itself might tell us the type if we added it effectively,
          // but for now relying on the tab context is safe if the list is filtered.
          // However, to be robust, let's use the type from state or assume 'merchants'/'customers' route.
          const route = type === "customer" ? "customers" : "merchants";
          window.open(`/${route}/${row.original._id}/compliance`, "_self");
        }}
      />
      <DataPagination
        currentPage={page}
        totalItems={data?.data?.totalDocs || 0}
        itemsPerPage={10}
        onPageChange={setPage}
      />
    </Page>
  );
}
