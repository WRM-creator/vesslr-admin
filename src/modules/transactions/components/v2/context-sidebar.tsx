import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import type {
  AdminConversationMessage,
  AdminTransactionConversation,
} from "@/lib/api/transaction-conversations";
import { formatCurrency } from "@/lib/currency";
import { cn, formatDateTime } from "@/lib/utils";
import {
  Banknote,
  History,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

interface ContextSidebarProps {
  transaction: TransactionResponseDto;
}

export function ContextSidebar({ transaction }: ContextSidebarProps) {
  return (
    <div className="space-y-4">
      <FinancialSummary transaction={transaction} />
      <ChatPreview transactionId={transaction._id} />
      <AuditLog transactionId={transaction._id} />
    </div>
  );
}

// ─── Financial Summary ─────────────────────────────────────────────
function FinancialSummary({
  transaction,
}: {
  transaction: TransactionResponseDto;
}) {
  const order = transaction.order;
  const escrow = transaction.escrow;
  const currency = order?.currency || "USD";
  const goodsAmount = order?.totalAmount || 0;
  const serviceFeeAmount = order?.serviceFeeAmount ?? 0;
  const totalWithFee = order?.totalWithFee ?? goodsAmount + serviceFeeAmount;

  const isFunded = [
    "ESCROW_FUNDED",
    "LOGISTICS_ASSIGNED",
    "IN_TRANSIT",
    "INSPECTION_PENDING",
    "INSPECTION_UNDER_REVIEW",
    "DELIVERY_CONFIRMED",
    "SETTLEMENT_RELEASED",
    "CLOSED",
    "MILESTONES_IN_PROGRESS",
  ].includes(transaction.status);

  const isReleased =
    transaction.status === "SETTLEMENT_RELEASED" ||
    transaction.status === "CLOSED";
  const isRefunded = transaction.status === "REFUNDED";

  const escrowLabel = isReleased
    ? "Released"
    : isRefunded
      ? "Refunded"
      : isFunded
        ? "Funded"
        : "Pending";

  const escrowColor = isReleased
    ? "text-green-600"
    : isRefunded
      ? "text-amber-600"
      : isFunded
        ? "text-blue-600"
        : "text-muted-foreground";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <Banknote className="text-muted-foreground size-4" />
        <CardTitle className="text-sm">Financial Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Goods</span>
            <span className="font-medium">
              {formatCurrency(goodsAmount, currency)}
            </span>
          </div>
          {serviceFeeAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fee (3%)</span>
              <span className="font-medium">
                {formatCurrency(serviceFeeAmount, currency)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">
              {formatCurrency(totalWithFee, currency)}
            </span>
          </div>
        </div>

        <div className="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2">
          <span className="text-muted-foreground text-xs">Escrow</span>
          <span className={cn("text-xs font-semibold", escrowColor)}>
            {escrowLabel}
          </span>
        </div>

        {escrow?.referenceId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Ref</span>
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-[10px]">
              {escrow.referenceId}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Chat Preview ──────────────────────────────────────────────────
function ChatPreview({ transactionId }: { transactionId: string }) {
  const { data, isLoading } = api.admin.transactions.conversation.useQuery({
    path: { id: transactionId },
  });

  const conversation = data as unknown as
    | AdminTransactionConversation
    | undefined;
  const messages = conversation?.messages ?? [];
  const recentMessages = messages.slice(-5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <MessageSquare className="text-muted-foreground size-4" />
        <CardTitle className="text-sm">Chat</CardTitle>
        {messages.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {messages.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner className="size-4" />
          </div>
        ) : recentMessages.length === 0 ? (
          <p className="text-muted-foreground py-3 text-center text-xs">
            No messages yet
          </p>
        ) : (
          <div className="space-y-2">
            {recentMessages.map((msg) => (
              <ChatBubble key={msg._id} message={msg} />
            ))}
            {messages.length > 5 && (
              <p className="text-muted-foreground text-center text-[10px]">
                +{messages.length - 5} earlier messages
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChatBubble({ message }: { message: AdminConversationMessage }) {
  const isBuyer = message.authorName === "Buyer";
  return (
    <div className={cn("flex", isBuyer ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-2.5 py-1.5",
          isBuyer ? "bg-muted" : "bg-primary/10",
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold">{message.authorName}</span>
          <span className="text-muted-foreground text-[9px]">
            {formatDateTime(message.createdAt)}
          </span>
          {message.status === "flagged" && (
            <span className="rounded bg-red-100 px-1 py-0.5 text-[8px] font-medium text-red-700">
              Flagged
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}

// ─── Audit Log ─────────────────────────────────────────────────────
const getLogMessage = (
  action: string,
  metadata: Record<string, unknown> | undefined,
) => {
  switch (action) {
    case "STATUS_CHANGE":
      return `Status → ${((metadata?.newStatus as string) ?? "unknown").replace(/_/g, " ")}`;
    case "DOCUMENT_UPLOADED":
      return `Doc uploaded: ${(metadata?.documentName as string) ?? "Unknown"}`;
    case "DOCUMENT_REVIEWED":
      return `Doc ${((metadata?.decision as string) ?? "").toLowerCase()}: ${(metadata?.documentName as string) ?? "Unknown"}`;
    case "REQUIREMENT_ADDED":
      return `Requirement added: ${(metadata?.name as string) ?? "Document"}`;
    case "REQUIREMENT_DELETED":
      return `Requirement deleted: ${(metadata?.name as string) ?? "Document"}`;
    case "LOGISTICS_UPDATE":
      return "Logistics updated";
    case "CREATED":
      return "Transaction created";
    case "STAGE_COMPLETED":
      return `Stage completed: ${(metadata?.stageName as string) ?? ""}`;
    case "MILESTONE_SUBMITTED":
      return "Milestone submitted";
    case "MILESTONE_APPROVED":
      return "Milestone approved";
    case "INSPECTION_SUBMITTED":
      return "Inspection docs submitted";
    case "INSPECTION_REVIEWED":
      return `Inspection ${(metadata?.decision as string)?.toLowerCase() ?? "reviewed"}`;
    case "DISPUTE_RAISED":
      return "Dispute raised";
    case "DISPUTE_RESOLVED":
      return "Dispute resolved";
    case "DISPUTE_WITHDRAWN":
      return "Dispute withdrawn";
    default:
      return action.replace(/_/g, " ");
  }
};

const COLLAPSED_LOG_COUNT = 8;

function AuditLog({ transactionId }: { transactionId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { data: logs, isLoading } = api.admin.transactions.logs.useQuery({
    path: { id: transactionId },
  });

  const allLogs = logs ?? [];
  const hasMore = allLogs.length > COLLAPSED_LOG_COUNT;
  const visibleLogs = expanded
    ? allLogs
    : allLogs.slice(0, COLLAPSED_LOG_COUNT);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <History className="text-muted-foreground size-4" />
        <CardTitle className="text-sm">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner className="size-4" />
          </div>
        ) : allLogs.length === 0 ? (
          <p className="text-muted-foreground py-3 text-center text-xs">
            No activity recorded
          </p>
        ) : (
          <div className="space-y-0">
            <div className="relative">
              <div className="space-y-0">
                {visibleLogs.map((log: any, i: number) => (
                  <div key={i} className="group flex gap-2.5 text-xs">
                    <div className="flex min-w-[32px] flex-col items-end">
                      <span className="text-muted-foreground text-[10px]">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                    <div className="border-border/50 relative flex-1 border-l pb-3 pl-3 group-last:border-transparent">
                      <div className="border-background bg-muted-foreground/30 group-first:bg-primary absolute top-1 -left-[4px] size-2 rounded-full border" />
                      <span className="text-foreground/80">
                        {getLogMessage(log.action, log.metadata)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && !expanded && (
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-white to-transparent dark:from-zinc-950" />
              )}
            </div>
            {hasMore && (
              <button
                className="text-muted-foreground hover:text-foreground mt-1 w-full py-1 text-center text-[11px] transition-colors"
                onClick={() => setExpanded((p) => !p)}
              >
                {expanded
                  ? "Show less"
                  : `Show ${allLogs.length - COLLAPSED_LOG_COUNT} more`}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
