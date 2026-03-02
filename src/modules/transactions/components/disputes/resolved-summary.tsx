import { Badge } from "@/components/ui/badge";
import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { formatCurrency } from "@/lib/utils";

const outcomeLabel: Record<string, string> = {
  PROCEED: "Resumed",
  CANCELLED: "Cancelled & Refunded",
  PARTIAL_REFUND: "Split Settlement",
  RE_INSPECT: "Re-inspect",
  MUTUAL_SETTLEMENT: "Mutual Settlement",
  ESCALATED: "Escalated",
};

export function ResolvedSummary({
  dispute,
}: {
  dispute: AdminDisputeResponseDto;
}) {
  const resolution = dispute.resolution!;
  const partialRefundAmount = resolution.metadata?.buyerRefundAmount;

  return (
    <div className="space-y-2 rounded-md border p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Outcome</span>
        <Badge variant="secondary" className="text-[10px]">
          {outcomeLabel[resolution.outcome] ?? resolution.outcome}
        </Badge>
      </div>
      {partialRefundAmount != null && partialRefundAmount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Buyer refunded</span>
          <span className="text-xs font-medium">
            {formatCurrency(partialRefundAmount)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Resolved by</span>
        <span className="text-xs font-medium">
          {resolution.resolvedBy?.firstName} {resolution.resolvedBy?.lastName}
        </span>
      </div>
      {resolution.notes && (
        <p className="text-muted-foreground border-t pt-2 text-xs leading-relaxed">
          {resolution.notes}
        </p>
      )}
    </div>
  );
}
