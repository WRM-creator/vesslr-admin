import type {
  EscrowResponseDto,
  TransactionEscrowFundingDto,
} from "@/lib/api/generated";
import { describe, expect, it } from "vitest";
import { unconfirmedPayout } from "./unconfirmed-payout";

const now = new Date("2026-11-09T12:00:00Z");
const escrow = (status: string, payoutClaimedAt?: string) =>
  ({ status, payoutClaimedAt }) as unknown as EscrowResponseDto;

describe("unconfirmedPayout", () => {
  it("offers a lookup for a release pending 30 minutes or more", () => {
    expect(
      unconfirmedPayout(
        escrow("RELEASE_PENDING", "2026-11-09T11:00:00Z"),
        null,
        now,
      ),
    ).toEqual({ label: "Seller settlement", lookupFrom: null });
  });

  it("says when a recent refund can be looked up", () => {
    expect(
      unconfirmedPayout(
        escrow("REFUND_PENDING", "2026-11-09T11:50:00Z"),
        null,
        now,
      )?.lookupFrom,
    ).toEqual(new Date("2026-11-09T12:20:00Z"));
  });

  it("treats a pending payout claimed before the timestamp existed as old enough", () => {
    expect(
      unconfirmedPayout(escrow("REFUND_PENDING"), null, now)?.lookupFrom,
    ).toBeNull();
  });

  it("offers a lookup for an unconfirmed or stuck wallet payment", () => {
    const funding = (f: Partial<TransactionEscrowFundingDto>) =>
      ({
        startedAt: "2026-11-09T10:00:00Z",
        ...f,
      }) as TransactionEscrowFundingDto;
    expect(
      unconfirmedPayout(null, funding({ unconfirmed: true }), now)?.label,
    ).toBe("Wallet payment into escrow");
    expect(
      unconfirmedPayout(null, funding({ status: "STUCK" }), now),
    ).not.toBeNull();
    expect(
      unconfirmedPayout(null, funding({ status: "IN_PROGRESS" }), now),
    ).toBeNull();
  });

  it("has nothing for a funded or settled escrow", () => {
    expect(unconfirmedPayout(escrow("FUNDED"), null, now)).toBeNull();
    expect(unconfirmedPayout(escrow("RELEASED"), null, now)).toBeNull();
  });
});
