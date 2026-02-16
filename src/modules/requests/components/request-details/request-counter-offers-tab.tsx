import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useState } from "react";
import { AdminNegotiationSheet } from "../../../negotiations/components/admin-negotiation-sheet";
import { AdminCounterOfferCard } from "./admin-counter-offer-card";

interface RequestCounterOffersTabProps {
  requestId: string;
  isAccepted?: boolean;
}

export const RequestCounterOffersTab = ({
  requestId,
  isAccepted,
}: RequestCounterOffersTabProps) => {
  const [selectedNegotiationId, setSelectedNegotiationId] = useState<
    string | undefined
  >();

  const { data: response, isLoading } = api.admin.negotiations.list.useQuery({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { requestId, responseType: "counter_offer" } as any,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const negotiations = (response as any)?.data?.docs;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!negotiations || negotiations.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        No counter offers yet
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {negotiations.map((negotiation: any) => (
          <AdminCounterOfferCard
            key={negotiation._id}
            negotiation={negotiation}
            isAccepted={isAccepted}
            onClick={() => setSelectedNegotiationId(negotiation._id)}
          />
        ))}
      </div>

      <AdminNegotiationSheet
        open={!!selectedNegotiationId}
        onOpenChange={(open) => {
          if (!open) setSelectedNegotiationId(undefined);
        }}
        negotiationId={selectedNegotiationId}
      />
    </>
  );
};
