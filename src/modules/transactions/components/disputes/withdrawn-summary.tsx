import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { format } from "date-fns";

type DisputeWithdrawal = {
  withdrawnAt: string;
  reason: string;
  attachments: Array<{ url: string; name: string }>;
};

type DisputeWithWithdrawal = AdminDisputeResponseDto & {
  withdrawal?: DisputeWithdrawal | null;
};

export function WithdrawnSummary({
  dispute,
}: {
  dispute: DisputeWithWithdrawal;
}) {
  const withdrawal = dispute.withdrawal!;
  const initiatorName =
    [dispute.initiator?.firstName, dispute.initiator?.lastName]
      .filter(Boolean)
      .join(" ") || "Initiating party";

  return (
    <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/40">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Withdrawn by</span>
        <span className="text-xs font-medium">{initiatorName}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Date</span>
        <span className="text-xs font-medium">
          {format(new Date(withdrawal.withdrawnAt), "MMM d, yyyy")}
        </span>
      </div>
      <p className="text-muted-foreground border-t pt-2 text-xs leading-relaxed">
        {withdrawal.reason}
      </p>
      {withdrawal.attachments.length > 0 && (
        <div className="border-t pt-2">
          <p className="text-muted-foreground mb-1.5 text-xs font-medium">
            Attachments ({withdrawal.attachments.length})
          </p>
          <div className="space-y-1">
            {withdrawal.attachments.map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted/50 flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs transition-colors"
              >
                <span className="flex-1 truncate font-medium">{a.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
