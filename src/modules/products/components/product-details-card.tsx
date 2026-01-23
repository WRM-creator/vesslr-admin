import type { ProductDetails } from "../lib/product-details-model";

interface ProductDetailsCardProps {
  data: ProductDetails["specs"];
}

export function ProductDetailsCard({ data }: ProductDetailsCardProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="space-y-2">
        <h4 className="text-muted-foreground text-sm font-medium">
          Description
        </h4>
        <p className="text-sm leading-relaxed">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Core Info */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground border-b pb-2 text-sm font-medium">
            Core Specifications
          </h4>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-muted-foreground">Condition</div>
            <div className="font-medium capitalize">{data.condition}</div>

            {data.brand && (
              <>
                <div className="text-muted-foreground">Brand</div>
                <div className="font-medium">{data.brand}</div>
              </>
            )}

            {data.model && (
              <>
                <div className="text-muted-foreground">Model</div>
                <div className="font-medium">{data.model}</div>
              </>
            )}

            {data.sku && (
              <>
                <div className="text-muted-foreground">SKU</div>
                <div className="bg-muted w-fit rounded px-2 py-0.5 font-mono text-xs">
                  {data.sku}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <h4 className="text-muted-foreground border-b pb-2 text-sm font-medium">
            Inventory Status
          </h4>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-muted-foreground">Total Units</div>
            <div className="font-medium">{data.inventory.total}</div>

            <div className="text-muted-foreground">Available</div>
            <div className="font-medium text-green-600">
              {data.inventory.available}
            </div>

            <div className="text-muted-foreground">Reserved</div>
            <div className="font-medium text-amber-600">
              {data.inventory.reserved}
            </div>

            <div className="text-muted-foreground">Sold</div>
            <div className="font-medium">{data.inventory.sold}</div>
          </div>
        </div>
      </div>

      {/* Additional Attributes */}
      {data.attributes.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="text-muted-foreground border-b pb-2 text-sm font-medium">
            Additional Attributes
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            {data.attributes.map((attr, index) => (
              <div key={index} className="space-y-1">
                <div className="text-muted-foreground text-xs">{attr.key}</div>
                <div className="font-medium">{attr.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
