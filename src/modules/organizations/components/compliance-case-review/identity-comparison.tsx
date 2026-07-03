import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";
import {
  ColumnsIcon,
  ImageOffIcon,
  RotateCwIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useState } from "react";
import type { ComplianceCase, ViewableItem } from "./types";

/** An expected identity image that was never captured/uploaded. */
const isMissingSlot = (item: ViewableItem) => item.slotStatus === "missing";

interface IdentityComparisonProps {
  items: ViewableItem[];
  summary: ComplianceCase["identitySummary"];
  /** Open a single item in the document viewer sheet. */
  onOpenSingle: (index: number, list: ViewableItem[]) => void;
}

function SourceBadge({ source }: { source: ViewableItem["source"] }) {
  return source === "smile_id" ? (
    <Badge variant="outline" className={TINT.green}>
      Smile ID ✓
    </Badge>
  ) : (
    <Badge variant="outline" className={TINT.gray}>
      Uploaded
    </Badge>
  );
}

function Thumbnail({ item }: { item: ViewableItem }) {
  const [error, setError] = useState(false);
  if (error || !item.type?.startsWith("image/")) {
    return (
      <UserIcon className="text-muted-foreground size-7" strokeWidth={1.2} />
    );
  }
  return (
    <img
      src={item.url}
      alt={item.label}
      className="h-full w-full object-cover"
      onError={() => setError(true)}
    />
  );
}

/** One zoomable/rotatable pane in the side-by-side compare view. */
function ComparePane({
  items,
  index,
  onSelect,
}: {
  items: ViewableItem[];
  index: number;
  onSelect: (index: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const item = items[index];
  const isImage = item?.type?.startsWith("image/");

  const reset = (next: number) => {
    onSelect(next);
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            onClick={() => reset(i)}
            className={cn(
              "bg-muted size-12 overflow-hidden rounded border",
              i === index
                ? "ring-ring ring-2"
                : "hover:border-ring opacity-70 hover:opacity-100",
            )}
            title={it.label}
          >
            <div className="flex h-full w-full items-center justify-center">
              <Thumbnail item={it} />
            </div>
          </button>
        ))}
      </div>

      <div className="relative flex h-[52vh] items-center justify-center overflow-hidden rounded-lg border bg-black/5">
        {!item ? (
          <span className="text-muted-foreground text-sm">
            Nothing selected
          </span>
        ) : isImage ? (
          <img
            src={item.url}
            alt={item.label}
            className="max-h-full max-w-full object-contain transition-transform"
            style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
          />
        ) : (
          <iframe
            src={item.url}
            title={item.label}
            className="h-full w-full border-0"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">{item?.label}</span>
          {item && <SourceBadge source={item.source} />}
        </div>
        <div className="flex items-center gap-1">
          {isImage && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              >
                <ZoomOutIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setScale((s) => Math.min(4, s + 0.25))}
              >
                <ZoomInIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setRotation((r) => (r + 90) % 360)}
              >
                <RotateCwIcon className="size-3.5" />
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="h-7" asChild>
            <a href={item?.url} target="_blank" rel="noopener noreferrer">
              Original
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium sm:col-span-2">{value}</span>
    </div>
  );
}

export function IdentityComparison({
  items,
  summary,
  onOpenSingle,
}: IdentityComparisonProps) {
  const [compareOpen, setCompareOpen] = useState(false);
  const [leftIndex, setLeftIndex] = useState(0);

  // Only real files can be viewed/compared; missing slots are visible placeholders.
  const present = items.filter((it) => !isMissingSlot(it));
  const missingCount = items.length - present.length;
  const canCompare = present.length >= 2;
  const [rightIndex, setRightIndex] = useState(present.length > 1 ? 1 : 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Identity verification</CardTitle>
        <div className="flex items-center gap-2">
          {missingCount > 0 && (
            <Badge variant="outline" className={cn("gap-1", TINT.amber)}>
              <ImageOffIcon className="size-3" />
              {missingCount} missing
            </Badge>
          )}
          {summary.verificationMethod && (
            <SourceBadge
              source={
                summary.verificationMethod === "manual"
                  ? "uploaded"
                  : "smile_id"
              }
            />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Wrapper span so the tooltip still fires on a disabled button. */}
              <span tabIndex={canCompare ? -1 : 0}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canCompare}
                  onClick={() => setCompareOpen(true)}
                >
                  <ColumnsIcon className="size-4" />
                  Compare
                </Button>
              </span>
            </TooltipTrigger>
            {!canCompare && (
              <TooltipContent>
                Need at least two uploaded images to compare side by side.
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No identity images were uploaded.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) =>
              isMissingSlot(item) ? (
                <div
                  key={item.name}
                  className="border-muted-foreground/25 flex flex-col overflow-hidden rounded-lg border border-dashed"
                >
                  <div className="bg-muted/40 flex h-28 items-center justify-center overflow-hidden">
                    <ImageOffIcon
                      className="size-6 text-amber-500/80"
                      strokeWidth={1.2}
                    />
                  </div>
                  <div className="space-y-1 p-2">
                    <p className="text-muted-foreground truncate text-xs font-medium">
                      {item.label}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", TINT.amber)}
                    >
                      Not uploaded
                    </Badge>
                  </div>
                </div>
              ) : (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onOpenSingle(present.indexOf(item), present)}
                  className="group hover:border-ring focus-visible:ring-ring flex flex-col overflow-hidden rounded-lg border text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="bg-muted flex h-28 items-center justify-center overflow-hidden">
                    <Thumbnail item={item} />
                  </div>
                  <p className="truncate p-2 text-xs font-medium">{item.label}</p>
                </button>
              ),
            )}
          </div>
        )}

        {(summary.name || summary.idType || summary.idNumber) && (
          <div className="space-y-1.5 border-t pt-3">
            <SummaryField label="Name" value={summary.name} />
            <SummaryField
              label="ID type"
              value={summary.idType?.replace(/_/g, " ")}
            />
            <SummaryField label="ID number" value={summary.idNumber} />
          </div>
        )}
      </CardContent>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compare identity evidence</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ComparePane
              items={present}
              index={leftIndex}
              onSelect={setLeftIndex}
            />
            <ComparePane
              items={present}
              index={rightIndex}
              onSelect={setRightIndex}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
