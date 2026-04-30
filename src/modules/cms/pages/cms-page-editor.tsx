import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { api } from "@/lib/api";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageForm } from "../components/page-form";
import type { CmsPageFormValues } from "../lib/schemas";

export default function CmsPageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    data: pageData,
    isLoading: isLoadingPage,
    error,
  } = api.admin.cms.pages.detail.useQuery(
    { path: { id: id! } },
    { enabled: isEditing },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPage = pageData as any;

  useAppBreadcrumbLabel(id ?? "", rawPage?.title || "");

  const initialValues: CmsPageFormValues | undefined = useMemo(() => {
    if (!rawPage) return undefined;
    return {
      title: rawPage.title || "",
      slug: rawPage.slug || "",
      status: rawPage.status || "draft",
      meta: {
        title: rawPage.meta?.title || "",
        description: rawPage.meta?.description || "",
        keywords: rawPage.meta?.keywords || [],
      },
      blocks: (rawPage.blocks || []).map((b: any, i: number) => ({
        type: b.type,
        order: b.order ?? i,
        data: b.data || {},
      })),
    };
  }, [rawPage]);

  const { mutate: createPage, isPending: isCreating } =
    api.admin.cms.pages.create.useMutation({
      onSuccess: () => {
        toast.success("Page created");
        navigate("/cms/pages");
      },
      onError: () => toast.error("Failed to create page"),
    });

  const { mutate: updatePage, isPending: isUpdating } =
    api.admin.cms.pages.update.useMutation({
      onSuccess: () => {
        toast.success("Page updated");
      },
      onError: () => toast.error("Failed to update page"),
    });

  const handleSubmit = (values: CmsPageFormValues) => {
    // Ensure block order values match their array positions
    const blocks = values.blocks.map((b, i) => ({ ...b, order: i }));
    const payload = { ...values, blocks };

    if (isEditing) {
      updatePage({ path: { id: id! }, body: payload });
    } else {
      createPage({ body: payload });
    }
  };

  if (isEditing && isLoadingPage) return <PageLoader />;

  if (isEditing && (error || !rawPage)) {
    return (
      <Page>
        <PageHeader title="Page Not Found" />
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title={isEditing ? "Edit Page" : "Create Page"}
      />
      <PageForm
        initialValues={initialValues}
        isEditing={isEditing}
        isLoading={isCreating || isUpdating}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cms/pages")}
      />
    </Page>
  );
}
