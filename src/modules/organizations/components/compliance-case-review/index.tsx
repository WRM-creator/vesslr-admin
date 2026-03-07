import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { ComplianceCaseDetailDto } from "@/lib/api/generated";
import { useState } from "react";
import { ApproveDialog } from "./approve-dialog";
import { AutomatedChecks } from "./automated-checks";
import { CompanyDetails } from "./company-details";
import { REGISTRY_SOURCE, toComplianceCase } from "./compliance-utils";
import { DecisionHistory } from "./decision-history";
import { DeclarationsSection } from "./declarations-section";
import { DocumentViewerSheet } from "./document-viewer-sheet";
import { DocumentsGrid } from "./documents-grid";
import { IdentityImages } from "./identity-images";
import { RegistryPeople } from "./registry-people";
import { RequestActionDialog } from "./request-action-dialog";
import { StatusBadge } from "./status-badge";
import type { ViewableItem } from "./types";

export function ComplianceCaseReview({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    data: rawData,
    isLoading,
    isError,
  } = api.admin.compliance.getCase.useQuery({
    path: { organizationId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiData = ((rawData as any)?.data ?? rawData) as
    | ComplianceCaseDetailDto
    | undefined;
  const data = apiData ? toComplianceCase(apiData) : null;

  const primaryUserId = apiData?.kycProfiles?.[0]?.user?._id;

  const { mutate: reviewKyb, isPending: isKybPending } =
    api.admin.compliance.reviewKyb.useMutation();
  const { mutate: reviewKyc, isPending: isKycPending } =
    api.admin.compliance.reviewKyc.useMutation();
  const isSubmitting = isKybPending || isKycPending;

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<ViewableItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [approveOpen, setApproveOpen] = useState(false);
  const [requestActionOpen, setRequestActionOpen] = useState(false);

  const openViewer = (index: number, list: ViewableItem[]) => {
    setViewerItems(list);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleApprove = () => {
    reviewKyb(
      { path: { organizationId }, body: { decision: "approved" } },
      {
        onSuccess: () => {
          if (primaryUserId) {
            reviewKyc(
              {
                path: { userId: primaryUserId },
                body: { decision: "approved" },
              },
              { onSuccess: () => setApproveOpen(false) },
            );
          } else {
            setApproveOpen(false);
          }
        },
      },
    );
  };

  const handleRequestAction = (reasons: string[]) => {
    reviewKyb(
      {
        path: { organizationId },
        body: { decision: "action_required", reasons },
      },
      {
        onSuccess: () => {
          if (primaryUserId) {
            reviewKyc(
              {
                path: { userId: primaryUserId },
                body: { decision: "action_required", reasons },
              },
              { onSuccess: () => setRequestActionOpen(false) },
            );
          } else {
            setRequestActionOpen(false);
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-muted-foreground py-24 text-center text-sm">
        Failed to load compliance case.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">KYC</span>
            <StatusBadge status={data.kycStatus} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">KYB</span>
            <StatusBadge status={data.kybStatus} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRequestActionOpen(true)}
            disabled={isSubmitting}
          >
            Request Action
          </Button>
          <Button onClick={() => setApproveOpen(true)} disabled={isSubmitting}>
            Approve
          </Button>
        </div>
      </div>

      <AutomatedChecks kyc={data.checks.kyc} kyb={data.checks.kyb} />
      {data.registryData?.companyInformation && (
        <CompanyDetails
          info={data.registryData.companyInformation}
          registrySource={
            REGISTRY_SOURCE[data.organization.countryCode] ?? "Registry"
          }
        />
      )}
      {data.registryData && <RegistryPeople registryData={data.registryData} />}
      <IdentityImages items={data.identityImages} onSelect={openViewer} />
      <DocumentsGrid items={data.documents} onSelect={openViewer} />
      <DeclarationsSection declarations={data.declarations} />
      <DecisionHistory events={data.events} />

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
        onConfirm={handleApprove}
        isSubmitting={isSubmitting}
      />

      <RequestActionDialog
        open={requestActionOpen}
        onOpenChange={setRequestActionOpen}
        onConfirm={handleRequestAction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
