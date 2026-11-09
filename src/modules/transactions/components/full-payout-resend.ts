import type { EscrowResponseDto } from "@/lib/api/generated";

/**
 * A full release or refund the provider took and then reported FAILED. The
 * API reversed it and the escrow is FUNDED again; an admin can resend it as
 * the next attempt. A payout refused at initiation is not shown here: it is
 * resent the way it was started (Release, or resolving the dispute again).
 */
export function resendableFailure(escrow?: EscrowResponseDto | null) {
  const failure = escrow?.lastPayoutFailure;
  if (!failure || failure.cause !== "failed" || escrow?.status !== "FUNDED") {
    return null;
  }
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
