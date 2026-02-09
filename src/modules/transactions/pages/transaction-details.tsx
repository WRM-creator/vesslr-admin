import { CopyButton } from "@/components/shared/copy-button";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { TransactionDealTicket } from "../components/transaction-deal-ticket";
import { TransactionLifecycle } from "../components/transaction-lifecycle";
import { TransactionPartyCard } from "../components/transaction-party-card";
import { TransactionTabs } from "../components/transaction-tabs";

export default function TransactionDetailsPage() {
  const { id } = useParams();

  // Mock data for now
  const status = "in_transit";
  const createdDate = new Date("2023-10-23T14:30:00");
  const updatedDate = new Date();

  return (
    <Page>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>Transaction #{id}</span>
            <CopyButton value={id || ""} />
            <Badge variant="outline" className="capitalize">
              {status.replace("_", " ")}
            </Badge>
          </div>
        }
        description={`Created: ${formatDateTime(createdDate)} • Updated: ${formatDateTime(updatedDate)}`}
      />

      <TransactionLifecycle currentStatus={status} />

      <TransactionDealTicket
        type="purchase"
        product={{
          name: "Bonny Light Crude Oil",
          quantity: 50000,
          unit: "MT",
          pricePerUnit: 17000,
          total: 850000000,
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TransactionPartyCard
          role="Seller"
          name="Dangote Refinery"
          company="Dangote Industries Ltd"
          link="/merchants/merc_123"
        />
        <TransactionPartyCard
          role="Buyer"
          name="Total Energies"
          company="Total Energies EP Nigeria"
          link="/customers/cust_456"
        />
      </div>

      {/* Detailed Tabs */}
      <TransactionTabs />
    </Page>
  );
}
