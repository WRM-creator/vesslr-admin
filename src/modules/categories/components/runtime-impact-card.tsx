import { AlertOctagon, ArrowRight, Ban, ListChecks } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface RuntimeImpactCardProps {
  data: Category["runtime"];
}

export function RuntimeImpactCard({ data }: RuntimeImpactCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
            <Ban className="h-4 w-4 text-red-500" />
            Blocked Actions
          </h4>
          <ul className="space-y-2">
            {data.blockedActions.map((action, idx) => (
              <li
                key={idx}
                className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-300"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
            <ListChecks className="h-4 w-4 text-blue-500" />
            Required Steps
          </h4>
          <ul className="space-y-2">
            {data.requiredSteps.map((step, idx) => (
              <li
                key={idx}
                className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-900/10 dark:text-blue-300"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
          <AlertOctagon className="h-4 w-4" />
          Example Flow
        </h4>
        <div className="bg-secondary/30 border-border/50 rounded-md border p-4 font-mono text-sm">
          {data.exampleFlow.split("->").map((step, idx, arr) => (
            <span key={idx}>
              <span className="font-semibold">{step.trim()}</span>
              {idx < arr.length - 1 && (
                <ArrowRight className="text-muted-foreground mx-2 inline-block h-3 w-3" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
