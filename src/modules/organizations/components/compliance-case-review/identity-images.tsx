import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import type { ViewableItem } from "./placeholder-data";

interface IdentityImagesProps {
  items: ViewableItem[];
  onSelect: (index: number, list: ViewableItem[]) => void;
}

export function IdentityImages({ items, onSelect }: IdentityImagesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Identity Images</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">No identity images</p>
        )}
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelect(index, items)}
            className={cn(
              "group flex flex-col overflow-hidden rounded-lg border text-left transition-colors",
              "hover:border-ring hover:bg-accent/30 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <div className="bg-muted flex h-32 items-center justify-center">
              <UserIcon
                className="text-muted-foreground group-hover:text-foreground size-8 transition-colors"
                strokeWidth={1.2}
              />
            </div>
            <div className="space-y-1.5 p-3">
              <p className="text-sm leading-tight font-medium">{item.label}</p>
              <Badge className="bg-green-100 text-xs text-green-700 hover:bg-green-100">
                Smile ID ✓
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
