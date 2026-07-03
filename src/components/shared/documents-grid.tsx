import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePdfThumbnail } from "@/lib/pdf-utils";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import { FileClockIcon, FileTextIcon, FileX2Icon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { ViewableItem } from "./viewable-item";

/** A slot is a placeholder (not a real file) when it's an expected-but-absent gap. */
const isMissingSlot = (item: ViewableItem) =>
  item.slotStatus === "missing" || item.slotStatus === "requested";

interface DocumentsGridProps {
  items: ViewableItem[];
  onSelect: (index: number, list: ViewableItem[]) => void;
  /** Suppress the built-in "Documents" heading when the caller supplies its own. */
  hideHeading?: boolean;
  /**
   * Optional overlay rendered in each card's top-right corner (e.g. an inline
   * flag control). Rendered as a sibling of the card button, not inside it, so
   * interactive controls don't nest inside a button.
   */
  cornerSlot?: (item: ViewableItem, index: number) => ReactNode;
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

/**
 * Placeholder tile for an expected-but-absent document: a dashed, muted card that
 * makes the gap visible (and, via the corner slot, flaggable) instead of the
 * document simply not appearing. `requested` reads as awaiting the customer;
 * `missing` reads as a required document that was never provided.
 */
function MissingTile({ item }: { item: ViewableItem }) {
  const requested = item.slotStatus === "requested";
  return (
    <div className="border-muted-foreground/25 flex h-full w-full flex-col overflow-hidden rounded-lg border border-dashed">
      <div className="bg-muted/40 flex h-32 items-center justify-center overflow-hidden">
        {requested ? (
          <FileClockIcon
            className="text-muted-foreground/70 size-8"
            strokeWidth={1.2}
          />
        ) : (
          <FileX2Icon
            className="size-8 text-amber-500/80"
            strokeWidth={1.2}
          />
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <p className="text-muted-foreground text-sm leading-tight font-medium">
          {item.label}
        </p>
        <Badge
          variant="outline"
          className={cn("text-xs", requested ? TINT.gray : TINT.amber)}
        >
          {requested ? "Requested" : "Not uploaded"}
        </Badge>
        {item.note && (
          <p className="text-muted-foreground text-xs">{item.note}</p>
        )}
      </div>
    </div>
  );
}

export function DocumentsGrid({
  items,
  onSelect,
  hideHeading = false,
  cornerSlot,
}: DocumentsGridProps) {
  if (items.length === 0) return null;

  // The viewer only navigates real files, so open against a present-only list.
  const viewable = items.filter((it) => !isMissingSlot(it));

  const grid = (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="relative">
          {cornerSlot && (
            <div className="absolute right-2 top-2 z-10">
              {cornerSlot(item, index)}
            </div>
          )}
          {isMissingSlot(item) ? (
            <MissingTile item={item} />
          ) : (
            <button
              type="button"
              onClick={() => onSelect(viewable.indexOf(item), viewable)}
              className={cn(
                "group flex w-full flex-col overflow-hidden rounded-lg border text-left transition-colors",
                "hover:border-ring hover:bg-accent/30 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              )}
            >
              <div className="bg-muted flex h-32 items-center justify-center overflow-hidden">
                <DocumentThumbnail item={item} />
              </div>
              <div className="space-y-1.5 p-3">
                <p className="text-sm leading-tight font-medium">{item.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.source === "smile_id" ? (
                    <Badge className="bg-green-100 text-xs text-green-700 hover:bg-green-100">
                      Smile ID ✓
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Uploaded
                    </Badge>
                  )}
                  {item.updatedSinceReview && (
                    <Badge variant="outline" className={cn("text-xs", TINT.amber)}>
                      Updated
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  if (hideHeading) return grid;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Documents</h3>
      {grid}
    </div>
  );
}
