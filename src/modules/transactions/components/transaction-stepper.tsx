import type { TransactionStageResponseDto } from "@/lib/api/generated/types.gen";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, X } from "lucide-react";

interface TransactionStepperProps {
  stages?: Array<TransactionStageResponseDto>;
  transactionStatus?: string;
}

export function TransactionStepper({
  stages = [],
  transactionStatus,
}: TransactionStepperProps) {
  const isCancelled = ["REFUNDED", "CANCELLED", "PARTIALLY_REFUNDED"].includes(
    transactionStatus ?? "",
  );

  // Index of the last non-PENDING stage. The cancellation break is injected
  // immediately after it, before the remaining grey "would-have-been" stages.
  const breakAfterIndex = isCancelled
    ? stages.reduce((last, s, i) => (s.status !== "PENDING" ? i : last), -1)
    : -1;

  // Only show the break when there are remaining stages after the cutoff.
  const hasBreak = breakAfterIndex >= 0 && breakAfterIndex < stages.length - 1;

  if (stages.length === 0) return null;

  return (
    <div className="flex flex-1 items-center gap-2" role="list" aria-label="Transaction progress">
      {stages.flatMap((stage, index) => {
        const isLast = index === stages.length - 1;
        const isCompleted = stage.status === "COMPLETED";
        const isCurrent = stage.status === "ACTIVE";
        const isDisputed = stage.status === "DISPUTED";

        const nextStage = isLast ? null : stages[index + 1];
        const isNextStepReached = !isLast && nextStage?.status !== "PENDING";

        const stageEl = (
          <div key={stage._id} className="contents pb-8" role="listitem" aria-current={isCurrent ? "step" : undefined}>
            <div className="relative flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2 transition-colors",
                  isDisputed
                    ? "border-destructive/80 bg-destructive/80 text-destructive-foreground"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-background ring-primary/20 ring-4"
                        : "border-muted-foreground/30 bg-background text-transparent",
                )}
              >
                {isDisputed ? (
                  <AlertTriangle
                    className="relative bottom-px size-3.5 text-white"
                    strokeWidth={1.6}
                  />
                ) : (
                  <>
                    {isCompleted && <Check className="size-3.5 stroke-[3]" />}
                    {isCurrent && !isLast && (
                      <div className="bg-primary size-2 rounded-full" />
                    )}
                  </>
                )}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 max-w-[120px] -translate-x-1/2 truncate text-center text-xs font-medium",
                  isDisputed
                    ? "text-destructive"
                    : isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
                title={stage.name}
              >
                {stage.name}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "h-0.5 w-8 flex-1 transition-colors",
                  isNextStepReached
                    ? "bg-primary"
                    : isDisputed
                      ? "bg-destructive/40"
                      : isCurrent
                        ? "from-primary to-border bg-gradient-to-r"
                        : "bg-border",
                )}
              />
            )}
          </div>
        );

        if (hasBreak && index === breakAfterIndex) {
          const breakEl = (
            <div key="cancellation-break" className="contents">
              <div className="relative flex flex-col items-center gap-1">
                <div className="bg-background flex size-6 items-center justify-center rounded-full">
                  <X className="text-destructive size-4" strokeWidth={2.5} />
                </div>
                <span className="text-destructive absolute -bottom-6 left-1/2 -translate-x-1/2 text-center text-xs font-medium whitespace-nowrap">
                  {transactionStatus === "PARTIALLY_REFUNDED"
                    ? "Split Settlement"
                    : "Cancelled"}
                </span>
              </div>
              <div className="bg-border/50 h-0.5 w-8 flex-1" />
            </div>
          );

          return [stageEl, breakEl];
        }

        return [stageEl];
      })}
    </div>
  );
}
