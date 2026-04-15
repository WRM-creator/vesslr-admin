import type { EntryType, AccountType, ReconciliationStatus, DiscrepancyIssue } from "./types";

// ── Entry type labels ─────────────────────────────────────────

const entryTypeLabels: Record<string, string> = {
  ESCROW_FUND: "Escrow Funded",
  ESCROW_RELEASE: "Escrow Released",
  ESCROW_RELEASE_CONFIRM: "Release Confirmed",
  ESCROW_RELEASE_FAIL: "Release Failed",
  ESCROW_REFUND: "Escrow Refund",
  ESCROW_REFUND_CONFIRM: "Refund Confirmed",
  ESCROW_REFUND_FAIL: "Refund Failed",
  ESCROW_PARTIAL_REFUND_BUYER: "Partial Refund (Buyer)",
  ESCROW_PARTIAL_REFUND_SELLER: "Partial Refund (Seller)",
  ESCROW_PARTIAL_CONFIRM_BUYER: "Partial Confirm (Buyer)",
  ESCROW_PARTIAL_CONFIRM_SELLER: "Partial Confirm (Seller)",
  ESCROW_DECREMENT: "Escrow Decrement",
  WALLET_FUND: "Wallet Funded",
  WALLET_DISBURSE: "Disbursement",
  WALLET_TO_ESCROW: "Wallet → Escrow",
  ESCROW_MILESTONE_RELEASE: "Milestone Release",
  ESCROW_MILESTONE_RELEASE_CONFIRM: "Milestone Confirmed",
  ESCROW_MILESTONE_RELEASE_FAIL: "Milestone Failed",
  ESCROW_MILESTONE_FEE_CAPTURE: "Milestone Fee Capture",
  PLATFORM_FEE_CAPTURE: "Fee Captured",
  INVOICE_PAYMENT: "Invoice Payment",
  REVERSAL: "Reversal",
  MANUAL_ADJUSTMENT: "Manual Adjustment",
};

export function getEntryTypeLabel(type: EntryType | string): string {
  return entryTypeLabels[type] ?? type.replace(/_/g, " ");
}

// ── Account type display ──────────────────────────────────────

const accountTypeColors: Record<AccountType, { bg: string; text: string }> = {
  ASSET: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  LIABILITY: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  EQUITY: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  REVENUE: { bg: "bg-green-50 border-green-200", text: "text-green-700" },
  EXPENSE: { bg: "bg-red-50 border-red-200", text: "text-red-700" },
};

export function getAccountTypeStyle(type: AccountType) {
  return accountTypeColors[type] ?? accountTypeColors.ASSET;
}

// ── Reconciliation status ─────────────────────────────────────

export function getReconStatusVariant(status: ReconciliationStatus) {
  switch (status) {
    case "CLEAN":
      return { label: "Clean", variant: "success" as const };
    case "DISCREPANCIES_FOUND":
      return { label: "Discrepancies Found", variant: "warning" as const };
    case "DISCREPANCIES_BACKFILLED":
      return { label: "Backfilled", variant: "info" as const };
  }
}

export function getDiscrepancyIssueLabel(issue: DiscrepancyIssue): string {
  switch (issue) {
    case "MISSING_ENTRY":
      return "Missing Entry";
    case "AMOUNT_MISMATCH":
      return "Amount Mismatch";
    case "UNRESOLVABLE":
      return "Unresolvable";
  }
}

// ── Formatting helpers ────────────────────────────────────────

export function formatAccountCode(code: string): string {
  // Make ORG:{id}:WALLET more readable
  const match = code.match(/^ORG:([a-f0-9]+):(.+)$/);
  if (match) {
    return `${match[2]} (${match[1].slice(0, 8)}…)`;
  }
  return code.replace(/:/g, " › ");
}

export function getTotalAmount(lines: { debit: number; credit: number }[]): number {
  return lines.reduce((sum, line) => sum + line.debit, 0);
}
