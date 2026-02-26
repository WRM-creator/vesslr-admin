import type { ProductResponseDto } from "@/lib/api/generated";

interface ProductComplianceTabProps {
  product: ProductResponseDto;
}

export function ProductComplianceTab({ product }: ProductComplianceTabProps) {
  const docs = product.documents ?? [];

  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted-foreground">
        Compliance information for product ID: {product._id}
      </p>
      {docs.length > 0 ? (
        <ul className="space-y-1">
          {docs.map((doc, i) => (
            <li key={i} className="truncate font-mono text-xs">
              {doc}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground italic">No compliance documents uploaded.</p>
      )}
    </div>
  );
}
