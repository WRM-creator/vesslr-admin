import { DocumentViewerSheet } from "@/components/shared/document-viewer-sheet";
import { DocumentsGrid } from "@/components/shared/documents-grid";
import type { ViewableItem } from "@/components/shared/viewable-item";
import type { ProductResponseDto } from "@/lib/api/generated";
import { useMemo, useState } from "react";
import { ProductDetailsCard } from "./product-details-card";
import { ProductInventoryCard } from "./product-inventory-card";
import { ProductListingCard } from "./product-listing-card";
import { ProductLocationCard } from "./product-location-card";
import { ProductSpecificationsCards } from "./product-specifications-cards";

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

  const hasListingInfo =
    product.listingType ||
    (product.conditions && product.conditions.length > 0);

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
      <ProductDetailsCard
        description={product.description}
        features={product.features}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {hasInventoryDetails && (
          <ProductInventoryCard
            availableQuantity={product.availableQuantity}
            minimumOrderQuantity={product.minimumOrderQuantity}
            maximumOrderQuantity={product.maximumOrderQuantity}
            unitOfMeasurement={product.unitOfMeasurement}
          />
        )}

        {hasListingInfo && (
          <ProductListingCard
            listingType={product.listingType}
            conditions={product.conditions}
          />
        )}
      </div>

      {hasLocation && (
        <ProductLocationCard
          address={product.location?.address}
          state={product.location?.state?.name}
          region={product.location?.region?.name}
          country={product.location?.country?.name}
        />
      )}

      {product.specifications && (
        <ProductSpecificationsCards specifications={product.specifications} />
      )}

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
