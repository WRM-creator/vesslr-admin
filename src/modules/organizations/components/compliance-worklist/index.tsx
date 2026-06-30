import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type {
  ComplianceCaseListItemDto,
  ComplianceCaseListResponseDto,
} from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import type { Row } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { columns } from "./columns";

/** Unwrap the `{ message, data }` response envelope to the typed payload. */
function unwrap(
  data: unknown,
): ComplianceCaseListResponseDto | undefined {
  return (data as { data?: ComplianceCaseListResponseDto } | undefined)?.data;
}

export interface WorklistTab {
  label: string;
  value: string;
  /** Query params that scope the worklist to this tab. */
  query: Record<string, string>;
}

/**
 * Status-first reviewer worklist. Tabs map to the review states an admin acts on
 * (not the onboarding funnel): cases awaiting review, those we've sent back, those
 * a provider declined post-approval, and the approved archive.
 */
export const WORKLIST_TABS: WorklistTab[] = [
  { label: "Needs review", value: "needs_review", query: { status: "pending_review" } },
  { label: "Action requested", value: "action_required", query: { status: "action_required" } },
  { label: "Provider review", value: "provider_review", query: { providerReviewPending: "true" } },
  { label: "Approved", value: "approved", query: { status: "approved" } },
];

/** Self-contained count badge for a tab (lightweight totalDocs probe). */
function TabCount({ query }: { query: Record<string, string> }) {
  const { data } = api.admin.compliance.cases.useQuery({
    query: { ...query, limit: "1" },
  });
  const total = unwrap(data)?.totalDocs;
  if (total === undefined) return null;
  return (
    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
      {total}
    </Badge>
  );
}

interface ComplianceWorklistProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  data: ComplianceCaseListItemDto[];
  isLoading?: boolean;
  onRowClick: (row: Row<ComplianceCaseListItemDto>) => void;
}

export function ComplianceWorklist({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  data,
  isLoading,
  onRowClick,
}: ComplianceWorklistProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {WORKLIST_TABS.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {tab.label}
                <TabCount query={tab.query} />
              </button>
            );
          })}
        </div>
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search organizations..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />
    </div>
  );
}
