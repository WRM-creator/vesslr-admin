import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { MOCK_FRAUD_SIGNALS } from "../lib/analytics-model";

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "destructive";
    case "high":
      return "destructive"; // Orange technically better but 'destructive' fits shadcn defaults
    case "medium":
      return "secondary"; // Using secondary (gray/yellowish)
    default:
      return "outline";
  }
}

export function FraudSignalsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="text-destructive h-5 w-5" />
            Fraud Signals
          </CardTitle>
          <CardDescription>
            Recent security alerts and risk indicators
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_FRAUD_SIGNALS.map((signal) => (
            <div
              key={signal.id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{signal.signalType}</span>
                  <Badge variant={getSeverityColor(signal.severity) as any}>
                    {signal.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {signal.description}
                </p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{new Date(signal.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span className="font-mono">{signal.relatedEntity}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
