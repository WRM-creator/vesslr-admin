import { CheckSquare, MapPin, Truck } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface LogisticsRulesCardProps {
  data: Category["logistics"];
}

export function LogisticsRulesCard({ data }: LogisticsRulesCardProps) {
  if (!data.required) {
    return (
      <div className="text-muted-foreground py-6 text-center">
        Logistics management is not required for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Truck className="h-4 w-4" />
          Allowed Modes
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.allowedModes.map((mode) => (
            <div
              key={mode}
              className="bg-card rounded-md border px-3 py-1.5 text-sm font-medium capitalize shadow-sm"
            >
              {mode}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4" />
          Tracking Requirements
        </h4>
        <ul className="space-y-2 text-sm">
          {data.trackingMethod.map((method) => (
            <li key={method} className="flex items-center gap-2">
              <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              {method}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <CheckSquare className="h-4 w-4" />
          Delivery Confirmation
        </h4>
        <ul className="space-y-2 text-sm">
          {data.deliveryConfirmation.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
