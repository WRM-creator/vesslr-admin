import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight, Box, CalendarClock, MapPin, Truck } from "lucide-react";
import type { FulfillmentDetails } from "../lib/fulfillment-details-model";

interface FulfillmentOverviewCardProps {
  data: FulfillmentDetails;
}

export function FulfillmentOverviewCard({
  data,
}: FulfillmentOverviewCardProps) {
  const getStatusColor = (status: FulfillmentDetails["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "in_transit":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "picked_up":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Shipment Overview</CardTitle>
        <Truck className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Status & Tracking */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm tracking-wide uppercase ${getStatusColor(
                data.status,
              )}`}
            >
              {data.status.replace(/_/g, " ")}
            </Badge>
            <div className="text-muted-foreground mt-2 flex items-center text-xs">
              <span className="bg-muted rounded px-2 py-0.5 font-mono">
                {data.trackingNumber}
              </span>
              <span className="mx-2">•</span>
              <span className="font-medium">{data.carrier}</span>
              <span className="text-muted-foreground/50 mx-1">
                ({data.serviceLevel})
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-muted-foreground flex items-center justify-end gap-2 text-sm font-medium">
              <CalendarClock className="h-4 w-4" />
              Estimated Arrival
            </div>
            <div className="text-xl font-bold">
              {format(new Date(data.eta), "MMM d, yyyy")}
            </div>
            <div className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(data.eta), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Route Visual */}
        <div className="bg-muted/20 relative rounded-lg border p-4">
          <div className="relative z-10 flex items-center justify-between">
            {/* Origin */}
            <div className="flex min-w-[120px] flex-col gap-1">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Box className="h-3.5 w-3.5" /> Origin
              </div>
              <div className="text-lg font-semibold">{data.origin.city}</div>
              <div className="text-muted-foreground text-sm">
                {data.origin.country}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-muted-foreground/40 flex flex-1 items-center justify-center px-4">
              <div className="bg-border mx-2 h-px flex-1" />
              <ArrowRight className="h-5 w-5" />
              <div className="bg-border mx-2 h-px flex-1" />
            </div>

            {/* Destination */}
            <div className="flex min-w-[120px] flex-col items-end gap-1 text-right">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                Destination <MapPin className="h-3.5 w-3.5" />
              </div>
              <div className="text-lg font-semibold">
                {data.destination.city}
              </div>
              <div className="text-muted-foreground text-sm">
                {data.destination.country}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
