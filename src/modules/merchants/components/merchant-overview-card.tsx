import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Store } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface MerchantOverviewCardProps {
  data: MerchantDetails["overview"];
}

export function MerchantOverviewCard({ data }: MerchantOverviewCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Logo / Avatar Placeholder */}
        <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border">
          {data.logo ? (
            <img
              src={data.logo}
              alt={data.companyName}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <Store className="text-muted-foreground h-10 w-10" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{data.companyName}</h3>
            <Badge
              variant={data.merchantType === "both" ? "default" : "secondary"}
              className="capitalize"
            >
              {data.merchantType}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl text-base">
            {data.shortDescription}
          </p>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>
                {data.merchantType === "buyer"
                  ? "Active Buyer"
                  : "Active Seller"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Est. {data.yearEstablished}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
