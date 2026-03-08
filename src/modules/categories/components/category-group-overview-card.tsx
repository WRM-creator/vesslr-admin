import { Thumbnail } from "@/components/shared/thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import { useState } from "react";
import { CategoryGroupStatusBadge } from "./category-group-status-badge";
import { EditCategoryGroupOverviewDialog } from "./edit-category-group-overview-dialog";

interface CategoryGroupOverviewCardProps {
  categoryGroup: CategoryGroupDto;
}

export function CategoryGroupOverviewCard({
  categoryGroup,
}: CategoryGroupOverviewCardProps) {
  const { name, slug, type, isActive } = categoryGroup;
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Category Group Overview</span>
            <div className="flex items-center gap-2">
              <CategoryGroupStatusBadge isActive={isActive} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Thumbnail src={categoryGroup.image} className="size-16" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold">{name}</h3>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span className="text-xs capitalize">
                  {type.toLowerCase().replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditCategoryGroupOverviewDialog
        categoryGroup={categoryGroup}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
