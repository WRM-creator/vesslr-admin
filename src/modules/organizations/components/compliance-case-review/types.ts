import type { RegistryDataDto } from "@/lib/api/generated";

export type { ViewableItem } from "@/components/shared/viewable-item";

export interface ComplianceCase {
  organization: {
    name: string;
    countryCode: string;
    rcNumber: string;
    taxId: string;
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
  declarations: {
    isPep: boolean;
    pepDetails?: string;
    sourceOfFunds: string;
    sanctionsDeclaration: boolean;
  };
  events: Array<{
    id: string;
    eventType: string;
    actorType: "admin" | "system" | "user";
    actorName?: string;
    createdAt: string;
    metadata?: { reasons?: Array<{ target: string; issue: string; note?: string }> };
  }>;
}
