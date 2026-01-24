"use client";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { PlusIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Link } from "react-router-dom";
import { OrganizationsTable } from "../components/organizations-table";

export default function CustomersPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: 1,
      limit: 10,
      type: "customer",
      search: search || undefined,
    },
  });

  const customers = (data?.data?.docs ?? []).map((item) => ({
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
        title="Customers"
        endContent={
          <Button asChild>
            <Link to="/customers/new">
              <PlusIcon /> Create Customer
            </Link>
          </Button>
        }
      />
      <OrganizationsTable
        data={customers}
        search={search || ""}
        onSearchChange={setSearch}
        isLoading={isLoading}
        title="Customers"
      />
    </Page>
  );
}
