import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { Loader2, RotateCw } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface StageMilestoneContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

const payoutStatusConfig = {
  PENDING: { label: "Pending", variant: "outline" as const },
  RELEASE_PENDING: { label: "Processing", variant: "secondary" as const },
  RELEASED: { label: "Paid", variant: "default" as const },
  FAILED: { label: "Retrying", variant: "secondary" as const },
  FAILED_PERMANENT: { label: "Failed", variant: "destructive" as const },
};

export function StageMilestoneContent({
  transaction,
  stage,
}: StageMilestoneContentProps) {
  const milestonePayouts = transaction.escrow?.milestonePayouts ?? [];
  const currency = transaction.order?.currency || "USD";

  if (milestonePayouts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {stage.status === "ACTIVE"
          ? "Milestone delivery is in progress."
          : "No milestone payout data available."}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {milestonePayouts.map((payout) => (
        <MilestoneRow
          key={payout.milestoneIndex}
          payout={payout}
          currency={currency}
          transactionId={transaction._id}
        />
      ))}
    </div>
  );
}

function MilestoneRow({
  payout,
  currency,
  transactionId,
}: {
  payout: {
    milestoneIndex: number;
    amount: number;
    status: string;
    retryCount: number;
  };
  currency: string;
  transactionId: string;
}) {
  const retryMutation =
    api.admin.transactions.retryMilestonePayment.useMutation();
  const config =
    payoutStatusConfig[payout.status as keyof typeof payoutStatusConfig] ??
    payoutStatusConfig.PENDING;
  const canRetry =
    payout.status === "FAILED" || payout.status === "FAILED_PERMANENT";

  const handleRetry = () => {
    retryMutation.mutate(
      {
        path: { id: transactionId, milestoneIndex: payout.milestoneIndex },
      },
      {
        onSuccess: () =>
          toast.success(
            `Milestone ${payout.milestoneIndex + 1} retry initiated`,
          ),
        onError: (err) =>
          toast.error(`Retry failed: ${(err as Error).message}`),
      },
    );
  };

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          Milestone {payout.milestoneIndex + 1}
        </span>
        <Badge variant={config.variant} className="text-[10px]">
          {config.label}
        </Badge>
        {payout.retryCount > 0 && payout.status !== "RELEASED" && (
          <span className="text-muted-foreground text-[10px]">
            {payout.retryCount}/3 retries
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          {formatCurrency(payout.amount, currency)}
        </span>
        {canRetry && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleRetry}
            disabled={retryMutation.isPending}
          >
            {retryMutation.isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <RotateCw className="size-3" />
            )}
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
