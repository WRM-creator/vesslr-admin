import { Badge } from "@/components/ui/badge";
import { TINT } from "@/lib/tint";
import { cn } from "@/lib/utils";

/**
 * Corridor type for a compliance case. `manual` corridors (no automated KYB/KYC
 * provider) are the ones a human reviews by hand, so they're tinted to stand out;
 * `automated` corridors clear largely on provider/registry signal.
 */
export function CorridorBadge({
  mode,
  className,
}: {
  mode?: "manual" | "automated";
  className?: string;
}) {
  const isManual = mode === "manual";
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        isManual ? TINT.amber : TINT.gray,
        className,
      )}
    >
      <span aria-hidden>{isManual ? "◔" : "◉"}</span>
      {isManual ? "Manual" : "Automated"}
    </Badge>
  );
}
