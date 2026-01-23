import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Plane,
  Truck,
  Warehouse,
} from "lucide-react";
import type { Checkpoint } from "../lib/fulfillment-details-model";

interface FulfillmentTimelineCardProps {
  checkpoints: Checkpoint[];
}

export function FulfillmentTimelineCard({
  checkpoints,
}: FulfillmentTimelineCardProps) {
  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const getIcon = (icon?: Checkpoint["icon"]) => {
    switch (icon) {
      case "truck":
        return <Truck className="h-4 w-4" />;
      case "plane":
        return <Plane className="h-4 w-4" />;
      case "warehouse":
        return <Warehouse className="h-4 w-4" />;
      case "package":
        return <CheckCircle2 className="h-4 w-4" />; // Customs/Cleared
      case "alert":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="before:via-muted relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:to-transparent">
      {sortedCheckpoints.map((checkpoint, index) => {
        const isLatest = index === 0;

        return (
          <div key={checkpoint.id} className="group relative flex gap-6">
            <div
              className={`bg-background absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
                isLatest
                  ? "border-primary text-primary ring-primary/10 ring-4"
                  : "border-muted text-muted-foreground group-hover:border-primary/50 group-hover:text-primary/70"
              }`}
            >
              {getIcon(checkpoint.icon)}
            </div>
            <div className="ml-6 flex-1 space-y-2 pt-1.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h4
                  className={`text-sm font-semibold ${
                    isLatest ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {checkpoint.status}
                </h4>
                <time className="text-muted-foreground text-xs tabular-nums">
                  {format(
                    new Date(checkpoint.timestamp),
                    "MMM d, yyyy • HH:mm",
                  )}
                </time>
              </div>
              <div
                className={`text-sm ${
                  isLatest ? "text-foreground/90" : "text-muted-foreground"
                }`}
              >
                {checkpoint.description}
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <MapPin className="h-3 w-3" />
                {checkpoint.location}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
