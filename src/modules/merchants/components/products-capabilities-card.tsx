import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, Package, Tag } from "lucide-react";
import type { MerchantDetails } from "../lib/merchant-details-model";

interface ProductsCapabilitiesCardProps {
  data: MerchantDetails["products"];
}

export function ProductsCapabilitiesCard({
  data,
}: ProductsCapabilitiesCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Listings */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-muted-foreground text-sm font-medium">
              Active Listings
            </h4>
            <Package className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{data.activeListings}</span>
            <Button variant="link" className="text-primary h-auto p-0 text-xs">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-muted-foreground text-sm font-medium">
              Availability
            </h4>
            <Info className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="mt-2">
            <Badge
              variant={
                data.availability === "available" ? "default" : "secondary"
              }
            >
              {data.availability.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Order Size */}
        <div className="bg-card col-span-2 rounded-lg border p-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-muted-foreground text-sm font-medium">
              Typical Order Size
            </h4>
          </div>
          <div className="mt-2 text-lg font-medium capitalize">
            {data.typicalOrderSize} Volume
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Tag className="h-4 w-4" />
          Product Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="px-3 py-1">
              {cat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
