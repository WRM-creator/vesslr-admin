import type { TransactionStageResponseDto } from "@/lib/api/generated/types.gen";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TransactionStepperProps {
  stages?: Array<TransactionStageResponseDto>;
}

export function TransactionStepper({ stages = [] }: TransactionStepperProps) {
  return (
    <div className="flex flex-1 items-center gap-2">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const isCompleted = stage.status === "COMPLETED";
        const isCurrent = stage.status === "ACTIVE";

        const nextStage = isLast ? null : stages[index + 1];
        const isNextStepReached = !isLast && nextStage?.status !== "PENDING";

        return (
          <div key={stage._id} className="contents pb-8">
            <div className="relative flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-background ring-primary/20 ring-4"
                      : "border-muted-foreground/30 bg-background text-transparent",
                )}
              >
                {isCompleted && <Check className="size-3.5 stroke-[3]" />}
                {isCurrent && !isLast && (
                  <div className="bg-primary size-2 rounded-full" />
                )}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 max-w-[120px] -translate-x-1/2 truncate text-center text-xs font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground",
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
                    : isCurrent
                      ? "from-primary to-border bg-gradient-to-r"
                      : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
