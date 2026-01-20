import { Truck, MapPin, CheckSquare } from "lucide-react";
import type { Category } from "../../lib/category-details-model";

interface LogisticsRulesCardProps {
  data: Category["logistics"];
}

export function LogisticsRulesCard({ data }: LogisticsRulesCardProps) {
  if (!data.required) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Logistics management is not required for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Allowed Modes
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.allowedModes.map((mode) => (
            <div
              key={mode}
              className="px-3 py-1.5 rounded-md border bg-card text-sm font-medium capitalize shadow-sm"
            >
              {mode}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Tracking Requirements
        </h4>
        <ul className="text-sm space-y-2">
          {data.trackingMethod.map((method) => (
            <li key={method} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {method}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Delivery Confirmation
        </h4>
        <ul className="text-sm space-y-2">
          {data.deliveryConfirmation.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
