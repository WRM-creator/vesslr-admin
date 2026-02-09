import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { DisputeEvidence } from "./disputes/dispute-evidence";
import { DisputeHeader } from "./disputes/dispute-header";
import { DisputeParties } from "./disputes/dispute-parties";
import { DisputeResolution } from "./disputes/dispute-resolution";
import { MOCK_DISPUTE } from "./disputes/dispute-types";

export const MOCK_ESCROW_STATUS = {
  status: "funds_locked",
  lockedAmount: 880000000,
  releaseReady: true,
  lastActivity: new Date("2023-10-24T10:15:00"),
};

export function TransactionDisputes() {
  // Demo toggle state
  const [showDemoDispute, setShowDemoDispute] = useState(true);

  if (!showDemoDispute) {
    return <DisputeEmptyState onCreate={() => setShowDemoDispute(true)} />;
  }

  return (
    <div className="animate-in fade-in space-y-4 duration-500">
      <DisputeHeader dispute={MOCK_DISPUTE} />
      <DisputeParties dispute={MOCK_DISPUTE} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DisputeEvidence dispute={MOCK_DISPUTE} />
        </div>
        <div className="lg:col-span-1">
          <DisputeResolution
            dispute={MOCK_DISPUTE}
            escrowStatus={MOCK_ESCROW_STATUS}
          />
        </div>
      </div>
    </div>
  );
}

function DisputeEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>No Active Disputes</EmptyTitle>
        <EmptyDescription>
          There are no disputes currently active for this transaction. If an
          issue requires intervention, a dispute record will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onCreate}>
          Simulate Dispute (Demo)
        </Button>
      </EmptyContent>
    </Empty>
  );
}
