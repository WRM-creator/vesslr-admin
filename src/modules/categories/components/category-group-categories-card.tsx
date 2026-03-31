import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddCategoryDialog } from "./add-category-dialog";
import { CategoriesTable } from "./categories-table";
import type { CategoryTableItem } from "./categories-table/columns";
import { EditCategoryDialog } from "./edit-category-dialog";

interface CategoryGroupCategoriesCardProps {
  categoryGroup: CategoryGroupDto;
}

export function CategoryGroupCategoriesCard({
  categoryGroup,
}: CategoryGroupCategoriesCardProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryTableItem | null>(
    null,
  );

  const { data, isLoading } = api.categories.list.useQuery({
    query: { groupId: categoryGroup._id },
  });


  const { mutate: updateCategory, isPending: isToggling } =
    api.categories.update.useMutation();

  const handleToggleActive = (id: string, current: boolean) => {
    updateCategory(
      { path: { id }, body: { isActive: !current } },
      {
        onError: (error: any) => {
          toast.error(error.message || "Failed to update category");
        },
      },
    );
  };

  const categories = data ?? [];

  const filtered = search.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : categories;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>
                <div className="flex items-center gap-1">
                  Categories
                  {categories.length > 0 && (
                    <span className="text-muted-foreground text-sm font-normal">
                      ({categories.length})
                    </span>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                Individual categories that belong to this group.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CategoriesTable
            data={filtered}
            isLoading={isLoading}
            search={search}
            onSearchChange={setSearch}
            onToggleActive={handleToggleActive}
            isToggling={isToggling}
            onEdit={setEditCategory}
          />
        </CardContent>
      </Card>

      <AddCategoryDialog
        groupId={categoryGroup._id}
        groupType={categoryGroup.type as "equipment-and-products" | "services"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {editCategory && (
        <EditCategoryDialog
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => {
            if (!open) setEditCategory(null);
          }}
        />
      )}
    </>
  );
}
