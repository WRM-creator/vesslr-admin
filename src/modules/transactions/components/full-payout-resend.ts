import type { EscrowResponseDto } from "@/lib/api/generated";

/**
 * A full release or refund an admin can resend (mirrors the API's rule): a
 * release the provider failed or refused (its Release step is already
 * complete), or a refund it failed after taking it (a refused refund leaves
 * its dispute open, to be resolved again). Never one the provider later
 * reported delivered (`contradicted`).
 */
export function resendableFailure(escrow?: EscrowResponseDto | null) {
  const failure = escrow?.lastPayoutFailure;
  if (!failure || escrow?.status !== "FUNDED") return null;
  if (failure.cause === "contradicted") return null;
  if (failure.kind === "refund" && failure.cause !== "failed") return null;
  return failure;
}

export function failedPayoutLabel(kind: "release" | "refund"): string {
  return kind === "release" ? "Seller settlement" : "Buyer refund";
}

/** Toast text after a resend, naming the new reference to look up at the provider. */
export function resendMessage(
  kind: "release" | "refund",
  reference?: string,
): string {
  return `${failedPayoutLabel(kind)} resent${reference ? ` as ${reference}` : ""}. Waiting for the provider's confirmation.`;
}
