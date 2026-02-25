import { Page } from "@/components/shared/page";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { useParams } from "react-router-dom";
import { CategoryGroupAllowedOptionsCard } from "../components/category-group-allowed-options-card";
import { CategoryGroupOverviewCard } from "../components/category-group-overview-card";
import { CategoryGroupPoliciesCard } from "../components/category-group-policies-card";

export default function CategoryGroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: categoryGroup,
    isLoading,
    error,
  } = api.categoryGroups.detail.useQuery({
    path: { id: id! },
  });

  useAppBreadcrumbLabel(id!, categoryGroup?.name || "Category Details");

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !categoryGroup) {
    return (
      <Page>
        <PageHeader title="Category Details" />
        <div className="text-muted-foreground flex h-48 items-center justify-center rounded-lg border border-dashed">
          Category not found or failed to load.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageBreadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: categoryGroup.name },
        ]}
      />
      <PageHeader title={categoryGroup.name} />
      <div className="max-w-3xl space-y-6">
        <CategoryGroupOverviewCard categoryGroup={categoryGroup} />
        <CategoryGroupAllowedOptionsCard categoryGroup={categoryGroup} />
        <CategoryGroupPoliciesCard categoryGroup={categoryGroup} />
      </div>
    </Page>
  );
}
