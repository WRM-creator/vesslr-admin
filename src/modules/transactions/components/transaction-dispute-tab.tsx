import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { DisputeAuditLog } from "./disputes/dispute-audit-log";
import { DisputeClaim } from "./disputes/dispute-claim";
import { DisputeHeader } from "./disputes/dispute-header";
import { DisputeResolution } from "./disputes/dispute-resolution";

export function TransactionDisputeTab({
  transaction,
  onResolved,
}: {
  transaction: any;
  onResolved?: () => void;
}) {
  const transactionId = transaction._id;

  const { data, isLoading, refetch } = api.admin.disputes.list.useQuery({
    query: { transactionId },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  const disputes = data?.data.docs || [];
  if (disputes.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-slate-500">
        <p>No active disputes for this transaction</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {disputes.map((apiDispute) => {
        const amount = transaction?.order?.totalAmount || 0;

        const escrowStatus = transaction.escrow
          ? {
              status: transaction.escrow.status,
              lockedAmount: transaction.escrow.amount,
            }
          : {
              status: "LOCKED",
              lockedAmount: amount,
            };

        return (
          <div
            key={apiDispute._id}
            className="grid grid-cols-1 gap-6 xl:grid-cols-3"
          >
            {/* Main column */}
            <div className="space-y-6 xl:col-span-2">
              <DisputeHeader dispute={apiDispute} amount={amount} />
              <DisputeClaim dispute={apiDispute} />
            </div>

            {/* Secondary column */}
            <div className="flex flex-col gap-6">
              <DisputeResolution
                dispute={apiDispute}
                escrowStatus={escrowStatus}
                amount={amount}
                onResolved={() => {
                  refetch();
                  onResolved?.();
                }}
              />
              <DisputeAuditLog dispute={apiDispute} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
