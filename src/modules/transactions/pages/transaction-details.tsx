import { Page } from "@/components/shared/page";
import { useParams } from "react-router-dom";

export default function TransactionDetailsPage() {
  const { id } = useParams();

  // Mock data for now
  const status = "in_transit";
  const createdDate = new Date("2023-10-23T14:30:00");
  const updatedDate = new Date();

  return (
    <Page>
      <div className="flex flex-col gap-6 p-6">
        {/* Header Region */}
        <div className="flex h-16 w-full items-center justify-center border-2 border-dashed border-gray-400 bg-gray-50 font-mono text-gray-500">
          HEADER (Breadcrumbs, Title, Status, Override Actions)
        </div>

        {/* Timeline / Progress Stepper */}
        <div className="flex h-24 w-full items-center justify-center border-2 border-dashed border-gray-400 bg-gray-50 font-mono text-gray-500">
          TRANSACTION PROGRESS TIMELINE (9 Steps)
        </div>

        {/* Main Orchestration Area - 3 Columns */}
        <div className="grid min-h-[600px] grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Column: Buyer Context */}
          <div className="flex flex-col gap-4 border-2 border-dashed border-blue-300 bg-blue-50/30 p-4">
            <div className="mb-4 text-center font-bold text-blue-800">
              BUYER CONTEXT
            </div>

            <div className="flex h-32 items-center justify-center border border-blue-200 bg-white text-sm text-blue-600">
              Identity Card & Trust Score
            </div>

            <div className="flex h-24 items-center justify-center border border-blue-200 bg-white text-sm text-blue-600">
              Buyer Needed Actions
            </div>

            <div className="flex flex-1 items-center justify-center border border-blue-200 bg-white text-sm text-blue-600">
              Buyer Document Vault
            </div>
          </div>

          {/* Middle Column: Orchestration / Admin Control */}
          <div className="flex flex-col gap-4 border-2 border-dashed border-purple-300 bg-purple-50/30 p-4">
            <div className="mb-4 text-center font-bold text-purple-800">
              ORCHESTRATION / ADMIN
            </div>

            <div className="flex h-40 items-center justify-center border-2 border-purple-400 bg-white text-sm font-bold text-purple-700 shadow-sm">
              ACTIVE BLOCKER / CALL TO ACTION
            </div>

            <div className="flex flex-1 items-center justify-center border border-purple-200 bg-white text-sm text-purple-600">
              Activity Feed & Audit Log
            </div>
          </div>

          {/* Right Column: Seller Context */}
          <div className="flex flex-col gap-4 border-2 border-dashed border-green-300 bg-green-50/30 p-4">
            <div className="mb-4 text-center font-bold text-green-800">
              SELLER CONTEXT
            </div>

            <div className="flex h-32 items-center justify-center border border-green-200 bg-white text-sm text-green-600">
              Identity Card & Trust Score
            </div>

            <div className="flex h-24 items-center justify-center border border-green-200 bg-white text-sm text-green-600">
              Seller Needed Actions
            </div>

            <div className="flex flex-1 items-center justify-center border border-green-200 bg-white text-sm text-green-600">
              Seller Document Vault
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
