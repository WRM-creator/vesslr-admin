import { Button } from "@/components/ui/button";
import { AlertTriangle, Flag, Phone } from "lucide-react";
import type { FulfillmentDetails } from "../lib/fulfillment-details-model";

interface FulfillmentExceptionsCardProps {
  alerts: FulfillmentDetails["alerts"];
}

export function FulfillmentExceptionsCard({
  alerts,
}: FulfillmentExceptionsCardProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold tracking-wide text-red-900 uppercase dark:text-red-400">
                Exception: {alert.type.replace(/_/g, " ")}
              </h4>
              <p className="mt-1 text-sm text-red-800 dark:text-red-300">
                {alert.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-red-200 bg-white text-xs text-red-700 hover:bg-red-50"
                >
                  <Phone className="mr-2 h-3.5 w-3.5" /> Contact Carrier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-red-200 bg-white text-xs text-red-700 hover:bg-red-50"
                >
                  <Flag className="mr-2 h-3.5 w-3.5" /> Escalate
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
