// ── Account types ──────────────────────────────────────────────

export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
export type EntityType = "PLATFORM" | "ORGANIZATION" | "EXTERNAL";

export interface LedgerAccount {
  accountCode: string;
  accountType: AccountType;
  entityType: EntityType;
  entityId: string | null;
  description: string;
  currency: string;
  isActive: boolean;
  balance: number; // minor units
  internalReconciledUpTo: string | null;
  externalReconciledUpTo: string | null;
}

// ── Journal entry types ───────────────────────────────────────

export type EntryType =
  | "ESCROW_FUND"
  | "ESCROW_RELEASE"
  | "ESCROW_RELEASE_CONFIRM"
  | "ESCROW_RELEASE_FAIL"
  | "ESCROW_REFUND"
  | "ESCROW_REFUND_CONFIRM"
  | "ESCROW_REFUND_FAIL"
  | "ESCROW_PARTIAL_REFUND_BUYER"
  | "ESCROW_PARTIAL_REFUND_SELLER"
  | "ESCROW_PARTIAL_CONFIRM_BUYER"
  | "ESCROW_PARTIAL_CONFIRM_SELLER"
  | "ESCROW_DECREMENT"
  | "WALLET_FUND"
  | "WALLET_DISBURSE"
  | "WALLET_TO_ESCROW"
  | "ESCROW_MILESTONE_RELEASE"
  | "ESCROW_MILESTONE_RELEASE_CONFIRM"
  | "ESCROW_MILESTONE_RELEASE_FAIL"
  | "ESCROW_MILESTONE_FEE_CAPTURE"
  | "PLATFORM_FEE_CAPTURE"
  | "INVOICE_PAYMENT"
  | "REVERSAL"
  | "MANUAL_ADJUSTMENT";

export type JournalEntryStatus = "POSTED" | "REVERSED";

export interface LedgerLine {
  accountCode: string;
  debit: number;
  credit: number;
  currency: string;
}

export interface EntryMetadata {
  transactionId?: string | null;
  escrowId?: string | null;
  orderId?: string | null;
  invoiceId?: string | null;
  disputeId?: string | null;
  providerRef?: string | null;
  actorUserId?: string | null;
}

export interface JournalEntry {
  _id: string;
  idempotencyKey: string;
  entryDate: string;
  entryType: EntryType;
  description: string;
  lines: LedgerLine[];
  metadata: EntryMetadata;
  status: JournalEntryStatus;
  reversedBy: string | null;
  reversalOf: string | null;
  createdAt: string;
}

// ── Reconciliation types ──────────────────────────────────────

export type ReconciliationScope = "INTERNAL" | "EXTERNAL";
export type ReconciliationStatus =
  | "CLEAN"
  | "DISCREPANCIES_FOUND"
  | "DISCREPANCIES_BACKFILLED";
export type DiscrepancyIssue = "MISSING_ENTRY" | "AMOUNT_MISMATCH" | "UNRESOLVABLE";
export type DiscrepancyEntityType = "ESCROW" | "WALLET" | "INVOICE";

export interface ReconciliationDiscrepancy {
  entityType: DiscrepancyEntityType;
  entityId: string;
  expectedKey: string;
  issue: DiscrepancyIssue;
  resolved: boolean;
  details: string;
}

export interface ReconciliationSummary {
  entriesChecked: number;
  entriesBackfilled: number;
  discrepancies: number;
  status: ReconciliationStatus;
}

export interface ReconciliationRun {
  _id: string;
  runDate: string;
  scope: ReconciliationScope;
  provider: string | null;
  periodStart: string;
  periodEnd: string;
  summary: ReconciliationSummary;
  discrepancies: ReconciliationDiscrepancy[];
  completedAt: string | null;
}
