import { useOutletContext } from "react-router-dom";
import { ComplianceCaseReview } from "../components/compliance-case-review";
import { MerchantDisputesTab } from "../components/merchant-details/merchant-disputes-tab";
import { MerchantFinancialsTab } from "../components/merchant-details/merchant-financials-tab";
import { MerchantOverviewTab } from "../components/merchant-details/merchant-overview-tab";
import { MerchantPaymentsTab } from "../components/merchant-details/payments/merchant-payments-tab";
import { MerchantProductsTab } from "../components/merchant-details/merchant-products-tab";
import { MerchantTeamTab } from "../components/merchant-details/merchant-team-tab";
import { MerchantTransactionsTab } from "../components/merchant-details/merchant-transactions-tab";
import { PreOnboardingGate } from "../components/pre-onboarding-gate";

interface OrganizationContext {
  organization: any;
}

/**
 * Post-approval sections ghost out while the owner has never submitted for
 * review (draft case state). Orgs in or past review keep the real tabs: a
 * post-approval case that cycles back to action_required must never hide
 * live data.
 */
function usePreOnboarding(): { gated: boolean; onboardingStep?: string } {
  const { organization } = useOutletContext<OrganizationContext>();
  const owner = organization?.owner as
    | { complianceStatus?: string; onboardingStep?: string }
    | undefined;
  return {
    gated: owner?.complianceStatus === "draft",
    onboardingStep: owner?.onboardingStep,
  };
}

export function OrganizationOverviewRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  return <MerchantOverviewTab organization={organization} />;
}

export function OrganizationTeamRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  return <MerchantTeamTab merchantId={organization._id} />;
}

export function OrganizationProductsRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  const { gated, onboardingStep } = usePreOnboarding();
  if (gated) {
    return <PreOnboardingGate section="Products" onboardingStep={onboardingStep} />;
  }
  // Note: Assuming 'merchantId' prop is okay for generic organization for now.
  // If the component handles only merchants strictly, we might need to update it later.
  return <MerchantProductsTab merchantId={organization._id} />;
}

export function OrganizationComplianceRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  return <ComplianceCaseReview organizationId={organization._id} />;
}

export function OrganizationPaymentsRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  const { gated, onboardingStep } = usePreOnboarding();
  if (gated) {
    return <PreOnboardingGate section="Payments" onboardingStep={onboardingStep} />;
  }
  return <MerchantPaymentsTab organizationId={organization._id} />;
}

export function OrganizationFinancialsRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  const { gated, onboardingStep } = usePreOnboarding();
  if (gated) {
    return (
      <PreOnboardingGate section="Financials" onboardingStep={onboardingStep} />
    );
  }
  return <MerchantFinancialsTab organization={organization} />;
}

export function OrganizationTransactionsRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  const { gated, onboardingStep } = usePreOnboarding();
  if (gated) {
    return (
      <PreOnboardingGate section="Transactions" onboardingStep={onboardingStep} />
    );
  }
  return <MerchantTransactionsTab merchantId={organization._id} />;
}

export function OrganizationDisputesRoute() {
  // Disputes tab doesn't need organization data passed directly in the original code
  return <MerchantDisputesTab />;
}
