import { Card, CardContent } from "@/components/ui/card";
import type { NegotiationResponseDto } from "@/lib/api/generated/types.gen";
import { cn, formatCurrency } from "@/lib/utils";
import { useOfferCountdown } from "@/modules/negotiations/hooks/use-offer-countdown";

interface AdminAcceptOfferCardProps {
  negotiation: NegotiationResponseDto;
  isAccepted?: boolean;
  onClick?: () => void;
}

export const AdminAcceptOfferCard = ({
  negotiation,
  isAccepted,
  onClick,
}: AdminAcceptOfferCardProps) => {
  const countdown = useOfferCountdown(negotiation.offerExpiresAt);
  const offer = negotiation.latestOffer;

  if (!offer) return null;

  return (
    <Card
      className={cn("hover:bg-muted/20 cursor-pointer py-3 transition-colors", {
        "border-primary/30 bg-primary/5": negotiation.isMyTurn && !isAccepted,
        "opacity-60": isAccepted || countdown.isExpired,
      })}
      onClick={onClick}
    >
      <CardContent className="space-y-3 px-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">
              {negotiation.sellerOrganization.name || "Seller"}
            </h3>
            {/* 
            <p className="text-muted-foreground text-xs">98% completion rate</p>
             TODO: Add seller metrics if available in DTO
            */}
          </div>
          {!isAccepted && (
            <div className="mb-auto text-right">
              {countdown.isExpired ? (
                <span className="text-xs font-medium text-red-500">
                  Offer expired
                </span>
              ) : countdown.timeRemaining ? (
                <span className="text-xs font-medium text-amber-600">
                  Expires in {countdown.timeRemaining}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground text-xs uppercase">
              Price
            </span>
            <p className="font-medium">
              {formatCurrency(offer.pricePerUnit, offer.currency)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs uppercase">Qty</span>
            <p className="font-medium">
              {offer.quantity} {offer.unitOfMeasurement}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
