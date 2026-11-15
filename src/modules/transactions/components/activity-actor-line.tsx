import type { AdminTransactionEventDto } from "@/lib/api/generated";
import { actorLabel } from "@/modules/transactions/lib/activity-log";

/** "by Deborah (admin) · deborah@vesslr.com" under an activity entry, when known. */
export function ActorLine({
  log,
  className,
}: {
  log: AdminTransactionEventDto;
  className?: string;
}) {
  const actor = actorLabel(log);
  return actor ? <span className={className}>by {actor}</span> : null;
}
