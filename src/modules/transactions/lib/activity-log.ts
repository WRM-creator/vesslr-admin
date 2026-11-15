import type { AdminTransactionEventDto } from "@/lib/api/generated";

/** "Sign Contract (buyer)": each party has its own stage of the same name. */
export function stageCompletedLabel(log: AdminTransactionEventDto): string {
  const name = (log.metadata?.stageName as string | undefined) ?? "";
  return log.stageParty ? `${name} (${log.stageParty})` : name;
}

/**
 * Who acted, for the activity list: "Deborah (admin) · deborah@vesslr.com".
 * Null for the system, and for an actor that matches no admin or user
 * (admin actions logged before the actor fix carry such an id).
 */
export function actorLabel(log: AdminTransactionEventDto): string | null {
  if (!log.actorKind) return null;
  const who = log.actorName ?? log.actorEmail ?? "Unknown";
  const name = log.actorKind === "admin" ? `${who} (admin)` : who;
  return log.actorEmail && log.actorName ? `${name} · ${log.actorEmail}` : name;
}
