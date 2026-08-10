"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { OrganizationsTable } from "../components/organizations-table";
import { columns, onboardingColumns } from "../components/organizations-table/columns";

const TYPE_TABS = [
  { label: "All types", value: "all" },
  { label: "Sellers", value: "buyer_seller" },
  { label: "Buyers", value: "buyer" },
];

/**
 * Primary segmentation is the owner's lifecycle stage, so the registry covers
 * every org from signup onward. Participant type is the secondary filter.
 */
const LIFECYCLE_TABS = [
  { label: "Active", value: "active" },
  { label: "Onboarding", value: "onboarding" },
  { label: "In review", value: "in_review" },
  { label: "All", value: "all" },
];

function lifecycleQuery(lifecycle: string) {
  return lifecycle === "all"
    ? {}
    : { lifecycle: lifecycle as "active" | "onboarding" | "in_review" };
}

/** Lightweight totalDocs probe so each lifecycle tab carries its count. */
function LifecycleTabCount({ lifecycle }: { lifecycle: string }) {
  const { data } = api.organizations.list.useQuery({
    query: { page: "1", limit: "1", ...lifecycleQuery(lifecycle) },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = (data as any)?.data?.totalDocs;
  if (total === undefined) return null;
  return (
    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
      {total}
    </Badge>
  );
}

export default function OrganizationsPage() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ throttleMs: 500 }),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [type, setType] = useQueryState("type", parseAsString.withDefault("all"));

  const [lifecycle, setLifecycle] = useQueryState(
    "lifecycle",
    parseAsString.withDefault("active"),
  );

  const { data, isLoading } = api.organizations.list.useQuery({
    query: {
      page: String(page),
      limit: "10",
      type: type === "all" ? undefined : (type as "buyer" | "buyer_seller"),
      search: search || undefined,
      ...lifecycleQuery(lifecycle),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: (item.categories ?? [])
      .filter((c: any) => c && typeof c === "object" && c.name)
      .map((c: any) => c.name),
    verificationStatus: item.verificationStatus || "unverified",
    providerReviewPending: item.providerReviewPending === true,
    createdAt: item.createdAt,
    onboardingStep: item.onboardingStep,
    lastActivityAt: item.lastActivityAt,
  }));

  return (
    <Page>
      <PageHeader title="Organizations" />
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {LIFECYCLE_TABS.map((tab) => {
          const isActive = tab.value === lifecycle;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setLifecycle(tab.value);
                setPage(1);
              }}
              className={cn(
                "flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {tab.label}
              <LifecycleTabCount lifecycle={tab.value} />
            </button>
          );
        })}
      </div>
      <OrganizationsTable
        data={organizations}
        columns={lifecycle === "onboarding" ? onboardingColumns : columns}
        search={search || ""}
        onSearchChange={setSearch}
        isLoading={isLoading}
        title="Organizations"
        onRowClick={(row) =>
          window.open(`/organizations/${row.original._id}`, "_self")
        }
        tabs={TYPE_TABS}
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
