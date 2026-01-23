import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import type { TransactionDetails } from "../lib/transaction-details-model";

interface TransactionDetailsCardProps {
  product: TransactionDetails["product"];
  financials: TransactionDetails["financials"];
}

export function TransactionDetailsCard({
  product,
  financials,
}: TransactionDetailsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: financials.currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Product Section */}
      <div className="flex items-start gap-4">
        <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
          {product.thumbnail && !product.thumbnail.includes("placeholder") ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package className="text-muted-foreground h-8 w-8" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <Link
                to={`/categories/${product.categoryId}`}
                className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm hover:underline"
              >
                {product.category}
              </Link>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">
              Qty: {product.quantity} {product.unit}
            </Badge>
            <Badge variant="secondary" className="font-mono">
              ID: {product.id}
            </Badge>
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* Financials Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Unit Price</span>
          <span className="font-mono">
            {formatCurrency(financials.unitPrice)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({product.quantity} units)
          </span>
          <span className="font-mono">
            {formatCurrency(financials.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            Platform Fee
            <span className="bg-muted rounded px-1 text-xs">2%</span>
          </span>
          <span className="font-mono">
            {formatCurrency(financials.platformFee)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            Escrow & Handling
            <span className="bg-muted rounded px-1 text-xs">1%</span>
          </span>
          <span className="font-mono">
            {formatCurrency(financials.escrowFee)}
          </span>
        </div>

        <div className="flex items-end justify-between border-t pt-3">
          <span className="font-semibold">Total Transaction Value</span>
          <span className="text-xl font-bold">
            {formatCurrency(financials.totalValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
