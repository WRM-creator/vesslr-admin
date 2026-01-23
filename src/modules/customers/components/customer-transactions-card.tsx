import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  ShoppingCart,
} from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerTransactionsCardProps {
  data: CustomerDetails["transactions"];
  onViewHistory?: () => void;
}

export function CustomerTransactionsCard({
  data,
  onViewHistory,
}: CustomerTransactionsCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="bg-muted/40 rounded-lg border p-3">
          <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs font-medium">
            <ShoppingCart className="h-3 w-3" />
            Total Requests
          </div>
          <div className="text-2xl font-bold">{data.totalRequests}</div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-900/10">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
            <Clock className="h-3 w-3" />
            Active Orders
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {data.activeOrders}
          </div>
        </div>

        <div className="rounded-lg border border-green-100 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-900/10">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Completed
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {data.completedOrders}
          </div>
        </div>

        <div className="bg-muted/40 rounded-lg border p-3">
          <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            Disputes
          </div>
          <div className="text-2xl font-bold">{data.disputeCount}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-muted-foreground text-sm">
          Last order activity:{" "}
          <span className="text-foreground font-medium">
            {format(new Date(data.lastOrderDate), "MMM d, yyyy")}
          </span>
        </div>

        <button
          onClick={onViewHistory}
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
        >
          View Full History <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
