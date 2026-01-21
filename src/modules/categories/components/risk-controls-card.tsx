import { AlertTriangle, Eye, Gavel } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface RiskControlsCardProps {
  data: Category["risk"];
}

export function RiskControlsCard({ data }: RiskControlsCardProps) {
  const getRiskColor = (score: number) => {
    if (score < 30)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (score < 70)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h4 className="text-muted-foreground text-sm font-medium">
            Base Risk Score
          </h4>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`rounded-md px-3 py-1 text-2xl font-bold ${getRiskColor(data.baseRiskScore)}`}
            >
              {data.baseRiskScore}
            </span>
            <span className="text-muted-foreground text-sm">/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-muted-foreground text-sm font-medium">
            Dispute Handling
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <Gavel className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium capitalize">
              {data.disputeHandling}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Eye className="h-4 w-4" />
            Manual Review Triggers
          </h4>
          <ul className="space-y-2">
            {data.manualReviewTriggers.map((trigger, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-600 dark:text-yellow-500">•</span>
                {trigger}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            Escalation Rules
          </h4>
          <ul className="space-y-2">
            {data.escalationRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-red-600 dark:text-red-500">•</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
