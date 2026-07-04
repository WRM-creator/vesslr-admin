import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AdminOutstandingAskDto,
  AdminProviderRequirementsDto,
} from "@/lib/api/generated";
import { ClipboardListIcon, FileTextIcon, MessageSquareIcon } from "lucide-react";

interface RequirementsPanelProps {
  requirements: AdminProviderRequirementsDto[];
  outstandingAsks: AdminOutstandingAskDto[];
}

const RESOLUTION_BADGES: Record<string, { label: string; variant: "outline" | "secondary" | "destructive" }> = {
  registry_adoptable: { label: "Auto-fill from registry", variant: "secondary" },
  org_data: { label: "Ask organization", variant: "outline" },
  org_document: { label: "Ask organization", variant: "outline" },
  platform: { label: "Platform-side", variant: "secondary" },
  unmapped: { label: "Needs decision", variant: "destructive" },
};

/**
 * Read-only provisioning observability: what each provider still needs before
 * it can verify the org, how every gap resolves, and the asks currently
 * outstanding on the compliance case. The ACTION lives on the case's Data
 * completeness panel ("Request missing info") — asking the org for
 * information is a compliance conversation, never a payments one.
 */
export function RequirementsPanel({
  requirements: requirementsProp,
  outstandingAsks: outstandingAsksProp,
}: RequirementsPanelProps) {
  // Tolerate a backend one version behind (fields absent from the payload):
  // degrade to hidden rather than crashing the whole tab.
  const requirements = requirementsProp ?? [];
  const outstandingAsks = outstandingAsksProp ?? [];

  const hasMissing = requirements.some((r) => r.missing.length > 0);
  if (!hasMissing && outstandingAsks.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardListIcon className="h-4 w-4" />
          Outstanding requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements
          .filter((r) => r.missing.length > 0)
          .map((r) => (
            <div key={r.provider} className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                {r.provider}
              </p>
              <ul className="space-y-2">
                {r.missing.map((m) => {
                  const badge =
                    RESOLUTION_BADGES[m.resolution] ??
                    RESOLUTION_BADGES.unmapped;
                  return (
                    <li
                      key={m.field}
                      className="bg-muted/50 flex flex-wrap items-center justify-between gap-2 rounded-md px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {m.label ?? m.field}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {m.reason}
                        </p>
                      </div>
                      <Badge variant={badge.variant} className="text-[10px]">
                        {badge.label}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

        {outstandingAsks.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              Awaiting the organization
            </p>
            <ul className="space-y-1">
              {outstandingAsks.map((ask) => (
                <li
                  key={`${ask.kind}:${ask.target}`}
                  className="flex items-center gap-2 text-sm"
                >
                  {ask.kind === "document" ? (
                    <FileTextIcon className="text-muted-foreground h-3.5 w-3.5" />
                  ) : (
                    <MessageSquareIcon className="text-muted-foreground h-3.5 w-3.5" />
                  )}
                  {ask.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-muted-foreground text-xs">
          Requesting information from the organization happens on the
          compliance case (Data completeness panel); fulfilled asks clear from
          this list and the full exchange lives on the case.
        </p>
      </CardContent>
    </Card>
  );
}
