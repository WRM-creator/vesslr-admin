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

export const PLACEHOLDER_COMPLIANCE_CASE: ComplianceCase = {
  organization: {
    name: "Acme Trading Ltd",
    countryCode: "NG",
    rcNumber: "RC-1234567",
    taxId: "TIN-98765432",
  },
  kybStatus: "pending_review",
  kycStatus: "pending_review",
  checks: {
    kyc: {
      status: "passed",
      selfieMatch: true,
      liveness: true,
      documentAuth: true,
      idType: "Passport (NG)",
    },
    kyb: {
      status: "passed",
      rcNumber: "RC-1234567",
      companyName: "Acme Trading Ltd",
      directorsFound: 2,
      registrySource: "CAC",
    },
  },
  documents: [
    {
      url: "https://example.com/search-cert.jpg",
      name: "search-certificate.jpg",
      type: "image/jpeg",
      source: "smile_id",
      label: "Search Certificate",
    },
    {
      url: "https://example.com/proof-of-address.pdf",
      name: "proof-of-address.pdf",
      type: "application/pdf",
      source: "uploaded",
      label: "Proof of Business Address",
    },
    {
      url: "https://example.com/tax-id.pdf",
      name: "tax-id-evidence.pdf",
      type: "application/pdf",
      source: "uploaded",
      label: "Tax ID Evidence",
    },
    {
      url: "https://example.com/board-resolution.pdf",
      name: "board-resolution.pdf",
      type: "application/pdf",
      source: "uploaded",
      label: "Board Resolution",
    },
    {
      url: "https://example.com/psc-register.pdf",
      name: "psc-register.pdf",
      type: "application/pdf",
      source: "uploaded",
      label: "PSC Register",
    },
  ],
  identityImages: [
    {
      url: "https://example.com/selfie.jpg",
      name: "selfie.jpg",
      type: "image/jpeg",
      source: "smile_id",
      label: "Selfie",
    },
    {
      url: "https://example.com/id-front.jpg",
      name: "id-front.jpg",
      type: "image/jpeg",
      source: "smile_id",
      label: "ID Front",
    },
    {
      url: "https://example.com/id-back.jpg",
      name: "id-back.jpg",
      type: "image/jpeg",
      source: "smile_id",
      label: "ID Back",
    },
  ],
  declarations: {
    isPep: false,
    sourceOfFunds: "Business Revenue",
    sanctionsDeclaration: true,
  },
  events: [
    {
      id: "evt-1",
      eventType: "kyc.action_required",
      actorType: "admin",
      actorName: "Jane Admin",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      metadata: {
        reasons: ["Document unreadable or expired", "Name mismatch between documents"],
      },
    },
  ],
};
