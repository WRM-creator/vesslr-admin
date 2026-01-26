import { useOutletContext } from "react-router-dom";
import { MerchantComplianceTab } from "../components/merchant-details/merchant-compliance-tab";
import { MerchantDisputesTab } from "../components/merchant-details/merchant-disputes-tab";
import { MerchantFinancialsTab } from "../components/merchant-details/merchant-financials-tab";
import { MerchantOverviewTab } from "../components/merchant-details/merchant-overview-tab";
import { MerchantProductsTab } from "../components/merchant-details/merchant-products-tab";
import { MerchantTeamTab } from "../components/merchant-details/merchant-team-tab";
import { MerchantTransactionsTab } from "../components/merchant-details/merchant-transactions-tab";

interface MerchantContext {
  organization: any; // Type should ideally be shared/imported
}

export function MerchantOverviewRoute() {
  const { organization } = useOutletContext<MerchantContext>();
  return <MerchantOverviewTab organization={organization} />;
}

export function MerchantTeamRoute() {
  const { organization } = useOutletContext<MerchantContext>();
  return <MerchantTeamTab merchantId={organization._id} />;
}

export function MerchantProductsRoute() {
  const { organization } = useOutletContext<MerchantContext>();
  return <MerchantProductsTab merchantId={organization._id} />;
}

export function MerchantComplianceRoute() {
  const { organization } = useOutletContext<MerchantContext>();
  return <MerchantComplianceTab organization={organization} />;
}

export function MerchantFinancialsRoute() {
  const { organization } = useOutletContext<MerchantContext>();
  return <MerchantFinancialsTab organization={organization} />;
}

export function MerchantTransactionsRoute() {
  const { organization } = useOutletContext<MerchantContext>();
  return <MerchantTransactionsTab merchantId={organization._id} />;
}

export function MerchantDisputesRoute() {
  // Disputes tab doesn't seem to need organization data based on previous file content
  return <MerchantDisputesTab />;
}
