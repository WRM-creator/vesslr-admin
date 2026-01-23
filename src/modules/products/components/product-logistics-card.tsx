import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck } from "lucide-react";
import type { ProductDetails } from "../lib/product-details-model";

interface ProductLogisticsCardProps {
  data: ProductDetails["logistics"];
}

export function ProductLogisticsCard({ data }: ProductLogisticsCardProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium">In Transit</div>
            <div className="text-muted-foreground text-xs">
              {data.carrier} • {data.trackingId}
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="capitalize">
          {data.shippingStatus}
        </Badge>
      </div>

      <div className="relative ml-5 space-y-6 border-l-2 border-dashed py-2 pl-6">
        <div className="relative">
          <span className="bg-background absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border">
            <Package className="text-muted-foreground h-3 w-3" />
          </span>
          <div className="text-sm font-medium">Origin</div>
          <div className="text-muted-foreground text-xs">{data.origin}</div>
        </div>

        {data.destination && (
          <div className="relative">
            <span className="bg-primary border-primary absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border text-white">
              <MapPin className="h-3 w-3" />
            </span>
            <div className="text-sm font-medium">Destination</div>
            <div className="text-muted-foreground text-xs">
              {data.destination}
            </div>
          </div>
        )}
      </div>

      {data.estimatedDelivery && (
        <div className="bg-muted/50 rounded-md p-3 text-center text-xs">
          Estimated Delivery:{" "}
          <span className="font-medium">
            {new Date(data.estimatedDelivery).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
