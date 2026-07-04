/**
 * Contract tests for toComplianceCase against degenerate case payloads.
 *
 * The backend can serve sparse/legacy cases: no KYC profile (KYB-only), no
 * company snapshot, no events, an empty documents view. toComplianceCase is the
 * single normalization point, so it must degrade every one of these to an
 * honest sparse case instead of crashing to the route error boundary. Fixtures
 * deliberately violate the generated DTO types — that is the point — so they
 * are built as partials and cast once.
 */
import { describe, expect, it } from "vitest";
import type { ComplianceCaseDetailDto } from "@/lib/api/generated";
import { toComplianceCase } from "./compliance-utils";

const file = (name: string) => ({
  url: `https://files.example.com/${name}.pdf`,
  name: `${name}.pdf`,
  type: "application/pdf",
});

function payload(overrides: Record<string, unknown> = {}) {
  return {
    organizationId: "org-1",
    accountType: "buyer_seller",
    kybProfile: {
      status: "pending_review",
      companySnapshot: {
        name: "Acme Ltd",
        countryCode: "NG",
        rcNumber: "RC123",
        taxId: "TIN9",
        directorsCount: 2,
      },
      checks: { registry: { status: "passed" } },
      documents: {},
      verificationMode: "automated",
    },
    kycProfiles: [
      {
        status: "pending_review",
        user: { firstName: "Ada", lastName: "Obi", email: "ada@acme.test" },
        identity: {
          idType: "NIN",
          idNumber: "123",
          verificationMethod: "smile_id",
          smileVerificationStatus: "passed",
          selfie: file("selfie"),
        },
        checks: { identity: { status: "passed" } },
      },
    ],
    documentChecklist: [],
    otherDocuments: [],
    complianceStatus: "pending_review",
    events: [],
    ...overrides,
  } as unknown as ComplianceCaseDetailDto;
}

describe("toComplianceCase degenerate payloads", () => {
  it("KYB-only case (no KYC profiles) degrades honestly instead of crashing", () => {
    const result = toComplianceCase(payload({ kycProfiles: [] }));
    expect(result.hasKycProfile).toBe(false);
    expect(result.kycStatus).toBe("draft");
    expect(result.checks.kyc.providerResult).toBeUndefined();
    expect(result.checks.kyc.selfieProvided).toBe(false);
    expect(result.identityImages).toEqual([]);
  });

  it("missing kycProfiles array entirely does not crash", () => {
    const result = toComplianceCase(payload({ kycProfiles: undefined }));
    expect(result.hasKycProfile).toBe(false);
  });

  it("missing companySnapshot yields empty org fields, not a crash", () => {
    const raw = payload();
    delete (raw.kybProfile as Record<string, unknown>).companySnapshot;
    const result = toComplianceCase(raw);
    expect(result.organization.name).toBe("");
    expect(result.organization.countryCode).toBe("");
  });

  it("missing events does not crash and produces an empty history", () => {
    const result = toComplianceCase(payload({ events: undefined }));
    expect(result.events).toEqual([]);
  });

  it("missing documents view does not crash", () => {
    const raw = payload();
    delete (raw.kybProfile as Record<string, unknown>).documents;
    const result = toComplianceCase(raw);
    expect(result.documents).toEqual([]);
  });

  it("kybProfile absent yields a sparse case, not a crash", () => {
    const result = toComplianceCase(payload({ kybProfile: undefined }));
    expect(result.kybStatus).toBe("draft");
    expect(result.organization.name).toBe("");
  });
});

describe("honest identity signals", () => {
  it("maps the provider verdict to ONE providerResult signal", () => {
    const result = toComplianceCase(payload());
    expect(result.checks.kyc.providerResult).toBe("passed");
    expect(result.checks.kyc.selfieProvided).toBe(true);
  });

  it("no provider verdict -> providerResult unset, images badged uploaded", () => {
    const raw = payload();
    const kyc = (raw.kycProfiles as Array<Record<string, unknown>>)[0];
    (kyc.identity as Record<string, unknown>).smileVerificationStatus =
      undefined;
    const result = toComplianceCase(raw);
    expect(result.checks.kyc.providerResult).toBeUndefined();
    const selfie = result.identityImages.find((i) => i.label === "Selfie");
    expect(selfie?.source).toBe("uploaded");
  });

  it("manual corridor images are badged uploaded even with a provider status", () => {
    const raw = payload();
    const kyc = (raw.kycProfiles as Array<Record<string, unknown>>)[0];
    (kyc.identity as Record<string, unknown>).verificationMethod = "manual";
    const result = toComplianceCase(raw);
    const selfie = result.identityImages.find((i) => i.label === "Selfie");
    expect(selfie?.source).toBe("uploaded");
    expect(result.verificationMode).toBe("manual");
  });

  it("badges the registry search certificate as registry, not Smile ID", () => {
    const raw = payload();
    (raw.kybProfile.documents as Record<string, unknown>).searchCertificate =
      file("search-cert");
    const result = toComplianceCase(raw);
    const cert = result.documents.find((d) => d.label === "Search Certificate");
    expect(cert?.source).toBe("registry");
  });
});

