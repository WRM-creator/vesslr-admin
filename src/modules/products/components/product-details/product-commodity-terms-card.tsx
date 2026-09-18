import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductResponseDto } from "@/lib/api/generated";
import { format } from "date-fns";
import { DetailRow } from "./detail-row";

type ContractStyle = NonNullable<ProductResponseDto["contractStyle"]>;
type Availability = NonNullable<ProductResponseDto["availability"]>;
type PaymentTerms = NonNullable<ProductResponseDto["paymentTerms"]>;
type ShippingRegion = NonNullable<
  ProductResponseDto["shippingRegions"]
>[number];

// The seller-facing labels, kept identical to the frontend's
// `lib/commodity-listing.ts` so a reviewer reads what the seller chose.
const CONTRACT_STYLE_LABELS: Record<ContractStyle, string> = {
  spot: "Spot Trade",
  term: "Term Contracts",
};

const AVAILABILITY_LABELS: Record<Availability, string> = {
  available: "Available: buyers may place an order",
  indicative: "Indicative: buyers respond with a request",
  request_only: "Request only: terms agreed through a request",
};

const PAYMENT_TERMS_LABELS: Record<PaymentTerms, string> = {
  first_tranche_balance_on_title_transfer:
    "First tranche + balance on title transfer",
};

const SHIPPING_REGION_LABELS: Record<ShippingRegion, string> = {
  west_africa: "West Africa",
  northwest_europe: "Northwest Europe",
  mediterranean: "Mediterranean",
  us_gulf: "US Gulf",
  asia_pacific: "Asia Pacific",
  middle_east: "Middle East",
};

const formatDate = (value?: string) =>
  value ? format(new Date(value), "MMM d, yyyy") : undefined;

/**
 * The terms a seller declares on a commodity listing, laid out as buyers will
 * read them, so the reviewer approves exactly what goes live.
 */
export function ProductCommodityTermsCard({
  product,
}: {
  product: ProductResponseDto;
}) {
  const expiresAt = product.listingExpiresAt
    ? new Date(product.listingExpiresAt)
    : undefined;
  const expired = !!expiresAt && expiresAt <= new Date();

  const terms: { label: string; value?: React.ReactNode }[] = [
    {
      label: "Contract style",
      value: product.contractStyle && CONTRACT_STYLE_LABELS[product.contractStyle],
    },
    {
      label: "Availability",
      value: product.availability && AVAILABILITY_LABELS[product.availability],
    },
    { label: "Availability note", value: product.availabilityNote },
    {
      label: "Payment terms",
      value: product.paymentTerms && PAYMENT_TERMS_LABELS[product.paymentTerms],
    },
    {
      label: "Tolerance",
      value:
        product.tolerancePercent != null
          ? `+/- ${product.tolerancePercent}%`
          : undefined,
    },
    {
      label: "Listing expires",
      value: expiresAt && (
        <span className="inline-flex items-center gap-2">
          {formatDate(product.listingExpiresAt)}
          {expired && <Badge variant="secondary">Expired</Badge>}
        </span>
      ),
    },
  ];

  const delivery: { label: string; value?: React.ReactNode }[] = [
    { label: "Loading terminal", value: product.loadingTerminal?.name },
    {
      label: "Laycan",
      value:
        product.laycan?.start && product.laycan?.end
          ? `${formatDate(product.laycan.start)} to ${formatDate(product.laycan.end)}`
          : undefined,
    },
    {
      label: "Shipping regions",
      value: product.shippingRegions
        ?.map((region) => SHIPPING_REGION_LABELS[region] ?? region)
        .join(", "),
    },
  ];

  // A declaration without a value is an empty row the seller left behind.
  const specifications = (product.specDeclarations ?? []).filter(
    (declaration) =>
      declaration.value !== undefined &&
      declaration.value !== null &&
      String(declaration.value) !== "",
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Commercial terms</CardTitle>
            <CardDescription>As declared by the seller.</CardDescription>
          </CardHeader>
          <CardContent>
            {terms
              .filter((row) => !!row.value)
              .map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
            <CardDescription>
              Where and when the cargo loads. Buyers name the destination.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {delivery
              .filter((row) => !!row.value)
              .map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {specifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Declared specifications</CardTitle>
              <CardDescription>
                Values the seller commits to; inspection checks against these.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {specifications.map((declaration) => {
                // The DTO types a declared value as an opaque record; it is a
                // number or a string in practice.
                const value = declaration.value as unknown as number | string;
                return (
                  <DetailRow
                    key={declaration.key}
                    label={declaration.label ?? declaration.key}
                    value={[
                      typeof value === "number"
                        ? value.toLocaleString("en-US")
                        : String(value),
                      declaration.unit,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                );
              })}
            </CardContent>
          </Card>
        )}

        {(product.tradeDocuments?.length ?? 0) > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Trade documents</CardTitle>
              <CardDescription>
                Availability only. Files are exchanged inside the transaction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.tradeDocuments?.map((document) => (
                <DetailRow
                  key={document.key}
                  label={document.name}
                  value={
                    document.status === "available" ? (
                      <Badge variant="secondary">Available</Badge>
                    ) : (
                      <span className="text-muted-foreground font-normal">
                        To be advised
                      </span>
                    )
                  }
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
