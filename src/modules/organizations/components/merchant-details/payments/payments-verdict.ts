import type {
  AdminPaymentProfileDto,
  AdminProviderBindingDto,
} from "@/lib/api/generated";

/**
 * The tab's top-level answer, derived once from the profile. The backend owns
 * the per-binding `blockedBy` interpretation; this only aggregates it into a
 * single headline plus whose move it is.
 */
export interface PaymentsVerdict {
  tone: "healthy" | "progress" | "blocked" | "inactive";
  headline: string;
  detail?: string;
  /** Whose move it is. Drives the guidance strip. */
  ownership: "none" | "admin" | "applicant" | "provider";
  /** Show the retry action at all. */
  canRetry: boolean;
  /** Retry is the useful primary action (vs shown-but-demoted). */
  retryPrimary: boolean;
  /** Most recent provisioning touch across bindings, if any. */
  lastChangedAt?: string;
}

function isHealthy(b: AdminProviderBindingDto): boolean {
  return (
    b.status === "active" &&
    (b.onboardingStatus === "none" || b.onboardingStatus === "active")
  );
}

function latestTouch(bindings: AdminProviderBindingDto[]): string | undefined {
  const times = bindings
    .map((b) => b.lastAttemptAt)
    .filter((t): t is string => !!t)
    .sort();
  return times[times.length - 1];
}

export function derivePaymentsVerdict(
  profile: AdminPaymentProfileDto,
): PaymentsVerdict {
  const { kybStatus, bindings } = profile;
  const lastChangedAt = latestTouch(bindings);

  if (kybStatus !== "approved") {
    return {
      tone: "inactive",
      headline: "Not provisioned",
      detail:
        "Payment rails are set up after the business verification is approved.",
      ownership: "none",
      canRetry: false,
      retryPrimary: false,
      lastChangedAt,
    };
  }

  if (bindings.length === 0) {
    return {
      tone: "blocked",
      headline: "No payment rails configured yet",
      detail:
        "This organization is approved but was never provisioned. Run provisioning to set up its wallets.",
      ownership: "admin",
      canRetry: true,
      retryPrimary: true,
      lastChangedAt,
    };
  }

  if (bindings.every(isHealthy)) {
    return {
      tone: "healthy",
      headline: "Payments are fully set up",
      ownership: "none",
      canRetry: true,
      retryPrimary: false,
      lastChangedAt,
    };
  }

  const buckets = new Set(bindings.map((b) => b.blockedBy).filter(Boolean));

  // Most actionable bucket wins the headline.
  if (buckets.has("data_actionable")) {
    return {
      tone: "blocked",
      headline: "Blocked on information from the applicant",
      detail:
        "The provider needs corrected or additional data. Request the changes through the compliance case; retrying without new data will fail the same way.",
      ownership: "applicant",
      canRetry: true,
      retryPrimary: false,
      lastChangedAt,
    };
  }

  if (buckets.has("transient")) {
    return {
      tone: "blocked",
      headline: "Provisioning hit an error",
      detail:
        "The last attempt failed. A retry may resolve it; the reconciler also retries automatically every 30 minutes.",
      ownership: "admin",
      canRetry: true,
      retryPrimary: true,
      lastChangedAt,
    };
  }

  if (buckets.has("provider_blocked")) {
    return {
      tone: "blocked",
      headline: "Waiting on the provider",
      detail:
        "Verification is stalled on the provider's side. There is no action available here; retrying will not speed it up.",
      ownership: "provider",
      canRetry: false,
      retryPrimary: false,
      lastChangedAt,
    };
  }

  return {
    tone: "progress",
    headline: "Setting up",
    detail: "The provider is verifying this organization.",
    ownership: "none",
    canRetry: true,
    retryPrimary: false,
    lastChangedAt,
  };
}