describe("sanctions/PEP screening results", () => {
  it("passes KYB sanctions and KYC sanctions/pep check results through", () => {
    const raw = payload();
    (raw.kybProfile.checks as Record<string, unknown>).sanctions = {
      status: "manual_review",
      provider: "smile_id",
      checkedAt: "2026-06-01T09:00:00.000Z",
    };
    const kyc = (raw.kycProfiles as Array<Record<string, unknown>>)[0];
    (kyc.checks as Record<string, unknown>).sanctions = { status: "passed" };
    (kyc.checks as Record<string, unknown>).pep = { status: "failed" };
    const result = toComplianceCase(raw);
    expect(result.checks.kyb.sanctions).toEqual({
      status: "manual_review",
      provider: "smile_id",
      checkedAt: "2026-06-01T09:00:00.000Z",
    });
    expect(result.checks.kyc.sanctions?.status).toBe("passed");
    expect(result.checks.kyc.pep?.status).toBe("failed");
  });

  it("never-ran screening stays undefined (not defaulted to a status)", () => {
    const result = toComplianceCase(payload());
    expect(result.checks.kyb.sanctions).toBeUndefined();
    expect(result.checks.kyc.sanctions).toBeUndefined();
    expect(result.checks.kyc.pep).toBeUndefined();
  });

  it("a stored check without a status counts as never-ran", () => {
    const raw = payload();
    (raw.kybProfile.checks as Record<string, unknown>).sanctions = {
      provider: "smile_id",
    };
    const result = toComplianceCase(raw);
    expect(result.checks.kyb.sanctions).toBeUndefined();
  });
});

describe("declarations", () => {
  it("surfaces the business-representative declaration from the KYC user", () => {
    const raw = payload();
    const kyc = (raw.kycProfiles as Array<Record<string, unknown>>)[0];
    (kyc.user as Record<string, unknown>).businessRepresentative = {
      isPep: true,
      pepRelations: [{ name: "Chief Obi", position: "Senator" }],
      isDirector: true,
      ownsMoreThanFivePercent: false,
      attestation: true,
    };
    (kyc as Record<string, unknown>).declarations = {
      isPep: false,
      sanctionsDeclaration: false,
      pepDetails: "Uncle holds public office",
    };
    const result = toComplianceCase(raw);
    expect(result.declarations.representative).toEqual({
      isPep: true,
      pepRelations: [{ name: "Chief Obi", position: "Senator" }],
      isDirector: true,
      ownsMoreThanFivePercent: false,
      attestation: true,
    });
    expect(result.declarations.pepDetails).toBe("Uncle holds public office");
  });

  it("default-false KYC declaration fields are not presented as answers", () => {
    const raw = payload();
    const kyc = (raw.kycProfiles as Array<Record<string, unknown>>)[0];
    // The persisted defaults every profile carries today (no write path).
    (kyc as Record<string, unknown>).declarations = {
      isPep: false,
      sanctionsDeclaration: false,
    };
    const result = toComplianceCase(raw);
    expect(result.declarations.representative).toBeUndefined();
    expect(result.declarations.pepDetails).toBeUndefined();
    expect(result.declarations.sourceOfFunds).toBeUndefined();
    expect(result.declarations.sanctionsDeclared).toBe(false);
  });

  it("KYB-only case yields an empty declarations block, not a crash", () => {
    const result = toComplianceCase(payload({ kycProfiles: [] }));
    expect(result.declarations.representative).toBeUndefined();
    expect(result.declarations.sanctionsDeclared).toBe(false);
  });
});

describe("completeness / UBO / people reconciliation", () => {
  it("passes the backend-derived checks through", () => {
    const result = toComplianceCase(
      payload({
        completeness: [
          {
            key: "incorporation_date",
            label: "Incorporation date",
            satisfied: false,
            source: "platform",
          },
          {
            key: "provider:busha:owners",
            label: "Owners",
            satisfied: false,
            detail: "Busha KYB requires at least one business owner/director",
            source: "provider",
            provider: "busha",
          },
        ],
        ubo: {
          totalPercent: 115,
          ownersWithPercent: 2,
          ownersWithoutPercent: 0,
          over100: true,
          threshold: 5.01,
          thresholdLabel: "UBO threshold is > 5%",
        },
        peopleReconciliation: {
          registryDirectors: 2,
          storedDirectors: 0,
          registryOwners: 1,
          storedOwners: 0,
          directorsNotStored: ["Ada Lovelace", "Alan Turing"],
          ownersNotStored: ["Grace Hopper"],
        },
      }),
    );
    expect(result.completeness).toHaveLength(2);
    expect(result.completeness[1].source).toBe("provider");
    expect(result.ubo.over100).toBe(true);
    expect(result.peopleReconciliation.directorsNotStored).toEqual([
      "Ada Lovelace",
      "Alan Turing",
    ]);
  });

  it("an older payload without the derived fields degrades to empty, not a crash", () => {
    const result = toComplianceCase(payload());
    expect(result.completeness).toEqual([]);
    expect(result.ubo.totalPercent).toBe(0);
    expect(result.ubo.over100).toBe(false);
    expect(result.peopleReconciliation.storedDirectors).toBe(0);
    expect(result.peopleReconciliation.directorsNotStored).toEqual([]);
  });
});

