import type { StatusVariant } from "@/components/shared/status-badge";

export type ComplianceStatus =
  | "draft"
  | "submitted"
  | "pending_review"
  | "action_required"
  | "approved";

/** Map a composite compliance status to a status-pill tint. */
export const STATUS_VARIANT: Record<ComplianceStatus, StatusVariant> = {
  draft: "neutral",
  submitted: "info",
  pending_review: "info",
  action_required: "warning",
  approved: "success",
};

/** Human-readable label for a compliance status. */
export const STATUS_LABEL: Record<ComplianceStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  pending_review: "Awaiting review",
  action_required: "Action requested",
  approved: "Approved",
};
