"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { OrganizationsTable } from "../components/organizations-table";

const TABS = [
  { label: "All", value: "all" },
  { label: "Merchants", value: "merchant" },
  { label: "Customers", value: "customer" },
];

export default function OrganizationsPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [type, setType] = useQueryState("type", parseAsString.withDefault("all"));

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: String(page),
      limit: "10",
      type: type === "all" ? undefined : (type as "merchant" | "customer"),
      search: search || undefined,
      approved: "true",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData = (data as any)?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organizations = (responseData?.docs ?? []).map((item: any) => ({
    _id: item._id,
    name: item.name,
    email: item.email,
    location: [item.address?.state?.name, item.address?.country?.name]
      .filter(Boolean)
      .join(", "),
    categories: [
      ...new Map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item.categories ?? [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((c: any) => c?.group)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((g: any) => g && typeof g === "object" && g._id)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((g: any) => [String(g._id), g.name])
      ).values(),
    ],
    verificationStatus: item.verificationStatus || "unverified",
    createdAt: item.createdAt,
  }));

  return (
    <Page>
      <PageHeader title="Organizations" />
      <OrganizationsTable
        data={organizations}
        search={search || ""}
        onSearchChange={setSearch}
        isLoading={isLoading}
        title="Organizations"
        onRowClick={(row) =>
          window.open(`/organizations/${row.original._id}`, "_self")
        }
        tabs={TABS}
        activeTab={type}
        onTabChange={(value) => {
          setType(value);
          setPage(1);
        }}
      />
      <DataPagination
        currentPage={page}
        totalItems={responseData?.totalDocs || 0}
        itemsPerPage={10}
        onPageChange={setPage}
      />
    </Page>
  );
}
