"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { PlusIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Link } from "react-router-dom";
import { OrganizationsTable } from "../components/organizations-table";

export default function CustomersPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page,
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
        onRowClick={(row) =>
          window.open(`/customers/${row.original._id}`, "_self")
        }
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
