import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Droplet } from "lucide-react";

interface TransactionDealTicketProps {
  product: {
    name: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    total: number;
  };
  type: string;
}

export function TransactionDealTicket({
  product,
  type,
}: TransactionDealTicketProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: The Asset */}
        <div className="flex items-start gap-2">
          <div className="bg-muted text-foreground/70 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
            <Droplet className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-tight">
                {product.name}
              </h3>
              <Badge
                variant="outline"
                className="text-muted-foreground border-border font-normal capitalize"
              >
                {type.replace("_", " ")}
              </Badge>
            </div>
            <div className="text-muted-foreground text-sm">
              {product.quantity.toLocaleString()} {product.unit} @{" "}
              {formatCurrency(product.pricePerUnit)} / {product.unit}
            </div>
          </div>
        </div>

        {/* Right: The Financials */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Total Value
          </div>
          <div className="text-foreground bg-clip-text text-xl font-bold tracking-tight">
            {formatCurrency(product.total)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
