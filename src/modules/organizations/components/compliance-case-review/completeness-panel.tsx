import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { RequestMissingOutcomeDto } from "@/lib/api/generated";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ClipboardListIcon,
  ClockIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { ComplianceCase } from "./types";

function ItemRow({
  item,
}: {
  item: ComplianceCase["completeness"][number];
}) {
  // Reviewer-confirmed items are pending until approval, not missing — amber
  // clock, and the label stays quiet instead of demanding attention.
  const pendingApproval = !item.satisfied && item.resolution === "approval";
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <div className="min-w-0">
        <span
          className={
            item.satisfied || pendingApproval
              ? "text-muted-foreground"
              : "font-medium"
          }
        >
          {item.label}
        </span>
        {item.detail && (
          <p className="text-muted-foreground truncate text-xs">{item.detail}</p>
        )}
      </div>
      {item.satisfied ? (
        <CheckIcon className="size-4 shrink-0 text-green-600" />
      ) : pendingApproval ? (
        <ClockIcon className="size-4 shrink-0 text-amber-500" />
      ) : (
        <XIcon className="size-4 shrink-0 text-red-500" />
      )}
    </div>
  );
}

function outcomeToast(outcome: RequestMissingOutcomeDto) {
  const parts: string[] = [];
  if (outcome.adopted.length) {
    parts.push(`${outcome.adopted.length} filled from the registry`);
  }
  const asked = outcome.dataRequested.length + outcome.documentsRequested.length;
  if (asked) parts.push(`${asked} requested from the organization`);
  if (outcome.alreadyPending.length) {
    parts.push(`${outcome.alreadyPending.length} already pending`);
  }
  if (outcome.platform.length) {
    parts.push(`${outcome.platform.length} platform-side`);
  }
  if (outcome.verificationRevoked) {
    parts.push("verification turned off until re-approval");
  }
  if (parts.length === 0) {
    toast.info("Nothing to request", {
      description: "Everything required is already satisfied or in motion.",
    });
    return;
  }
  toast.success("Missing information handled", {
    description: parts.join("; ") + ".",
  });
}

/**
 * Data-completeness checklist beside the document checklist: is everything the
 * platform (country registry) and payment provisioning need actually on file?
 * Platform items always render, satisfied or not; provider items only exist
 * when provisioning would defer, and come from the same missingRequirements
 * call the onboarding pipeline gates on — so approving a case with open
 * provider items means provisioning WILL stall on exactly those fields.
 *
 * For verified orgs the panel also carries the "Request missing info" action:
 * registry-satisfiable gaps auto-fill and the rest opens ONE request-changes
 * conversation on this case — the same scaffolding as review flags, and the
 * org's verified standing keeps its access intact throughout. Pre-approval,
 * gaps belong to the normal review conversation instead.
 */
