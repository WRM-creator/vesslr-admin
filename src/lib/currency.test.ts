import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("shows exact kobo when there is any", () => {
    expect(formatCurrency(33950, "NGN")).toBe("₦339.50");
    expect(formatCurrency(35350, "NGN")).toBe("₦353.50");
    expect(formatCurrency(35301, "NGN")).toBe("₦353.01");
  });

  it("keeps whole amounts whole", () => {
    expect(formatCurrency(34000, "NGN")).toBe("₦340");
    expect(formatCurrency(5000000, "NGN")).toBe("₦50,000");
  });

  it("keeps negative kobo", () => {
    expect(formatCurrency(-1450, "NGN")).toBe("-₦14.50");
  });

  it("shows full crypto precision", () => {
    expect(formatCurrency(5728032, "USDT")).toBe("5.728032 USDT");
    expect(formatCurrency(5500000, "USDT")).toBe("5.50 USDT");
  });

  it("keeps sub-cent crypto dust", () => {
    expect(formatCurrency(5000001, "USDT")).toBe("5.000001 USDT");
  });

  it("abbreviates compact figures", () => {
    expect(formatCurrency(150000000, "NGN", { compact: true })).toBe("₦1.5M");
    expect(formatCurrency(123456789, "NGN", { compact: true })).toBe("₦1.2M");
    expect(formatCurrency(1234567890000, "USDT", { compact: true })).toBe("1.2M USDT");
  });

  it("renders a dash for missing amounts", () => {
    expect(formatCurrency(null, "NGN")).toBe("-");
  });
});
