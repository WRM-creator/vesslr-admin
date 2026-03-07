import type { RegistryDataDto } from "@/lib/api/generated";

export interface ViewableItem {
  url: string;
  name: string;
  type: string;
  source: "smile_id" | "uploaded";
  label: string;
}

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
    metadata?: { reasons?: string[] };
  }>;
}