export function CompletenessPanel({
  data,
  organizationId,
}: {
  data: ComplianceCase;
  organizationId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [revoke, setRevoke] = useState(false);
  const { mutate: requestMissing, isPending } =
    api.admin.compliance.requestMissing.useMutation();

  const { completeness, ubo } = data;
  if (completeness.length === 0) return null;

  const platform = completeness.filter((i) => i.source === "platform");
  const provider = completeness.filter((i) => i.source === "provider");
  // Reviewer-confirmed (`approval`) items are pending, not missing — they
  // resolve themselves at approval, so they never count toward the badge or
  // the request-missing callout.
  const missing = completeness.filter(
    (i) => !i.satisfied && i.resolution !== "approval",
  ).length;

  const adoptableCount = provider.filter(
    (i) => !i.satisfied && i.resolution === "registry_adoptable",
  ).length;
  const askableCount = provider.filter(
    (i) =>
      !i.satisfied &&
      (i.resolution === "org_data" || i.resolution === "org_document"),
  ).length;
  const requestable =
    data.verificationStanding === "verified" &&
    adoptableCount + askableCount > 0;

  // Say exactly what the click will do for THIS case, and account for every
  // missing item so the text always reconciles with the "N missing" badge.
  const remainder = missing - adoptableCount - askableCount;
  const actions: string[] = [];
  if (adoptableCount > 0) {
    actions.push(`auto-fills ${adoptableCount} from the registry`);
  }
  if (askableCount > 0) {
    actions.push(
      `asks the organization for ${askableCount} in a single message`,
    );
  }
  const calloutText =
    `${missing} ${missing === 1 ? "item is" : "items are"} missing. ` +
    `One click ${actions.join(" and ")}` +
    (remainder > 0
      ? `; the remaining ${remainder} ${remainder === 1 ? "needs" : "need"} platform-side attention (nothing to ask the organization).`
      : ".");

  const handleSubmit = () => {
    requestMissing(
      {
        path: { organizationId },
        body: {
          ...(message.trim() ? { message: message.trim() } : {}),
          ...(revoke ? { revokeVerification: true } : {}),
        },
      },
      {
        onSuccess: (res) => {
          if (res) outcomeToast(res.data);
          setDialogOpen(false);
          setMessage("");
          setRevoke(false);
        },
        onError: () => {
          toast.error("Request failed", {
            description: "See the activity log or server logs for details.",
          });
          setDialogOpen(false);
        },
      },
    );
  };

  const uboLine =
    ubo.ownersWithPercent > 0 || ubo.ownersWithoutPercent > 0
      ? `Listed owners hold ${ubo.totalPercent}%` +
        (ubo.ownersWithoutPercent > 0
          ? ` (${ubo.ownersWithoutPercent} without a stated stake)`
          : "")
      : undefined;

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Data completeness</h3>
        {missing > 0 ? (
          <Badge variant="outline" className={cn("font-medium", TINT.amber)}>
            {missing} missing
          </Badge>
        ) : completeness.some(
            (i) => !i.satisfied && i.resolution === "approval",
          ) ? (
          <span className="text-muted-foreground text-xs">
            Remaining items are confirmed at approval
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">
            Everything required is on file
          </span>
        )}
      </div>
      {requestable && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-500/10">
          <div className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-300">
            <ClipboardListIcon className="size-4 shrink-0" />
            <span>{calloutText}</span>
          </div>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            Request missing info
          </Button>
        </div>
      )}
      <div className="bg-card grid grid-cols-1 divide-y overflow-hidden rounded-xl border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <p className="text-muted-foreground pb-1 text-[10px] font-semibold uppercase tracking-wide">
            Required by the platform
          </p>
          <div className="divide-border/70 divide-y">
            {platform.map((item) => (
              <ItemRow key={item.key} item={item} />
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground pb-1 text-[10px] font-semibold uppercase tracking-wide">
            Payment provisioning
          </p>
          {provider.length === 0 ? (
            <p className="text-muted-foreground py-1.5 text-sm">
              No outstanding provider requirements.
            </p>
          ) : (
            <div className="divide-border/70 divide-y">
              {provider.map((item) => (
                <ItemRow key={item.key} item={item} />
              ))}
            </div>
          )}
          {(uboLine || ubo.over100) && (
            <div className="border-border/70 mt-2 border-t pt-2 text-xs">
              <p className="text-muted-foreground">
                {uboLine}
                {ubo.thresholdLabel && ` · ${ubo.thresholdLabel}`}
              </p>
              {ubo.over100 && (
                <p className="mt-1 font-medium text-red-600">
                  Ownership stakes sum past 100%, which cannot be right — verify
                  the beneficial owners before approving.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request missing information</DialogTitle>
            <DialogDescription>
              Registry-satisfiable gaps are filled automatically. The rest
              opens one request-changes conversation on this case: the
              organization gets a single message and to-do list, and their
              account access is unaffected (verified standing). Asks already
              pending are not re-sent. Nothing here names a provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="request-missing-message">
                Message to the organization (optional)
              </Label>
              <Textarea
                id="request-missing-message"
                placeholder="We need a little more information to finish setting up your payment account."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-md border p-3">
              <Checkbox
                id="request-missing-revoke"
                checked={revoke}
                onCheckedChange={(v) => setRevoke(v === true)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="request-missing-revoke"
                  className="text-sm font-medium"
                >
                  Also turn off verification
                </Label>
                <p className="text-muted-foreground text-xs">
                  Suspends the organization's account access until the case is
                  re-approved. Leave off for routine asks: the organization
                  keeps trading while it responds.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={revoke ? "destructive" : "default"}
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : null}
              {revoke ? "Send & turn off verification" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
