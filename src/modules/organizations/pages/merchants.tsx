"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { PlusIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Link } from "react-router-dom";
import { OrganizationsTable } from "../components/organizations-table";

export default function MerchantsPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: 1,
      limit: 10,
      type: "merchant",
      search: search || undefined,
    },
  });

  const merchants = (data?.data?.docs ?? []).map((item) => ({
    _id: item._id!,
    name: item.name!,
    email: item.email!,
    verificationStatus: (item.verificationStatus as any) || "unverified",
    industrySectors: item.industrySectors || [],
    createdAt: item.createdAt!,
  }));

  return (
    <Page>
      <PageHeader
        title="Merchants"
        endContent={
          <Button asChild>
            <Link to="/merchants/new">
              <PlusIcon /> Create Merchant
            </Link>
          </Button>
        }
      />
      <OrganizationsTable
        data={merchants}
        search={search || ""}
        onSearchChange={setSearch}
        isLoading={isLoading}
        title="Merchants"
        onRowClick={(row) =>
          window.open(`/merchants/${row.original._id}`, "_self")
        }
      />
    </Page>
  );
}