describe("document trail", () => {
  it("passes accepted/rejected verdicts and requested dates through to tiles", () => {
    const result = toComplianceCase(
      payload({
        documentChecklist: [
          {
            code: "certificate_of_incorporation",
            label: "Certificate of Incorporation",
            required: true,
            requested: false,
            present: true,
            file: file("cert"),
            status: "rejected",
          },
          {
            code: "utility_bill",
            label: "Utility bill",
            required: false,
            requested: true,
            present: false,
            requestedAt: "2026-06-01T10:00:00.000Z",
          },
        ],
      }),
    );
    const cert = result.documents.find(
      (d) => d.label === "Certificate of Incorporation",
    );
    expect(cert?.reviewVerdict).toBe("rejected");
    const bill = result.documents.find((d) => d.label === "Utility bill");
    expect(bill?.slotStatus).toBe("requested");
    expect(bill?.requestedAt).toBe("2026-06-01T10:00:00.000Z");
  });

  it("a merely-provided document gets NO verdict chip", () => {
    const result = toComplianceCase(
      payload({
        documentChecklist: [
          {
            code: "certificate_of_incorporation",
            label: "Certificate of Incorporation",
            required: true,
            requested: false,
            present: true,
            file: file("cert"),
            status: "provided",
          },
        ],
      }),
    );
    const cert = result.documents.find(
      (d) => d.label === "Certificate of Incorporation",
    );
    expect(cert?.reviewVerdict).toBeUndefined();
  });
});

describe("multi-member KYC", () => {
  const secondProfile = (overrides: Record<string, unknown> = {}) => ({
    status: "pending_review",
    user: {
      _id: "u2",
      firstName: "Grace",
      lastName: "Hopper",
      email: "grace@acme.test",
      role: "admin",
      businessRepresentative: { isPep: true, pepRelations: [] },
    },
    identity: {
      idType: "passport",
      idNumber: "P99",
      verificationMethod: "manual",
      governmentId: file("grace-id"),
    },
    checks: { identity: { status: "manual_review" }, pep: { status: "failed" } },
    ...overrides,
  });

  it("normalizes EVERY member's profile, not just the first", () => {
    const raw = payload();
    (raw.kycProfiles as unknown[]).push(secondProfile());
    const result = toComplianceCase(raw);

    expect(result.members).toHaveLength(2);
    const [first, second] = result.members;
    expect(first.identitySummary.name).toBe("Ada Obi");
    expect(second.identitySummary.name).toBe("Grace Hopper");
    expect(second.userId).toBe("u2");
    // Per-member evidence and signals, independent of the primary's.
    expect(second.identityImages.map((i) => i.label)).toContain(
      "Government ID (Front)",
    );
    expect(second.checks.pep?.status).toBe("failed");
    expect(second.declarations.representative?.isPep).toBe(true);
    // The primary keeps anchoring the single-member fields.
    expect(result.identitySummary.name).toBe("Ada Obi");
  });

  it("kycStatus rolls up worst-of across members, so one approved member cannot mask another", () => {
    const raw = payload();
    (raw.kycProfiles as Array<Record<string, unknown>>)[0].status = "approved";
    (raw.kycProfiles as unknown[]).push(
      secondProfile({ status: "action_required" }),
    );
    expect(toComplianceCase(raw).kycStatus).toBe("action_required");

    const allApproved = payload();
    (allApproved.kycProfiles as Array<Record<string, unknown>>)[0].status =
      "approved";
    (allApproved.kycProfiles as unknown[]).push(
      secondProfile({ status: "approved" }),
    );
    expect(toComplianceCase(allApproved).kycStatus).toBe("approved");
  });

  it("KYB-only case yields an empty members list", () => {
    const result = toComplianceCase(payload({ kycProfiles: [] }));
    expect(result.members).toEqual([]);
    expect(result.kycStatus).toBe("draft");
  });
});

describe("events", () => {
  it("passes actorName through for decision-history attribution", () => {
    const result = toComplianceCase(
      payload({
        events: [
          {
            _id: "e1",
            eventType: "kyb.approved",
            actorType: "admin",
            actorId: "a1",
            actorName: "Jane Ops",
            createdAt: "2026-07-01T10:00:00.000Z",
          },
        ],
      }),
    );
    expect(result.events[0].actorName).toBe("Jane Ops");
  });
});
