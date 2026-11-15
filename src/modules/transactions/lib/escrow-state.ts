import type { TransactionResponseDto } from "@/lib/api/generated";

/**
 * Where the buyer's money stands, derived once for every admin surface that
 * shows it, so the overview and the sidebar can never disagree.
 */
export type EscrowState =
  | "awaiting"
  | "depositReview"
  | "shortfall"
  | "secured"
  | "released"
  | "refunding"
  | "refunded"
  | "cancelled";

export function getEscrowState(
  transaction: Pick<
    TransactionResponseDto,
    "status" | "escrow" | "escrowFunding"
  >,
): EscrowState {
  // The escrow document is the source of truth once it exists; deriving from
  // transaction.status breaks on flow-specific statuses (rental, charter).
  const escrow = transaction.escrow;
  if (escrow) {
    switch (escrow.status) {
      case "RELEASED":
        return "released";
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "refunded";
      case "REFUND_PENDING":
        return "refunding";
      // FUNDED / RELEASE_PENDING — funds still in custody.
      default:
        return "secured";
    }
  }
  // No escrow yet: cancelled before funding, or still awaiting it.
  if (transaction.status === "CANCELLED") return "cancelled";
  // Deposit-led funding accumulates deposits under admin review before the
  // escrow exists; surface that review state instead of a bare "awaiting".
  const funding = transaction.escrowFunding;
  if (funding?.mode === "DEPOSIT_LED") {
    if (funding.state === "DEPOSIT_RECEIVED") return "depositReview";
    if (funding.state === "SHORTFALL_REPORTED") return "shortfall";
  }
  return "awaiting";
}
