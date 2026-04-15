import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

const TransactionAction = {
  CREATED: "CREATED",
  STATUS_CHANGE: "STATUS_CHANGE",
  DOCUMENT_UPLOADED: "DOCUMENT_UPLOADED",
  DOCUMENT_REVIEWED: "DOCUMENT_REVIEWED",
  REQUIREMENT_ADDED: "REQUIREMENT_ADDED",
  REQUIREMENT_UPDATED: "REQUIREMENT_UPDATED",
  REQUIREMENT_DELETED: "REQUIREMENT_DELETED",
  LOGISTICS_UPDATE: "LOGISTICS_UPDATE",
  NOTE_ADDED: "NOTE_ADDED",
  STAGE_COMPLETED: "STAGE_COMPLETED",
  MILESTONE_SUBMITTED: "MILESTONE_SUBMITTED",
  MILESTONE_APPROVED: "MILESTONE_APPROVED",
  INSPECTION_SUBMITTED: "INSPECTION_SUBMITTED",
  INSPECTION_REVIEWED: "INSPECTION_REVIEWED",
  ESCROW_REFUND_INITIATED: "ESCROW_REFUND_INITIATED",
  DISPUTE_WITHDRAWN: "DISPUTE_WITHDRAWN",
  ESCROW_DISCOUNT_INITIATED: "ESCROW_DISCOUNT_INITIATED",
} as const;

type TransactionActionType = string;

const getLogMessage = (action: TransactionActionType, metadata: Record<string, unknown> | undefined) => {
  switch (action) {
    case TransactionAction.STATUS_CHANGE:
      return `Status changed to ${((metadata?.newStatus as string) ?? "unknown").replace(/_/g, " ")}`;
    case TransactionAction.DOCUMENT_UPLOADED:
      return `Document uploaded: ${(metadata?.documentName as string) ?? "Unknown"}`;
    case TransactionAction.DOCUMENT_REVIEWED:
      return `Document ${((metadata?.decision as string) ?? "").toLowerCase()}: ${(metadata?.documentName as string) ?? "Unknown"}`;
    case TransactionAction.REQUIREMENT_ADDED:
      return `Requirement added: ${(metadata?.name as string) ?? "Document"}`;
    case TransactionAction.REQUIREMENT_UPDATED:
      return `Requirement updated: ${((metadata?.updates as Record<string, unknown>)?.name as string) ?? "Document"}`;
    case TransactionAction.REQUIREMENT_DELETED:
      return `Requirement deleted: ${(metadata?.name as string) ?? "Document"}`;
    case TransactionAction.LOGISTICS_UPDATE:
      return "Logistics details updated";
    case TransactionAction.NOTE_ADDED:
      return "Note added";
    case TransactionAction.CREATED:
      return "Transaction Created";
    default:
      return action.replace(/_/g, " ");
  }
};

const getLogDetails = (action: TransactionActionType, metadata: Record<string, unknown> | undefined) => {
  switch (action) {
    case TransactionAction.STATUS_CHANGE:
      return (metadata?.reason as string) || `Moved from ${(metadata?.oldStatus as string) ?? "unknown"}`;
    case TransactionAction.DOCUMENT_UPLOADED:
      return `Type: ${(metadata?.type as string) ?? "Unknown"}`;
    case TransactionAction.DOCUMENT_REVIEWED:
      return (metadata?.rejectionReason as string)
        ? `Reason: ${metadata?.rejectionReason as string}`
        : "Approved by admin";
    case TransactionAction.REQUIREMENT_ADDED:
      return `${metadata?.isMandatory ? "Mandatory" : "Optional"} from ${(metadata?.requiredFrom as string) ?? "Unknown"}`;
    case TransactionAction.LOGISTICS_UPDATE:
      return (metadata?.carrier as string)
        ? `Carrier: ${metadata?.carrier as string}, Tracking: ${(metadata?.trackingNumber as string) ?? "-"}`
        : "Shipping details updated";
    case TransactionAction.CREATED:
      return "Initialized by system";
    default:
      return "";
  }
};

export function TransactionRecentActivity({
  transactionId,
}: {
  transactionId: string;
}) {
  const { data: logs, isLoading } = api.admin.transactions.logs.useQuery({
    path: { id: transactionId },
  });
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Spinner className="size-6" />
            </div>
          ) : (
            logs?.map((log, index) => (
              <div key={index} className="group flex gap-3 text-sm">
                {/* Date/Time Left Sidebar */}
                <div className="flex min-w-[40px] flex-col items-end text-right">
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>

                {/* Timeline Line & Content */}
                <div className="border-border/50 relative ml-1 flex-1 border-l pb-4 pl-4 group-last:border-transparent">
                  {/* Timeline dot */}
                  <div className="border-background bg-muted-foreground/30 ring-background group-first:bg-primary group-first:ring-primary/20 absolute top-1.5 -left-[6px] h-3 w-3 rounded-full border ring-2" />

                  <div className="flex flex-col gap-0.5">
                    <span className="text-foreground/90 text-xs font-medium">
                      {getLogMessage(log.action, log.metadata)}
                    </span>
                    <span className="text-muted-foreground text-[11px] leading-snug">
                      {getLogDetails(log.action, log.metadata)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
