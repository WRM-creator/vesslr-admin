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
): ViewableItem {
  return {
    url: file.url,
    name: file.name ?? label,
    type: file.type ?? "application/octet-stream",
    label,
    source,
  };
}

export function toComplianceCase(raw: ComplianceCaseDetailDto): ComplianceCase {
  const kyb = raw.kybProfile;
  const kyc = raw.kycProfiles[0];
  const snap = kyb.companySnapshot;
  const smileStatus = kyc?.identity?.smileVerificationStatus;
  const isPassed = smileStatus === "passed";

  const documents: ViewableItem[] = [];
  const docs = kyb.documents;
  if (docs.searchCertificate)
    documents.push(
      toViewableItem(docs.searchCertificate, "Search Certificate", "smile_id"),
    );
  if (docs.certificateOfIncorporation)
    documents.push(
      toViewableItem(
        docs.certificateOfIncorporation,
        "Certificate of Incorporation",
        "uploaded",
      ),
    );
  if (docs.memorandumArticles)
    documents.push(
      toViewableItem(
        docs.memorandumArticles,
        "Memorandum & Articles",
        "uploaded",
      ),
    );
  if (docs.proofOfBusinessAddress)
    documents.push(
      toViewableItem(
        docs.proofOfBusinessAddress,
        "Proof of Business Address",
        "uploaded",
      ),
    );
  if (docs.boardResolution)
    documents.push(
      toViewableItem(docs.boardResolution, "Board Resolution", "uploaded"),
    );
  if (docs.pscRegister)
    documents.push(
      toViewableItem(docs.pscRegister, "PSC Register", "uploaded"),
    );
  if (docs.taxIdEvidence)
    documents.push(
      toViewableItem(docs.taxIdEvidence, "Tax ID Evidence", "uploaded"),
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

  const identityImages: ViewableItem[] = [];
  if (kyc?.identity?.selfie)
    identityImages.push(
      toViewableItem(kyc.identity.selfie, "Selfie", "smile_id"),
    );
  if (kyc?.identity?.governmentId)
    identityImages.push(
      toViewableItem(
        kyc.identity.governmentId,
        "Government ID (Front)",
        "smile_id",
      ),
    );
  if (kyc?.identity?.governmentIdBack)
    identityImages.push(
      toViewableItem(
        kyc.identity.governmentIdBack,
        "Government ID (Back)",
        "smile_id",
      ),
    );
  if (kyc?.identity?.addressProof)
    identityImages.push(
      toViewableItem(kyc.identity.addressProof, "Address Proof", "uploaded"),
    );

  return {
    organization: {
      name: snap.name ?? "",
      countryCode: snap.countryCode ?? "",
      rcNumber: snap.rcNumber ?? "",
      taxId: snap.taxId ?? "",
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
      metadata: e.metadata as { reasons?: Array<{ target: string; issue: string; note?: string }> } | undefined,
    })),
  };
}
