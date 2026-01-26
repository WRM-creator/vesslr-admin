import { cn } from "@/lib/utils";
import { CheckIcon, CircleIcon } from "lucide-react";

const STEPS = [
  { id: "initiated", label: "Initiated" },
  { id: "documents_submitted", label: "Documents" },
  { id: "compliance_review", label: "Compliance" },
  { id: "escrow_funded", label: "Escrow" },
  { id: "logistics_assigned", label: "Logistics" },
  { id: "in_transit", label: "In Transit" },
  { id: "delivery_confirmed", label: "Delivered" },
  { id: "settlement_released", label: "Settled" },
  { id: "closed", label: "Closed" },
];

interface TransactionLifecycleProps {
  currentStatus: string;
}

export function TransactionLifecycle({
  currentStatus,
}: TransactionLifecycleProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStatus);
  // If status not found or cancelled/disputed, handle accordingly.
  // For now assuming linear happy path matching STEPS.

  return (
    <div className="@container w-full">
      <div className="relative flex w-full flex-col @3xl:flex-row">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-1 gap-4 @3xl:block",
                // Vertical (mobile): explicit height to draw lines or just stacking
                "pb-8 @3xl:pb-0",
              )}
            >
              {/* Connecting Line */}
              {index !== STEPS.length - 1 && (
                <>
                  {/* Vertical Line (Mobile) */}
                  <div
                    className={cn(
                      "absolute top-8 bottom-0 left-[15px] w-[2px] @3xl:hidden",
                      isCompleted ? "bg-primary" : "bg-border",
                    )}
                  />
                  {/* Horizontal Line (Desktop) */}
                  <div
                    className={cn(
                      "absolute top-[15px] right-[-50%] left-1/2 hidden h-[2px] @3xl:block",
                      isCompleted ? "bg-primary" : "bg-border",
                    )}
                  />
                </>
              )}

              {/* Step indicator circle */}
              <div className="relative z-10 flex @3xl:justify-center">
                <div
                  className={cn(
                    "bg-background flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary text-primary ring-primary/20 ring-4",
                    isFuture &&
                      "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : isCurrent ? (
                    <CircleIcon className="h-3 w-3 fill-current" />
                  ) : null}
                </div>
              </div>

              {/* Label */}
              <div className="pt-1 @3xl:pt-4 @3xl:text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-muted-foreground mt-0.5 block text-xs @3xl:hidden">
                    Current Step
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
