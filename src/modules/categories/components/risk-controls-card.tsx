import { AlertTriangle, Eye, Gavel } from "lucide-react";
import type { Category } from "../../lib/category-details-model";

interface RiskControlsCardProps {
  data: Category["risk"];
}

export function RiskControlsCard({ data }: RiskControlsCardProps) {
  const getRiskColor = (score: number) => {
    if (score < 30) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (score < 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
             <h4 className="text-sm font-medium text-muted-foreground">Base Risk Score</h4>
             <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-bold px-3 py-1 rounded-md ${getRiskColor(data.baseRiskScore)}`}>
                    {data.baseRiskScore}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
             </div>
        </div>
        <div className="flex-1">
             <h4 className="text-sm font-medium text-muted-foreground">Dispute Handling</h4>
             <div className="flex items-center gap-2 mt-2">
                <Gavel className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{data.disputeHandling}</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        <div className="space-y-3">
             <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Manual Review Triggers
             </h4>
             <ul className="space-y-2">
                {data.manualReviewTriggers.map((trigger, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-yellow-600 dark:text-yellow-500">•</span>
                        {trigger}
                    </li>
                ))}
             </ul>
        </div>

        <div className="space-y-3">
             <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Escalation Rules
             </h4>
             <ul className="space-y-2">
                {data.escalationRules.map((rule, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
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
