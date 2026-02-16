import { Page } from "@/components/shared/page";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useParams } from "react-router-dom";
import { RequestCounterOffersTab } from "../components/request-details/request-counter-offers-tab";
import { RequestOffersTab } from "../components/request-details/request-offers-tab";

export default function RequestsDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Use the generic 'detail' or 'findOne' if generated, or the one we just ensured exists.
  // The generated SDK might typically have 'adminRequestsControllerFindOne'.
  // In 'lib/api/index.ts', we likely mapped it.
  // We'll check 'lib/api/index.ts' again to be sure of the naming 'api.admin.requests.detail' vs 'findOne'.
  // For now, assuming 'detail' or 'findOne'.
  // Actually, in previous steps, we saw 'api.admin.requests.list'.
  // I need to verify if 'detail' exists in 'api.admin.requests'.

  const { data: request, isLoading } = api.admin.requests.detail.useQuery(
    { path: { id: id! } },
    { enabled: !!id },
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <Page>
      <PageBreadcrumb
        items={[
          { label: "Requests", href: "/requests" },
          { label: `Request ${request.displayId}` },
        ]}
      />
      <PageHeader
        title={`Request ${request.displayId}`}
        description={request.name}
        // endContent={<Button variant="destructive-outline">Cancel Request</Button>}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - 2 spans */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Category
                </span>
                <p>{request.category.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Quantity
                </span>
                <p>
                  {request.quantity} {request.unitOfMeasurement}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Target Price
                </span>
                <p>
                  {request.targetPricePerUnit} {request.currency}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Condition
                </span>
                <p>{request.condition?.join(", ") || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground text-sm font-medium">
                  Description
                </span>
                <p className="whitespace-pre-wrap">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logistics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Region
                </span>
                <p>{request.region[0]?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Country
                </span>
                <p>{request.country[0]?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  State
                </span>
                <p>{request.state[0]?.name || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1 span */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Requester
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    {request.requester.firstName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {request.requester.firstName} {request.requester.lastName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {request.requester.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Organization
                </span>
                <p className="mt-1">{request.organization.name || "N/A"}</p>
              </div>

              {request.matchedSeller && (
                <div>
                  <span className="text-muted-foreground text-sm font-medium">
                    Matched Seller
                  </span>
                  <p className="mt-1">{request.matchedSeller?.name || "N/A"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Created
                </span>
                <p>{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Updated
                </span>
                <p>{new Date(request.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="offers">
          <TabsList>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="counter-offers">Counter Offers</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          <TabsContent value="offers" className="mt-2">
            <RequestOffersTab
              requestId={id!}
              isAccepted={
                request.status === "matched" || request.status === "fulfilled"
              }
            />
          </TabsContent>
          <TabsContent value="counter-offers" className="mt-2">
            <RequestCounterOffersTab
              requestId={id!}
              isAccepted={
                request.status === "matched" || request.status === "fulfilled"
              }
            />
          </TabsContent>
          <TabsContent
            value="activity"
            className="mt-2 min-h-[200px] rounded-md border p-4"
          >
            {/* Blank for now */}
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
