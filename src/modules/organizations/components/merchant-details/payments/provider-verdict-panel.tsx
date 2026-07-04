import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AdminProviderVerificationDto } from "@/lib/api/generated";
import { format } from "date-fns";
import { ChevronsUpDownIcon, ShieldAlertIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ProviderVerdictPanelProps {
  verification: AdminProviderVerificationDto;
  organizationId: string;
  /** Highlighted while an admin still needs to act on the decline. */
  pending: boolean;
}

/**
 * OPS-only view of the provider's verification verdict, collapsed by default so
 * a healthy org never pays for it. Names the provider; never shown to customers.
 * The remedy for itemized declines is the compliance request-changes flow.
 */
export function ProviderVerdictPanel({
  verification,
  organizationId,
  pending,
}: ProviderVerdictPanelProps) {
  return (
    <Card>
      <Collapsible defaultOpen={pending}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between text-left">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlertIcon className="h-4 w-4" />
                Provider verdict
                <Badge
                  variant={pending ? "destructive" : "outline"}
                  className="text-[10px]"
                >
                  {verification.status}
                </Badge>
              </CardTitle>
              <ChevronsUpDownIcon className="text-muted-foreground h-4 w-4" />
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <span>{verification.provider}</span>
              {verification.currencies &&
                verification.currencies.length > 0 && (
                  <span>· {verification.currencies.join(", ")}</span>
                )}
              {verification.receivedAt && (
                <span>
                  ·{" "}
                  {format(
                    new Date(verification.receivedAt),
                    "dd MMM yyyy, HH:mm",
                  )}
                </span>
              )}
            </div>

            {verification.summary && (
              <p className="text-sm leading-relaxed">{verification.summary}</p>
            )}

            {verification.items && verification.items.length > 0 && (
              <ul className="space-y-2">
                {verification.items.map((item, i) => (
                  <li
                    key={`${item.label}-${i}`}
                    className="bg-muted/50 rounded-md px-3 py-2"
                  >
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.reason}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                The full raw payload is available on the compliance case.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to={`/organizations/${organizationId}/compliance`}>
                  Open compliance case
                </Link>
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
