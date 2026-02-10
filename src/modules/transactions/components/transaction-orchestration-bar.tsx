import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface TransactionOrchestrationBarProps {
  currentStatus: string;
  events: any[]; // We can refine this type later
}

export function TransactionOrchestrationBar({
  currentStatus,
  events,
}: TransactionOrchestrationBarProps) {
  // Mapping of status to steps - this should match the bible/bible.md flow
  const steps = [
    { label: "Initiated", status: "INITIATED" },
    { label: "Docs Submitted", status: "DOCUMENTS_SUBMITTED" },
    { label: "Compliance", status: "COMPLIANCE_REVIEW" },
    { label: "Escrow", status: "ESCROW_FUNDED" },
    { label: "Logistics", status: "LOGISTICS_ASSIGNED" },
    { label: "In Transit", status: "IN_TRANSIT" },
    { label: "Delivered", status: "DELIVERY_CONFIRMED" },
    { label: "Settled", status: "SETTLEMENT_RELEASED" },
    { label: "Closed", status: "CLOSED" },
  ];

  // Helper to determine step state: 'completed', 'current', 'pending'
  const getStepState = (stepStatus: string) => {
    // This logic assumes linear progression which might not always be true but works for now
    const statusOrder = steps.map((s) => s.status);
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="bg-card w-full overflow-x-auto rounded-lg border p-6 shadow-sm">
      <div className="relative flex min-w-[800px] items-center justify-between">
        {/* Line background */}
        <div className="bg-muted absolute top-[15px] left-0 z-0 h-0.5 w-[96%]" />

        {steps.map((step, index) => {
          const state = getStepState(step.status);
          const isCompleted = state === "completed";
          const isCurrent = state === "current";

          return (
            <div
              key={step.status}
              className="bg-card z-10 flex flex-col items-center gap-2 px-2"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-background text-primary ring-primary/20 ring-4",
                  state === "pending" &&
                    "border-muted bg-background text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Circle className="h-4 w-4 fill-current" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isCurrent && "text-primary",
                  state === "pending" && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
