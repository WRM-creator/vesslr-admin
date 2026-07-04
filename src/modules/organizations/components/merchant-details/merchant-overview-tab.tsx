import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAccountType } from "../compliance-case-review/compliance-utils";

interface MerchantOverviewTabProps {
  // The admin org detail endpoint has no response DTO in swagger yet, so there
  // is no generated type to use; typed once the org record surface gets one.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
}

export function MerchantOverviewTab({
  organization,
}: MerchantOverviewTabProps) {
  const orgId = organization._id as string;

  const { data: productsData, isLoading: productsLoading } =
    api.admin.products.list.useQuery(
      { query: { merchant: orgId, limit: "1" } },
      { enabled: !!orgId },
    );

  const { data: transactionsData, isLoading: transactionsLoading } =
    api.admin.transactions.list.useQuery(
      { query: { organization: orgId, limit: "1" } },
      { enabled: !!orgId },
    );

  const { data: disputesData, isLoading: disputesLoading } =
    api.admin.disputes.list.useQuery(
      { query: { respondent: orgId, limit: "1" } },
      { enabled: !!orgId },
    );

  const totalProducts = productsData?.data?.totalDocs ?? 0;
  const totalOrders = transactionsData?.data?.totalDocs ?? 0;
  const totalDisputes = disputesData?.data?.totalDocs ?? 0;
  const statsLoading = productsLoading || transactionsLoading || disputesLoading;

  const analytics = [
    { label: "Total Products", value: totalProducts },
    { label: "Total Orders", value: totalOrders },
    { label: "Total Disputes", value: totalDisputes },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Snapshot */}
      <div className="grid gap-4 md:grid-cols-3">
        {analytics.map((item) => (
          <Card key={item.label}>
            <CardHeader className="max-h-5 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{item.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="max-h-5">
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Trading Name
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.tradingName || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Account Type
                </span>
                <p className="mt-1 text-sm">
                  {formatAccountType(organization.accountType) || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Industry Sectors
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {organization.industrySectors?.map((sector: string) => (
                    <Badge key={sector} variant="secondary">
                      {sector}
                    </Badge>
                  )) || <span className="text-sm">-</span>}
                </div>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Description
              </span>
              <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                {organization.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Joined Date
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.createdAt
                    ? new Date(organization.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Business Structure
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.businessStructure || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Tax ID
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.taxId || "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  RC Number
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.rcNumber || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="max-h-5">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Email
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.email}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Phone
                </span>
                <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                  {organization.phoneNumber || "-"}
                </p>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Address
              </span>
              <p className="mt-1 text-sm [overflow-wrap:anywhere] whitespace-pre-wrap">
                {organization.address
                  ? [
                      organization.address.streetAddress,
                      organization.address.city?.name,
                      organization.address.state?.name,
                      organization.address.country?.name,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
