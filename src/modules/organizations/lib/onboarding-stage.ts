// Human labels for the backend's User.onboardingStep enum. The wizard's two
// interest steps collapse into one label; post-submission steps read as
// "Submitted" because the compliance queue owns them from there.
export const ONBOARDING_STEP_LABELS: Record<string, string> = {
  intent: "Getting started",
  identity_kyc: "Identity verification",
  residential: "Residential address",
  company_info: "Company details",
  business_address: "Business address",
  selling_interests: "Trading interests",
  buying_interests: "Trading interests",
  directors: "Directors",
  beneficial_owners: "Beneficial owners",
  company_documents: "Documents",
  financial_setup: "Financial setup",
  business_representative: "Representative",
  review: "Final review",
  status: "Submitted",
  complete: "Complete",
};

export function onboardingStageLabel(step?: string | null): string {
  return (step && ONBOARDING_STEP_LABELS[step]) || "Getting started";
}
