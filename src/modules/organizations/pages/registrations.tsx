"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { parseAsString, useQueryState } from "nuqs";
import { OrganizationsTable } from "../components/organizations-table";

export default function PendingApprovalsPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: 1,
      limit: 10,
      verificationStatus: "pending",
      search: search || undefined,
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
      />
    </Page>
  );
}
