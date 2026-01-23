import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Globe, Hash, MapPin } from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerBusinessInfoCardProps {
  data: CustomerDetails["business"];
}

export function CustomerBusinessInfoCard({
  data,
}: CustomerBusinessInfoCardProps) {
  if (!data)
    return (
      <div className="text-muted-foreground p-4">
        No business information available
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Info */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4" />
            Corporate Details
          </h4>

          <div className="grid gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <span className="text-muted-foreground text-xs font-medium uppercase">
                Registered Name
              </span>
              <div className="mt-1 font-medium">{data.companyName}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
                  <Hash className="h-3 w-3" />
                  Reg. Number
                </span>
                <div className="mt-1 font-mono text-sm">
                  {data.registrationNumber}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
                  <FileText className="h-3 w-3" />
                  Tax ID
                </span>
                <div className="mt-1 font-mono text-sm">{data.taxId}</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase">
                <Globe className="h-3 w-3" />
                Jurisdiction
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg">
                  {data.countryCode === "NG"
                    ? "🇳🇬"
                    : data.countryCode === "US"
                      ? "🇺🇸"
                      : "🌐"}
                </span>
                <span className="font-medium">{data.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4" />
            Addresses
          </h4>

          <div className="space-y-3">
            {data.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="bg-muted/50 hover:border-border rounded-lg border border-transparent p-3 transition-colors"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="h-5 text-xs capitalize">
                    {addr.type}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-sm leading-relaxed">
                  <div>{addr.line1}</div>
                  {addr.line2 && <div>{addr.line2}</div>}
                  <div>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </div>
                  <div>{addr.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
