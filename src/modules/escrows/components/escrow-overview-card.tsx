import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import type { EscrowDetails } from "../lib/escrow-details-model";

interface EscrowOverviewCardProps {
  data: EscrowDetails;
}

export function EscrowOverviewCard({ data }: EscrowOverviewCardProps) {
  const getStatusColor = (status: EscrowDetails["status"]) => {
    switch (status) {
      case "funded":
      case "ready_for_release":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "released":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "disputed":
      case "dispute_hold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "refunded":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
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
        <CardTitle className="text-sm font-medium">Escrow Overview</CardTitle>
        <ShieldCheck className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {formatCurrency(data.amountSecured, data.currency)}
            </div>
            <Badge
              variant="outline"
              className={`capitalize ${getStatusColor(data.status)}`}
            >
              {data.status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Created {format(new Date(data.createdAt), "PPP")}</span>
            </div>
            {data.riskFlags.length > 0 && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <span>{data.riskFlags.length} Risk Flags</span>
              </div>
            )}
          </div>

          {data.riskFlags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.riskFlags.map((flag) => (
                <Badge
                  key={flag}
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400"
                >
                  {flag.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
