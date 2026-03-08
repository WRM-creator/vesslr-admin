import type { StructuredReasonDto } from "@/lib/api/generated";

export type ReasonTarget = StructuredReasonDto["target"];
export type ReasonIssue = StructuredReasonDto["issue"];

export interface ReasonOption {
  target: ReasonTarget;
  issue: ReasonIssue;
  label: string;
}

export interface ReasonGroup {
  heading: string;
  options: ReasonOption[];
}

export const KYB_REASON_GROUPS: ReasonGroup[] = [
  {
    heading: "Business Registration",
    options: [
      {
        target: "cac_certificate",
        issue: "unreadable",
        label: "CAC Certificate — unreadable or poor quality",
      },
      {
        target: "cac_certificate",
        issue: "expired",
        label: "CAC Certificate — expired",
      },
      {
        target: "cac_certificate",
        issue: "missing",
        label: "CAC Certificate — not uploaded",
      },
      {
        target: "company_name",
        issue: "mismatch",
        label: "Company name — mismatch between documents",
      },
      {
        target: "rc_number",
        issue: "invalid",
        label: "RC Number — does not match registry",
      },
    ],
  },
  {
    heading: "Address Verification",
    options: [
      {
        target: "proof_of_address",
        issue: "unreadable",
        label: "Proof of address — unreadable or poor quality",
      },
      {
        target: "proof_of_address",
        issue: "expired",
        label: "Proof of address — expired",
      },
      {
        target: "proof_of_address",
        issue: "missing",
        label: "Proof of address — not uploaded",
      },
      {
        target: "proof_of_address",
        issue: "mismatch",
        label: "Address — inconsistency between documents",
      },
    ],
  },
  {
    heading: "Directors",
    options: [
      {
        target: "director_id",
        issue: "unreadable",
        label: "Director ID — unreadable or poor quality",
      },
      {
        target: "director_id",
        issue: "expired",
        label: "Director ID — expired",
      },
      {
        target: "director_id",
        issue: "missing",
        label: "Director ID — not uploaded",
      },
      {
        target: "director_info",
        issue: "incomplete",
        label: "Director information — incomplete",
      },
      {
        target: "director_info",
        issue: "mismatch",
        label: "Director information — mismatch",
      },
    ],
  },
];

export const KYC_REASON_GROUPS: ReasonGroup[] = [
  {
    heading: "Identity Document",
    options: [
      {
        target: "id_document",
        issue: "unreadable",
        label: "ID document — unreadable or poor quality",
      },
      {
        target: "id_document",
        issue: "expired",
        label: "ID document — expired",
      },
      {
        target: "id_document",
        issue: "mismatch",
        label: "ID document — name does not match records",
      },
      {
        target: "id_document",
        issue: "invalid",
        label: "ID number — does not match records",
      },
    ],
  },
  {
    heading: "Selfie & Liveness",
    options: [
      {
        target: "selfie_liveness",
        issue: "failed",
        label: "Liveness or selfie check failed — redo required",
      },
    ],
  },
];

export const REASON_GROUPS: Record<"KYB" | "KYC", ReasonGroup[]> = {
  KYB: KYB_REASON_GROUPS,
  KYC: KYC_REASON_GROUPS,
};

export function reasonKey(option: ReasonOption): string {
  return `${option.target}:${option.issue}`;
}
