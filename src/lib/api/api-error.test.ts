import { describe, expect, it } from "vitest";
import { ApiError, toApiError } from "./api-error";

describe("ApiError", () => {
  it("is an Error carrying the server's message", () => {
    const body = {
      statusCode: 422,
      message:
        "Could not find the bank account behind Flutterwave subaccount PSA1 (static account: 400: bank code 035 not available)",
      error: "Unprocessable Entity",
    };
    const err = toApiError(body);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe(body.message);
    expect((err as ApiError).statusCode).toBe(422);
    // The pattern every affected dialog uses now shows the real reason.
    const shown = err instanceof Error ? err.message : "Unknown error";
    expect(shown).toBe(body.message);
  });

  it("joins a validation message array", () => {
    expect(toApiError({ message: ["amount must be positive", "reason too short"] }).message).toBe(
      "amount must be positive; reason too short",
    );
  });

  it("keeps the body's extra fields readable", () => {
    const err = toApiError({ message: "Short", heldTotal: 100, confirmAmount: 150, shortfall: 50 }) as ApiError;
    expect(err.shortfall).toBe(50);
    expect(err.heldTotal).toBe(100);
    expect(err.body).toMatchObject({ shortfall: 50 });
  });

  it("falls back when the body has no message", () => {
    expect(toApiError(undefined).message).toBe("Request failed");
    expect(toApiError({ error: "Bad Gateway" }).message).toBe("Bad Gateway");
  });

  it("passes an existing Error through", () => {
    const original = new TypeError("Failed to fetch");
    expect(toApiError(original)).toBe(original);
  });
});
