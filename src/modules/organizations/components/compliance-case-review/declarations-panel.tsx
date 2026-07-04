import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import type { CaseDeclarations } from "./types";

/**
 * "Not collected" is a first-class value here, not an absence to hide: a
 * reviewer must be able to tell "the applicant declared no" from "the platform
 * never asked". Every row renders one of declared-yes / declared-no /
 * not-collected explicitly.
 */
function NotCollected() {
  return <span className="text-muted-foreground/70">Not collected</span>;
}

function DeclaredBool({ value }: { value?: boolean }) {
  if (value === undefined) return <NotCollected />;
  return value ? (
    <CheckIcon className="size-4 text-green-600" />
  ) : (
    <XIcon className="text-muted-foreground/60 size-4" />
  );
}

function Row({
  label,
  children,
  note,
}: {
  label: string;
  children: React.ReactNode;
  /** Free-text context rendered under the row (e.g. PEP details). */
  note?: string;
}) {
  return (
    <div className="py-1.5 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{children}</span>
      </div>
      {note && <p className="text-muted-foreground mt-1 text-xs">{note}</p>}
    </div>
  );
}

/**
 * What one applicant attested about themselves during onboarding: PEP status
 * (with named relations), directorship, ownership, source of funds, sanctions
 * declaration, and the truthfulness attestation. The business-representative
 * declaration is the platform's only explicitly-collected declaration today;
 * fields no flow collects render "Not collected" rather than defaulting to a
 * reassuring "No". Rendered once per member on multi-member cases.
 */
export function DeclarationsPanel({
  declarations,
  applicantName,
  hasApplicant,
  /** Suppress the section heading when nested under a member header. */
  hideHeading,
}: {
  declarations: CaseDeclarations;
  applicantName?: string;
  /** False on a KYB-only case — renders the honest no-applicant state. */
  hasApplicant: boolean;
  hideHeading?: boolean;
}) {
  const rep = declarations.representative;

  return (
    <section className="space-y-2.5">
      {!hideHeading && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Declarations</h3>
          <span className="text-muted-foreground text-xs">
            {rep
              ? `Self-declared by ${applicantName ?? "the applicant"} at onboarding`
              : "Applicant declarations"}
          </span>
        </div>
      )}
      <div className="bg-card rounded-xl border p-4">
        {!hasApplicant && !rep ? (
          <p className="text-muted-foreground text-sm">
            No applicant is attached to this case, so no declarations were
            collected.
          </p>
        ) : (
          <div className="divide-border/70 divide-y">
            <Row
              label="Politically exposed person"
              note={declarations.pepDetails}
            >
              {rep?.isPep === undefined ? (
                <NotCollected />
              ) : rep.isPep ? (
                <Badge variant="outline" className={cn("font-medium", TINT.amber)}>
                  Yes, declared
                </Badge>
              ) : (
                "No"
              )}
            </Row>
            {(rep?.pepRelations?.length ?? 0) > 0 && (
              <div className="py-1.5 text-sm">
                <span className="text-muted-foreground">
                  Declared PEP relations
                </span>
                <ul className="mt-1 space-y-0.5">
                  {rep!.pepRelations.map((relation, i) => (
                    <li key={i} className="font-medium">
                      {relation.name || "Unnamed"}
                      {relation.position && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          ({relation.position})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Row label="Company director">
              <DeclaredBool value={rep?.isDirector} />
            </Row>
            <Row label="Owns more than 5% of the business">
              <DeclaredBool value={rep?.ownsMoreThanFivePercent} />
            </Row>
            <Row label="Source of funds">
              {declarations.sourceOfFunds ?? <NotCollected />}
            </Row>
            <Row label="Sanctions declaration">
              {declarations.sanctionsDeclared ? "Declared" : <NotCollected />}
            </Row>
            <Row label="Attested that the information given is truthful">
              <DeclaredBool value={rep?.attestation} />
            </Row>
          </div>
        )}
      </div>
    </section>
  );
}
