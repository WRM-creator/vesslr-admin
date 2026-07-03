import type {
  ComplianceCaseDetailDto,
  FileMetadataDto,
} from "@/lib/api/generated";
import type { ComplianceCase, ViewableItem } from "./types";

export const REGISTRY_SOURCE: Record<string, string> = {
  NG: "CAC",
  KE: "eCitizen",
  ZA: "CIPC",
  GH: "ORC",
};

export function toViewableItem(
  file: FileMetadataDto,
  label: string,
  source: "smile_id" | "uploaded",
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

export function toComplianceCase(raw: ComplianceCaseDetailDto): ComplianceCase {
  const kyb = raw.kybProfile;
  const kyc = raw.kycProfiles[0];
  const snap = kyb.companySnapshot;
  const smileStatus = kyc?.identity?.smileVerificationStatus;
  const isPassed = smileStatus === "passed";

  // Manual corridors (no automated identity provider) upload the ID/selfie for
  // admin review; badge those as "Uploaded" rather than "Smile ID".
  const identitySource: "smile_id" | "uploaded" =
    kyc?.identity?.verificationMethod === "manual" ? "uploaded" : "smile_id";

  const isManual = identitySource === "uploaded";

  const documents: ViewableItem[] = [];
  const docs = kyb.documents;

  // Expected documents (country requirements + admin requests): render required
  // and outstanding-requested items even when absent so gaps are visible, plus
  // any present optional doc. Absent optional documents are omitted (noise).
  for (const item of raw.documentChecklist ?? []) {
    if (!(item.required || item.requested || item.present)) continue;
    const meta = DOC_CHECKLIST_META[item.code];
    const title = meta?.title ?? item.label;
    if (item.present && item.file) {
      documents.push(
        toViewableItem(item.file, title, "uploaded", meta?.reasonTarget, item.uploadedAt),
      );
    } else {
      documents.push(
        missingSlot(
          title,
          meta?.reasonTarget,
          item.requested ? "requested" : "missing",
          item.note,
        ),
      );
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
    });
  }

  // Present documents outside the checklist set (registry search certificate,
  // secondary registry docs, seller financials, collections) render as-is; these
  // are never "missing" in a required sense.
  if (docs.searchCertificate)
    documents.push(
      toViewableItem(docs.searchCertificate, "Search Certificate", "smile_id"),
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
      file: kyc?.identity?.governmentId,
      label: "Government ID (Front)",
      reasonTarget: "id_document",
      expected: isManual,
    },
    {
      file: kyc?.identity?.governmentIdBack,
      label: "Government ID (Back)",
      reasonTarget: "id_document",
      expected: false,
    },
    {
      file: kyc?.identity?.selfie,
      label: "Selfie",
      reasonTarget: "selfie_liveness",
      expected: isManual,
    },
    {
      file: kyc?.identity?.addressProof,
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
      identityImages.push(
        missingSlot(slot.label, slot.reasonTarget, "missing"),
      );
    }
  }

  // "Changed since I last looked": a document uploaded after the reviewer's
  // most recent action on the case gets an Updated chip. Anchoring on the last
  // admin event (request/decision) avoids per-admin read tracking; ISO strings
  // compare lexicographically. No admin action yet → nothing is "updated".
  const lastAdminActionAt = raw.events
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

  const fullName = [kyc?.user?.firstName, kyc?.user?.lastName]
    .filter(Boolean)
    .join(" ");

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
      submitterEmail: kyc?.user?.email,
      submittedAt:
        typeof raw.submittedAt === "string"
          ? raw.submittedAt
          : raw.submittedAt
            ? new Date(raw.submittedAt).toISOString()
            : undefined,
    },
    // Manual corridors set verificationMethod 'manual' on identity; the KYB profile
    // also carries the corridor mode. Treat either manual signal as a manual case.
    verificationMode:
      kyb.verificationMode === "manual" ||
      kyc?.identity?.verificationMethod === "manual"
        ? "manual"
        : "automated",
    identitySummary: {
      name: fullName || undefined,
      idType: kyc?.identity?.idType,
      idNumber: kyc?.identity?.idNumber,
      verificationMethod: kyc?.identity?.verificationMethod,
    },
    kybStatus: kyb.status as ComplianceCase["kybStatus"],
    kycStatus: (kyc?.status ?? "draft") as ComplianceCase["kycStatus"],
    checks: {
      kyc: {
        status: kyc?.checks?.identity?.status ?? "manual_review",
        selfieMatch: isPassed,
        liveness: isPassed,
        documentAuth: isPassed,
        idType: kyc?.identity?.idType ?? "",
      },
      kyb: {
        status: kyb.checks?.registry?.status ?? "manual_review",
        rcNumber: snap.rcNumber ?? "",
        companyName: snap.name ?? "",
        directorsFound: snap.directorsCount ?? 0,
        registrySource: REGISTRY_SOURCE[snap.countryCode ?? ""] ?? "Registry",
      },
    },
    registryData: kyb.registryData,
    documents,
    identityImages,
    events: raw.events.map((e) => ({
      id: e._id,
      eventType: e.eventType,
      actorType: e.actorType,
      createdAt: e.createdAt,
      metadata: e.metadata as ComplianceCase["events"][number]["metadata"],
    })),
  };
}
