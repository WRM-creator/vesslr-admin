/**
 * Reviewer-checklist definitions for MANUAL corridors, mirroring the backend's
 * canonical keys in api `compliance/review-checklist.ts`. Keys MUST stay in sync —
 * the backend validates them on the review payload. Ticking every item gates the
 * Approve action; the ticked list is persisted to the compliance audit trail.
 */
import type { ReviewChecklistItemDto } from "@/lib/api/generated";

export interface ChecklistItemDefinition {
  key: ReviewChecklistItemDto["key"];
  label: string;
}

export const KYC_REVIEW_CHECKLIST: ChecklistItemDefinition[] = [
  { key: "selfie_matches_id", label: "Selfie matches the ID photo" },
  { key: "id_legible", label: "ID document is legible" },
  { key: "id_unexpired", label: "ID is not expired" },
  { key: "name_matches", label: "Name matches the application" },
];

export const KYB_REVIEW_CHECKLIST: ChecklistItemDefinition[] = [
  { key: "cert_legible", label: "Registration certificate is legible and valid" },
  { key: "company_name_matches", label: "Company name matches the application" },
  { key: "address_matches", label: "Registered address matches the evidence" },
];
