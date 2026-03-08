import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeftIcon, ChevronRightIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";
import type { ViewableItem } from "./viewable-item";

interface DocumentViewerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ViewableItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

function DocumentViewer({ item }: { item: ViewableItem }) {
  const [loaded, setLoaded] = useState(false);

  if (item.type.startsWith("image/")) {
    return (
      <img
        src={item.url}
        alt={item.label}
        className="h-full w-full object-contain"
      />
    );
  }
  if (item.type === "application/pdf") {
    return (
      <div className="relative h-full w-full">
        {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <iframe
          src={item.url}
          title={item.label}
          className="h-full w-full border-0"
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <FileTextIcon
        className="text-muted-foreground size-12"
        strokeWidth={1.2}
      />
      <p className="text-muted-foreground text-sm">Preview not available</p>
      <Button variant="outline" size="sm" asChild>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          Open file
        </a>
      </Button>
    </div>
  );
}

export function DocumentViewerSheet({
  open,
  onOpenChange,
  items,
  currentIndex,
  onNavigate,
}: DocumentViewerSheetProps) {
  const current = items[currentIndex];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-2xl"
      >
        <SheetHeader className="flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <SheetTitle className="text-base">
              {current?.label ?? "Document"}
            </SheetTitle>
            {current && (
              <p className="text-muted-foreground text-xs capitalize">
                {current.type} ·{" "}
                {current.source === "smile_id" ? "Smile ID" : "Uploaded"}
              </p>
            )}
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-hidden bg-black/5">
          {current ? (
            <DocumentViewer item={current} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No document selected
              </p>
            </div>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              {currentIndex + 1} / {items.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === items.length - 1}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
