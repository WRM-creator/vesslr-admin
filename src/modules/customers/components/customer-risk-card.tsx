import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertTriangle, BadgeCheck, Shield } from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerRiskCardProps {
  trustData: CustomerDetails["trust"];
  activityData: CustomerDetails["activity"];
}

export function CustomerRiskCard({
  trustData,
  activityData,
}: CustomerRiskCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const score = trustData.trustScore;

  return (
    <div className="space-y-6">
      {/* Trust Score */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative mb-2">
          <svg className="h-24 w-24 -rotate-90 transform">
            <circle
              className="text-muted/30"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="48"
              cy="48"
            />
            <circle
              className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * score) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="48"
              cy="48"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              Trust Score
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {trustData.verificationStatus === "verified" && (
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              <BadgeCheck className="mr-1 h-3 w-3" /> Verified
            </Badge>
          )}
          {trustData.badges.map((badge, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {badge.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Signals */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <Shield className="text-muted-foreground h-4 w-4" />
          Security Signals
        </h4>

        {activityData.riskSignals.length > 0 ? (
          <div className="space-y-2">
            {activityData.riskSignals.map((signal, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded border border-red-100 bg-red-50 p-2 text-sm text-red-700"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <span className="font-medium capitalize">
                    {signal.type.replace("_", " ")}
                  </span>
                  <div className="text-xs opacity-80">
                    {format(new Date(signal.detectedAt), "MMM d, HH:mm")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded border border-green-100 bg-green-50 p-3 text-sm text-green-700">
            <Shield className="h-4 w-4" />
            No risk signals detected recently.
          </div>
        )}
      </div>

      {/* Device Activity */}
      <div className="space-y-3 border-t pt-4">
        <div className="text-muted-foreground text-xs">
          <div className="mb-1 flex justify-between">
            <span>Last Login</span>
            <span className="font-medium">
              {format(new Date(activityData.lastLogin), "MMM d, HH:mm")}
            </span>
          </div>
          <div className="mb-1 flex justify-between">
            <span>Last IP</span>
            <span className="font-mono font-medium">{activityData.lastIp}</span>
          </div>
          <div className="flex justify-between">
            <span>Device</span>
            <span
              className="max-w-[150px] truncate font-medium"
              title={activityData.deviceAttributes}
            >
              {activityData.deviceAttributes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
