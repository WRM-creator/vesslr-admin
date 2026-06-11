import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KybProfileDto } from "@/lib/api/generated";
import { format } from "date-fns";

interface ProviderResponsePanelProps {
  kyb: KybProfileDto;
}

/**
 * OPS/ADMIN-ONLY view of a payment provider's verification verdict. This panel may
 * name the provider and show its raw payload — it must never be shown to customers.
 * It surfaces a case the provider declined after we approved, so an admin can read
 * the reason and compose a white-labeled request to the customer.
 */
export function ProviderResponsePanel({ kyb }: ProviderResponsePanelProps) {
  const verification = kyb.providerVerification;
  if (!verification) return null;

  const pending = kyb.providerReviewPending === true;

  const body = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant={pending ? "destructive" : "outline"}>
          {verification.status}
        </Badge>
        <span className="text-muted-foreground">{verification.provider}</span>
        {verification.currencies && verification.currencies.length > 0 && (
          <span className="text-muted-foreground">
            · {verification.currencies.join(", ")}
          </span>
        )}
        {verification.receivedAt && (
          <span className="text-muted-foreground">
            ·{" "}
            {format(new Date(verification.receivedAt), "dd MMM yyyy, HH:mm")}
          </span>
        )}
      </div>

      {verification.summary && (
        <p className="text-sm leading-relaxed">{verification.summary}</p>
      )}

      {verification.items && verification.items.length > 0 && (
        <div className="space-y-2">
          {verification.items.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className="border-l-2 border-l-amber-500 py-1 pl-4"
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-muted-foreground text-xs">{item.reason}</p>
            </div>
          ))}
        </div>
      )}

      {verification.raw && Object.keys(verification.raw).length > 0 && (
        <details className="text-xs">
          <summary className="text-muted-foreground cursor-pointer select-none">
            Raw provider response
          </summary>
          <pre className="bg-muted mt-2 max-h-72 overflow-auto rounded-md p-3 text-[11px] leading-relaxed">
            {JSON.stringify(verification.raw, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );

  // While review is pending, lead with an attention alert. Once resolved, keep the
  // verdict visible as a neutral card for historical reference.
  if (pending) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Provider verification needs review</AlertTitle>
        <AlertDescription>
          <p className="text-muted-foreground">
            A payment provider declined this organization after our approval.
            Review the response below, then request the necessary updates from
            the customer using a white-labeled message — do not name the
            provider.
          </p>
          <div className="mt-3 w-full">{body}</div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Provider Verification</CardTitle>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
