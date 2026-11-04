import { describe, expect, it } from "vitest";
import type {
  AdminPaymentProfileDto,
  AdminProviderBindingDto,
} from "@/lib/api/generated";
import { derivePaymentsVerdict } from "./payments-verdict";

const binding = (
  over: Record<string, unknown> = {},
): AdminProviderBindingDto =>
  ({
    provider: "flutterwave",
    currency: "NGN",
    country: "NG",
    onboardingStatus: "none",
    status: "active",
    ...over,
  }) as AdminProviderBindingDto;

const profile = (bindings: AdminProviderBindingDto[]) =>
  ({ kybStatus: "approved", bindings }) as AdminPaymentProfileDto;

describe("derivePaymentsVerdict", () => {
  it("ignores a retired wallet next to a healthy one", () => {
    const verdict = derivePaymentsVerdict(
      profile([
        binding({
          provider: "busha",
          status: "disabled",
          onboardingStatus: "in_review",
          walletStatus: "retired",
        }),
        binding(),
      ]),
    );
    expect(verdict.tone).toBe("healthy");
  });

  it("does not hide a disabled binding that is not retired", () => {
    const verdict = derivePaymentsVerdict(
      profile([binding({ status: "disabled" })]),
    );
    expect(verdict.tone).not.toBe("healthy");
  });
});
