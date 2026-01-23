import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface TrustVerificationCardProps {
  data: MerchantDetails["trust"];
}

export function TrustVerificationCard({ data }: TrustVerificationCardProps) {
  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Verification Status */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground text-sm font-medium">
            Verification Status
          </h4>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`border-0 px-3 py-1 text-sm font-medium ${getVerificationColor(
                data.verificationStatus,
              )}`}
            >
              {data.verificationStatus === "verified" && (
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
              )}
              {data.verificationStatus.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Trust Score */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-muted-foreground text-sm font-medium">
              Trust Score
            </h4>
            <span className="font-bold">{data.trustScore}/100</span>
          </div>
          <Progress
            value={data.trustScore}
            className="h-2"
            indicatorClassName={getScoreColor(data.trustScore)}
          />
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-sm font-medium">Badges</h4>
        <div className="flex flex-wrap gap-2">
          {data.badges.map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="bg-primary/5 text-primary flex items-center gap-1"
            >
              <ShieldCheck className="h-3 w-3" />
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="space-y-3 pt-2">
          {data.warnings.map((warning) => (
            <Alert
              key={warning.id}
              variant={
                warning.severity === "critical" ? "destructive" : "default"
              }
              className={
                warning.severity === "warning"
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : ""
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="capitalize">
                {warning.severity} Warning
              </AlertTitle>
              <AlertDescription>{warning.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
