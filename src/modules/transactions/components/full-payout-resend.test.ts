import { describe, expect, it } from "vitest";
import type { EscrowResponseDto } from "@/lib/api/generated";
import { resendableFailure, resendMessage } from "./full-payout-resend";

const escrow = (over: Partial<EscrowResponseDto>) =>
  ({ status: "FUNDED", lastPayoutFailure: null, ...over }) as EscrowResponseDto;
const failure = {
  kind: "release" as const,
  attempt: 1,
  cause: "failed" as const,
  failedAt: "2026-11-09T10:00:00Z",
};

describe("resendableFailure", () => {
  it("offers a resend for a FAILED payout on a FUNDED escrow", () => {
    expect(resendableFailure(escrow({ lastPayoutFailure: failure }))).toEqual(failure);
  });

  it("offers none for a payout refused at initiation", () => {
    expect(
      resendableFailure(escrow({ lastPayoutFailure: { ...failure, cause: "refused" } })),
    ).toBeNull();
  });

  it("offers none once a new attempt is in flight", () => {
    expect(
      resendableFailure(escrow({ status: "RELEASE_PENDING" as never, lastPayoutFailure: failure })),
    ).toBeNull();
  });

  it("offers none with no failure or no escrow", () => {
    expect(resendableFailure(escrow({}))).toBeNull();
    expect(resendableFailure(undefined)).toBeNull();
  });
});

describe("resendMessage", () => {
  it("names the new reference", () => {
    expect(resendMessage("refund", "refund-abc-a2")).toBe(
      "Buyer refund resent as refund-abc-a2. Waiting for the provider's confirmation.",
    );
  });
});
