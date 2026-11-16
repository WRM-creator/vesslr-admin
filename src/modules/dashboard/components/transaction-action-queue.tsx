import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { AdminActionQueueItemDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const txnNumber = (id: number) => `TXN-${String(id).padStart(4, "0")}`;

const GROUP_TAG: Record<
  AdminActionQueueItemDto["group"],
  { label: string; className: string } | null
> = {
  MONEY: { label: "Money", className: TINT.red },
  WORKFLOW: null,
  ONGOING: {
    label: "Ongoing",
    className: "text-muted-foreground font-normal",
  },
};

const waitedFor = (item: AdminActionQueueItemDto) => {
  if (!item.since) return null;
  const since = new Date(item.since);
  return item.group === "ONGOING"
    ? `Running for ${formatDistanceToNowStrict(since)}`
    : `Waiting ${formatDistanceToNowStrict(since)}`;
};

const rowLink = (item: AdminActionQueueItemDto) =>
  item.kind === "DISPUTE" && item.disputeId
    ? `/disputes/${item.disputeId}`
    : `/transactions/${item.transactionId}`;

function QueueRow({ item }: { item: AdminActionQueueItemDto }) {
  const tag = GROUP_TAG[item.group];
  const waited = waitedFor(item);
  const parties = [item.buyerName, item.sellerName].filter(Boolean);

  return (
    <Link
      to={rowLink(item)}
      className="group hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-foreground text-sm font-medium">
            {item.label}
          </span>
          {tag && (
            <Badge
              variant="outline"
              className={cn("text-[11px] font-medium", tag.className)}
            >
              {tag.label}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground truncate text-xs">
          <span className="text-foreground/80 font-medium tabular-nums">
            {txnNumber(item.transactionDisplayId)}
          </span>
          {item.orderDisplayId != null && (
            <span className="tabular-nums"> · ORD-{item.orderDisplayId}</span>
          )}
          {` · ${item.title}`}
        </p>
        {(parties.length > 0 || item.detail) && (
          <p className="text-muted-foreground truncate text-xs">
            {parties.length === 2
              ? `${parties[0]} → ${parties[1]}`
              : parties.join("")}
            {parties.length > 0 && item.detail ? " · " : ""}
            {item.detail}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
        {item.amount != null && (
          <span className="text-foreground text-sm font-semibold tabular-nums">
            {formatCurrency(item.amount, item.currency)}
          </span>
        )}
        {waited && (
          <span className="text-muted-foreground text-xs">{waited}</span>
        )}
      </div>
      <ChevronRight className="text-muted-foreground/50 group-hover:text-muted-foreground size-4 shrink-0 transition-colors" />
    </Link>
  );
}

/**
 * Every transaction waiting on an admin, one row per action: money gone
 * wrong first, then the workflow steps that wait on Vesslr, then rentals and
 * charters only an admin can end. The rules live in the api
 * (`GET /admin/transactions/action-queue`).
 */
export function TransactionActionQueue() {
  const { data, isLoading, isError, refetch, isRefetching } =
    api.admin.transactions.actionQueue.useQuery({});
  const items = data?.data ?? [];
  const blocking = items.filter((i) => i.group !== "ONGOING").length;

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b px-4 py-4">
        <div className="space-y-1">
          <CardTitle>Transactions waiting on you</CardTitle>
          <CardDescription className="text-xs">
            Each row opens the transaction where the action is.
          </CardDescription>
        </div>
        {!isLoading && !isError && items.length > 0 && (
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {blocking} to do
            {items.length > blocking
              ? ` · ${items.length - blocking} ongoing`
              : ""}
          </span>
        )}
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64 max-w-full" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-muted-foreground text-sm">
              The queue could not be loaded.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={cn(isRefetching && "animate-spin")} />
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-8 text-center">
            <CheckCircle2
              className="text-muted-foreground/70 mb-3 size-8"
              strokeWidth={1}
            />
            <p className="text-sm font-medium">All clear</p>
            <p className="text-muted-foreground mt-1 text-xs">
              No transaction is waiting on an admin.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <QueueRow
                key={`${item.transactionId}-${item.kind}`}
                item={item}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
