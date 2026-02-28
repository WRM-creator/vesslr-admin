import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { InformationRequest } from "@/lib/api/disputes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarClock,
  ExternalLink,
  FileText,
  Paperclip,
  X,
} from "lucide-react";

export function RequestItem({
  request,
  disputeId,
  onUpdated,
}: {
  request: InformationRequest;
  disputeId: string;
  onUpdated: () => void;
}) {
  const { mutate: dismissRequest, isPending: isDismissing } =
    api.admin.disputes.dismissRequest.useMutation();

  const handleDismiss = () => {
    dismissRequest(
      { path: { id: disputeId, requestId: request._id } },
      { onSuccess: onUpdated },
    );
  };

  const isPending = request.status === "PENDING";
  const isFulfilled = request.status === "FULFILLED";
  const isDismissed = request.status === "DISMISSED";

  const targetLabel = request.requestedFrom === "BUYER" ? "Buyer" : "Seller";

  const deadline = request.deadline ? new Date(request.deadline) : null;
  const isDeadlineSoon =
    deadline !== null &&
    deadline.getTime() - Date.now() < 48 * 60 * 60 * 1000 &&
    deadline.getTime() > Date.now();
  const isDeadlinePassed = deadline !== null && deadline.getTime() < Date.now();

  return (
    <div
      className={cn(
        "rounded-md border p-3 text-sm",
        isPending && "border-border bg-background",
        isFulfilled &&
          "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/10",
        isDismissed && "border-border bg-muted/30 opacity-60",
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-normal">
            {targetLabel}
          </Badge>
          <Badge
            variant={isFulfilled ? "default" : "secondary"}
            className={cn(
              "text-[10px]",
              isFulfilled &&
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
              isDismissed && "text-muted-foreground",
            )}
          >
            {isPending ? "Pending" : isFulfilled ? "Responded" : "Dismissed"}
          </Badge>
          {deadline && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                isDeadlinePassed
                  ? "text-destructive"
                  : isDeadlineSoon
                    ? "text-amber-600"
                    : "text-muted-foreground",
              )}
            >
              <CalendarClock className="h-3 w-3" />
              {isDeadlinePassed
                ? `Deadline passed ${format(deadline, "MMM d")}`
                : `Due ${format(deadline, "MMM d, yyyy")}`}
            </span>
          )}
        </div>

        {isPending && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-6 w-6 shrink-0"
            onClick={handleDismiss}
            disabled={isDismissing}
            title="Dismiss request"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Admin message */}
      <p className="text-foreground/80 mb-2 leading-relaxed">
        {request.message}
      </p>

      {/* Metadata */}
      {(request.requiresDocuments || request.documentDescription) && (
        <div className="mt-1 space-y-0.5">
          {request.requiresDocuments && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <FileText className="h-3 w-3" />
              Requires documents
            </p>
          )}
          {request.documentDescription && (
            <p className="text-muted-foreground text-xs italic">
              "{request.documentDescription}"
            </p>
          )}
        </div>
      )}

      {/* Fulfilled: show party's response */}
      {isFulfilled && request.response && (
        <>
          <Separator className="my-3" />
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs font-medium">
              {targetLabel}'s response
              {request.response.submittedAt && (
                <span className="font-normal">
                  {" · "}
                  {format(
                    new Date(request.response.submittedAt),
                    "MMM d, yyyy",
                  )}
                </span>
              )}
            </p>
            {request.response.message && (
              <p className="text-foreground/80 leading-relaxed">
                {request.response.message}
              </p>
            )}
            {request.response.attachments.length > 0 && (
              <div className="flex flex-col gap-1 pt-0.5">
                {request.response.attachments.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-muted/50 flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors"
                  >
                    <Paperclip className="text-muted-foreground h-3 w-3 shrink-0" />
                    <span className="flex-1 truncate font-medium">
                      {a.name}
                    </span>
                    <ExternalLink className="text-muted-foreground h-3 w-3 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
