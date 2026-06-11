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

  // Provider-review cases are already approved, so they live outside the normal
  // "not yet approved" queue — fetch them by the flag instead.
  const isProviderReview = step === "provider_review";

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: String(page),
      limit: "10",
      search: search || undefined,
      onboardingStep:
        isProviderReview || step === "all" ? undefined : step,
      approved: isProviderReview ? undefined : "false",
      providerReviewPending: isProviderReview ? "true" : undefined,
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
    categories: (item.categories ?? [])
      .filter((c: any) => c && typeof c === "object" && c.name)
      .map((c: any) => c.name),
    verificationStatus: item.verificationStatus || "unverified",
    providerReviewPending: item.providerReviewPending ?? false,
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
          { label: "Selling Interests", value: "selling_interests" },
          { label: "Buying Interests", value: "buying_interests" },
          { label: "Company Documents", value: "company_documents" },
          { label: "Review", value: "review" },
          { label: "Pending Review", value: "status" },
          { label: "Provider Review", value: "provider_review" },
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
