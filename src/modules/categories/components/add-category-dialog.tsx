import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CategoryForm } from "./category-form";
import type { CategoryFormSchema } from "./category-form/schema";

interface AddCategoryDialogProps {
  groupId: string;
  groupType: "equipment-and-products" | "services";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({
  groupId,
  groupType,
  open,
  onOpenChange,
}: AddCategoryDialogProps) {
  const { mutate: createCategory, isPending } =
    api.categories.create.useMutation();

  const handleSubmit = (data: CategoryFormSchema) => {
    createCategory(
      {
        body: {
          name: data.name,
          description: data.description || undefined,
          group: groupId,
          type: groupType,
        },
      },
      {
        onSuccess: () => {
          toast.success("Category created successfully");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create category");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
