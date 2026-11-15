import type { TransactionResponseDto } from "@/lib/api/generated";
import { describe, expect, it } from "vitest";
import { deriveOrderFees, deriveSettlementFees } from "./settlement-fees";

// The prod case: goods ₦350.00, escrow fee 1% (₦3.50), service charge 3% (₦10.50).
const order = (extra: Record<string, unknown> = {}) => ({
  currency: "NGN",
  pricingBasis: "flat",
  quantity: 1,
  totalAmount: 35000,
  serviceFeeAmount: 350,
  totalWithFee: 35350,
  serviceChargeConfig: { payer: "seller", feeType: "percentage", percentage: 0.03 },
  ...extra,
});
const tx = (o: Record<string, unknown>, escrow?: Record<string, unknown>) =>
  ({ order: o, escrow }) as unknown as TransactionResponseDto;
const funded = { currency: "NGN", amount: 35350, sellerAmount: 33950, serviceFeeAmount: 1400 };
const frozen = {
  frozenEscrowFee: { feeAmount: 350 },
  frozenSellerFee: { feeSettlementAmount: 1050 },
};

describe("deriveOrderFees", () => {
  it("estimates a percentage charge before funding", () => {
    expect(deriveOrderFees(tx(order()))).toEqual({
      escrowFeeAmount: 350,
      serviceChargeAmount: 1050,
      sellerPayout: 33950,
      chargeIsEstimate: true,
    });
  });

  it("estimates a same-currency per-unit charge and applies its minimum", () => {
    const o = order({
      quantity: 4,
      serviceChargeConfig: { feeType: "per_unit", perUnitAmount: 50, minFee: 500 },
    });
    expect(deriveOrderFees(tx(o)).serviceChargeAmount).toBe(500);
  });

  it("leaves a cross-currency per-unit charge to funding", () => {
    const o = order({
      serviceChargeConfig: { feeType: "per_unit", perUnitAmount: 50, currency: "USD" },
    });
    const fees = deriveOrderFees(tx(o));
    expect(fees.serviceChargeAmount).toBeNull();
    expect(fees.sellerPayout).toBeNull();
  });

  it("uses the frozen snapshot and the realized payout once funded", () => {
    expect(deriveOrderFees(tx(order(frozen), funded))).toEqual({
      escrowFeeAmount: 350,
      serviceChargeAmount: 1050,
      sellerPayout: 33950,
      chargeIsEstimate: false,
    });
  });

  it("ignores an escrow held in other units", () => {
    const usdt = { currency: "USDT", amount: 353500000, sellerAmount: 339500000, serviceFeeAmount: 14000000 };
    expect(deriveOrderFees(tx(order({ currency: "USD", ...frozen }), usdt)).sellerPayout).toBe(33950);
  });

  it("ignores a deposit-only escrow", () => {
    const deposit = { currency: "NGN", amount: 7000, sellerAmount: 6790, serviceFeeAmount: 210 };
    expect(deriveOrderFees(tx(order(frozen), deposit)).sellerPayout).toBe(33950);
  });

  it("reads a legacy differential's serviceFeeAmount as the seller charge", () => {
    const o = order({
      pricingBasis: "differential",
      differentialPrice: { differentialValue: 100 },
      serviceFeeAmount: 1050,
      serviceChargeConfig: undefined,
    });
    expect(deriveOrderFees(tx(o))).toMatchObject({
      escrowFeeAmount: 0,
      serviceChargeAmount: 1050,
      sellerPayout: 33950,
    });
  });
});

describe("deriveSettlementFees", () => {
  it("splits the take from the snapshots, and they reconcile to the held amount", () => {
    const fees = deriveSettlementFees(tx(order(frozen), funded));
    expect(fees.split).toMatchObject({ escrowFeeAmount: 350, serviceChargeAmount: 1050 });
    expect(fees.sellerPayout + fees.platformRevenue).toBe(fees.escrowHeld);
  });

  it("keeps the split right after a seller-absorbed discount", () => {
    // ₦50 off: held and seller share drop, the platform take does not.
    const discounted = { ...funded, amount: 30350, sellerAmount: 28950, originalFundedAmount: 35350 };
    const fees = deriveSettlementFees(tx(order(frozen), discounted));
    expect(fees.split).toMatchObject({ escrowFeeAmount: 350, serviceChargeAmount: 1050 });
    expect(fees.sellerPayout + fees.platformRevenue).toBe(fees.escrowHeld);
  });

  it("derives the split for a legacy escrow without snapshots", () => {
    expect(deriveSettlementFees(tx(order(), funded)).split).toMatchObject({
      escrowFeeAmount: 350,
      serviceChargeAmount: 1050,
    });
  });

  it("shows one combined take when a legacy escrow is in other units", () => {
    const usdt = { currency: "USDT", amount: 353500000, sellerAmount: 339500000, serviceFeeAmount: 14000000 };
    expect(deriveSettlementFees(tx(order({ currency: "USD" }), usdt)).split).toBeNull();
  });

  it("treats a 0 sellerAmount as unset, as the API does", () => {
    expect(deriveSettlementFees(tx(order(), { ...funded, sellerAmount: 0 })).sellerPayout).toBe(35350);
  });
});
