import { Badge } from "@/components/ui/badge";
import type { Category } from "../lib/category-details-model";

interface CategoryIdentityCardProps {
  data: Category["identity"];
}

export function CategoryIdentityCard({ data }: CategoryIdentityCardProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Category Name
          </h4>
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">Status</h4>
          <Badge variant={data.status === "active" ? "default" : "secondary"}>
            {data.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="text-muted-foreground text-sm font-medium">
          Description
        </h4>
        <p className="text-foreground/90 text-sm">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Parent Category
          </h4>
          <p className="text-sm">{data.parentId || "Root Category"}</p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">Tags</h4>
          <div className="mt-1 flex flex-wrap gap-2">
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
