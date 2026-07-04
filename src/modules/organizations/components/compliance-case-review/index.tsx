import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type {
  ComplianceCaseDetailDto,
  ProviderOnboardingOutcomeDto,
} from "@/lib/api/generated";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { FileX2Icon, RotateCwIcon } from "lucide-react";
import { useState } from "react";
import { ApproveDialog, type ApproveResult } from "./approve-dialog";
import { CaseHeader } from "./case-header";
import { CompanyDetails } from "./company-details";
import { CompletenessPanel } from "./completeness-panel";
import { REGISTRY_SOURCE, toComplianceCase } from "./compliance-utils";
import { DecisionBar } from "./decision-bar";
import { DecisionHistory } from "./decision-history";
import { DeclarationsPanel } from "./declarations-panel";
import { DocumentViewerSheet } from "./document-viewer-sheet";
import { DocumentsGrid } from "./documents-grid";
import { FlagButton } from "./flag-button";
import { DocFlagButton } from "./doc-flag-button";
import { IdentityComparison } from "./identity-comparison";
import { LicenseDocumentsPanel } from "./license-documents-panel";
import { ProviderOnboardingPanel } from "./provider-onboarding-panel";
import { ProviderResponsePanel } from "./provider-response-panel";
import { RegistryPeople } from "./registry-people";
import {
  RequestChangesSheet,
  type RequestChangesPayload,
} from "./request-changes-sheet";
import { StatusBadge } from "./status-badge";
import { useCaseFlags } from "./use-case-flags";
import { useDocRequests } from "./use-doc-requests";
import { VerificationBand } from "./verification-band";
import type { ViewableItem } from "./types";

/**
 * What the applicant has already been asked for and hasn't resolved, for the
 * read-only context block at the top of the request-changes sheet. Empty
 * sub-collections when the case carries no unresolved asks.
 */
function buildPriorRequestContext(apiData?: ComplianceCaseDetailDto) {
  if (!apiData) return undefined;
  const reasons = [
    ...(apiData.kybProfile?.actionRequiredReasons ?? []),
    ...(apiData.kycProfiles ?? []).flatMap(
      (p) => p.actionRequiredReasons ?? [],
    ),
  ];
  return {
    message: apiData.kybProfile?.actionRequiredMessage,
    reasons,
    outstandingDocuments: (apiData.requestedDocuments ?? []).map((d) => ({
      label: d.label ?? d.type.replace(/_/g, " "),
      note: d.note,
    })),
  };
}

/**
 * Build an editable message draft from a provider's decline response. The admin
 * rewrites this into white-labeled copy before sending; it is only a starting
 * point, never sent as-is.
 */
function buildProviderMessageDraft(
  kyb?: ComplianceCaseDetailDto["kybProfile"],
): string | undefined {
  const pv = kyb?.providerVerification;
  if (!pv) return undefined;
  const lines: string[] = [];
  if (pv.summary) lines.push(pv.summary);
  for (const item of pv.items ?? []) lines.push(`- ${item.label}: ${item.reason}`);
  return lines.length > 0 ? lines.join("\n") : undefined;
}

