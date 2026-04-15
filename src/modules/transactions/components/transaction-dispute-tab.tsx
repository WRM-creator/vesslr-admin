import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { DisputeAuditLog } from "./disputes/dispute-audit-log";
import { DisputeClaim } from "./disputes/dispute-claim";
import { DisputeHeader } from "./disputes/dispute-header";
import { DisputeInformationRequests } from "./disputes/dispute-information-requests";
import { DisputeResolution } from "./disputes/dispute-resolution";

const getStatusDot = (dispute: any): string => {
  if (dispute.status.toLowerCase().startsWith("resolved")) {
    return dispute.resolution?.outcome === "CANCELLED"
      ? "bg-muted-foreground"
      : "bg-emerald-500";
  }
  return "bg-red-500"; // OPEN, UNDER_REVIEW, ESCALATED
};

const formatType = (type: string) =>
  type
    .replace(/_DISPUTE$/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

const formatId = (displayId: number) =>
  `DSP-${String(displayId).padStart(4, "0")}`;

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

  const disputes = data?.data.docs || [];

  const defaultId =
    disputes.find(
      (d) => d.status === "OPEN" || d.status === "UNDER_REVIEW",
    )?._id ?? disputes[0]?._id;

  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const resolvedActiveId = activeId ?? defaultId;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-slate-500">
        <p>No active disputes for this transaction</p>
      </div>
    );
  }

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

  const renderDisputeContent = (apiDispute: any) => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 xl:col-span-2">
        <DisputeHeader dispute={apiDispute} amount={amount} />
        <DisputeClaim dispute={apiDispute} />
        <DisputeInformationRequests dispute={apiDispute} onUpdate={refetch} />
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

  if (disputes.length === 1) {
    return renderDisputeContent(disputes[0]);
  }

  return (
    <Tabs
      value={resolvedActiveId}
      onValueChange={setActiveId}
      className="w-full"
    >
      <TabsList className="mb-2">
        {disputes.map((d) => (
          <TabsTrigger
            key={d._id}
            value={d._id}
            className="gap-2 data-[state=active]:bg-background data-[state=active]:border-primaryGreenDark data-[state=active]:text-primaryGreenDark data-[state=active]:shadow-none"
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                getStatusDot(d),
              )}
            />
            <span className="font-mono text-xs">{formatId(d.displayId)}</span>
            <span className="text-xs opacity-70">-</span>
            <span>{formatType(d.type)}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {disputes.map((d) => (
        <TabsContent key={d._id} value={d._id}>
          {renderDisputeContent(d)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
