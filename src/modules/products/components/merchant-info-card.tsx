import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, ShieldAlert, Store } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductDetails } from "../lib/product-details-model";

interface MerchantInfoCardProps {
  data: ProductDetails["merchant"];
}

export function MerchantInfoCard({ data }: MerchantInfoCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
          {data.logo ? (
            <img
              src={data.logo}
              alt={data.name}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <Store className="text-muted-foreground h-6 w-6" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="leading-none font-semibold">{data.name}</div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`flex items-center gap-1 ${
                data.verificationStatus === "verified"
                  ? "text-green-600"
                  : data.verificationStatus === "pending"
                    ? "text-amber-600"
                    : "text-muted-foreground"
              }`}
            >
              {data.verificationStatus === "verified" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <ShieldAlert className="h-3 w-3" />
              )}
              <span className="capitalize">{data.verificationStatus}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Trust Score</span>
          <span className="font-medium">{data.trustScore}/100</span>
        </div>
        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
          <div
            className={`h-full ${
              data.trustScore >= 80
                ? "bg-green-500"
                : data.trustScore >= 60
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${data.trustScore}%` }}
          />
        </div>
      </div>

      <Button variant="outline" className="w-full text-xs" asChild>
        <Link to={`/merchants/${data.id}`}>
          View Merchant Profile
          <ArrowUpRight className="ml-2 h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}
