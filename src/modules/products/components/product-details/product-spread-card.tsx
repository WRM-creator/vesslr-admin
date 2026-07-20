import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { fromMinorUnit } from "@/lib/currency";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDifferentialFormula } from "@/modules/transactions/components/differential-formula";

interface ProductSpreadCardProps {
  product: {
    _id: string;
    status?: string;
    pricingBasis?: string;
    differentialPrice?: {
      benchmarkId: unknown;
      differentialValue: number;
      differentialCurrency: string;
    } | null;
    currency?: string;
    unitOfMeasurement?: string;
    spreadPerUnit?: number;
    spreadFrozenAt?: string | Date | null;
  };
}

/**
 * Admin-only view and (pre-approval) editor of the hidden platform spread on
 * a differential listing. Storage is seller-basis; buyers see the seller
 * differential shifted up by the spread. Once the listing is approved the
 * spread is frozen: buyers have seen the quoted number.
 */
export function ProductSpreadCard({ product }: ProductSpreadCardProps) {
  const isDifferential =
    product.pricingBasis === "differential" && !!product.differentialPrice;

  const frozen = !!product.spreadFrozenAt || product.status === "approved";
  const currentSpread = product.spreadPerUnit ?? 0;
  // The differential and the spread are quoted in the benchmark's currency;
  // the listing may settle in another.
  const formulaCurrency =
    product.differentialPrice?.differentialCurrency ?? product.currency ?? "USD";
  const settlesElsewhere =
    !!product.currency && product.currency !== formulaCurrency;
  const [spreadInput, setSpreadInput] = useState<number>(currentSpread);

  const { mutate: updateProduct, isPending } =
    api.admin.products.update.useMutation();

  const sellerFormula = useDifferentialFormula(
    isDifferential
      ? {
          pricingBasis: "differential",
          differentialPrice: product.differentialPrice as never,
          currency: (product.currency ?? "USD") as never,
          unitOfMeasurement: (product.unitOfMeasurement ?? "") as never,
        }
      : null,
  );
  const buyerFormula = useDifferentialFormula(
    isDifferential
      ? {
          pricingBasis: "differential",
          differentialPrice: {
            ...(product.differentialPrice as object),
            differentialValue:
              (product.differentialPrice?.differentialValue ?? 0) +
              currentSpread,
          } as never,
          currency: (product.currency ?? "USD") as never,
          unitOfMeasurement: (product.unitOfMeasurement ?? "") as never,
        }
      : null,
  );

  if (!isDifferential) return null;

  const saveSpread = () => {
    updateProduct(
      { path: { id: product._id }, body: { spreadPerUnit: spreadInput } },
      {
        onSuccess: () => toast.success("Platform spread updated"),
        onError: (e: unknown) =>
          toast.error(
            e instanceof Error && e.message
              ? e.message
              : "Failed to update the spread",
          ),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Platform Spread</CardTitle>
            <CardDescription>
              Admin-only. The buyer is quoted the seller differential plus this
              per-unit spread; neither party ever sees a fee line. Quoted in{" "}
              {formulaCurrency}
              {settlesElsewhere
                ? `, converted to ${product.currency} at the rate agreed when funding is confirmed.`
                : "."}
            </CardDescription>
          </div>
          {frozen && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Frozen
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs">Seller quotes</p>
            <p className="text-sm font-medium">
              {sellerFormula.formula ?? "…"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs">Spread per unit</p>
            <p className="text-sm font-medium">
              {fromMinorUnit(currentSpread, formulaCurrency).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 },
              )}{" "}
              {formulaCurrency}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs">Buyer sees</p>
            <p className="text-sm font-medium">{buyerFormula.formula ?? "…"}</p>
          </div>
        </div>

        {!frozen && (
          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="spread-input">
              Adjust spread ({formulaCurrency} minor units per unit)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="spread-input"
                type="number"
                min={0}
                step={1}
                value={spreadInput}
                onChange={(e) => setSpreadInput(Number(e.target.value))}
                className="w-48"
                disabled={isPending}
              />
              <Button
                size="sm"
                onClick={saveSpread}
                disabled={isPending || spreadInput === currentSpread}
              >
                {isPending && (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                )}
                Save
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Editable until the listing is approved. Approval freezes the
              spread permanently.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
