/**
 * A milestone payout left RELEASE_PENDING with no transfer id: the provider
 * may never have received it (a refusal or timeout under the old code). A
 * retry resends it under the same reference, so the provider refuses a
 * duplicate and the retry is safe.
 */
export function isUnconfirmedPayout(payout: {
  status: string;
  transferId?: string | null;
}): boolean {
  return payout.status === "RELEASE_PENDING" && !payout.transferId;
}

export const unconfirmedPayoutConfig = {
  label: "Unconfirmed",
  variant: "destructive" as const,
};

/** Toast text for a successful retry, by what the API says happened. */
export function retryOutcomeMessage(
  milestoneIndex: number,
  outcome?: "started" | "awaiting",
): string {
  return outcome === "awaiting"
    ? `Milestone ${milestoneIndex + 1}: the provider already has this payout. Waiting for its confirmation.`
    : `Milestone ${milestoneIndex + 1} retry initiated`;
}
