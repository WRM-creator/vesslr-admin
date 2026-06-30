import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import type { ComplianceCaseListItemDto } from "@/lib/api/generated";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import { CorridorBadge } from "../corridor-badge";
import {
  STATUS_LABEL,
  STATUS_VARIANT,
  type ComplianceStatus,
} from "./status";

const STALE_AFTER_DAYS = 3;

function waitingSince(item: ComplianceCaseListItemDto): {
  label: string;
  isStale: boolean;
} | null {
  const raw = item.submittedAt ?? item.createdAt;
  if (!raw) return null;
  const date = new Date(raw);
  const ageMs = Date.now() - date.getTime();
  return {
    label: `${formatDistanceToNowStrict(date)} ago`,
    isStale: ageMs > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000,
  };
}

export const columns: ColumnDef<ComplianceCaseListItemDto>[] = [
  {
    accessorKey: "organizationName",
    header: "Organization",
    cell: ({ row }) => {
      const submitter = row.original.submittedByUser;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.organizationName}</span>
          {submitter?.email && (
            <span className="text-muted-foreground text-xs">
              {submitter.email}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "countryCode",
    header: "Country",
    cell: ({ row }) =>
      row.original.countryCode ? (
        <span className="text-sm font-medium">{row.original.countryCode}</span>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  {
    accessorKey: "verificationMode",
    header: "Corridor",
    cell: ({ row }) => <CorridorBadge mode={row.original.verificationMode} />,
  },
  {
    accessorKey: "complianceStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.complianceStatus as ComplianceStatus;
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge
            status={STATUS_LABEL[status] ?? status}
            variant={STATUS_VARIANT[status] ?? "neutral"}
          />
          {row.original.providerReviewPending && (
            <Badge variant="outline" className={TINT.amber}>
              Provider review
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "waiting",
    header: "Waiting",
    cell: ({ row }) => {
      const waiting = waitingSince(row.original);
      if (!waiting) {
        return <span className="text-muted-foreground text-xs">-</span>;
      }
      return (
        <span
          className={
            waiting.isStale
              ? "text-destructive text-sm font-medium"
              : "text-muted-foreground text-sm"
          }
        >
          {waiting.label}
        </span>
      );
    },
  },
];
