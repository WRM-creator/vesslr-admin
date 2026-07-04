import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { LicenseRequirementItemDto } from "@/lib/api/generated";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const EXPIRY_WARNING_DAYS = 30;

/**
 * Expiry state, spelled out: the review checklist asks the admin to attest
 * documents are current, so the dates they attest against must be on screen.
 */
function ExpiryNote({ expiryDate }: { expiryDate?: string }) {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return null;
  const daysLeft = Math.floor((expiry.getTime() - Date.now()) / MS_PER_DAY);
  const formatted = expiry.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (daysLeft < 0) {
    return (
      <Badge variant="outline" className={cn("text-xs", TINT.red)}>
        Expired {formatted}
      </Badge>
    );
  }
  if (daysLeft <= EXPIRY_WARNING_DAYS) {
    return (
      <Badge variant="outline" className={cn("text-xs", TINT.amber)}>
        Expires {formatted}
      </Badge>
    );
  }
  return (
    <span className="text-muted-foreground text-xs">Expires {formatted}</span>
  );
}

function UploadState({
  upload,
}: {
  upload?: LicenseRequirementItemDto["upload"];
}) {
  if (!upload) {
    return (
      <Badge variant="outline" className={cn("text-xs", TINT.amber)}>
        Not uploaded
      </Badge>
    );
  }
  const map = {
    approved: { tint: TINT.green, label: "Approved" },
    rejected: { tint: TINT.red, label: "Rejected" },
    pending: { tint: TINT.gray, label: "Pending review" },
  } as const;
  const { tint, label } = map[upload.status];
  return (
    <Badge variant="outline" className={cn("text-xs", tint)}>
      {label}
    </Badge>
  );
}

/**
 * The org's category license requirements on the compliance case, so a
 * reviewer sees license status (and expiries) without leaving for the license
 * screen. Read-only rollup: review verdicts on individual licenses stay in the
 * dedicated license-documents flow. Renders nothing when the org's categories
 * carry no license requirements — most orgs — rather than an empty shell.
 */
export function LicenseDocumentsPanel({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data } = api.admin.licenseDocuments.orgRequirements.useQuery({
    path: { orgId: organizationId },
  });
  const raw = data as unknown;
  const requirements =
    ((raw as { data?: { requirements?: LicenseRequirementItemDto[] } })?.data
      ?.requirements ??
      (raw as { requirements?: LicenseRequirementItemDto[] })?.requirements) ||
    [];
  if (requirements.length === 0) return null;

  const attention = requirements.filter(
    (r) =>
      (r.isMandatory && !r.upload) || r.upload?.status === "rejected",
  ).length;

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Licenses & certifications</h3>
        {attention > 0 ? (
          <Badge variant="outline" className={cn("font-medium", TINT.amber)}>
            {attention} need attention
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">
            Required by the org's trading categories
          </span>
        )}
      </div>
      <div className="bg-card divide-border/70 divide-y rounded-xl border px-4 py-1">
        {requirements.map((req) => (
          <div
            key={req.requirementId}
            className="flex flex-wrap items-center justify-between gap-2 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {req.name}
                {!req.isMandatory && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    (optional)
                  </span>
                )}
              </p>
              <p className="text-muted-foreground text-xs">
                {req.categoryName}
                {req.alsoRequiredBy.length > 0 &&
                  `, also ${req.alsoRequiredBy.join(", ")}`}
              </p>
              {req.upload?.status === "rejected" &&
                req.upload.rejectionReason && (
                  <p className="mt-0.5 text-xs text-red-600">
                    {req.upload.rejectionReason}
                  </p>
                )}
            </div>
            <div className="flex items-center gap-2">
              <ExpiryNote expiryDate={req.upload?.expiryDate} />
              <UploadState upload={req.upload} />
              {req.upload?.fileUrl && (
                <a
                  href={req.upload.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                  title={req.upload.fileName ?? "Open document"}
                >
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
