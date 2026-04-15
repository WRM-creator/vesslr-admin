import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type {
  AdminConversationMessage,
  AdminTransactionConversation,
} from "@/lib/api/transaction-conversations";
import { cn, formatDateTime } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

function statusBadge(status: string) {
  if (status === "approved") return null;
  const label = status === "flagged" ? "Flagged" : "Pending review";
  const color =
    status === "flagged"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span
      className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", color)}
    >
      {label}
    </span>
  );
}

function ChatMessage({ message }: { message: AdminConversationMessage }) {
  const isBuyer = message.authorName === "Buyer";

  return (
    <div className={cn("flex", isBuyer ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[75%] space-y-1 rounded-lg px-4 py-2",
          isBuyer ? "bg-muted" : "bg-primary/10",
        )}
      >
        <div className="flex items-center gap-2">
          <p className="text-foreground text-xs font-semibold">
            {message.authorName}
          </p>
          <span className="text-muted-foreground text-[10px]">
            {formatDateTime(message.createdAt)}
          </span>
          {statusBadge(message.status)}
        </div>
        <p className="text-foreground text-sm">{message.text}</p>
      </div>
    </div>
  );
}

export function TransactionChatTab({
  transactionId,
}: {
  transactionId: string;
}) {
  const { data, isLoading } = api.admin.transactions.conversation.useQuery({
    path: { id: transactionId },
  });

  const conversation = data as unknown as AdminTransactionConversation | undefined;
  const messages = conversation?.messages ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
        <MessageSquare className="h-6 w-6 opacity-40" />
        <p className="text-sm">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-3 rounded-lg border p-3">
      {messages.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}
    </div>
  );
}
