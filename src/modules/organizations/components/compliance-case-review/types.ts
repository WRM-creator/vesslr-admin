import type { RegistryDataDto } from "@/lib/api/generated";

import type { ViewableItem } from "@/components/shared/viewable-item";
export type { ViewableItem };

export interface ChecklistAttestation {
  key: string;
  label: string;
  passed: boolean;
}

/** A screening check's verdict (sanctions/PEP). Absence of the whole object —
 * not a status value — is how "never ran" is represented. */
export interface ScreeningResult {
  status: "passed" | "manual_review" | "failed";
  provider?: string;
  checkedAt?: string;
}

export type ReviewStatus =
  | "draft"
  | "submitted"
  | "pending_review"
  | "approved"
  | "action_required";

export interface KycCheckSummary {
  status: "passed" | "manual_review" | "failed";
  /**
   * The identity provider's actual verdict, unset when no provider ran.
   * This is ONE signal on purpose: the provider returns a single result,
   * and fanning it into separate selfie/liveness/document indicators would
   * fabricate granularity the data does not have.
   */
  providerResult?: "pending" | "passed" | "manual_review" | "failed";
  /** A selfie file exists on the profile (evidence presence, not a verdict). */
  selfieProvided: boolean;
  idType: string;
  /** Sanctions screening result on the person; unset = screening never ran. */
  sanctions?: ScreeningResult;
  /** PEP screening result on the person; unset = screening never ran. */
  pep?: ScreeningResult;
}

/**
 * What the applicant attested during onboarding. The business-representative
 * declaration is the platform's only explicitly-collected declaration; the
 * KYC-profile fields (pepDetails, sourceOfFunds, sanctionsDeclaration) have no
 * write path today and are surfaced only when actually set — a default `false`
 * is "never asked", not "declared no".
 */
export interface CaseDeclarations {
  /** Unset when the business-representative step was never completed. */
  representative?: {
    isPep?: boolean;
    pepRelations: Array<{ name?: string; position?: string }>;
    isDirector?: boolean;
    ownsMoreThanFivePercent?: boolean;
    attestation?: boolean;
  };
  /** Free-text PEP context from the KYC profile, when a flow ever sets it. */
  pepDetails?: string;
  /** Declared source of funds, when a flow ever sets it. */
  sourceOfFunds?: string;
  /** Only surfaced when explicitly true (the field defaults to false unasked). */
  sanctionsDeclared: boolean;
}

export interface IdentitySummary {
  name?: string;
  email?: string;
  role?: string;
  idType?: string;
  idNumber?: string;
  verificationMethod?: "smile_id" | "manual";
}

/**
 * One org member's full KYC view. The payload returns every member's profile;
 * each is rendered and approved individually — a multi-member org is not
 * reviewable through its first profile alone.
 */
export interface MemberKycView {
  /** Review-mutation target (PATCH kyc/:userId); unset if the user was deleted. */
  userId?: string;
  status: ReviewStatus;
  identitySummary: IdentitySummary;
  checks: KycCheckSummary;
  declarations: CaseDeclarations;
  identityImages: ViewableItem[];
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
  /** Case-header summary fields (who, role, how long they have waited). */
  summary: {
    /** Composite onboarding status, drives the header status pill. */
    complianceStatus:
      | "draft"
      | "submitted"
      | "pending_review"
      | "action_required"
      | "approved";
    /** Self-identified participant role (buyer, seller, logistics_provider, …). */
    accountType?: string;
    /** Email of the applicant who submitted the case. */
    submitterEmail?: string;
    /** ISO submission timestamp, drives the "waiting" age + overdue flag. */
    submittedAt?: string;
  };
  /**
   * Corridor verification mode. `manual` drives the document-led layout + reviewer
   * checklist; `automated` keeps the provider/registry-led checks layout.
   */
  verificationMode: "manual" | "automated";
  /** Primary member's identity summary (members[0]); see `members` for all. */
  identitySummary: IdentitySummary;
  kybStatus: ReviewStatus;
  /**
   * Durable verification verdict — platform access gates on this, while
   * kybStatus is the conversational case state and cycles freely
   * post-approval. Absent = never approved.
   */
  verificationStanding?: "verified" | "revoked";
  /**
   * Worst-of KYC status across ALL members (any action_required wins, approved
   * only when every member is approved) — so the decision bar never claims an
   * identity verdict a second member does not yet have.
   */
  kycStatus: ReviewStatus;
  /** False when the case has no identity (KYC) profile at all — KYB-only. */
  hasKycProfile: boolean;
  /** Every org member's KYC view, one entry per profile in the payload. */
  members: MemberKycView[];
  checks: {
    /** Primary member's checks (members[0]); see `members` for all. */
    kyc: KycCheckSummary;
    kyb: {
      status: "passed" | "manual_review" | "failed";
      rcNumber: string;
      companyName: string;
      directorsFound: number;
      registrySource: string;
      /** Sanctions screening result on the business; unset = screening never ran. */
      sanctions?: ScreeningResult;
    };
  };
  /** Primary member's declarations (members[0]); see `members` for all. */
  declarations: CaseDeclarations;
  registryData?: RegistryDataDto;
  /**
   * Data-completeness checklist: platform items (country identifiers +
   * provisioning-known fields) plus provider items derived from the same
   * missingRequirements call the payment-onboarding pipeline gates on.
   */
  completeness: Array<{
    key: string;
    label: string;
    satisfied: boolean;
    detail?: string;
    source: "platform" | "provider";
    provider?: string;
    /**
     * How the gap closes (drives the request action). Provider items carry the
     * requestable kinds; `approval` marks reviewer-confirmed platform items
     * (set at approval; pending, not missing, before then).
     */
    resolution?:
      | "registry_adoptable"
      | "org_data"
      | "org_document"
      | "platform"
      | "unmapped"
      | "approval";
  }>;
  /** Ownership math over stored beneficial owners. Only over100 is an error. */
  ubo: {
    totalPercent: number;
    ownersWithPercent: number;
    ownersWithoutPercent: number;
    over100: boolean;
    threshold: number;
    thresholdLabel: string;
  };
  /** Registry-vs-stored people divergence; notStored names are adoptable. */
  peopleReconciliation: {
    registryDirectors: number;
    storedDirectors: number;
    registryOwners: number;
    storedOwners: number;
    directorsNotStored: string[];
    ownersNotStored: string[];
  };
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
      /** Document trace (kyb.document_provided / kyb.documents_requested). */
      document?: string;
      label?: string;
      /** Snapshot of the provided file — doubles as version history, since a
       * later re-upload replaces the live entry but not this reference. */
      file?: { url: string; name?: string };
    };
  }>;
}
