import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { TransactionOverviewTab } from "./transaction-overview-tab";

interface TransactionDetailsTabsProps {
  transaction: TransactionResponseDto;
}

export function TransactionDetailsTabs({
  transaction,
}: TransactionDetailsTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="documents">Documents & Compliance</TabsTrigger>
        <TabsTrigger value="financials">Financials & Escrow</TabsTrigger>
        <TabsTrigger value="logistics">Logistics</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>

      <div className="mt-2">
        <TabsContent value="overview">
          <TransactionOverviewTab transaction={transaction} />
        </TabsContent>
        <TabsContent value="documents" />
        <TabsContent value="financials" />
        <TabsContent value="logistics" />
        <TabsContent value="audit" />
      </div>
    </Tabs>
  );
}
