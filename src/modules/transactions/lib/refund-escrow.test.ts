import { describe, expect, it } from "vitest";

import { canRefundEscrow, isRefundOwed } from "./refund-escrow";

type Tx = Parameters<typeof canRefundEscrow>[0];

const funded = (status = "DELIVERY_CONFIRMED", milestones: string[] = []): Tx =>
  ({
    status,
    escrow: {
      status: "FUNDED",
      milestonePayouts: milestones.map((s) => ({ status: s })),
    },
  }) as unknown as Tx;

describe("canRefundEscrow", () => {
  it("offers a funded escrow at any unfinished stage", () => {
    expect(canRefundEscrow(funded("DELIVERY_CONFIRMED"))).toBe(true);
    expect(canRefundEscrow(funded("IN_TRANSIT"))).toBe(true);
    expect(canRefundEscrow(funded("ESCROW_FUNDED", ["PENDING", "PENDING"]))).toBe(true);
  });

  it("hides it once the escrow is not funded or the deal is finished or disputed", () => {
    expect(canRefundEscrow({ status: "DELIVERY_CONFIRMED", escrow: null } as Tx)).toBe(false);
    expect(
      canRefundEscrow({
        ...funded(),
        escrow: { ...funded().escrow!, status: "REFUND_PENDING" },
      } as Tx),
    ).toBe(false);
    for (const s of ["DISPUTED", "CLOSED", "REFUNDED", "SETTLEMENT_RELEASED"]) {
      expect(canRefundEscrow(funded(s))).toBe(false);
    }
  });

  it("hides it once a milestone payment has gone out", () => {
    expect(canRefundEscrow(funded("MILESTONES_IN_PROGRESS", ["RELEASED", "PENDING"]))).toBe(false);
  });

  it("offers a resend when the provider failed a full refund", () => {
    const owed = {
      status: "REFUNDED",
      escrow: {
        status: "FUNDED",
        milestonePayouts: [],
        refundHistory: [{ type: "FULL" }],
      },
    } as unknown as Tx;
    expect(isRefundOwed(owed)).toBe(true);
    expect(canRefundEscrow(owed)).toBe(true);
    // The same history on a deal that isn't refunded is not offered.
    expect(
      canRefundEscrow({ ...owed, status: "DELIVERY_CONFIRMED" } as Tx),
    ).toBe(false);
  });
});
