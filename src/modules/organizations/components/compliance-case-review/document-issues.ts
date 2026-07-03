/**
 * Generic issue vocabulary for flagging a provided ad-hoc document — one with no
 * fixed reason target (e.g. a bank statement or a custom request). Reason
 * `target` is a fixed enum and can't name these documents, so their issues aren't
 * structured reasons; instead they compose into the re-request's note (surfaced
 * to the applicant and persisted on the request). This mirrors the named-doc
 * FlagButton experience for documents the enum can't express.
 */
export const DOCUMENT_ISSUES: { issue: string; label: string }[] = [
  { issue: "unreadable", label: "Unreadable or poor quality" },
  { issue: "outdated", label: "Expired or outdated" },
  { issue: "incomplete", label: "Incomplete" },
  { issue: "mismatch", label: "Does not match records" },
  { issue: "wrong_document", label: "Wrong document" },
];

const LABEL_BY_ISSUE: Record<string, string> = Object.fromEntries(
  DOCUMENT_ISSUES.map((i) => [i.issue, i.label]),
);

export const documentIssueLabel = (issue: string): string =>
  LABEL_BY_ISSUE[issue] ?? issue.replace(/_/g, " ");

/**
 * Compose the re-request note from the selected issues + an optional custom note,
 * so the applicant sees why the document is being asked for again.
 */
export function composeDocRequestNote(
  issues: string[],
  customNote?: string,
): string {
  const issueText = issues.map(documentIssueLabel).join("; ");
  const custom = customNote?.trim();
  if (issueText && custom) return `${issueText}. ${custom}`;
  return issueText || custom || "";
}
