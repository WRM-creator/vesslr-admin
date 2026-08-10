"use client";

import { TruncatedList } from "@/components/shared/truncated-list";
import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { onboardingStageLabel } from "../../lib/onboarding-stage";

export interface OrganizationTableItem {
  _id: string;
  name: string;
  email: string;
  location: string;
  categories: string[];
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  providerReviewPending: boolean;
  createdAt: string;
  onboardingStep?: string;
  lastActivityAt?: string;
}

const statusStyles: Record<
  OrganizationTableItem["verificationStatus"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  verified: "default",
  pending: "secondary",
  unverified: "outline",
  rejected: "destructive",
};

/**
 * Identity cell. Orgs mid-onboarding have no name yet; the owner's email is
 * the identity at that stage, so it promotes to the primary line rather than
 * leaving a blank cell.
 */
const identityColumn: ColumnDef<OrganizationTableItem> = {
  accessorKey: "name",
  header: "Organization",
  cell: ({ row }) =>
    row.original.name ? (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">
          {row.original.email}
        </span>
      </div>
    ) : (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.email}</span>
        <span className="text-muted-foreground text-xs">
          No company name yet
        </span>
      </div>
    ),
};

const locationColumn: ColumnDef<OrganizationTableItem> = {
  accessorKey: "location",
  header: "Location",
  cell: ({ row }) =>
    row.original.location ? (
      <span className="text-sm">{row.original.location}</span>
    ) : (
      <span className="text-muted-foreground text-xs">-</span>
    ),
};

const joinedColumn: ColumnDef<OrganizationTableItem> = {
  accessorKey: "createdAt",
  header: "Joined",
  cell: ({ row }) => (
    <span className="text-muted-foreground text-sm">
      {format(new Date(row.original.createdAt), "MMM d, yyyy")}
    </span>
  ),
};

export const columns: ColumnDef<OrganizationTableItem>[] = [
  identityColumn,
  locationColumn,
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => (
      <TruncatedList items={row.original.categories} maxVisible={2} />
    ),
  },
  {
    accessorKey: "verificationStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.verificationStatus;
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant={statusStyles[status] || "outline"}
            className="capitalize"
          >
            {status}
          </Badge>
          {row.original.providerReviewPending && (
            <Badge className="border-transparent bg-amber-500 text-white">
              Needs review
            </Badge>
          )}
        </div>
      );
    },
  },
  joinedColumn,
];

/**
 * Column set for the Onboarding lifecycle tab. Categories and verification
 * status carry no signal pre-submission; the stalled stage and staleness are
 * what an operator acts on.
 */
export const onboardingColumns: ColumnDef<OrganizationTableItem>[] = [
  identityColumn,
  locationColumn,
  {
    accessorKey: "onboardingStep",
    header: "Stage",
    cell: ({ row }) => (
      <Badge variant="outline" className={`text-xs ${TINT.gray}`}>
        {onboardingStageLabel(row.original.onboardingStep)}
      </Badge>
    ),
  },
  {
    accessorKey: "lastActivityAt",
    header: "Last activity",
    cell: ({ row }) =>
      row.original.lastActivityAt ? (
        <span className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(row.original.lastActivityAt), {
            addSuffix: true,
          })}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  joinedColumn,
];
