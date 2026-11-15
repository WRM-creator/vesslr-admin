import type { TransactionResponseDto } from "@/lib/api/generated";
import { describe, expect, it } from "vitest";
import { getEscrowState } from "./escrow-state";

const tx = (status: string, escrowStatus?: string) =>
  ({
    status,
    escrow: escrowStatus ? { status: escrowStatus } : null,
  }) as unknown as TransactionResponseDto;

describe("getEscrowState", () => {
  it("reads a funded escrow as secured whatever the deal's status", () => {
    for (const status of ["DISPUTED", "RENTAL_IN_PROGRESS", "PREPARATION_IN_PROGRESS", "CHARTER_IN_PROGRESS"]) {
      expect(getEscrowState(tx(status, "FUNDED"))).toBe("secured");
    }
  });

  it("follows the escrow through release and refund", () => {
    expect(getEscrowState(tx("SETTLEMENT_RELEASED", "RELEASED"))).toBe("released");
    expect(getEscrowState(tx("REFUNDED", "REFUND_PENDING"))).toBe("refunding");
    expect(getEscrowState(tx("REFUNDED", "REFUNDED"))).toBe("refunded");
  });

  it("is awaiting before any escrow exists, and cancelled if the deal was", () => {
    expect(getEscrowState(tx("COMPLIANCE_REVIEWED"))).toBe("awaiting");
    expect(getEscrowState(tx("CANCELLED"))).toBe("cancelled");
  });
});
