import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Map, ShieldCheck, Truck } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface LogisticsFulfillmentCardProps {
  data: MerchantDetails["logistics"];
}

export function LogisticsFulfillmentCard({
  data,
}: LogisticsFulfillmentCardProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Delivery Methods */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Truck className="h-4 w-4" />
            Delivery Methods
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.deliveryMethods.map((method) => (
              <Badge key={method} variant="outline" className="bg-muted/50">
                {method}
              </Badge>
            ))}
          </div>
        </div>

        {/* Reliability Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Fulfillment Reliability
            </h4>
            <span className="font-bold">{data.reliabilityScore}%</span>
          </div>
          <Progress value={data.reliabilityScore} className="h-2" />
          <p className="text-muted-foreground text-xs">
            On-time delivery performance
          </p>
        </div>
      </div>

      {/* Regions Served */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Map className="h-4 w-4" />
          Regions Served
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.regionsServed.map((region) => (
            <Badge key={region} variant="secondary">
              {region}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
