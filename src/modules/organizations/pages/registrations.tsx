"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import { OrganizationsTable } from "../components/organizations-table";

export default function PendingApprovalsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const [step, setStep] = useQueryState(
    "step",
    parseAsString.withDefault("status"),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: String(page),
      limit: "10",
      search: search || undefined,
      onboardingStep: step === "all" ? undefined : step,
      approved: "false",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData = (data as any)?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organizations = (responseData?.docs ?? []).map((item: any) => ({
    _id: item._id!,
    name: item.name!,
    email: item.email!,
    location: [item.address?.state?.name, item.address?.country?.name]
      .filter(Boolean)
      .join(", "),
    categories: [
      ...new Map(
        (item.categories ?? [])
          .map((c: any) => c?.group)
          .filter((g: any) => g && typeof g === "object" && g._id)
          .map((g: any) => [String(g._id), g.name]),
      ).values(),
    ],
    verificationStatus: item.verificationStatus || "unverified",
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
          { label: "All", value: "all" },
          { label: "Identity KYC", value: "identity_kyc" },
          { label: "Residential", value: "residential" },
          { label: "Company Info", value: "company_info" },
          { label: "Product Categories", value: "product_categories" },
          { label: "Company Documents", value: "company_documents" },
          { label: "Review", value: "review" },
          { label: "Pending Review", value: "status" },
          { label: "Complete", value: "complete" },
        ]}
        activeTab={step}
        onTabChange={setStep}
        onRowClick={(row) => {
          navigate(`/registrations/${row.original._id}`, {
            state: { name: row.original.name },
          });
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
