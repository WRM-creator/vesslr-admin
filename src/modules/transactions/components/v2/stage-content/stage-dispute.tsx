import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { DisputeHeader } from "../../disputes/dispute-header";
import { DisputeClaim } from "../../disputes/dispute-claim";
import { DisputeInformationRequests } from "../../disputes/dispute-information-requests";
import { DisputeResolution } from "../../disputes/dispute-resolution";
import { DisputeAuditLog } from "../../disputes/dispute-audit-log";

interface StageDisputeContentProps {
  transaction: TransactionResponseDto;
}

export function StageDisputeContent({
  transaction,
}: StageDisputeContentProps) {
  const { data, isLoading, refetch } = api.admin.disputes.list.useQuery({
    query: { transactionId: transaction._id },
  });

  const disputes = data?.data?.docs || [];
  const amount = transaction.order?.totalAmount || 0;
  const escrowStatus = transaction.escrow
    ? {
        status: transaction.escrow.status,
        lockedAmount: transaction.escrow.amount,
      }
    : {
        status: "LOCKED" as const,
        lockedAmount: amount,
      };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No disputes found for this transaction.
      </p>
    );
  }

  // Show the most recent active dispute
  const activeDispute =
    disputes.find(
      (d: any) => d.status === "OPEN" || d.status === "UNDER_REVIEW",
    ) ?? disputes[0];

  return (
    <div className="space-y-4 rounded-lg border border-red-200 p-4 dark:border-red-900">
      <DisputeHeader dispute={activeDispute} amount={amount} />
      <DisputeClaim dispute={activeDispute} />
      <DisputeInformationRequests
        dispute={activeDispute}
        onUpdate={refetch}
      />
      <DisputeResolution
        dispute={activeDispute}
        escrowStatus={escrowStatus}
        amount={amount}
        onResolved={refetch}
      />
      <DisputeAuditLog dispute={activeDispute} />
    </div>
  );
}
