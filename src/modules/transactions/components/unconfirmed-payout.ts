import type {
  EscrowResponseDto,
  TransactionEscrowFundingDto,
} from "@/lib/api/generated";

/** How long a payout must be unconfirmed before it can be looked up. */
export const LOOKUP_AFTER_MS = 30 * 60_000;

export type UnconfirmedPayout = {
  label: string;
  /** When it can be looked up; null when it already can. */
  lookupFrom: Date | null;
};

/**
 * A payout whose outcome never came, which an admin can look up at the
 * provider (mirrors the API's rule): a full release or refund still pending,
 * or a wallet payment into escrow that is unconfirmed or STUCK. Null when
 * there is none.
 */
export function unconfirmedPayout(
  escrow: EscrowResponseDto | null | undefined,
  funding: TransactionEscrowFundingDto | null | undefined,
  now: Date = new Date(),
): UnconfirmedPayout | null {
  const after = (since?: string | Date | null) => {
    if (!since) return null;
    const from = new Date(new Date(since).getTime() + LOOKUP_AFTER_MS);
    return from > now ? from : null;
  };
  if (
    escrow &&
    (escrow.status === "RELEASE_PENDING" || escrow.status === "REFUND_PENDING")
  ) {
    return {
      label:
        escrow.status === "RELEASE_PENDING"
          ? "Seller settlement"
          : "Buyer refund",
      lookupFrom: after(escrow.payoutClaimedAt),
    };
  }
  if (
    !escrow &&
    funding &&
    (funding.unconfirmed || funding.status === "STUCK")
  ) {
    return {
      label: "Wallet payment into escrow",
      lookupFrom: after(funding.startedAt),
    };
  }
  return null;
}
