import type { TransactionResponseDto } from "@/lib/api/generated/types.gen";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type TransactionStatus = TransactionResponseDto["status"];

const ALL_STATUSES: TransactionStatus[] = [
  "INITIATED",
  "DOCUMENTS_SUBMITTED",
  "COMPLIANCE_REVIEWED",
  "ESCROW_FUNDED",
  "LOGISTICS_ASSIGNED",
  "IN_TRANSIT",
  "DELIVERY_CONFIRMED",
  "SETTLEMENT_RELEASED",
  "CLOSED",
];

const STEPS: { key: TransactionStatus; label: string }[] = [
  { key: "INITIATED", label: "Initiated" },
  { key: "DOCUMENTS_SUBMITTED", label: "Docs" },
  { key: "COMPLIANCE_REVIEWED", label: "Compliance" },
  { key: "ESCROW_FUNDED", label: "Escrow" },
  { key: "LOGISTICS_ASSIGNED", label: "Logistics" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "DELIVERY_CONFIRMED", label: "Delivery" },
  { key: "SETTLEMENT_RELEASED", label: "Settlement" },
  { key: "CLOSED", label: "Closed" },
];

interface TransactionStepperProps {
  status?: TransactionStatus;
}

export function TransactionStepper({ status }: TransactionStepperProps) {
  const currentStatusIndex = status ? ALL_STATUSES.indexOf(status) : 0;

  return (
    <div className="flex flex-1 items-center gap-2">
      {STEPS.map((step, index) => {
        const stepStatusIndex = ALL_STATUSES.indexOf(step.key);
        const isLast = index === STEPS.length - 1;
        const isCurrent = stepStatusIndex === currentStatusIndex;
        // Treat the last step as completed when it's the current step (transaction is fully done)
        const isCompleted =
          stepStatusIndex < currentStatusIndex || (isCurrent && isLast);

        // Determine line style for the line FOLLOWING this step
        // If the NEXT step is reached (current or completed), the line is solid.
        // If THIS step is current, the line is a gradient to indicate progress.
        const nextStepStatusIndex = isLast
          ? -1
          : ALL_STATUSES.indexOf(STEPS[index + 1].key);
        const isNextStepReached =
          !isLast && nextStepStatusIndex <= currentStatusIndex;

        return (
          <div key={step.key} className="contents pb-8">
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
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap",
                  isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
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
