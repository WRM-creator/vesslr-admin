import { AlertOctagon, ArrowRight, Ban, ListChecks } from "lucide-react";
import type { Category } from "../../lib/category-details-model";

interface RuntimeImpactCardProps {
  data: Category["runtime"];
}

export function RuntimeImpactCard({ data }: RuntimeImpactCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                Blocked Actions
            </h4>
            <ul className="space-y-2">
                {data.blockedActions.map((action, idx) => (
                    <li key={idx} className="text-sm px-3 py-2 bg-red-50 text-red-900 dark:bg-red-900/10 dark:text-red-300 rounded-md border border-red-100 dark:border-red-900/50">
                        {action}
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-blue-500" />
                Required Steps
            </h4>
             <ul className="space-y-2">
                {data.requiredSteps.map((step, idx) => (
                    <li key={idx} className="text-sm px-3 py-2 bg-blue-50 text-blue-900 dark:bg-blue-900/10 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-900/50">
                        {step}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <AlertOctagon className="h-4 w-4" />
            Example Flow
        </h4>
        <div className="p-4 rounded-md bg-secondary/30 border border-border/50 text-sm font-mono">
            {data.exampleFlow.split("->").map((step, idx, arr) => (
                <span key={idx}>
                    <span className="font-semibold">{step.trim()}</span>
                    {idx < arr.length - 1 && (
                        <ArrowRight className="inline-block h-3 w-3 mx-2 text-muted-foreground" />
                    )}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
}
