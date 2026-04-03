import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DocumentViewerSheet } from "@/components/shared/document-viewer-sheet";
import { DocumentsGrid } from "@/components/shared/documents-grid";
import type { ViewableItem } from "@/components/shared/viewable-item";
import type { ProductResponseDto } from "@/lib/api/generated";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";

function getFilename(url: string): string {
  try {
    const decoded = decodeURIComponent(url.split("?")[0]);
    const parts = decoded.split("/");
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

function guessType(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".pdf")) return "application/pdf";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm [&:not(:last-child)]:border-b">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium">{value ?? "—"}</span>
    </div>
  );
}

interface ProductOverviewTabProps {
  product: ProductResponseDto;
}

export function ProductOverviewTab({ product }: ProductOverviewTabProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const hasInventoryDetails =
    product.availableQuantity != null ||
    product.minimumOrderQuantity != null ||
    product.maximumOrderQuantity != null ||
    !!product.unitOfMeasurement;

  const hasLocation =
    product.location?.address ||
    product.location?.country?.name ||
    product.location?.region?.name ||
    product.location?.state?.name;

  const documents = useMemo<ViewableItem[]>(
    () =>
      (product.documents ?? []).map((url) => {
        const name = getFilename(url);
        return { url, name, type: guessType(url), source: "uploaded", label: name };
      }),
    [product.documents],
  );

  return (
    <div className="space-y-4">
      {/* Description, features, conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {product.description ? (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              No description provided.
            </p>
          )}

          {product.features && product.features.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold uppercase">
                  Features
                </p>
                <ul className="space-y-1.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Inventory */}
        {hasInventoryDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {product.availableQuantity != null && (
                <DetailRow
                  label="Available quantity"
                  value={`${product.availableQuantity} ${product.unitOfMeasurement ?? "units"}`}
                />
              )}
              {product.minimumOrderQuantity != null && (
                <DetailRow
                  label="Minimum order"
                  value={`${product.minimumOrderQuantity} ${product.unitOfMeasurement ?? "units"}`}
                />
              )}
              {product.maximumOrderQuantity != null && (
                <DetailRow
                  label="Maximum order"
                  value={`${product.maximumOrderQuantity} ${product.unitOfMeasurement ?? "units"}`}
                />
              )}
              {product.unitOfMeasurement && (
                <DetailRow
                  label="Unit of measurement"
                  value={product.unitOfMeasurement}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Listing Type & Conditions */}
        {(product.listingType ||
          (product.conditions && product.conditions.length > 0)) && (
          <Card>
            <CardHeader>
              <CardTitle>Listing Type & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.listingType && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Listing Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {product.listingType}
                    </Badge>
                  </div>
                </div>
              )}
              {product.conditions && product.conditions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Condition
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.conditions.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Location */}
      {hasLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
              <span className="text-muted-foreground">
                {[
                  product.location?.address,
                  product.location?.state?.name,
                  product.location?.region?.name,
                  product.location?.country?.name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <DocumentsGrid
        items={documents}
        onSelect={(index) => {
          setViewerIndex(index);
          setViewerOpen(true);
        }}
      />

      <DocumentViewerSheet
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={documents}
        currentIndex={viewerIndex}
        onNavigate={setViewerIndex}
      />
    </div>
  );
}
