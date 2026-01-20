import { Badge } from "@/components/ui/badge";
import type { Category } from "../../lib/category-details-model";

interface CategoryIdentityCardProps {
  data: Category["identity"];
}

export function CategoryIdentityCard({ data }: CategoryIdentityCardProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Category Name</h4>
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <Badge variant={data.status === "active" ? "default" : "secondary"}>
            {data.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
        <p className="text-sm text-foreground/90">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Parent Category</h4>
          <p className="text-sm">{data.parentId || "Root Category"}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
