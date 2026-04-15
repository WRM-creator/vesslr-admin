import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Calendar, ExternalLink, MapPin, Truck } from "lucide-react";
import { formatShippingMethod } from "../../logistics-utils";

interface StageLogisticsContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

interface LogisticsInfo {
  carrierName?: string;
  shippingMethod?: string;
  vesselName?: string;
  trackingReference?: string;
  estimatedDeparture?: string;
  estimatedArrival?: string;
}

export function StageLogisticsContent({
  transaction,
  stage,
}: StageLogisticsContentProps) {
  // Logistics data can be in stage metadata or the legacy assignedLogistics field
  const logistics =
    (stage.metadata as unknown as LogisticsInfo) ??
    (transaction.assignedLogistics as unknown as LogisticsInfo);

  if (!logistics?.carrierName) {
    return (
      <div className="flex items-center gap-3 py-4">
        <Truck className="text-muted-foreground size-5 opacity-50" />
        <p className="text-muted-foreground text-sm">
          Logistics not yet assigned by the seller.
        </p>
      </div>
    );
  }

  // Logistics events from the audit log
  const logisticsEvents = (transaction.events || [])
    .filter((e) => e.action === "LOGISTICS_UPDATE")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return (
    <div className="space-y-4">
      {/* Shipment details */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground text-xs">Carrier</span>
          <p className="font-medium">{logistics.carrierName || "—"}</p>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground text-xs">Method</span>
          <p className="font-medium">
            {formatShippingMethod(logistics.shippingMethod)}
          </p>
        </div>
        {logistics.vesselName && (
          <div className="text-sm">
            <span className="text-muted-foreground text-xs">Vessel / Vehicle</span>
            <p className="font-medium">{logistics.vesselName}</p>
          </div>
        )}
        {logistics.trackingReference && (
          <div className="text-sm">
            <span className="text-muted-foreground text-xs">Tracking</span>
            <p>
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                {logistics.trackingReference}
              </code>
            </p>
          </div>
        )}
      </div>

      {/* Schedule */}
      {(logistics.estimatedDeparture || logistics.estimatedArrival) && (
        <div className="flex gap-6 text-sm">
          {logistics.estimatedDeparture && (
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground text-xs">Departure:</span>
              <span className="text-xs font-medium">
                {formatDateTime(logistics.estimatedDeparture)}
              </span>
            </div>
          )}
          {logistics.estimatedArrival && (
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground text-xs">Arrival:</span>
              <span className="text-xs font-medium">
                {formatDateTime(logistics.estimatedArrival)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Logistics events */}
      {logisticsEvents.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Activity
          </p>
          {logisticsEvents.slice(0, 5).map((event, i) => (
            <div key={i} className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>{formatDateTime(event.timestamp)}</span>
              <span>·</span>
              <span>
                {String((event.metadata as any)?.carrierName ?? "Logistics updated")}{" "}
                {(event.metadata as any)?.trackingReference && (
                  <code className="text-[10px]">
                    {String((event.metadata as any).trackingReference)}
                  </code>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
