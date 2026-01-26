import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { ChevronRight, Clock, Copy, ExternalLink, MapPin } from "lucide-react";

export function TransactionLogistics() {
  // Mock data for initial implementation
  const logisticsData = {
    provider: {
      name: "Maersk Line",
      trackingNumber: "2244558899",
      trackingUrl: "https://www.maersk.com/tracking/2244558899",
    },
    status: {
      current: "In Transit",
      estimatedDelivery: "2024-02-28",
      origin: "Lagos Port Complex, Nigeria",
      destination: "Port of Felixstowe, UK",
    },
    timeline: [
      {
        status: "Vessel departure from Lagos",
        date: new Date("2024-02-12T14:30:00"),
        location: "Lagos Port Complex, Nigeria",
        completed: true,
      },
      {
        status: "Gate in full container",
        date: new Date("2024-02-11T10:15:00"),
        location: "Lagos Port Complex, Nigeria",
        completed: true,
      },
      {
        status: "Empty container release",
        date: new Date("2024-02-10T09:00:00"),
        location: "Lagos Terminal B",
        completed: true,
      },
      {
        status: "Booking Confirmed",
        date: new Date("2024-02-09T16:45:00"),
        location: "System",
        completed: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex w-full justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2"
            onClick={() =>
              window.open(logisticsData.provider.trackingUrl, "_blank")
            }
          >
            <ExternalLink className="h-4 w-4" />
            Track Shipment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipment Details */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {logisticsData.provider.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-sm">
                      Tracking Number
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">
                        {logisticsData.provider.trackingNumber}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            logisticsData.provider.trackingNumber,
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-sm">
                    Estimated Delivery
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span>{logisticsData.status.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-muted-foreground text-sm">Origin</p>
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{logisticsData.status.origin}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-sm">Destination</p>
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{logisticsData.status.destination}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Shipment Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {logisticsData.timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    index === 0 ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div
                        className={`font-medium ${index !== 0 ? "text-muted-foreground" : ""}`}
                      >
                        {event.status}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {event.location}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {formatDateTime(event.date)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-1 text-xs"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
