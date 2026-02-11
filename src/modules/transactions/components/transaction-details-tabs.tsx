import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { TransactionDocumentsTab } from "./transaction-documents-tab";
import { TransactionFinancialsTab } from "./transaction-financials-tab";
import { TransactionLogisticsTab } from "./transaction-logistics-tab";
import { TransactionOverviewTab } from "./transaction-overview-tab";

interface TransactionDetailsTabsProps {
  transaction: TransactionResponseDto;
  value?: string;
  onValueChange?: (value: string) => void;
  onAction?: (action: any) => void;
}

export function TransactionDetailsTabs({
  transaction,
  value,
  onValueChange,
  onAction,
}: TransactionDetailsTabsProps) {
  return (
    <Tabs
      defaultValue="overview"
      value={value}
      onValueChange={onValueChange}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="documents">Documents & Compliance</TabsTrigger>
        <TabsTrigger value="financials">Financials & Escrow</TabsTrigger>
        <TabsTrigger value="logistics">Logistics</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>

      <div className="mt-2">
        <TabsContent value="overview">
          <TransactionOverviewTab
            transaction={transaction}
            onAction={onAction}
          />
        </TabsContent>
        <TabsContent value="documents">
          <TransactionDocumentsTab transaction={transaction} />
        </TabsContent>
        <TabsContent value="financials">
          <TransactionFinancialsTab transaction={transaction} />
        </TabsContent>
        <TabsContent value="logistics">
          <TransactionLogisticsTab transaction={transaction} />
        </TabsContent>
        <TabsContent value="audit" />
      </div>
    </Tabs>
  );
}
