import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, FileText, Image as ImageIcon, Paperclip } from "lucide-react";

interface DisputeClaimProps {
  dispute: AdminDisputeResponseDto;
}

function AttachmentItem({
  attachment,
}: {
  attachment: { url: string; name: string; uploadedAt: string; uploadedByRole: "BUYER" | "SELLER" };
}) {
  const isPdf = attachment.name.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(attachment.name);

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
    >
      {isPdf ? (
        <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
      ) : isImage ? (
        <ImageIcon className="text-muted-foreground h-4 w-4 shrink-0" />
      ) : (
        <Paperclip className="text-muted-foreground h-4 w-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1 truncate font-medium">{attachment.name}</span>
      <ExternalLink className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

export function DisputeClaim({ dispute }: DisputeClaimProps) {
  const initiatorName = `${dispute.initiator.firstName} ${dispute.initiator.lastName}`;
  const respondentName = `${dispute.respondent.firstName} ${dispute.respondent.lastName}`;
  const initiatorRole = dispute.raisedByRole === "BUYER" ? "Buyer" : "Seller";
  const respondentRole = dispute.raisedByRole === "BUYER" ? "Seller" : "Buyer";

  const category = dispute.type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const filedAt = new Date(dispute.createdAt);
  const dateLabel = `${format(filedAt, "MMM d, yyyy")} · ${formatDistanceToNow(filedAt, { addSuffix: true })}`;

  const attachments = dispute.attachments ?? [];

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="font-medium">Dispute Claim</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Initiator */}
        <div className="bg-muted/40 rounded-lg border px-4 py-3">
          <p className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase">
            Raised by
          </p>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{initiatorName}</span>
                <Badge variant="secondary" className="text-[10px] font-normal">
                  {initiatorRole}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                {dispute.initiator.organization.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {dispute.initiator.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 shrink-0 gap-1 px-2 text-xs"
              disabled
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Profile
            </Button>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Category</span>
          <span className="font-medium">{category}</span>
          <span className="text-muted-foreground">Date Filed</span>
          <span className="font-medium">{dateLabel}</span>
        </div>

        {/* Reason */}
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            Reason
          </p>
          <blockquote className="border-l-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-relaxed dark:border-slate-600 dark:bg-slate-900/40">
            <p className="text-foreground/80 whitespace-pre-wrap">
              {dispute.reason || "No reason provided."}
            </p>
          </blockquote>
        </div>

        {/* Attachments */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Paperclip className="text-muted-foreground h-3.5 w-3.5" />
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Attachments{" "}
              {attachments.length > 0 && (
                <span className="normal-case">({attachments.length})</span>
              )}
            </p>
          </div>
          {attachments.length > 0 ? (
            <div className="space-y-1.5">
              {attachments.map((a, i) => (
                <AttachmentItem key={i} attachment={a} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">No documents attached.</p>
          )}
        </div>

        <Separator />

        {/* Respondent */}
        <div>
          <p className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase">
            Respondent
          </p>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{respondentName}</span>
                <Badge variant="outline" className="text-[10px] font-normal">
                  {respondentRole}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                {dispute.respondent.organization.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {dispute.respondent.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 shrink-0 gap-1 px-2 text-xs"
              disabled
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
