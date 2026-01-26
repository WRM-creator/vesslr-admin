import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

interface MerchantOverviewTabProps {
  organization: any; // Type will be improved later
}

export function MerchantOverviewTab({
  organization,
}: MerchantOverviewTabProps) {
  const analytics = [
    {
      label: "Total Products",
      value: 0,
      formatter: (v: number) => v.toString(),
    }, // Placeholder
    { label: "Total Orders", value: 0, formatter: (v: number) => v.toString() }, // Placeholder
    {
      label: "Total Disputes",
      value: 0,
      formatter: (v: number) => v.toString(),
    }, // Placeholder
    { label: "Trust Score", value: "-", formatter: (v: string) => v },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Snapshot - 4 Separate Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analytics.map((item) => (
          <Card key={item.label}>
            <CardHeader className="max-h-5 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {item.formatter(item.value as never)}
              </div>
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
                      organization.address.houseNumber,
                      organization.address.street,
                      organization.address.city,
                      organization.address.state,
                      organization.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Socials
              </span>
              <div className="mt-2 flex gap-2">
                <GlobeIcon className="text-muted-foreground h-4 w-4" />
                <LinkedinIcon className="text-muted-foreground h-4 w-4" />
                <TwitterIcon className="text-muted-foreground h-4 w-4" />
                <InstagramIcon className="text-muted-foreground h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
