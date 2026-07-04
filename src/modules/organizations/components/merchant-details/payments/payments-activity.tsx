import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminPaymentsEventDto } from "@/lib/api/generated";
import { format } from "date-fns";
import { HistoryIcon, RefreshCwIcon, WebhookIcon, UserIcon } from "lucide-react";

interface PaymentsActivityProps {
  events: AdminPaymentsEventDto[];
}

const PROVIDER_LABELS: Record<string, string> = {
  busha: "Busha",
  flutterwave: "Flutterwave",
  fake: "Fake (dev)",
};

function providerLabel(provider?: unknown): string {
  if (typeof provider !== "string" || !provider) return "the provider";
  return (
    PROVIDER_LABELS[provider] ??
    provider.charAt(0).toUpperCase() + provider.slice(1)
  );
}

function describe(event: AdminPaymentsEventDto): {
  label: string;
  detail?: string;
  Icon: typeof HistoryIcon;
} {
  const meta = (event.metadata ?? {}) as Record<string, unknown>;

  if (event.eventType === "payments.provisioning_triggered") {
    const outcome = meta.outcome as
      | { status?: string; reason?: string }
      | undefined;
    const result =
      outcome?.status === "onboarded"
        ? "provisioning ran"
        : outcome?.status === "incomplete"
          ? "provisioning deferred, data missing"
          : "nothing to do";
    return {
      label: `Provisioning triggered by an admin (${result})`,
      detail: outcome?.reason,
      Icon: UserIcon,
    };
  }

  if (event.eventType === "payments.onboarding_status_changed") {
    const status = typeof meta.status === "string" ? meta.status : "updated";
    const source =
      meta.source === "webhook"
        ? `Reported by ${providerLabel(meta.provider)}`
        : meta.source === "reconciler"
          ? "Found by the reconciler"
          : "Status changed";
    return {
      label: `${source}: verification is now ${status.replace("_", " ")}`,
      detail: typeof meta.reason === "string" ? meta.reason : undefined,
      Icon: meta.source === "webhook" ? WebhookIcon : RefreshCwIcon,
    };
  }

  return { label: event.eventType, Icon: HistoryIcon };
}

/**
 * Recent provisioning history: manual triggers with their actor, and status
 * changes with what produced them. Same events also appear in the compliance
 * case's decision history.
 */
export function PaymentsActivity({ events }: PaymentsActivityProps) {
  if (events.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HistoryIcon className="h-4 w-4" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {events.map((event, i) => {
            const { label, detail, Icon } = describe(event);
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="bg-muted mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  <Icon className="text-muted-foreground h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm">{label}</p>
                  {detail && (
                    <p className="text-muted-foreground text-xs">{detail}</p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(event.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
