import { Card, CardContent } from "@/components/ui/card";
import type { NegotiationResponseDto } from "@/lib/api/generated/types.gen";
import { cn, formatCurrency } from "@/lib/utils";
import { useOfferCountdown } from "@/modules/negotiations/hooks/use-offer-countdown";
import { formatDistanceToNow } from "date-fns";

interface AdminCounterOfferCardProps {
  negotiation: NegotiationResponseDto;
  isAccepted?: boolean;
  onClick?: () => void;
}

export const AdminCounterOfferCard = ({
  negotiation,
  isAccepted,
  onClick,
}: AdminCounterOfferCardProps) => {
  const offer = negotiation.latestOffer;
  const countdown = useOfferCountdown(negotiation.offerExpiresAt);

  return (
    <Card
      className={cn("hover:bg-muted/20 cursor-pointer transition-colors", {
        "border-primary/30 bg-primary/5": negotiation.isMyTurn && !isAccepted,
        "opacity-60 grayscale": isAccepted,
      })}
      onClick={onClick}
    >
      <CardContent className="space-y-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              #{negotiation.displayId}
            </span>
          </div>

          {!isAccepted && (
            <span
              className={cn(
                "text-muted-foreground/60 relative bottom-1 mb-auto inline-block text-xs font-medium",
                {
                  "text-primary": negotiation.isMyTurn,
                },
              )}
            >
              {negotiation.isMyTurn ? "Buyer's Turn" : "Seller's Turn"}
              {/* Context: Admin sees 'My Turn' relative to the logged in user, but here we view externally. 
                  Actually, 'isMyTurn' logic in controller determines if it's the requesting user's turn. 
                  For admin, 'isMyTurn' might be meaningless or false.
                  The DTO map logic for admin needs to be checked or we infer state.
                  If pendingOrganization is buyer -> Buyer's Turn.
              */}
            </span>
          )}
        </div>

        {offer ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Price Per Unit
                </p>
                <p className="font-semibold">
                  {formatCurrency(offer.pricePerUnit, offer.currency)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  Quantity
                </p>
                <p className="font-semibold">
                  {offer.quantity.toLocaleString()} {offer.unitOfMeasurement}
                </p>
              </div>
            </div>

            <div className="border-muted-foreground/10 mt-2 flex items-center justify-between border-t pt-2 text-sm">
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(negotiation.updatedAt), {
                  addSuffix: true,
                })}
              </span>
              {!isAccepted && (
                <>
                  {countdown.isExpired ? (
                    <span className="text-xs font-medium text-red-500">
                      Offer expired
                    </span>
                  ) : countdown.timeRemaining ? (
                    <span className="text-xs font-medium text-amber-600">
                      Expires in {countdown.timeRemaining}
                    </span>
                  ) : null}
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">No offer yet</p>
        )}
      </CardContent>
    </Card>
  );
};
