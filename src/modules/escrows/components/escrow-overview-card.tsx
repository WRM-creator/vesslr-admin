import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { TINT } from "@/lib/tint";
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
        return TINT.emerald;
      case "released":
        return TINT.blue;
      case "disputed":
      case "dispute_hold":
        return TINT.red;
      case "refunded":
        return TINT.amber;
      default:
        return TINT.gray;
    }
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
                  className={TINT.amber}
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
