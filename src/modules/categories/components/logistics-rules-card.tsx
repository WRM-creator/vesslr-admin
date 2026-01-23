import { Truck } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Truck className="h-4 w-4" />
          Allowed Logistics Providers
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.allowedProviders.map((provider) => (
            <div
              key={provider}
              className="bg-secondary text-secondary-foreground rounded-md px-2.5 py-1 text-sm font-medium"
            >
              {provider}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
