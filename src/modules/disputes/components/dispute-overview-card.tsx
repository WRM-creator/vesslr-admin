import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Clock, HelpCircle, Lock } from "lucide-react";
import type { DisputeDetails } from "../lib/dispute-details-model";

interface DisputeOverviewCardProps {
  data: DisputeDetails;
}

export function DisputeOverviewCard({ data }: DisputeOverviewCardProps) {
  const getStatusColor = (status: DisputeDetails["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "under_review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "resolved":
      case "closed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "escalated":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dispute Overview</CardTitle>
        <HelpCircle className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm capitalize ${getStatusColor(
                data.status,
              )}`}
            >
              {data.status.replace(/_/g, " ")}
            </Badge>
            <div className="text-muted-foreground flex items-center text-xs font-medium">
              <Clock className="mr-1 h-3.5 w-3.5" />
              Opened{" "}
              {formatDistanceToNow(new Date(data.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Reason
            </span>
            <p className="text-lg font-medium">{data.reason}</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Description
            </span>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          {data.escrowId && (
            <div className="mt-2 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/10">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  Funds on Hold
                </h4>
                <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-500">
                  Escrow <strong>{data.escrowId}</strong> is currently frozen.
                  <br />
                  Amount:{" "}
                  <strong>
                    {formatCurrency(data.amountInDispute, data.currency)}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
