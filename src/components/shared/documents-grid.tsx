import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePdfThumbnail } from "@/lib/pdf-utils";
import { cn } from "@/lib/utils";
import { FileTextIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ViewableItem } from "./viewable-item";

interface DocumentsGridProps {
  items: ViewableItem[];
  onSelect: (index: number, list: ViewableItem[]) => void;
}

function DocumentThumbnail({ item }: { item: ViewableItem }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (item.type.startsWith("image/")) {
          if (mounted) setPreview(item.url);
        } else if (item.type === "application/pdf") {
          const response = await fetch(item.url);
          if (!response.ok) throw new Error("Failed to fetch PDF");
          const blob = await response.blob();
          const file = new File([blob], item.name, { type: "application/pdf" });
          const thumbnail = await generatePdfThumbnail(file);
          if (mounted) setPreview(thumbnail);
        }
      } catch {
        // fall through to icon fallback
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [item.url, item.type, item.name]);

  if (loading) return <Skeleton className="h-full w-full" />;

  if (preview) {
    return (
      <img
        src={preview}
        alt={item.label}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <FileTextIcon
      className="text-muted-foreground group-hover:text-foreground size-8 transition-colors"
      strokeWidth={1.2}
    />
  );
}

export function DocumentsGrid({ items, onSelect }: DocumentsGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Documents</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            type="button"
            onClick={() => onSelect(index, items)}
            className={cn(
              "group flex flex-col overflow-hidden rounded-lg border text-left transition-colors",
              "hover:border-ring hover:bg-accent/30 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <div className="bg-muted flex h-32 items-center justify-center overflow-hidden">
              <DocumentThumbnail item={item} />
            </div>
            <div className="space-y-1.5 p-3">
              <p className="text-sm leading-tight font-medium">{item.label}</p>
              {item.source === "smile_id" ? (
                <Badge className="bg-green-100 text-xs text-green-700 hover:bg-green-100">
                  Smile ID ✓
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Uploaded
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
