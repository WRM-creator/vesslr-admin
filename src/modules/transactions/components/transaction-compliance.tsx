import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { type ComplianceDocumentStatus } from "./transaction-compliance-badge";
import {
  type ComplianceDocument,
  TransactionComplianceTable,
} from "./transaction-compliance-table";

export function TransactionCompliance() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([
    {
      id: "doc_1",
      name: "Bill of Lading",
      type: "Logistics",
      requiredFor: "Shipping Verification",
      party: "seller",
      status: "verified",
      uploadedDate: new Date("2023-10-24T10:00:00"),
      uploadedBy: "Maersk Line",
      fileUrl: "#",
    },
    {
      id: "doc_2",
      name: "Certificate of Origin",
      type: "Compliance",
      requiredFor: "Import Clearance",
      party: "seller",
      status: "uploaded",
      uploadedDate: new Date("2023-10-25T09:30:00"),
      uploadedBy: "Dangote Refinery",
      fileUrl: "#",
    },
    {
      id: "doc_3",
      name: "Quality Analysis Report (Q&Q)",
      type: "Quality",
      requiredFor: "Payment Release",
      party: "seller",
      status: "pending",
    },
    {
      id: "doc_4",
      name: "Commercial Invoice",
      type: "Financial",
      requiredFor: "Payment Processing",
      party: "seller",
      status: "rejected",
      uploadedDate: new Date("2023-10-23T14:45:00"),
      uploadedBy: "Dangote Refinery",
      fileUrl: "#",
    },
    {
      id: "doc_5",
      name: "Proof of Funds",
      type: "Financial",
      requiredFor: "Trade Initiation",
      party: "buyer",
      status: "verified",
      uploadedDate: new Date("2023-10-22T09:00:00"),
      uploadedBy: "Total Energies",
      fileUrl: "#",
    },
    {
      id: "doc_6",
      name: "Import License",
      type: "Compliance",
      requiredFor: "Customs Clearance",
      party: "buyer",
      status: "pending",
    },
  ]);

  const handleStatusChange = (
    id: string,
    newStatus: ComplianceDocumentStatus,
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: newStatus } : doc)),
    );
    // In a real app, this would make an API call
  };

  const tabTriggerClassName =
    "data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-none";

  return (
    <div className="space-y-6">
      <Tabs defaultValue="seller" className="w-full">
        <TabsList className="h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="seller" className={tabTriggerClassName}>
            Seller
          </TabsTrigger>
          <TabsTrigger value="buyer" className={tabTriggerClassName}>
            Buyer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seller">
          <TransactionComplianceTable
            documents={documents}
            party="seller"
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="buyer">
          <TransactionComplianceTable
            documents={documents}
            party="buyer"
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>

      {/* Missing Docs Alert */}
      {documents.some(
        (d) => d.status === "pending" || d.status === "rejected",
      ) && (
        <div className="flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
          <div className="text-sm">
            <span className="font-semibold">Action Required:</span> There are
            pending or rejected documents that require attention before the
            transaction can proceed to the next stage.
          </div>
        </div>
      )}
    </div>
  );
}
