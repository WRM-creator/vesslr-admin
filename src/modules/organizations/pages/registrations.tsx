"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import type { ComplianceCaseListResponseDto } from "@/lib/api/generated";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import {
  ComplianceWorklist,
  WORKLIST_TABS,
} from "../components/compliance-worklist";

const DEFAULT_TAB = WORKLIST_TABS[0].value;

/** Unwrap the `{ message, data }` response envelope to the typed payload. */
function unwrap(
  data: unknown,
): ComplianceCaseListResponseDto | undefined {
  return (data as { data?: ComplianceCaseListResponseDto } | undefined)?.data;
}

export default function RegistrationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault(DEFAULT_TAB),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const activeTab =
    WORKLIST_TABS.find((t) => t.value === tab) ?? WORKLIST_TABS[0];

  const { data, isLoading } = api.admin.compliance.cases.useQuery({
    query: {
      ...activeTab.query,
      page: String(page),
      limit: "10",
      search: search || undefined,
    },
  });

  const payload = unwrap(data);
  const cases = payload?.docs ?? [];

  return (
    <Page>
      <PageHeader
        title="Compliance Review"
        description="Review and approve organizations onboarding to Vesslr."
      />
      <ComplianceWorklist
        activeTab={activeTab.value}
        onTabChange={(value) => {
          setTab(value);
          setPage(1);
        }}
        search={search || ""}
        onSearchChange={setSearch}
        data={cases}
        isLoading={isLoading}
        onRowClick={(row) => {
          navigate(`/registrations/${row.original.organizationId}`, {
            state: { name: row.original.organizationName },
          });
        }}
      />
      <DataPagination
        currentPage={page}
        totalItems={payload?.totalDocs || 0}
        itemsPerPage={10}
        onPageChange={setPage}
      />
    </Page>
  );
}
