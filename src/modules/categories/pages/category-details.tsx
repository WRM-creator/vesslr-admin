import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useParams } from "react-router-dom";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = api.categories.detail.useQuery({
    path: { id: id! },
  });

  const identity = data?.data;

  if (isLoading) {
    return (
      <Page>
        <PageHeader title="Category Details" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardContent>
        </Card>
      </Page>
    );
  }

  if (error || !identity) {
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
      <PageHeader title="Category Details" />
      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <span className="text-muted-foreground text-sm font-medium">
              Name
            </span>
            <span>{identity.name}</span>
          </div>
          {identity.description && (
            <div className="grid gap-1">
              <span className="text-muted-foreground text-sm font-medium">
                Description
              </span>
              <span>{identity.description}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
