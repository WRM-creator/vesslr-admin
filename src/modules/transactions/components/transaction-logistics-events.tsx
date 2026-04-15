import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { ExternalLink, History } from "lucide-react";
import { formatShippingMethod } from "./logistics-utils";

interface TransactionLogisticsEventsProps {
  transaction: TransactionResponseDto;
}

export function TransactionLogisticsEvents({
  transaction,
}: TransactionLogisticsEventsProps) {
  // Filter for logistics-related events
  const logisticsEvents = (transaction.events || [])
    .filter((e) => e.action === "LOGISTICS_UPDATE")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Logistics Activity</CardTitle>
        <History className="text-muted-foreground size-3.5" />
      </CardHeader>
      <CardContent>
        {logisticsEvents.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center text-xs">
            No logistics events recorded.
          </div>
        ) : (
          <div className="space-y-0">
            {logisticsEvents.map((log, index) => (
              <div key={index} className="group flex gap-3 text-sm">
                {/* Date/Time Left Sidebar */}
                <div className="flex min-w-[40px] flex-col items-end text-right">
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>

                {/* Timeline Line & Content */}
                <div className="border-border/50 relative ml-1 flex-1 border-l pb-4 pl-4 group-last:border-transparent">
                  {/* Timeline dot */}
                  <div className="border-background bg-muted-foreground/30 ring-background group-first:bg-primary group-first:ring-primary/20 absolute top-1.5 -left-[6px] h-3 w-3 rounded-full border ring-2" />

                  <div className="flex flex-col gap-0.5">
                    <span className="text-foreground/90 text-xs font-medium">
                      Logistics Assigned
                    </span>
                    <span className="text-muted-foreground text-[11px] leading-snug">
                      {(log.metadata?.carrierName as string) ?? ""} ·{" "}
                      {formatShippingMethod(log.metadata?.shippingMethod as string)}
                    </span>
                    {typeof log.metadata?.trackingReference === "string" && (
                      <div className="pt-1">
                        <span className="text-primaryGreenDark/80 hover:text-primaryGreenDark bg-muted/50 inline-flex items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[10px] transition-colors">
                          {log.metadata.trackingReference as string}
                          <ExternalLink className="size-2.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
