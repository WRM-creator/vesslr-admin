import type { StructuredReasonDto } from "@/lib/api/generated";

export type ReasonTarget = StructuredReasonDto["target"];
export type ReasonIssue = StructuredReasonDto["issue"];

export interface ReasonOption {
  target: ReasonTarget;
  issue: ReasonIssue;
  /**
   * The issue text ONLY (no document name). The document is established by the
   * surrounding context (a flag popover header, a picker group heading, or a
   * selected-item title), so it is never repeated in the option itself.
   */
  label: string;
}

export interface ReasonGroup {
  heading: string;
  options: ReasonOption[];
}

/** Friendly evidence name per reason target, used as the contextual title. */
export const TARGET_LABEL: Record<string, string> = {
  cac_certificate: "Registration certificate",
  proof_of_address: "Proof of address",
  company_name: "Company name",
  rc_number: "Registration number",
  director_id: "Director ID",
  director_info: "Director information",
  id_document: "ID document",
  selfie_liveness: "Selfie / liveness",
  proof_of_past_performance: "Proof of past performance",
  statement_of_account: "Statement of account",
  business_owners: "Directors & business owners",
  transaction_profile: "Expected transaction activity",
};

export const KYB_REASON_GROUPS: ReasonGroup[] = [
  {
    heading: "Business registration",
    options: [
      { target: "cac_certificate", issue: "unreadable", label: "Unreadable or poor quality" },
      { target: "cac_certificate", issue: "expired", label: "Expired" },
      { target: "cac_certificate", issue: "missing", label: "Not uploaded" },
      { target: "company_name", issue: "mismatch", label: "Does not match across documents" },
      { target: "rc_number", issue: "invalid", label: "Does not match the registry" },
    ],
  },
  {
    heading: "Past performance",
    options: [
      { target: "proof_of_past_performance", issue: "unreadable", label: "Unreadable or poor quality" },
      { target: "proof_of_past_performance", issue: "insufficient", label: "Does not show relevant experience" },
      { target: "proof_of_past_performance", issue: "missing", label: "Not uploaded" },
    ],
  },
  {
    heading: "Financial verification",
    options: [
      { target: "statement_of_account", issue: "unreadable", label: "Unreadable or poor quality" },
      { target: "statement_of_account", issue: "outdated", label: "Older than 6 months" },
      { target: "statement_of_account", issue: "mismatch", label: "Account name does not match" },
      { target: "statement_of_account", issue: "missing", label: "Not uploaded" },
    ],
  },
  {
    heading: "Address verification",
    options: [
      { target: "proof_of_address", issue: "unreadable", label: "Unreadable or poor quality" },
      { target: "proof_of_address", issue: "expired", label: "Expired" },
      { target: "proof_of_address", issue: "missing", label: "Not uploaded" },
      { target: "proof_of_address", issue: "mismatch", label: "Inconsistent across documents" },
    ],
  },
  {
    heading: "Directors",
    options: [
      { target: "director_id", issue: "unreadable", label: "Unreadable or poor quality" },
      { target: "director_id", issue: "expired", label: "Expired" },
      { target: "director_id", issue: "missing", label: "Not uploaded" },
      { target: "director_info", issue: "incomplete", label: "Incomplete" },
      { target: "director_info", issue: "mismatch", label: "Does not match" },
    ],
  },
  {
    heading: "People & activity",
    options: [
      // The targets the provisioning request-missing action flags; also
      // available here so a reviewer can raise them by hand. Both open real
      // editors on the customer's /verification fix view.
      { target: "business_owners", issue: "information_requested", label: "Details needed (ownership %, PEP, identification)" },
      { target: "business_owners", issue: "mismatch", label: "Does not match the registry" },
      { target: "transaction_profile", issue: "information_requested", label: "Purpose and expected monthly volume needed" },
    ],
  },
];

export const KYC_REASON_GROUPS: ReasonGroup[] = [
  {
    heading: "Identity document",
    options: [
      { target: "id_document", issue: "missing", label: "Not uploaded" },
      { target: "id_document", issue: "unreadable", label: "Unreadable or poor quality" },
      { target: "id_document", issue: "expired", label: "Expired" },
      { target: "id_document", issue: "mismatch", label: "Name does not match records" },
      { target: "id_document", issue: "invalid", label: "Number does not match records" },
    ],
  },
  {
    heading: "Selfie & liveness",
    options: [
      { target: "selfie_liveness", issue: "missing", label: "Not uploaded" },
      { target: "selfie_liveness", issue: "failed", label: "Liveness or selfie check failed" },
    ],
  },
];

export const REASON_GROUPS: Record<"KYB" | "KYC", ReasonGroup[]> = {
  KYB: KYB_REASON_GROUPS,
  KYC: KYC_REASON_GROUPS,
};

export function reasonKey(option: Pick<ReasonOption, "target" | "issue">): string {
  return `${option.target}:${option.issue}`;
}

/** All curated issues available for a given target (drawn from the groups above). */
export const ISSUES_BY_TARGET: Record<string, ReasonOption[]> = [
  ...KYB_REASON_GROUPS,
  ...KYC_REASON_GROUPS,
].reduce<Record<string, ReasonOption[]>>((acc, group) => {
  for (const option of group.options) {
    (acc[option.target] ??= []).push(option);
  }
  return acc;
}, {});

/**
 * Issues grouped by target (document), for a picker whose group heading names the
 * document so the options never repeat it. Ordered KYB targets first, then KYC.
 */
export const ISSUE_PICKER_GROUPS: {
  target: string;
  heading: string;
  options: ReasonOption[];
}[] = [
  "cac_certificate",
  "company_name",
  "rc_number",
  "proof_of_past_performance",
  "statement_of_account",
  "proof_of_address",
  "director_id",
  "director_info",
  "business_owners",
  "transaction_profile",
  "id_document",
  "selfie_liveness",
]
  .filter((target) => ISSUES_BY_TARGET[target]?.length)
  .map((target) => ({
    target,
    heading: TARGET_LABEL[target] ?? target.replace(/_/g, " "),
    options: ISSUES_BY_TARGET[target],
  }));

/** The document (target) name for a reason, for use as a contextual title. */
export function reasonTargetLabel(target: string): string {
  return TARGET_LABEL[target] ?? target.replace(/_/g, " ");
}

/** The issue-only text for a (target, issue) pair. */
export function reasonIssueLabel(target: string, issue: string): string {
  const match = ISSUES_BY_TARGET[target]?.find((o) => o.issue === issue);
  return match?.label ?? issue.replace(/_/g, " ");
}
