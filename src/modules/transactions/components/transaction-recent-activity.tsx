import { CardTitleText } from "@/components/shared/card-title-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Download, Loader2 } from "lucide-react";

// Define locally since generated SDK only exports type, not value
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
} as const;

type TransactionActionType =
  | "CREATED"
  | "STATUS_CHANGE"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_REVIEWED"
  | "LOGISTICS_UPDATE"
  | "NOTE_ADDED"
  | "REQUIREMENT_ADDED"
  | "REQUIREMENT_UPDATED"
  | "REQUIREMENT_DELETED";

const getLogMessage = (action: TransactionActionType, metadata: any) => {
  switch (action) {
    case TransactionAction.STATUS_CHANGE:
      return `Status changed to ${metadata.newStatus.replace(/_/g, " ")}`;
    case TransactionAction.DOCUMENT_UPLOADED:
      return `Document uploaded: ${metadata.documentName}`;
    case TransactionAction.DOCUMENT_REVIEWED:
      return `Document ${metadata.decision.toLowerCase()}: ${metadata.documentName}`;
    case TransactionAction.REQUIREMENT_ADDED:
      return `Requirement added: ${metadata.name}`;
    case TransactionAction.REQUIREMENT_UPDATED:
      return `Requirement updated: ${metadata.updates?.name || "Document"}`;
    case TransactionAction.REQUIREMENT_DELETED:
      return `Requirement deleted: ${metadata.name}`;
    case TransactionAction.LOGISTICS_UPDATE:
      return "Logistics details updated";
    case TransactionAction.NOTE_ADDED:
      return "Note added";
    case TransactionAction.CREATED:
      return "Transaction Created";
    default:
      return (action as string).replace(/_/g, " ");
  }
};

const getLogDetails = (action: TransactionActionType, metadata: any) => {
  switch (action) {
    case TransactionAction.STATUS_CHANGE:
      return metadata.reason || `Moved from ${metadata.oldStatus}`;
    case TransactionAction.DOCUMENT_UPLOADED:
      return `Type: ${metadata.type}`;
    case TransactionAction.DOCUMENT_REVIEWED:
      return metadata.rejectionReason
        ? `Reason: ${metadata.rejectionReason}`
        : "Approved by admin";
    case TransactionAction.REQUIREMENT_ADDED:
      return `${metadata.isMandatory ? "Mandatory" : "Optional"} from ${metadata.requiredFrom}`;
    case TransactionAction.LOGISTICS_UPDATE:
      return metadata.carrier
        ? `Carrier: ${metadata.carrier}, Tracking: ${metadata.trackingNumber}`
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
        <CardTitle>
          <CardTitleText>Recent Activity</CardTitleText>
        </CardTitle>
        <Button variant="ghost" size="icon" className="size-6 px-2 text-xs">
          <Download className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
          ) : (
            logs?.map((log, index) => (
              <div key={index} className="group flex gap-3 text-sm">
                {/* Date/Time Left Sidebar */}
                <div className="flex min-w-[40px] flex-col items-end text-right">
                  <span className="text-muted-foreground text-xs">
                    {new Date(log.timestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {new Date(log.timestamp).toLocaleString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
