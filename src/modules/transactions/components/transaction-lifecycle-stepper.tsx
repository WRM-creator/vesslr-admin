import { Check } from "lucide-react";
import { type TransactionState } from "../lib/transaction-details-model";

interface TransactionLifecycleStepperProps {
  currentState: TransactionState;
}

const STEPS: { id: TransactionState; label: string }[] = [
  { id: "initiated", label: "Initiated" },
  { id: "docs_submitted", label: "Docs Submitted" },
  { id: "compliance_review", label: "Compliance" },
  { id: "escrow_funded", label: "Escrow Funded" },
  { id: "logistics_assigned", label: "Logistics" },
  { id: "in_transit", label: "In Transit" },
  { id: "delivery_confirmed", label: "Delivered" },
  { id: "settlement_released", label: "Settled" },
  { id: "closed", label: "Closed" },
];

export function TransactionLifecycleStepper({
  currentState,
}: TransactionLifecycleStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentState);

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="relative min-w-[800px] px-8">
        {/* Progress Bar Background - spans between first and last step circles */}
        <div
          className="bg-secondary absolute top-3.5 h-0.5"
          style={{
            left: `calc(100% / ${STEPS.length * 2})`,
            right: `calc(100% / ${STEPS.length * 2})`,
          }}
        />

        {/* Active Progress Bar */}
        <div
          className="bg-primary absolute top-3.5 h-0.5 transition-all duration-300"
          style={{
            left: `calc(100% / ${STEPS.length * 2})`,
            width:
              currentIndex === 0
                ? "0%"
                : `calc(${(currentIndex / (STEPS.length - 1)) * 100}% * (1 - 1/${STEPS.length}))`,
          }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <div
                key={step.id}
                className="group flex cursor-pointer flex-col items-center gap-2"
              >
                {/* Circle Indicator */}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-background ring-primary/20 ring-4"
                        : "border-muted-foreground/30 bg-background text-muted-foreground"
                  } `}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors ${
                    isCompleted || isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  } `}
                >
                  {step.label}
                </span>

                {/* Hidden "Force Advance" Button (Conceptual) */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
