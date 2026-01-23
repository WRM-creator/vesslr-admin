import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, MoreVertical, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_FULFILLMENT_DETAILS } from "../lib/fulfillment-details-model";

// Components
import { FulfillmentContextCard } from "../components/fulfillment-context-card";
import { FulfillmentExceptionsCard } from "../components/fulfillment-exceptions-card";
import { FulfillmentOverviewCard } from "../components/fulfillment-overview-card";
import { FulfillmentTimelineCard } from "../components/fulfillment-timeline-card";
import { FulfillmentTrackingCard } from "../components/fulfillment-tracking-card";

export default function FulfillmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app we'd fetch based on ID
  const data = MOCK_FULFILLMENT_DETAILS;

  return (
    <Page>
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/logistics")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Logistics
        </Button>
      </div>

      {/* Header & Actions */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader
          title={`Shipment #${data.trackingNumber}`}
          description={`Managed by ${data.carrier} • Last updated just now`}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (66%) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <FulfillmentOverviewCard data={data} />

          {/* Tracking */}
          <FulfillmentTrackingCard
            status={data.status}
            currentLocation={data.currentLocation}
          />

          {/* Detailed Timeline */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 font-semibold">
              Processing History
            </h3>
            <FulfillmentTimelineCard checkpoints={data.checkpoints} />
          </div>
        </div>

        {/* Right Column (33%) */}
        <div className="space-y-6">
          {/* Exceptions (High Priority) */}
          <FulfillmentExceptionsCard alerts={data.alerts} />

          {/* Context */}
          <FulfillmentContextCard data={data} />
        </div>
      </div>
    </Page>
  );
}
