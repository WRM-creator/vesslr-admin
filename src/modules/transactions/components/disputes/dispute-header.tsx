import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { formatCurrency } from "@/lib/currency";
import { format, formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Undo2 } from "lucide-react";

type DisputeWithWithdrawal = AdminDisputeResponseDto & {
  withdrawal?: { withdrawnAt: string; reason: string } | null;
};

interface DisputeHeaderProps {
  dispute: DisputeWithWithdrawal;
  amount: number;
}

export function DisputeHeader({ dispute, amount }: DisputeHeaderProps) {
  const category = dispute.type
    ? dispute.type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Unknown Category";

  const displayId = `DSP-${String(dispute.displayId).padStart(4, "0")}`;
  const isResolved = dispute.status.toLowerCase().startsWith("resolved");
  const isWithdrawn = dispute.status === "withdrawn";
  const { resolution, withdrawal } = dispute;

  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  isResolved
                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : isWithdrawn
                      ? "border-slate-400 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                      : undefined
                }
              >
                {isResolved ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isWithdrawn ? (
                  <Undo2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {dispute.status}
              </Badge>
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                {formatDistanceToNow(new Date(dispute.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <h2 className="text-lg font-medium tracking-tight">{category}</h2>
            <span className="text-muted-foreground font-mono text-xs tracking-wide">
              {displayId}
            </span>
          </div>

          <div className="space-y-1 text-right">
            <CardTitle>Amount In Dispute</CardTitle>
            <div
              className={`font-semibold ${isResolved ? "text-green-700 dark:text-green-400" : isWithdrawn ? "text-slate-500" : "text-destructive"}`}
            >
              {formatCurrency(amount)}
            </div>
          </div>
        </div>

        {isResolved && resolution && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-950">
            <p className="text-xs font-medium text-green-700 dark:text-green-400">
              Resolved{" "}
              {formatDistanceToNow(new Date(resolution.resolvedAt), {
                addSuffix: true,
              })}{" "}
              by {resolution.resolvedBy.firstName}{" "}
              {resolution.resolvedBy.lastName}
            </p>
            {resolution.notes && (
              <p className="text-muted-foreground mt-0.5 text-xs">
                {resolution.notes}
              </p>
            )}
          </div>
        )}

        {isWithdrawn && withdrawal && (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Withdrawn by initiating party on{" "}
              {format(new Date(withdrawal.withdrawnAt), "MMM d, yyyy")}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              {withdrawal.reason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
