import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InformationRequest } from "@/lib/api/disputes";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateRequestDialog } from "./create-request-dialog";
import { RequestItem } from "./request-item";

// ─────────────────────────────────────────────────────────────────────────────
// DisputeInformationRequests
// ─────────────────────────────────────────────────────────────────────────────

interface DisputeInformationRequestsProps {
  dispute: any; // AdminDisputeResponseDto extended with informationRequests
  onUpdate: () => void;
}

export function DisputeInformationRequests({
  dispute,
  onUpdate,
}: DisputeInformationRequestsProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const isResolved = !!dispute.resolution || dispute.status === "withdrawn";
  const requests: InformationRequest[] = dispute.informationRequests ?? [];

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-medium">Information Requests</CardTitle>
            {!isResolved && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Request Information
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No information requests on this dispute.
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <RequestItem
                  key={req._id}
                  request={req}
                  disputeId={dispute._id}
                  onUpdated={onUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateRequestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        disputeId={dispute._id}
        raisedByRole={dispute.raisedByRole}
        onCreated={onUpdate}
      />
    </>
  );
}
