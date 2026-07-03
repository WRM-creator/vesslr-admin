/**
 * Requestable KYB document types, mirroring the backend's canonical codes
 * (api compliance/kyb-documents.ts: KYB_DOC + ADDITIONAL_DOC_TYPES). An admin can
 * request any of these by code (no label needed); a free-form document is also
 * supported via the dialog's custom row, which supplies its own label.
 */
export interface DocumentTypeOption {
  type: string;
  label: string;
}

export interface DocumentTypeGroup {
  heading: string;
  options: DocumentTypeOption[];
}

export const REQUESTABLE_DOCUMENT_GROUPS: DocumentTypeGroup[] = [
  {
    heading: "Business documents",
    options: [
      { type: "certificate_of_incorporation", label: "Certificate of Incorporation" },
      { type: "memorandum_articles", label: "Memorandum & Articles of Association" },
      { type: "proof_of_business_address", label: "Proof of Business Address" },
      { type: "board_resolution", label: "Board Resolution" },
      { type: "psc_register", label: "Register of Persons with Significant Control" },
      { type: "tax_id_evidence", label: "Tax Identification Evidence" },
      { type: "search_certificate", label: "Search Certificate" },
      { type: "proof_of_past_performance", label: "Proof of Past Performance" },
      { type: "statement_of_account", label: "Statement of Account" },
      { type: "licenses_certifications", label: "Licenses & Certifications" },
    ],
  },
  {
    heading: "Additional documents",
    options: [
      { type: "utility_bill", label: "Utility Bill" },
      { type: "bank_statement", label: "Bank Statement" },
      { type: "source_of_funds", label: "Source of Funds" },
      { type: "additional_id", label: "Additional ID" },
      { type: "signed_declaration", label: "Signed Declaration" },
      { type: "proof_of_relationship", label: "Proof of Relationship" },
    ],
  },
];

/** Turn a free-form label into a stable snake_case code for a custom document. */
export function customDocumentCode(label: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug ? `custom_${slug}` : "custom_document";
}
