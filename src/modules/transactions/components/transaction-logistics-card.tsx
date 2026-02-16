import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { Calendar, Package, Truck } from "lucide-react";

interface TransactionLogisticsCardProps {
  transaction: TransactionResponseDto;
}

export function TransactionLogisticsCard({
  transaction,
}: TransactionLogisticsCardProps) {
  const logistics = transaction.assignedLogistics as any;
  const isAssigned = !!logistics;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatMethod = (method?: string) => {
    if (!method) return "Unknown";
    return method
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <CardTitle>Logistics Details</CardTitle>
          <div
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isAssigned
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500"
            }`}
          >
            {isAssigned ? "Logistics Assigned" : "Awaiting Assignment"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isAssigned ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
              <Truck className="text-muted-foreground size-6" />
            </div>
            <h3 className="text-sm font-medium">No logistics assigned</h3>
            <p className="text-muted-foreground mt-1 max-w-[250px] text-xs">
              The seller has not yet provided shipping and logistics information
              for this transaction.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Context Banner */}
            <div className="rounded-md border border-green-100 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900/40 dark:text-green-500">
                  <Package className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">
                    Shipment Initialized
                  </p>
                  <p className="text-xs text-green-700/80 dark:text-green-500/70">
                    The seller has recorded the shipment details below. You can
                    track this shipment using the provided reference.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="space-y-4">
              <h4 className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Truck size={12} className="opacity-50" />
                Shipment Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="text-foreground font-medium">
                    {logistics.carrierName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span className="text-foreground font-medium">
                    {formatMethod(logistics.shippingMethod)}
                  </span>
                </div>
                {logistics.vesselName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Vessel / Vehicle
                    </span>
                    <span className="text-foreground font-medium">
                      {logistics.vesselName}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tracking Reference
                  </span>
                  <code className="bg-muted text-foreground border-border rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium">
                    {logistics.trackingReference}
                  </code>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h4 className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Calendar size={12} className="opacity-50" />
                Estimated Schedule
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-tight uppercase">
                    <div className="size-1.5 rounded-full bg-blue-500" />
                    Departure
                  </span>
                  <p className="text-foreground pl-3 text-sm font-medium">
                    {formatDate(logistics.estimatedDeparture)}
                  </p>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-tight uppercase">
                    <div className="size-1.5 rounded-full bg-amber-500" />
                    Arrival
                  </span>
                  <p className="text-foreground pl-3 text-sm font-medium">
                    {formatDate(logistics.estimatedArrival)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
