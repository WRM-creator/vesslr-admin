import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Copy, MapPin, Ship, Truck } from "lucide-react";
import type { TransactionDetails } from "../lib/transaction-details-model";

interface TransactionLogisticsCardProps {
  logistics: TransactionDetails["logistics"];
}

export function TransactionLogisticsCard({
  logistics,
}: TransactionLogisticsCardProps) {
  if (!logistics) {
    return (
      <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 text-center">
        <div className="bg-muted rounded-full p-4">
          <Truck className="text-muted-foreground h-8 w-8" />
        </div>
        <div>
          <h4 className="font-medium">No Logistics Assigned</h4>
          <p className="text-muted-foreground text-sm">
            This transaction has not reached the shipping stage yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Carrier Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-white p-2 dark:bg-black/20">
            <Ship className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-medium">{logistics.carrier}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>{logistics.trackingId}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() =>
                  navigator.clipboard.writeText(logistics.trackingId)
                }
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <Badge
          variant={logistics.status === "delivered" ? "default" : "secondary"}
          className="capitalize"
        >
          {logistics.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {logistics.eta && (
        <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-200">
          <span className="font-semibold">Estimated Arrival: </span>
          {format(new Date(logistics.eta), "PPP p")}
        </div>
      )}

      {/* Checkpoints */}
      <div className="relative space-y-0 pl-2">
        {/* Vertical Line */}
        <div className="bg-border absolute top-2 bottom-2 left-[15px] w-px" />

        {logistics.checkpoints.map((checkpoint, idx) => (
          <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
            <div
              className={`border-background relative z-10 mt-1 h-2.5 w-2.5 rounded-full border ring-2 ${idx === 0 ? "bg-primary ring-primary/20" : "bg-muted-foreground/30 ring-transparent"}`}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${idx === 0 ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {checkpoint.status}
                </span>
                <span className="text-muted-foreground text-xs">
                  • {format(new Date(checkpoint.date), "MMM d, HH:mm")}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {checkpoint.description}
              </p>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {checkpoint.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
