import { useOutletContext } from "react-router-dom";
import { MerchantComplianceTab } from "../components/merchant-details/merchant-compliance-tab";
import { MerchantDisputesTab } from "../components/merchant-details/merchant-disputes-tab";
import { MerchantFinancialsTab } from "../components/merchant-details/merchant-financials-tab";
import { MerchantOverviewTab } from "../components/merchant-details/merchant-overview-tab";
import { MerchantProductsTab } from "../components/merchant-details/merchant-products-tab";
import { MerchantTeamTab } from "../components/merchant-details/merchant-team-tab";
import { MerchantTransactionsTab } from "../components/merchant-details/merchant-transactions-tab";

interface OrganizationContext {
  organization: any;
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
  // Note: Assuming 'merchantId' prop is okay for generic organization for now.
  // If the component handles only merchants strictly, we might need to update it later.
  return <MerchantProductsTab merchantId={organization._id} />;
}

export function OrganizationComplianceRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  return <MerchantComplianceTab organization={organization} />;
}

export function OrganizationFinancialsRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  return <MerchantFinancialsTab organization={organization} />;
}

export function OrganizationTransactionsRoute() {
  const { organization } = useOutletContext<OrganizationContext>();
  return <MerchantTransactionsTab merchantId={organization._id} />;
}

export function OrganizationDisputesRoute() {
  // Disputes tab doesn't need organization data passed directly in the original code
  return <MerchantDisputesTab />;
}
