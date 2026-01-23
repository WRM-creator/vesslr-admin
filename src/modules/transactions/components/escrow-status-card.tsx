import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AlertTriangle, Lock, ShieldCheck, Wallet } from "lucide-react";
import type { TransactionDetails } from "../lib/transaction-details-model";

interface EscrowStatusCardProps {
  data: TransactionDetails["escrow"];
}

export function EscrowStatusCard({ data }: EscrowStatusCardProps) {
  const getStatusColor = (status: TransactionDetails["escrow"]["status"]) => {
    switch (status) {
      case "funded":
      case "ready_for_release":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "released":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "dispute_hold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: TransactionDetails["escrow"]["status"]) => {
    switch (status) {
      case "funded":
      case "ready_for_release":
      case "released":
        return <ShieldCheck className="h-5 w-5" />;
      case "dispute_hold":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Main Status Block */}
      <div
        className={`flex items-center justify-between rounded-lg border p-4 ${getStatusColor(
          data.status,
        )}`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/50 p-2 dark:bg-black/20">
            {getStatusIcon(data.status)}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase opacity-80">
              Escrow Status
            </div>
            <div className="text-lg font-bold capitalize">
              {data.status.replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Secured */}
      <div className="bg-card flex items-center justify-between rounded-lg border p-4 shadow-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium">Amount Secured</span>
        </div>
        <div className="text-primary font-mono text-xl font-bold">
          {formatCurrency(data.amountSecured, data.currency)}
        </div>
      </div>

      {/* Release Conditions */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          Release Conditions
        </h4>
        <ul className="space-y-2">
          {data.releaseConditions.map((condition, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <div className="bg-primary/50 mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timestamp */}
      {data.depositDate && (
        <div className="text-muted-foreground text-xs">
          Funds secured on {format(new Date(data.depositDate), "PPP p")}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" variant="outline">
          Hold Funds
        </Button>
        <Button className="flex-1" variant="default">
          Release
        </Button>
      </div>
    </div>
  );
}
