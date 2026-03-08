import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckIcon, XIcon } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { ComplianceCase } from "./types";

interface AutomatedChecksProps {
  kyc: ComplianceCase["checks"]["kyc"];
  kyb: ComplianceCase["checks"]["kyb"];
  kycReviewStatus: ComplianceCase["kycStatus"];
  kybReviewStatus: ComplianceCase["kybStatus"];
  onApproveKyc: () => void;
  onRequestActionKyc: () => void;
  onApproveKyb: () => void;
  onRequestActionKyb: () => void;
  isKycSubmitting: boolean;
  isKybSubmitting: boolean;
}

function CheckStatusBadge({
  status,
}: {
  status: "passed" | "manual_review" | "failed";
}) {
  if (status === "passed") {
    return (
      <Badge className="bg-green-100 text-green-700 capitalize hover:bg-green-100">
        Passed
      </Badge>
    );
  }
  if (status === "manual_review") {
    return (
      <Badge className="bg-amber-100 text-amber-700 capitalize hover:bg-amber-100">
        Manual Review
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 capitalize hover:bg-red-100">
      Failed
    </Badge>
  );
}

function CheckRow({
  label,
  value,
}: {
  label: string;
  value: boolean | string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-muted-foreground text-sm">{label}</span>
      {typeof value === "boolean" ? (
        value ? (
          <CheckIcon className="size-4 text-green-600" />
        ) : (
          <XIcon className="size-4 text-red-500" />
        )
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  );
}

function ReviewFooter({
  reviewStatus,
  onApprove,
  onRequestAction,
  isSubmitting,
}: {
  reviewStatus: ComplianceCase["kycStatus"] | ComplianceCase["kybStatus"];
  onApprove: () => void;
  onRequestAction: () => void;
  isSubmitting: boolean;
}) {
  return (
    <CardFooter className="mt-auto flex items-center justify-between border-t pt-3">
      <StatusBadge status={reviewStatus} />
      {reviewStatus !== "approved" && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRequestAction}
            disabled={isSubmitting}
          >
            Request Action
          </Button>
          <Button size="sm" onClick={onApprove} disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="size-4" /> : "Approve"}
          </Button>
        </div>
      )}
    </CardFooter>
  );
}

export function AutomatedChecks({
  kyc,
  kyb,
  kycReviewStatus,
  kybReviewStatus,
  onApproveKyc,
  onRequestActionKyc,
  onApproveKyb,
  onRequestActionKyb,
  isKycSubmitting,
  isKybSubmitting,
}: AutomatedChecksProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <span>Identity KYC</span> <CheckStatusBadge status={kyc.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <CheckRow label="Selfie match" value={kyc.selfieMatch} />
          <CheckRow label="Liveness" value={kyc.liveness} />
          <CheckRow label="Document auth" value={kyc.documentAuth} />
          <CheckRow label="ID type" value={kyc.idType} />
        </CardContent>
        <ReviewFooter
          reviewStatus={kycReviewStatus}
          onApprove={onApproveKyc}
          onRequestAction={onRequestActionKyc}
          isSubmitting={isKycSubmitting}
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <span>Business KYB</span> <CheckStatusBadge status={kyb.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <CheckRow label="RC Number" value={kyb.rcNumber} />
          <CheckRow label="Registry source" value={kyb.registrySource} />
          <CheckRow label="Company name" value={kyb.companyName} />
        </CardContent>
        <ReviewFooter
          reviewStatus={kybReviewStatus}
          onApprove={onApproveKyb}
          onRequestAction={onRequestActionKyb}
          isSubmitting={isKybSubmitting}
        />
      </Card>
    </div>
  );
}
