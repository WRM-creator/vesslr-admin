import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { TransactionAuditLogs } from "./transaction-audit-logs";
import { TransactionCompliance } from "./transaction-compliance";
import { TransactionDisputes } from "./transaction-disputes";
import { TransactionFinancials } from "./transaction-financials";
import { TransactionLogistics } from "./transaction-logistics";
import { TransactionQQ } from "./transaction-qq";

export function TransactionTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "financials";

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("tab", value);
      return prev;
    });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-2 h-auto flex-wrap justify-start">
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="quality">Q & Q</TabsTrigger>
        <TabsTrigger value="logistics">Logistics</TabsTrigger>
        <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        <TabsTrigger value="disputes">Disputes</TabsTrigger>
      </TabsList>

      <TabsContent value="financials">
        <TransactionFinancials />
      </TabsContent>
      <TabsContent value="disputes">
        <TransactionDisputes />
      </TabsContent>
      <TabsContent value="quality">
        <TransactionQQ />
      </TabsContent>
      <TabsContent value="logistics">
        <TransactionLogistics />
      </TabsContent>
      <TabsContent value="compliance">
        <TransactionCompliance />
      </TabsContent>
      <TabsContent value="audit">
        <TransactionAuditLogs />
      </TabsContent>
    </Tabs>
  );
}
