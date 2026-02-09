"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

export default function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Determine active tab from URL, default to "overview"
  const getActiveTab = () => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    const validTabs = [
      "overview",
      "team",
      "products",
      "compliance",
      "financials",
      "transactions",
      "disputes",
    ];

    return validTabs.includes(lastSegment) ? lastSegment : "overview";
  };

  const { data: organizationData, isLoading } =
    api.organizations.detail.useQuery(
      {
        path: { id: id! },
      },
      {
        enabled: !!id,
      },
    );

  const organization = (organizationData as any)?.data;
  useAppBreadcrumbLabel(id!, organization?.name);

  if (isLoading) {
    return (
      <Page>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </Page>
    );
  }

  if (!organization) {
    return (
      <Page>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold">Organization Not Found</h2>
          <p className="text-muted-foreground">
            The organization details could not be loaded.
          </p>
        </div>
      </Page>
    );
  }

  const getVerificationBadgeVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "default";
      case "pending":
        return "secondary";
      case "unverified":
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Page>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            {organization.name}
            {organization.verificationStatus && (
              <Badge
                variant={getVerificationBadgeVariant(
                  organization.verificationStatus,
                )}
              >
                {organization.verificationStatus}
              </Badge>
            )}
          </div>
        }
        description={
          <div className="flex items-center gap-2 text-sm">
            <span>ID: {organization._id}</span>
            <CopyButton
              variant="ghost"
              value={organization._id}
              label="Organization ID"
              className="size-3"
            />
          </div>
        }
      />

      <Tabs value={getActiveTab()} className="mt-6 space-y-6">
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link to="overview">Overview</Link>
          </TabsTrigger>
          <TabsTrigger value="team" asChild>
            <Link to="team">Team</Link>
          </TabsTrigger>
          <TabsTrigger value="products" asChild>
            <Link to="products">Products</Link>
          </TabsTrigger>
          <TabsTrigger value="compliance" asChild>
            <Link to="compliance">Compliance</Link>
          </TabsTrigger>
          <TabsTrigger value="financials" asChild>
            <Link to="financials">Financials</Link>
          </TabsTrigger>
          <TabsTrigger value="transactions" asChild>
            <Link to="transactions">Transactions</Link>
          </TabsTrigger>
          <TabsTrigger value="disputes" asChild>
            <Link to="disputes">Disputes</Link>
          </TabsTrigger>
        </TabsList>

        <Outlet context={{ organization }} />
      </Tabs>
    </Page>
  );
}
