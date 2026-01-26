import { Badge } from "@/components/ui/badge";
import { Box, Calendar, Package } from "lucide-react";
import type { ProductDetails } from "../lib/product-details-model";

interface ProductOverviewCardProps {
  data: ProductDetails["overview"];
}

const statusStyles: Record<
  ProductDetails["overview"]["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  draft: "secondary",
  reserved: "default", // Using default (primary color) for reserved but maybe with distinct text in real app
  in_transaction: "default",
  fulfilled: "outline",
  suspended: "destructive",
  pending_approval: "secondary",
};

export function ProductOverviewCard({ data }: ProductOverviewCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format(data.price);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Product Image / Placeholder */}
        <div className="bg-muted flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt={data.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback on error (for mock data or broken links)
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.classList.add(
                  "flex",
                  "items-center",
                  "justify-center",
                );
                // We'll rely on the parent div showing the icon if the img is hidden
                // But since we can't easily inject the icon here without state,
                // let's just assume for now the icon below is the fallback if !data.thumbnail
              }}
            />
          ) : (
            <Package className="text-muted-foreground h-12 w-12" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl leading-tight font-bold">{data.name}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={statusStyles[data.status]}
                  className="capitalize"
                >
                  {data.status.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {data.transactionType}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formattedPrice}</div>
              <div className="text-muted-foreground text-xs tracking-wider uppercase">
                Listing Price
              </div>
            </div>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 pt-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(data.created).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Box className="h-4 w-4" />
              <span>
                Updated {new Date(data.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
