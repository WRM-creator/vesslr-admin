import type { RegistryDataDto } from "@/lib/api/generated";

import type { ViewableItem } from "@/components/shared/viewable-item";
export type { ViewableItem };

export interface ChecklistAttestation {
  key: string;
  label: string;
  passed: boolean;
}

export interface ComplianceCase {
  organization: {
    name: string;
    countryCode: string;
    rcNumber: string;
    taxId: string;
    businessType?: string;
    postalAddress?: string;
  };
  /**
   * Corridor verification mode. `manual` drives the document-led layout + reviewer
   * checklist; `automated` keeps the provider/registry-led checks layout.
   */
  verificationMode: "manual" | "automated";
  /** Applicant identity summary, shown alongside the ID/selfie comparison. */
  identitySummary: {
    name?: string;
    idType?: string;
    idNumber?: string;
    verificationMethod?: "smile_id" | "manual";
  };
  kybStatus: "pending_review" | "approved" | "action_required";
  kycStatus: "pending_review" | "approved" | "action_required";
  checks: {
    kyc: {
      status: "passed" | "manual_review" | "failed";
      selfieMatch: boolean;
      liveness: boolean;
      documentAuth: boolean;
      idType: string;
    };
    kyb: {
      status: "passed" | "manual_review" | "failed";
      rcNumber: string;
      companyName: string;
      directorsFound: number;
      registrySource: string;
    };
  };
  registryData?: RegistryDataDto;
  documents: ViewableItem[];
  identityImages: ViewableItem[];
  events: Array<{
    id: string;
    eventType: string;
    actorType: "admin" | "system" | "user";
    actorName?: string;
    createdAt: string;
    metadata?: {
      reasons?: Array<{ target: string; issue: string; note?: string }>;
      checklist?: ChecklistAttestation[];
    };
  }>;
}
