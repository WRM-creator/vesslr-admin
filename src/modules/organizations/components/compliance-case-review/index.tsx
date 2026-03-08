import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { ComplianceCaseDetailDto, StructuredReasonDto } from "@/lib/api/generated";
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
import type { ViewableItem } from "./types";

type ActiveReview = {
  type: "KYB" | "KYC";
  action: "approve" | "request_action";
} | null;

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

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItems, setViewerItems] = useState<ViewableItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [activeReview, setActiveReview] = useState<ActiveReview>(null);

  const openViewer = (index: number, list: ViewableItem[]) => {
    setViewerItems(list);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleApproveKyb = () => {
    reviewKyb(
      { path: { organizationId }, body: { decision: "approved" } },
      { onSuccess: () => setActiveReview(null) },
    );
  };

  const handleApproveKyc = () => {
    if (!primaryUserId) return;
    reviewKyc(
      { path: { userId: primaryUserId }, body: { decision: "approved" } },
      { onSuccess: () => setActiveReview(null) },
    );
  };

  const handleRequestActionKyb = (reasons: StructuredReasonDto[]) => {
    reviewKyb(
      { path: { organizationId }, body: { decision: "action_required", reasons } },
      { onSuccess: () => setActiveReview(null) },
    );
  };

  const handleRequestActionKyc = (reasons: StructuredReasonDto[]) => {
    if (!primaryUserId) return;
    reviewKyc(
      {
        path: { userId: primaryUserId },
        body: { decision: "action_required", reasons },
      },
      { onSuccess: () => setActiveReview(null) },
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
      <AutomatedChecks
        kyc={data.checks.kyc}
        kyb={data.checks.kyb}
        kycReviewStatus={data.kycStatus}
        kybReviewStatus={data.kybStatus}
        onApproveKyc={() => setActiveReview({ type: "KYC", action: "approve" })}
        onRequestActionKyc={() =>
          setActiveReview({ type: "KYC", action: "request_action" })
        }
        onApproveKyb={() => setActiveReview({ type: "KYB", action: "approve" })}
        onRequestActionKyb={() =>
          setActiveReview({ type: "KYB", action: "request_action" })
        }
        isKycSubmitting={isKycPending}
        isKybSubmitting={isKybPending}
      />
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
        open={activeReview?.action === "approve"}
        onOpenChange={(open) => !open && setActiveReview(null)}
        reviewType={activeReview?.type ?? "KYB"}
        onConfirm={
          activeReview?.type === "KYC" ? handleApproveKyc : handleApproveKyb
        }
        isSubmitting={
          activeReview?.type === "KYC" ? isKycPending : isKybPending
        }
      />

      <RequestActionDialog
        open={activeReview?.action === "request_action"}
        onOpenChange={(open) => !open && setActiveReview(null)}
        reviewType={activeReview?.type ?? "KYB"}
        onConfirm={
          activeReview?.type === "KYC"
            ? handleRequestActionKyc
            : handleRequestActionKyb
        }
        isSubmitting={
          activeReview?.type === "KYC" ? isKycPending : isKybPending
        }
      />
    </div>
  );
}