/** Skeleton placeholder while the case loads (mirrors the real layout rhythm). */
function CaseSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export function ComplianceCaseReview({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    data: rawData,
    isLoading,
    isError,
    refetch,
  } = api.admin.compliance.getCase.useQuery({
    path: { organizationId },
  });

  // The endpoint wraps its payload in `{ message, data }`; unwrap to the typed
  // detail (tolerating an already-unwrapped body) without resorting to `any`.
  const raw = rawData as unknown;
  const apiData = ((raw as { data?: ComplianceCaseDetailDto })?.data ?? raw) as
    | ComplianceCaseDetailDto
    | undefined;
  const data = apiData ? toComplianceCase(apiData) : null;

  const { mutate: reviewKyb, isPending: isKybPending } =
    api.admin.compliance.reviewKyb.useMutation();
  const { mutateAsync: reviewKycAsync, isPending: isKycPending } =
    api.admin.compliance.reviewKyc.useMutation();
  const { mutate: requestChanges, isPending: isRequestingChanges } =
    api.admin.compliance.requestChanges.useMutation();
  const { mutate: onboard, isPending: isOnboarding } =
    api.admin.compliance.onboard.useMutation();
  const { mutate: adoptRegistryPeople, isPending: isAdopting } =
    api.admin.compliance.adoptRegistryPeople.useMutation();

  const flags = useCaseFlags();
  const docRequests = useDocRequests();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<ViewableItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [approveOpen, setApproveOpen] = useState(false);
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  // The last manual provisioning run's outcome — its missing[] used to be
  // silently discarded, leaving the admin no idea why nothing happened.
  const [onboardOutcome, setOnboardOutcome] = useState<
    ProviderOnboardingOutcomeDto | undefined
  >();

  const openViewer = (index: number, list: ViewableItem[]) => {
    setViewerItems(list);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const isManual = data?.verificationMode === "manual";
  const isSubmitting = isKybPending || isKycPending || isRequestingChanges;

  // Every member whose identity is still pending is approved in this pass —
  // approving through kycProfiles[0] alone left other members unreviewable.
  const pendingMemberIds = (data?.members ?? [])
    .filter((m) => m.status !== "approved" && m.userId)
    .map((m) => m.userId as string);

  // Whatever tracks are still pending are approved together in one confirm.
  const approveScope = {
    kyb: data ? data.kybStatus !== "approved" : false,
    kyc: pendingMemberIds.length > 0,
  };

  const handleApproveConfirm = (result: ApproveResult) => {
    const approveKyc = async () => {
      // Sequential on purpose: each review re-syncs the composite status, and
      // a failure stops the run so the dialog stays open on a partial pass.
      for (const userId of pendingMemberIds) {
        await reviewKycAsync({
          path: { userId },
          body: { decision: "approved", checklist: result.kycChecklist },
        });
      }
      setApproveOpen(false);
    };
    // Approve business first (it drives provider onboarding), then identity.
    if (approveScope.kyb) {
      reviewKyb(
        {
          path: { organizationId },
          body: {
            decision: "approved",
            businessRegistration: result.businessRegistration,
            checklist: result.kybChecklist,
          },
        },
        { onSuccess: () => void approveKyc() },
      );
    } else {
      void approveKyc();
    }
  };

  const handleSubmitRequestChanges = (payload: RequestChangesPayload) => {
    requestChanges(
      { path: { organizationId }, body: payload },
      {
        onSuccess: () => {
          setRequestChangesOpen(false);
          flags.clear();
          docRequests.clear();
        },
      },
    );
  };

  if (isLoading) return <CaseSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-muted-foreground text-sm">
          Couldn’t load this compliance case.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RotateCwIcon className="mr-1.5 size-4" />
          Retry
        </Button>
      </div>
    );
  }

  // An empty registry object ({}) is NOT registry data — treating it as truthy
  // rendered hollow registry cards while a genuinely-absent lookup vanished
  // silently. Both now resolve to the explicit no-registry notice below.
  const hasRegistry =
    !isManual &&
    !!data.registryData &&
    Object.values(data.registryData).some(
      (v) => v && (!Array.isArray(v) || v.length > 0) && Object.keys(v).length > 0,
    );

  // Corridor-adaptive evidence: manual corridors are document-led (the reviewer
  // is the authority and there is no registry), so documents come first and the
  // registry cards are omitted; automated corridors lead with registry evidence.
  //
  // One identity + declarations group PER MEMBER: the payload returns every org
  // member's KYC profile and each must be reviewable, not just the first. A
  // single-member case renders without the member header (nothing to tell apart).
  const multiMember = data.members.length > 1;
  const identityBlock =
    data.members.length === 0 ? (
      <>
        <IdentityComparison
          items={[]}
          summary={data.identitySummary}
          onOpenSingle={openViewer}
        />
        <DeclarationsPanel
          declarations={data.declarations}
          hasApplicant={false}
        />
      </>
    ) : (
      <>
        {data.members.map((member, i) => (
          <div key={member.userId ?? i} className="space-y-4">
            {multiMember && (
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold">
                    {member.identitySummary.name ??
                      member.identitySummary.email ??
                      `Member ${i + 1}`}
                  </h3>
                  {member.identitySummary.role && (
                    <span className="text-muted-foreground text-xs">
                      {member.identitySummary.role}
                    </span>
                  )}
                </div>
                <StatusBadge status={member.status} />
              </div>
            )}
            <IdentityComparison
              items={member.identityImages}
              summary={member.identitySummary}
              onOpenSingle={openViewer}
            />
            <DeclarationsPanel
              declarations={member.declarations}
              applicantName={member.identitySummary.name}
              hasApplicant
            />
          </div>
        ))}
      </>
    );
  const missingDocCount = data.documents.filter(
    (d) => d.slotStatus === "missing" || d.slotStatus === "requested",
  ).length;
  const documentsBlock = (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Documents</h3>
        {missingDocCount > 0 && (
          <Badge variant="outline" className={cn("gap-1", TINT.amber)}>
            <FileX2Icon className="size-3" />
            {missingDocCount} missing
          </Badge>
        )}
      </div>
      {data.documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">No documents uploaded.</p>
      ) : (
        <DocumentsGrid
          items={data.documents}
          onSelect={openViewer}
          hideHeading
          cornerSlot={(item) =>
            item.reasonTarget ? (
              <FlagButton target={item.reasonTarget} flags={flags} compact />
            ) : item.requestDoc ? (
              <DocFlagButton doc={item.requestDoc} docRequests={docRequests} />
            ) : null
          }
        />
      )}
    </section>
  );
  const registryBlock = hasRegistry ? (
    <>
      {data.registryData?.companyInformation && (
        <CompanyDetails
          info={data.registryData.companyInformation}
          registrySource={
            REGISTRY_SOURCE[data.organization.countryCode] ?? "Registry"
          }
        />
      )}
      {data.registryData && (
        <RegistryPeople
          registryData={data.registryData}
          reconciliation={data.peopleReconciliation}
          onAdopt={() =>
            adoptRegistryPeople({ path: { organizationId } })
          }
          isAdopting={isAdopting}
        />
      )}
    </>
  ) : !isManual ? (
    // Automated corridor with no registry payload: say so — a reviewer must be
    // able to tell "the registry returned nothing" from "we never looked".
    <p className="text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
      No registry data on this case. The{" "}
      {REGISTRY_SOURCE[data.organization.countryCode] ?? "registry"} lookup
      either has not run or returned nothing; company details below come from
      the application only.
    </p>
  ) : null;

  return (
    <div className="space-y-6">
      <CaseHeader data={data} />

      {apiData?.kybProfile && <ProviderResponsePanel kyb={apiData.kybProfile} />}

      <VerificationBand data={data} flags={flags} />

      {isManual ? (
        <>
          {documentsBlock}
          <LicenseDocumentsPanel organizationId={organizationId} />
          <CompletenessPanel data={data} organizationId={organizationId} />
          {identityBlock}
        </>
      ) : (
        <>
          {identityBlock}
          {registryBlock}
          {documentsBlock}
          <LicenseDocumentsPanel organizationId={organizationId} />
          <CompletenessPanel data={data} organizationId={organizationId} />
        </>
      )}

      <ProviderOnboardingPanel
        items={apiData?.providerOnboarding ?? []}
        canRetry={data.kybStatus === "approved"}
        isRetrying={isOnboarding}
        onRetry={() =>
          onboard(
            { path: { organizationId } },
            {
              onSuccess: (res) => {
                // The endpoint wraps its payload in { message, data }.
                const outcome = ((res as { data?: ProviderOnboardingOutcomeDto })
                  ?.data ?? res) as ProviderOnboardingOutcomeDto;
                setOnboardOutcome(outcome);
              },
            },
          )
        }
        lastOutcome={onboardOutcome}
      />

      <DecisionHistory
        events={data.events}
        totalEvents={apiData?.eventsTotal}
      />

      <DecisionBar
        data={data}
        onApprove={() => setApproveOpen(true)}
        onRequestChanges={() => setRequestChangesOpen(true)}
        isSubmitting={isSubmitting}
        flagCount={flags.count}
      />

      <DocumentViewerSheet
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        items={viewerItems}
        currentIndex={viewerIndex}
        onNavigate={setViewerIndex}
      />

      <ApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        scope={approveScope}
        manual={isManual}
        businessRegistrationPrefill={apiData?.businessRegistrationPrefill}
        onConfirm={handleApproveConfirm}
        isSubmitting={isKybPending || isKycPending}
      />

      <RequestChangesSheet
        open={requestChangesOpen}
        onOpenChange={setRequestChangesOpen}
        initialFlags={flags.flags}
        initialDocuments={docRequests.list}
        defaultMessage={buildProviderMessageDraft(apiData?.kybProfile)}
        priorRequest={buildPriorRequestContext(apiData)}
        onSubmit={handleSubmitRequestChanges}
        isSubmitting={isRequestingChanges}
      />
    </div>
  );
}
