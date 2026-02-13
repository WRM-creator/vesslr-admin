import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { useParams } from "react-router-dom";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: category,
    isLoading,
    error,
  } = api.categories.detail.useQuery({
    path: { id: id! },
  });

  useAppBreadcrumbLabel(id!, category?.name || "Category Details");

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !category) {
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
      <PageHeader title={category.name} />
    </Page>
  );
}
