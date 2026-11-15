import { describe, expect, it } from "vitest";
import type { AdminTransactionEventDto } from "@/lib/api/generated";
import { actorLabel, stageCompletedLabel } from "./activity-log";

const log = (over: Partial<AdminTransactionEventDto>): AdminTransactionEventDto => ({
  timestamp: "2026-11-14T10:00:00Z",
  action: "STAGE_COMPLETED",
  ...over,
});

describe("activity log labels", () => {
  it("labels a completed stage with its party", () => {
    expect(
      stageCompletedLabel(log({ metadata: { stageName: "Sign Contract" }, stageParty: "seller" })),
    ).toBe("Sign Contract (seller)");
    expect(stageCompletedLabel(log({ metadata: { stageName: "Settlement" } }))).toBe("Settlement");
  });

  it("names an admin with their email, a user by name, and nobody for an unknown actor", () => {
    expect(
      actorLabel(log({ actorKind: "admin", actorName: "Deborah", actorEmail: "deborah@vesslr.com" })),
    ).toBe("Deborah (admin) · deborah@vesslr.com");
    expect(actorLabel(log({ actorKind: "user", actorEmail: "ada@example.com" }))).toBe(
      "ada@example.com",
    );
    expect(actorLabel(log({ actor: "6af49a7b45b77e7078c9e5fb" }))).toBeNull();
  });
});
