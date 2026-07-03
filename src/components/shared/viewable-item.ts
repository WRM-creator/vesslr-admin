export interface ViewableItem {
  url: string;
  name: string;
  type: string;
  source: "smile_id" | "uploaded";
  label: string;
  /**
   * Compliance reason target this document maps to, if any (e.g. a certificate →
   * `cac_certificate`). Enables the inline "flag" affordance on the admin case;
   * absent for documents with no reviewable reason target.
   */
  reasonTarget?: string;
  /**
   * Whether this slot has actually been provided. `missing`/`requested` are
   * expected-but-absent slots (a required document not uploaded, or one an admin
   * requested) rendered as placeholders so gaps are visible and flaggable;
   * `present` (default) is a real uploaded/verified file with a `url`.
   */
  slotStatus?: "present" | "missing" | "requested";
  /** Context for a missing/requested slot, e.g. why an admin requested it. */
  note?: string;
  /** ISO timestamp of when the current file was (last) provided, when known. */
  uploadedAt?: string;
  /**
   * The file was provided after the reviewer's last action on the case —
   * surfaced as an "Updated" chip so what changed since the last review pops.
   */
  updatedSinceReview?: boolean;
  /**
   * A provided free-form admin-requested document (one with no fixed reason
   * target, e.g. a bank statement) that the reviewer can ask for again. Carries
   * the document `type`/`label` so the inline "Request again" affordance can seed
   * a fresh document request by type (reason targets are a fixed enum and can't
   * express these ad-hoc types).
   */
  requestDoc?: { type: string; label: string };
}
