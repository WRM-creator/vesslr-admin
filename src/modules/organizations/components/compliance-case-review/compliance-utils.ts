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

  // Manual corridors (no automated identity provider) upload the ID/selfie for
  // admin review; badge those as "Uploaded" rather than "Smile ID".
  const identitySource: "smile_id" | "uploaded" =
    kyc?.identity?.verificationMethod === "manual" ? "uploaded" : "smile_id";

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
  if (docs.proofOfPastPerformance)
    documents.push(
      toViewableItem(
        docs.proofOfPastPerformance,
        "Proof of Past Performance",
        "uploaded",
      ),
    );
  if (docs.statementOfAccount)
    documents.push(
      toViewableItem(
        docs.statementOfAccount,
        "Statement of Account",
        "uploaded",
      ),
    );

  const identityImages: ViewableItem[] = [];
  if (kyc?.identity?.selfie)
    identityImages.push(
      toViewableItem(kyc.identity.selfie, "Selfie", identitySource),
    );
  if (kyc?.identity?.governmentId)
    identityImages.push(
      toViewableItem(
        kyc.identity.governmentId,
        "Government ID (Front)",
        identitySource,
      ),
    );
  if (kyc?.identity?.governmentIdBack)
    identityImages.push(
      toViewableItem(
        kyc.identity.governmentIdBack,
        "Government ID (Back)",
        identitySource,
      ),
    );
  if (kyc?.identity?.addressProof)
    identityImages.push(
      toViewableItem(kyc.identity.addressProof, "Address Proof", "uploaded"),
    );

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
