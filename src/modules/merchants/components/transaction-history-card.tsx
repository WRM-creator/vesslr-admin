import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface TransactionHistoryCardProps {
  data: MerchantDetails["transactions"];
}

export function TransactionHistoryCard({ data }: TransactionHistoryCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Completed */}
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            Completed
          </div>
          <span className="text-2xl font-bold">{data.completed}</span>
        </div>

        {/* Ongoing */}
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Ongoing
          </div>
          <span className="text-2xl font-bold">{data.ongoing}</span>
        </div>

        {/* Disputes */}
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            Disputes
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{data.disputeCount}</span>
            <Button variant="link" className="h-auto p-0 text-xs">
              View Issues
            </Button>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Completion Rate</h4>
          <span className="text-sm font-bold">{data.completionRate}%</span>
        </div>
        <Progress value={data.completionRate} className="h-2" />
        <p className="text-muted-foreground text-xs">
          Based on lifetime successful transactions
        </p>
      </div>
    </div>
  );
}
