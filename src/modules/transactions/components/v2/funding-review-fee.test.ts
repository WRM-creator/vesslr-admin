import { describe, expect, it } from "vitest";

import { sellerFeeCaption, sellerFeePreview } from "./funding-review-fee";

// The deal behind the server's own cross-currency cases: 100 bbl at
// N14,500.00, quoted in USD, settled in NGN at 1,600.
const deal = {
  quantity: 100,
  goodsTotal: 145_000_000, // kobo
  settlementCurrency: "NGN",
  formulaCurrency: "USD",
  fxRateMicros: 1_600 * 1_000_000,
  requiresFxRate: true,
};

describe("sellerFeePreview", () => {
  it("crosses a per-unit rate once, exactly as the server does", () => {
    const { feeFormulaTotal, feeSettlementTotal } = sellerFeePreview({
      ...deal,
      fee: { method: "per_unit", feePerUnit: 100, currency: "USD" }, // $1.00/bbl
    });
    expect(feeFormulaTotal).toBe(10_000); // $100.00 across the deal
    expect(feeSettlementTotal).toBe(16_000_000); // N160,000.00
  });

  it("applies a percentage to the settlement goods total, never crossing it", () => {
    const { feeFormulaTotal, feeSettlementTotal } = sellerFeePreview({
      ...deal,
      fee: {
        method: "percentage",
        feePerUnit: 0, // unknown until a gross exists; must not be used
        percentage: 0.03,
        currency: "USD",
      },
    });
    // The bug this guards: feePerUnit x quantity = 0, which promised the seller
    // the whole goods amount while the server deducted 3%.
    expect(feeSettlementTotal).toBe(4_350_000); // 3% of the naira gross
    expect(feeFormulaTotal).toBe(0); // nothing to caption as "converted"
  });

  it("crosses a percentage clamp quoted in the formula currency", () => {
    const { feeSettlementTotal } = sellerFeePreview({
      ...deal,
      fee: {
        method: "percentage",
        feePerUnit: 0,
        percentage: 0.03,
        currency: "USD",
        minFee: 50_000, // USD 500.00
      },
    });
    expect(feeSettlementTotal).toBe(80_000_000); // N800,000.00 floor wins
  });

  it("shows nothing until the rate is entered on a per-unit cross-currency deal", () => {
    const { feeSettlementTotal } = sellerFeePreview({
      ...deal,
      fxRateMicros: 0,
      fee: { method: "per_unit", feePerUnit: 100, currency: "USD" },
    });
    expect(feeSettlementTotal).toBe(0);
  });

  it("needs no rate for a percentage on a same-currency deal", () => {
    const { feeSettlementTotal } = sellerFeePreview({
      ...deal,
      formulaCurrency: "NGN",
      fxRateMicros: 0,
      requiresFxRate: false,
      fee: { method: "percentage", feePerUnit: 0, percentage: 0.03 },
    });
    expect(feeSettlementTotal).toBe(4_350_000);
  });

  it("is zero when the deal carries no seller charge", () => {
    expect(sellerFeePreview({ ...deal, fee: null })).toEqual({
      feeFormulaTotal: 0,
      feeSettlementTotal: 0,
    });
  });
});

describe("sellerFeeCaption", () => {
  const base = {
    quantity: 2,
    unit: "bbl",
    formulaCurrency: "USD",
    settlementCurrency: "NGN",
    requiresFxRate: true,
  };

  it("shows the per-unit rate, quantity and agreed rate", () => {
    expect(
      sellerFeeCaption({
        ...base,
        fee: { method: "per_unit", feePerUnit: 50, currency: "USD", unit: "bbl" },
        feeFormulaTotal: 100,
        fxRate: 1600,
      }),
    ).toBe("$0.50/bbl x 2 bbl = $1 at 1,600 NGN/USD");
  });

  it("says the rate is still to come before it is entered", () => {
    expect(
      sellerFeeCaption({
        ...base,
        fee: { method: "per_unit", feePerUnit: 50 },
        feeFormulaTotal: 100,
        fxRate: 0,
      }),
    ).toBe("$0.50/bbl x 2 bbl = $1, converted at the agreed rate");
  });

  it("names a minimum that lifted the fee", () => {
    expect(
      sellerFeeCaption({
        ...base,
        requiresFxRate: false,
        fee: { method: "per_unit", feePerUnit: 50, minFee: 500 },
        feeFormulaTotal: 500,
        fxRate: 0,
      }),
    ).toBe("$0.50/bbl x 2 bbl, minimum fee $5");
  });

  it("keeps the agreed rate's precision", () => {
    expect(
      sellerFeeCaption({
        ...base,
        fee: { method: "per_unit", feePerUnit: 50 },
        feeFormulaTotal: 100,
        fxRate: 1600.12345,
      }),
    ).toBe("$0.50/bbl x 2 bbl = $1 at 1,600.12345 NGN/USD");
  });

  it("shows a fixed fee as its amount", () => {
    expect(
      sellerFeeCaption({
        ...base,
        fee: { method: "fixed", feePerUnit: 0 },
        feeFormulaTotal: 2500,
        fxRate: 1600,
      }),
    ).toBe("$25 at 1,600 NGN/USD");
  });

  it("names a percentage's bounds", () => {
    expect(
      sellerFeeCaption({
        ...base,
        fee: { method: "percentage", feePerUnit: 0, percentage: 0.03, currency: "NGN", minFee: 10000 },
        feeFormulaTotal: 0,
        fxRate: 1600,
      }),
    ).toBe("3% of goods, min ₦100");
  });

  it("shows a percentage as its rate", () => {
    expect(
      sellerFeeCaption({
        ...base,
        fee: { method: "percentage", feePerUnit: 0, percentage: 0.03 },
        feeFormulaTotal: 0,
        fxRate: 1600,
      }),
    ).toBe("3% of goods");
  });
});
