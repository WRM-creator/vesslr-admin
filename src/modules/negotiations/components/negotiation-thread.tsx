import { Separator } from "@/components/ui/separator";
import { useEffect, useRef } from "react";
import { CounterOfferCard } from "./counter-offer-card";
import { MessageBubble } from "./message-bubble";
import { NegotiationStatusBadge } from "./negotiation-status-badge";

interface NegotiationThreadProps {
  negotiation: any;
}

export const NegotiationThread = ({
  negotiation: neg,
}: NegotiationThreadProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [neg?.entries?.length]);

  if (!neg) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">Negotiation not found</p>
      </div>
    );
  }

  const entries = neg.entries || [];

  // Build a map of previous offers for diff comparison
  const offerEntries = entries.filter(
    (e: any) => e.type === "offer" || e.type === "counter_offer",
  );

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Status header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <NegotiationStatusBadge status={neg.status} />
          <span className="text-muted-foreground text-xs">
            #{neg.displayId}
          </span>
        </div>
        {/* Admin view doesn't have "My Turn", but maybe show who is waiting? */}
        {neg.status === "active" && neg.pendingOrganization && (
          <span className="text-muted-foreground text-xs">
            Waiting for {neg.pendingOrganization.name}
          </span>
        )}
      </div>

      <div className="text-muted-foreground px-4 text-xs">
        <span className="text-foreground font-medium">
          {neg.buyerOrganization?.name}
        </span>{" "}
        &harr;{" "}
        <span className="text-foreground font-medium">
          {neg.sellerOrganization?.name}
        </span>
        {neg.request && <span> &middot; Request: {neg.request.name}</span>}
      </div>

      <Separator />

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 pb-4"
      >
        {entries.map((entry: any, index: number) => {
          if (entry.type === "offer" || entry.type === "counter_offer") {
            // Find the previous offer for diff
            const offerIndex = offerEntries.indexOf(entry);
            const previousOffer =
              offerIndex > 0
                ? offerEntries[offerIndex - 1].offer
                : {
                    pricePerUnit: neg.request.targetPricePerUnit || 0,
                    quantity: neg.request.quantity || 0,
                    currency: (neg.request.currency as any) || "USD",
                    unitOfMeasurement: neg.request.unitOfMeasurement || "units",
                  };

            return (
              <CounterOfferCard
                key={index}
                entry={entry}
                previousOffer={previousOffer}
                isLatestOffer={offerIndex === offerEntries.length - 1}
                offerExpiresAt={neg.offerExpiresAt}
              />
            );
          }

          return <MessageBubble key={index} entry={entry} />;
        })}
      </div>
    </div>
  );
};
