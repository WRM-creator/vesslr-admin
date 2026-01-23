import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Map as MapIcon } from "lucide-react";
import type { FulfillmentDetails } from "../lib/fulfillment-details-model";

interface FulfillmentTrackingCardProps {
  status: FulfillmentDetails["status"];
  currentLocation?: { lat: number; lng: number };
}

export function FulfillmentTrackingCard({
  status,
  currentLocation,
}: FulfillmentTrackingCardProps) {
  const steps = [
    { id: "pending", label: "Ordered" },
    { id: "picked_up", label: "Picked Up" },
    { id: "in_transit", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
  ];

  const getCurrentStepIndex = () => {
    if (status === "out_for_delivery") return 2; // Treat as "In Transit" phase
    if (status === "failed") return 2; // Treat as "In Transit" phase but failed
    return steps.findIndex((s) => s.id === status);
  };

  const currentStep = getCurrentStepIndex();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Live Tracking</CardTitle>
        <MapIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Map Placeholder */}
        <div className="bg-muted/50 group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed">
          <div className="absolute inset-0 bg-[url('https://ui.shadcn.com/placeholder.svg')] bg-center bg-repeat opacity-10" />
          <MapIcon className="text-muted-foreground/50 relative z-10 mb-2 h-10 w-10" />
          <p className="text-muted-foreground relative z-10 text-sm font-medium">
            Map Visualization Unavailable
          </p>
          <p className="text-muted-foreground/70 relative z-10 mt-1 text-xs">
            Current Loc: {currentLocation?.lat || "N/A"},{" "}
            {currentLocation?.lng || "N/A"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="bg-muted absolute top-2.5 left-0 h-0.5 w-full" />
          <div
            className="bg-primary absolute top-2.5 left-0 h-0.5 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted && <Check className="h-3 w-3" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
