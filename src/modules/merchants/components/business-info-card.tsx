import { Button } from "@/components/ui/button";
import { Building, Globe, Mail, MapPin } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface BusinessInfoCardProps {
  data: MerchantDetails["business"];
}

export function BusinessInfoCard({ data }: BusinessInfoCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Registered Name */}
        <div className="space-y-1">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Building className="h-4 w-4" />
            Registered Entity
          </h4>
          <p className="text-base font-medium">{data.registeredName}</p>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Business Address
          </h4>
          <p className="text-base">
            {data.city}, {data.country}
          </p>
        </div>

        {/* Country of Operation */}
        <div className="space-y-1">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4" />
            Country of Operation
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-base">{data.country}</span>
            <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-xs">
              {data.countryCode}
            </span>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-1">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4" />
            Contact
          </h4>
          {data.contactEnabled ? (
            <Button variant="outline" size="sm" className="h-8">
              Contact via Platform
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Platform contact disabled
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
