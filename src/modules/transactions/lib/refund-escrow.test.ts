import { describe, expect, it } from "vitest";

import { canRefundEscrow } from "./refund-escrow";

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
});
