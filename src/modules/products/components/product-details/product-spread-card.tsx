import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fromMinorUnit } from "@/lib/currency";
import type { SellerFeeDto } from "@/lib/api/generated/types.gen";
import { useDifferentialFormula } from "@/modules/transactions/components/differential-formula";

interface ProductSellerFeeCardProps {
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
    sellerFee?: SellerFeeDto;
  };
}

const formatMinor = (amount: number, currency: string) =>
  `${fromMinorUnit(amount, currency).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;

/**
 * Read-only view of the disclosed platform fee resolved for a differential
 * listing (category override ?? group default). The fee is a SELLER deduction
 * from the listed price: the buyer pays exactly what is listed, and this card
 * shows the same gross / fee / net picture the seller sees. The fee itself is
 * configured on the category or category group, not per listing.
 */
export function ProductSpreadCard({ product }: ProductSellerFeeCardProps) {
  const isDifferential =
    product.pricingBasis === "differential" && !!product.differentialPrice;

  const fee = product.sellerFee;
  const formulaCurrency =
    fee?.currency ??
    product.differentialPrice?.differentialCurrency ??
    product.currency ??
    "USD";

  const listedFormula = useDifferentialFormula(
    isDifferential
      ? {
          pricingBasis: "differential",
          differentialPrice: product.differentialPrice as never,
          currency: (product.currency ?? "USD") as never,
          unitOfMeasurement: (product.unitOfMeasurement ?? "") as never,
        }
      : null,
  );
  const netFormula = useDifferentialFormula(
    isDifferential && fee
      ? {
          pricingBasis: "differential",
          differentialPrice: {
            ...(product.differentialPrice as object),
            differentialValue:
              (product.differentialPrice?.differentialValue ?? 0) -
              fee.feePerUnit,
          } as never,
          currency: (product.currency ?? "USD") as never,
          unitOfMeasurement: (product.unitOfMeasurement ?? "") as never,
        }
      : null,
  );

  if (!isDifferential) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Fee</CardTitle>
        <CardDescription>
          Disclosed seller fee resolved from the category configuration. The
          buyer pays exactly the listed price; the fee is deducted from the
          seller&apos;s proceeds at settlement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fee ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">
                Listed price (buyer pays)
              </p>
              <p className="text-sm font-medium">
                {listedFormula.formula ?? "…"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">Vesslr fee</p>
              <p className="text-sm font-medium">
                − {formatMinor(fee.feePerUnit, formulaCurrency)}
                {fee.unit ? ` / ${fee.unit}` : ""}
              </p>
              {(fee.minFee != null || fee.maxFee != null) && (
                <p className="text-muted-foreground text-xs">
                  {fee.minFee != null &&
                    `min ${formatMinor(fee.minFee, formulaCurrency)}`}
                  {fee.minFee != null && fee.maxFee != null && " · "}
                  {fee.maxFee != null &&
                    `max ${formatMinor(fee.maxFee, formulaCurrency)}`}
                </p>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">Seller receives</p>
              <p className="text-sm font-medium">{netFormula.formula ?? "…"}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No seller fee is configured for this listing&apos;s category — the
            deal flows fee-free until one is set on the category or group.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
