import type { ProductResponseDto } from "@/lib/api/generated";

interface ProductOverviewTabProps {
  product: ProductResponseDto;
}

export function ProductOverviewTab({ product }: ProductOverviewTabProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-y-3">
        <span className="text-muted-foreground">Title</span>
        <span className="font-medium">{product.title}</span>

        {product.description && (
          <>
            <span className="text-muted-foreground">Description</span>
            <span>{product.description}</span>
          </>
        )}

        <span className="text-muted-foreground">Price per unit</span>
        <span className="font-medium">
          {product.pricePerUnit} {product.currency}
        </span>

        <span className="text-muted-foreground">Status</span>
        <span className="capitalize">{product.status ?? "—"}</span>

        {product.availableQuantity != null && (
          <>
            <span className="text-muted-foreground">Available quantity</span>
            <span>{product.availableQuantity}</span>
          </>
        )}

        {product.unitOfMeasurement && (
          <>
            <span className="text-muted-foreground">Unit of measurement</span>
            <span>{product.unitOfMeasurement}</span>
          </>
        )}
      </div>
    </div>
  );
}
