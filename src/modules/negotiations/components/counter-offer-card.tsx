import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOfferCountdown } from "@/modules/negotiations/hooks/use-offer-countdown";

// Mimic the type or use any
interface OfferCardProps {
  entry: any;
  previousOffer?: any;
  isLatestOffer?: boolean;
  offerExpiresAt?: string;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

function OldValue({ value }: { value: string | number }) {
  return (
    <span className="text-muted-foreground ml-1 line-through opacity-60">
      {value}
    </span>
  );
}

export const CounterOfferCard = ({
  entry,
  previousOffer,
  isLatestOffer,
  offerExpiresAt,
}: OfferCardProps) => {
  const offer = entry.offer;
  if (!offer) return null;

  const timestamp = new Date(entry.createdAt).toLocaleString();
  const countdown = useOfferCountdown(
    isLatestOffer ? offerExpiresAt : undefined,
  );

  return (
    <div className={cn("flex justify-start")}>
      <Card className={cn("border-muted bg-muted/30 w-full max-w-[85%] py-0")}>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-semibold">
              {entry.authorName || "Unknown"}
            </p>
            <div className="flex items-center gap-2">
              {isLatestOffer && countdown.isExpired && (
                <span className="text-xs font-medium text-red-500">
                  Expired
                </span>
              )}
              {isLatestOffer &&
                !countdown.isExpired &&
                countdown.timeRemaining && (
                  <span className="text-xs font-medium text-amber-600">
                    Expires in {countdown.timeRemaining}
                  </span>
                )}
              <p className="text-muted-foreground text-xs">{timestamp}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Price Per Unit
              </p>
              <p className="font-semibold">
                {formatCurrency(offer.pricePerUnit, offer.currency)}{" "}
                {previousOffer &&
                  offer.pricePerUnit !== previousOffer.pricePerUnit && (
                    <OldValue
                      value={formatCurrency(
                        previousOffer.pricePerUnit,
                        previousOffer.currency,
                      )}
                    />
                  )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Quantity
              </p>
              <p className="font-semibold">
                {offer.quantity.toLocaleString()} {offer.unitOfMeasurement}{" "}
                {previousOffer && offer.quantity !== previousOffer.quantity && (
                  <OldValue value={previousOffer.quantity.toLocaleString()} />
                )}
              </p>
            </div>
            {offer.transactionType && (
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Transaction
                </p>
                <p className="font-medium">{offer.transactionType}</p>
              </div>
            )}
            {offer.condition && (
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Condition
                </p>
                <p className="font-medium">{offer.condition}</p>
              </div>
            )}
            {offer.paymentTerms && (
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Payment Terms
                </p>
                <p className="font-medium">{offer.paymentTerms}</p>
              </div>
            )}
            {offer.incoterms && (
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Incoterms
                </p>
                <p className="font-medium">{offer.incoterms}</p>
              </div>
            )}
            {offer.deliveryDate && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Delivery Date
                </p>
                <p className="font-medium">
                  {new Date(offer.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {offer.notes && (
            <p className="text-muted-foreground border-muted-foreground/10 border-t pt-2 text-sm italic">
              {offer.notes}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
