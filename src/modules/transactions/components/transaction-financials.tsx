import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { TransactionFinancialsEscrow } from "./transaction-financials-escrow";
import { TransactionFinancialsInvoiceCard } from "./transaction-financials-invoice-card";

export function TransactionFinancials() {
  // FINANCIALS DATA MODEL (MOCKED FOR BACK-TO-BACK TRADE)

  // 1. The Sale (What Vesslr charges the Customer)
  const receivableInvoice = {
    id: "INV-2023-001 (Sale)",
    entity: "Customer",
    entityName: "Total Energies EP Nigeria",
    status: "paid",
    issuedDate: new Date("2023-10-23T14:30:00"),
    items: [
      {
        description: "Bonny Light Crude Oil (50,000 MT)",
        quantity: 50000,
        unitPrice: 17500, // Includes Vesslr's margin
        amount: 875000000,
      },
      {
        description: "Logistics & Handling Fee",
        quantity: 1,
        unitPrice: 5000000,
        amount: 5000000,
      },
    ],
    subtotal: 880000000,
    total: 880000000,
    currency: "USD",
  };

  // 2. The Cost (What Vesslr pays the Vendor)
  const payableBill = {
    id: "BILL-2023-992 (Cost)",
    entity: "Vendor",
    entityName: "Dangote Refinery",
    status: "pending_release",
    issuedDate: new Date("2023-10-23T15:00:00"),
    items: [
      {
        description: "Bonny Light Crude Oil (50,000 MT)",
        quantity: 50000,
        unitPrice: 17000, // Base Price
        amount: 850000000,
      },
      {
        description: "Platform Commission (Deducted)",
        quantity: 1,
        unitPrice: -4250000, // Vesslr taking a cut from seller too? or just net cost. Let's assume net cost for simplicity or flat fee.
        amount: -4250000,
      },
    ],
    subtotal: 845750000,
    total: 845750000,
    currency: "USD",
  };

  // 3. Escrow Status
  const escrowStatus = {
    status: "funds_locked", // funds_locked, released, refunded
    lockedAmount: 880000000,
    releaseReady: true, // e.g. based on Q&Q
    lastActivity: new Date("2023-10-24T10:15:00"),
  };

  // Profit Calculation
  const grossMargin = receivableInvoice.total - payableBill.total;
  const marginPercent = (grossMargin / receivableInvoice.total) * 100;

  const tabTriggerClassName =
    "data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-none";

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("financialsTab") || "receivable";

  const handleTabChange = (value: string) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("financialsTab", value);
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      {/* SUMMARY STATS */}
      {/* <TransactionFinancialsStats
        receivableTotal={receivableInvoice.total}
        payableTotal={payableBill.total}
        grossMargin={grossMargin}
        marginPercent={marginPercent}
      /> */}

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="gap-2">
          <TabsTrigger value="receivable" className={tabTriggerClassName}>
            Inbound
          </TabsTrigger>
          <TabsTrigger value="escrow" className={tabTriggerClassName}>
            Escrow
          </TabsTrigger>
          <TabsTrigger value="payable" className={tabTriggerClassName}>
            Outbound
          </TabsTrigger>
        </TabsList>

        {/* INBOUND TAB (RECEIVABLE) */}
        <TabsContent value="receivable" className="space-y-6">
          <TransactionFinancialsInvoiceCard
            data={receivableInvoice}
            type="receivable"
          />
        </TabsContent>

        {/* ESCROW TAB (HOLDING) */}
        <TabsContent value="escrow" className="space-y-6">
          <TransactionFinancialsEscrow escrowStatus={escrowStatus} />
        </TabsContent>

        {/* OUTBOUND TAB (PAYABLE) */}
        <TabsContent value="payable" className="space-y-6">
          <TransactionFinancialsInvoiceCard data={payableBill} type="payable" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
