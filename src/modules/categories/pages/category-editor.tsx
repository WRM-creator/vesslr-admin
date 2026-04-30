import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type {
  CategoryDto,
  CategoryGroupDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/lib/api/generated/types.gen";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CategoryForm } from "../components/category-form";
import type { CategoryFormSchema } from "../components/category-form/schema";

export default function CategoryEditorPage() {
  const { id, groupId } = useParams<{ id: string; groupId: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    data: rawCategory,
    isLoading: isLoadingCategory,
    error,
  } = api.categories.detail.useQuery(
    { path: { id: id! } },
    { enabled: isEditing },
  );

  const category = rawCategory as unknown as CategoryDto | undefined;

  const resolvedGroupId = isEditing
    ? (category?.groupId as unknown as CategoryGroupDto)?._id
    : groupId;

  // Fetch the parent group to display inherited defaults in the form
  const { data: rawGroup } = api.categoryGroups.detail.useQuery(
    { path: { id: resolvedGroupId! } },
    { enabled: !!resolvedGroupId },
  );
  const parentGroup = rawGroup as unknown as CategoryGroupDto | undefined;

  const initialValues: Partial<CategoryFormSchema> | undefined = useMemo(() => {
    if (!category) return undefined;
    const catAny = category as Record<string, unknown>;
    return {
      name: category.name,
      description: category.description,
      image: category.image,
      allowedUnits: category.allowedUnits ?? [],
      requiredDocuments: (category.requiredDocuments ?? []).map((doc) => ({
        type: doc.type as CategoryFormSchema["requiredDocuments"][number]["type"],
        name: doc.name,
        requiredFrom:
          doc.requiredFrom as CategoryFormSchema["requiredDocuments"][number]["requiredFrom"],
        isMandatory: doc.isMandatory ?? true,
        requiredAtStatus: doc.requiredAtStatus,
      })),
      compliance: category.compliance
        ? {
            isHazardous: category.compliance.isHazardous ?? false,
            isRegulated: category.compliance.isRegulated ?? false,
            riskLevel: (category.compliance.riskLevel ?? "LOW") as "LOW" | "MEDIUM" | "HIGH",
          }
        : undefined,
      policyOverrides: catAny.policyOverrides
        ? (catAny.policyOverrides as CategoryFormSchema["policyOverrides"])
        : null,
    };
  }, [category]);

  const { mutate: createCategory, isPending: isCreating } =
    api.categories.create.useMutation({
      onSuccess: () => {
        toast.success("Category created");
        navigate(`/categories/${resolvedGroupId}`);
      },
      onError: (error: any) =>
        toast.error(error.message || "Failed to create category"),
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    api.categories.update.useMutation({
      onSuccess: () => {
        toast.success("Category updated");
        navigate(`/categories/${resolvedGroupId}`);
      },
      onError: (error: any) =>
        toast.error(error.message || "Failed to update category"),
    });

  const handleSubmit = (data: CategoryFormSchema) => {
    // Clean up policyOverrides: strip null values to avoid sending empty overrides
    const policyOverrides = data.policyOverrides
      ? Object.fromEntries(
          Object.entries(data.policyOverrides).filter(
            ([, v]) => v !== null && v !== undefined,
          ),
        )
      : undefined;

    const hasOverrides =
      policyOverrides && Object.keys(policyOverrides).length > 0;

    // Generated DTO types `allowedUnits` as a single union value instead of
    // Array — backend @ApiProperty issue. Cast via unknown per project convention.
    if (isEditing) {
      updateCategory({
        path: { id: id! },
        body: {
          name: data.name,
          description: data.description || undefined,
          image: data.image || undefined,
          allowedUnits:
            data.allowedUnits as unknown as UpdateCategoryDto["allowedUnits"],
          requiredDocuments: data.requiredDocuments,
          compliance: data.compliance,
          policyOverrides: hasOverrides ? policyOverrides : undefined,
        } as unknown as UpdateCategoryDto,
      });
    } else {
      createCategory({
        body: {
          name: data.name,
          description: data.description || undefined,
          image: data.image || undefined,
          groupId: groupId!,
          allowedUnits:
            data.allowedUnits as unknown as CreateCategoryDto["allowedUnits"],
          requiredDocuments: data.requiredDocuments,
          compliance: data.compliance,
          policyOverrides: hasOverrides ? policyOverrides : undefined,
        } as unknown as CreateCategoryDto,
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  if (isEditing && isLoadingCategory) return <PageLoader />;

  if (isEditing && (error || !category)) {
    return (
      <Page>
        <PageHeader title="Category Not Found" />
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/categories/${resolvedGroupId}`}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <span>{isEditing ? "Edit Category" : "Add Category"}</span>
          </div>
        }
      />
      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/categories/${resolvedGroupId}`)}
        isLoading={isLoading}
        submitLabel={isEditing ? "Save changes" : "Create Category"}
        loadingLabel={isEditing ? "Saving..." : "Creating..."}
        parentGroup={parentGroup}
      />
    </Page>
  );
}
