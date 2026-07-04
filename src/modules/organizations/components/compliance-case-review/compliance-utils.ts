import type {
  ComplianceCaseDetailDto,
  ComplianceCheckDto,
  FileMetadataDto,
  KycProfileDto,
} from "@/lib/api/generated";
import type {
  ComplianceCase,
  MemberKycView,
  ReviewStatus,
  ScreeningResult,
  ViewableItem,
} from "./types";

export const REGISTRY_SOURCE: Record<string, string> = {
  NG: "CAC",
  KE: "eCitizen",
  ZA: "CIPC",
  GH: "ORC",
};

/** "buyer_seller" → "Buyer & Seller"; "logistics_provider" → "Logistics provider". */
export function formatAccountType(value?: string): string | null {
  if (!value) return null;
  if (value === "buyer_seller") return "Buyer & Seller";
  const spaced = value.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function toViewableItem(
  file: FileMetadataDto,
  label: string,
  source: ViewableItem["source"],
  reasonTarget?: string,
  uploadedAt?: string,
): ViewableItem {
  return {
    url: file.url,
    name: file.name ?? label,
    type: file.type ?? "application/octet-stream",
    label,
    source,
    reasonTarget,
    slotStatus: "present",
    uploadedAt,
  };
}

/**
 * An expected-but-absent evidence slot (a required document not uploaded, an
 * admin-requested one still outstanding, or an identity image never captured).
 * Rendered as a placeholder so the gap is visible and flaggable; carries no file.
 */
function missingSlot(
  label: string,
  reasonTarget: string | undefined,
  status: "missing" | "requested",
  note?: string,
): ViewableItem {
  return {
    url: "",
    name: label,
    type: "",
    label,
    source: "uploaded",
    reasonTarget,
    slotStatus: status,
    note,
  };
}

/**
 * Friendly title + reason target for the document codes covered by the backend
 * checklist. Codes outside this map (free-form admin requests) fall back to the
 * checklist's own label and carry no reason target.
 */
const DOC_CHECKLIST_META: Record<
  string,
  { title: string; reasonTarget?: string }
> = {
  certificate_of_incorporation: {
    title: "Certificate of Incorporation",
    reasonTarget: "cac_certificate",
  },
  proof_of_business_address: {
    title: "Proof of Business Address",
    reasonTarget: "proof_of_address",
  },
  tax_id_evidence: { title: "Tax ID Evidence" },
  memorandum_articles: { title: "Memorandum & Articles" },
};

/**
 * A screening check (sanctions/PEP) as a normalized result, or undefined when
 * the check never ran. A stored check without a status is treated as never-ran
 * rather than defaulted — inventing a status here would misreport screening.
 */
function toScreeningResult(
  check?: ComplianceCheckDto,
): ScreeningResult | undefined {
  if (!check?.status) return undefined;
  return {
    status: check.status,
    provider: check.provider,
    checkedAt: check.checkedAt,
  };
}

/** ISO string for a date-ish value, or undefined when absent/unparseable. */
function toValidIso(value?: string | Date): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * Worst-of rollup across every member's KYC status, mirroring the backend's
 * composite ordering: a blocking state on any member wins; approved only when
 * every member is approved. No members at all reads as draft (KYB-only case).
 */
function worstKycStatus(statuses: ReviewStatus[]): ReviewStatus {
  if (statuses.length === 0) return "draft";
  if (statuses.every((s) => s === "approved")) return "approved";
  for (const blocking of [
    "action_required",
    "pending_review",
    "submitted",
  ] as const) {
    if (statuses.includes(blocking)) return blocking;
  }
  return "draft";
}

/**
 * One org member's KYC profile normalized for review: identity summary,
 * evidence images (with expected-but-missing slots on manual corridors),
 * honest check signals, and declarations. Applied to EVERY profile in the
 * payload — a multi-member org gets one view per member, not just the first.
 */
function toMemberView(kyc: KycProfileDto, kybManual: boolean): MemberKycView {
  const smileStatus = kyc.identity?.smileVerificationStatus;

  // Manual corridors (no automated identity provider) upload the ID/selfie for
  // admin review. Badge images "Smile ID" only when the provider actually
  // returned a verdict — a set smileVerificationStatus is the one signal the
  // provider handled this identity; anything else was an applicant upload.
  const identitySource: "smile_id" | "uploaded" =
    kyc.identity?.verificationMethod === "manual" || !smileStatus
      ? "uploaded"
      : "smile_id";

  const isManual = kybManual || kyc.identity?.verificationMethod === "manual";

  // Expected identity images apply to MANUAL corridors only, where the applicant
  // uploads an ID + selfie and an absent one is genuinely actionable. On automated
  // (Smile ID) corridors the provider is the identity authority: number-based IDs
  // (e.g. NIN) verify against a national database and return only a selfie, so a
  // "missing" government-ID image would be a false positive. Real incompleteness
  // there surfaces as the check status, not a missing-image tile. The ID back is
  // never forced (many IDs, e.g. passports, are single-sided); address proof is
  // present-only.
  const identitySlots: Array<{
    file?: FileMetadataDto;
    label: string;
    reasonTarget?: string;
    expected: boolean;
  }> = [
    {
      file: kyc.identity?.governmentId,
      label: "Government ID (Front)",
      reasonTarget: "id_document",
      expected: isManual,
    },
    {
      file: kyc.identity?.governmentIdBack,
      label: "Government ID (Back)",
      reasonTarget: "id_document",
      expected: false,
    },
    {
      file: kyc.identity?.selfie,
      label: "Selfie",
      reasonTarget: "selfie_liveness",
      expected: isManual,
    },
    {
      file: kyc.identity?.addressProof,
      label: "Address Proof",
      reasonTarget: undefined,
      expected: false,
    },
  ];

  const identityImages: ViewableItem[] = [];
  for (const slot of identitySlots) {
    if (slot.file) {
      identityImages.push(
        toViewableItem(slot.file, slot.label, identitySource, slot.reasonTarget),
      );
    } else if (slot.expected) {
      identityImages.push(missingSlot(slot.label, slot.reasonTarget, "missing"));
    }
  }

  const fullName = [kyc.user?.firstName, kyc.user?.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    userId: kyc.user?._id,
    status: (kyc.status ?? "draft") as ReviewStatus,
    identitySummary: {
      name: fullName || undefined,
      email: kyc.user?.email,
      role: kyc.user?.role,
      idType: kyc.identity?.idType,
      idNumber: kyc.identity?.idNumber,
      verificationMethod: kyc.identity?.verificationMethod,
    },
    checks: {
      status: kyc.checks?.identity?.status ?? "manual_review",
      providerResult: smileStatus,
      selfieProvided: !!kyc.identity?.selfie,
      idType: kyc.identity?.idType ?? "",
      sanctions: toScreeningResult(kyc.checks?.sanctions),
      pep: toScreeningResult(kyc.checks?.pep),
    },
    declarations: {
      representative: kyc.user?.businessRepresentative
        ? {
            isPep: kyc.user.businessRepresentative.isPep,
            pepRelations: kyc.user.businessRepresentative.pepRelations ?? [],
            isDirector: kyc.user.businessRepresentative.isDirector,
            ownsMoreThanFivePercent:
              kyc.user.businessRepresentative.ownsMoreThanFivePercent,
            attestation: kyc.user.businessRepresentative.attestation,
          }
        : undefined,
      // The KYC-profile declaration fields have no write path today; pass them
      // through only when genuinely set so defaults never render as answers.
      pepDetails: kyc.declarations?.pepDetails || undefined,
      sourceOfFunds: kyc.declarations?.sourceOfFunds || undefined,
      sanctionsDeclared: kyc.declarations?.sanctionsDeclaration === true,
    },
    identityImages,
  };
}

export function toComplianceCase(raw: ComplianceCaseDetailDto): ComplianceCase {
  // Every deref below is guarded: legacy/degenerate cases can arrive without a
  // company snapshot, without any KYC profile (KYB-only), or with an empty
  // documents view, and must degrade to an honest sparse case, not a crash.
  const kyb: Partial<ComplianceCaseDetailDto["kybProfile"]> =
    raw.kybProfile ?? {};
  const kycProfiles = raw.kycProfiles ?? [];
  const snap = kyb.companySnapshot ?? {};
  const events = raw.events ?? [];

  const kybManual = kyb.verificationMode === "manual";
  const members = kycProfiles.map((profile) => toMemberView(profile, kybManual));
  // The primary member anchors the single-member fields the header and band
  // read; multi-member consumers iterate `members`.
  const primary = members[0];

  const documents: ViewableItem[] = [];
  const docs: Partial<ComplianceCaseDetailDto["kybProfile"]["documents"]> =
    kyb.documents ?? {};

  // Expected documents (country requirements + admin requests): render required
  // and outstanding-requested items even when absent so gaps are visible, plus
  // any present optional doc. Absent optional documents are omitted (noise).
  for (const item of raw.documentChecklist ?? []) {
    if (!(item.required || item.requested || item.present)) continue;
    const meta = DOC_CHECKLIST_META[item.code];
    const title = meta?.title ?? item.label;
    if (item.present && item.file) {
      documents.push({
        ...toViewableItem(item.file, title, "uploaded", meta?.reasonTarget, item.uploadedAt),
        // Trail verdict passes through only when an admin actually ruled;
        // plain "provided" renders no verdict chip.
        reviewVerdict:
          item.status === "accepted" || item.status === "rejected"
            ? item.status
            : undefined,
      });
    } else {
      documents.push({
        ...missingSlot(
          title,
          meta?.reasonTarget,
          item.requested ? "requested" : "missing",
          item.note,
        ),
        requestedAt: item.requestedAt,
      });
    }
  }

  // Provided curated/ad-hoc documents (admin-requested types with no named slot,
  // e.g. a utility bill). Without these the fulfilled request would vanish from
  // the case view entirely — it drops off the checklist once provided.
  for (const other of raw.otherDocuments ?? []) {
    if (!other.file) continue;
    const label = other.label ?? other.type;
    documents.push({
      ...toViewableItem(other.file, label, "uploaded", undefined, other.uploadedAt),
      // No fixed reason target, but re-requestable by its own type so an
      // inadequate provided doc can be sent back without retyping it.
      requestDoc: { type: other.type, label },
      reviewVerdict:
        other.status === "accepted" || other.status === "rejected"
          ? other.status
          : undefined,
    });
  }

  // Present documents outside the checklist set (registry search certificate,
  // secondary registry docs, seller financials, collections) render as-is; these
  // are never "missing" in a required sense.
  if (docs.searchCertificate)
    documents.push(
      // Registry-sourced (e.g. a CAC search certificate) — the identity
      // provider is only the courier, so don't badge it "Smile ID".
      toViewableItem(docs.searchCertificate, "Search Certificate", "registry"),
    );
  if (docs.boardResolution)
    documents.push(
      toViewableItem(docs.boardResolution, "Board Resolution", "uploaded"),
    );
  if (docs.pscRegister)
    documents.push(
      toViewableItem(docs.pscRegister, "PSC Register", "uploaded"),
    );
  for (const license of docs.licensesAndCertifications ?? []) {
    documents.push(
      toViewableItem(
        license,
        license.name ?? "License/Certificate",
        "uploaded",
      ),
    );
  }
  for (const additional of docs.additionalDocuments ?? []) {
    documents.push(
      toViewableItem(
        additional,
        additional.name ?? "Additional Document",
        "uploaded",
      ),
    );
  }
  if (docs.proofOfPastPerformance)
    documents.push(
      toViewableItem(
        docs.proofOfPastPerformance,
        "Proof of Past Performance",
        "uploaded",
        "proof_of_past_performance",
      ),
    );
  if (docs.statementOfAccount)
    documents.push(
      toViewableItem(
        docs.statementOfAccount,
        "Statement of Account",
        "uploaded",
        "statement_of_account",
      ),
    );

  // "Changed since I last looked": a document uploaded after the reviewer's
  // most recent action on the case gets an Updated chip. Anchoring on the last
  // admin event (request/decision) avoids per-admin read tracking; ISO strings
  // compare lexicographically. No admin action yet → nothing is "updated".
  const lastAdminActionAt = events
    .filter((e) => e.actorType === "admin")
    .reduce<string | undefined>(
      (max, e) => (!max || e.createdAt > max ? e.createdAt : max),
      undefined,
    );
  if (lastAdminActionAt) {
    for (const doc of documents) {
      if (doc.uploadedAt && doc.uploadedAt > lastAdminActionAt) {
        doc.updatedSinceReview = true;
      }
    }
  }

  // Multi-member fields the primary anchors when absent (KYB-only case).
  const emptyDeclarations = { sanctionsDeclared: false };

  return {
    organization: {
      name: snap.name ?? "",
      countryCode: snap.countryCode ?? "",
      rcNumber: snap.rcNumber ?? "",
      taxId: snap.taxId ?? "",
      businessType: snap.businessType,
      postalAddress: snap.postalAddress,
    },
    summary: {
      complianceStatus:
        (raw.complianceStatus as ComplianceCase["summary"]["complianceStatus"]) ??
        "pending_review",
      accountType: raw.accountType,
      submitterEmail: primary?.identitySummary.email,
      submittedAt: toValidIso(raw.submittedAt),
    },
    // Manual corridors set verificationMethod 'manual' on identity; the KYB profile
    // also carries the corridor mode. Treat either manual signal as a manual case.
    verificationMode:
      kybManual ||
      primary?.identitySummary.verificationMethod === "manual"
        ? "manual"
        : "automated",
    identitySummary: primary?.identitySummary ?? {},
    kybStatus: (kyb.status ?? "draft") as ComplianceCase["kybStatus"],
    verificationStanding:
      kyb.verificationStanding as ComplianceCase["verificationStanding"],
    kycStatus: worstKycStatus(members.map((m) => m.status)),
    hasKycProfile: members.length > 0,
    members,
    checks: {
      kyc: primary?.checks ?? {
        status: "manual_review",
        selfieProvided: false,
        idType: "",
      },
      kyb: {
        status: kyb.checks?.registry?.status ?? "manual_review",
        rcNumber: snap.rcNumber ?? "",
        companyName: snap.name ?? "",
        directorsFound: snap.directorsCount ?? 0,
        registrySource: REGISTRY_SOURCE[snap.countryCode ?? ""] ?? "Registry",
        sanctions: toScreeningResult(kyb.checks?.sanctions),
      },
    },
    declarations: primary?.declarations ?? emptyDeclarations,
    registryData: kyb.registryData,
    // Backend-derived checks; guarded so an older payload degrades to empty
    // rather than crashing (same rule as every other deref in this function).
    completeness: raw.completeness ?? [],
    ubo: raw.ubo ?? {
      totalPercent: 0,
      ownersWithPercent: 0,
      ownersWithoutPercent: 0,
      over100: false,
      threshold: 0,
      thresholdLabel: "",
    },
    peopleReconciliation: raw.peopleReconciliation ?? {
      registryDirectors: 0,
      storedDirectors: 0,
      registryOwners: 0,
      storedOwners: 0,
      directorsNotStored: [],
      ownersNotStored: [],
    },
    documents,
    identityImages: primary?.identityImages ?? [],
    events: events.map((e) => ({
      id: e._id,
      eventType: e.eventType,
      actorType: e.actorType,
      actorName: e.actorName,
      createdAt: e.createdAt,
      metadata: e.metadata as ComplianceCase["events"][number]["metadata"],
    })),
  };
}
