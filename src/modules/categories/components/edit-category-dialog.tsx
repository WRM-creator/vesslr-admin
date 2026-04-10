import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CategoryForm } from "./category-form";
import type { CategoryFormSchema } from "./category-form/schema";
import type { CategoryTableItem } from "./categories-table/columns";

interface EditCategoryDialogProps {
  category: CategoryTableItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const { mutate: updateCategory, isPending } =
    api.categories.update.useMutation({
      onSuccess: () => {
        toast.success("Category updated successfully");
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update category");
      },
    });

  const handleSubmit = (data: CategoryFormSchema) => {
    updateCategory({
      path: { id: category._id },
      body: {
        name: data.name,
        description: data.description || undefined,
        image: data.image || undefined,
        allowedUnits: data.allowedUnits as unknown as typeof undefined,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <CategoryForm
          initialValues={{
            name: category.name,
            description: category.description,
            image: category.image,
            allowedUnits: (category as any).allowedUnits ?? [],
          }}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isPending}
          submitLabel="Save changes"
          loadingLabel="Saving..."
        />
      </DialogContent>
    </Dialog>
  );
}
