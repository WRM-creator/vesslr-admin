import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ChecklistItemDefinition } from "./review-checklist";

interface ReviewerChecklistProps {
  items: ChecklistItemDefinition[];
  checked: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
  disabled?: boolean;
}

/**
 * Manual-corridor reviewer checklist. The reviewer ticks each item to attest they
 * verified the uploaded evidence by hand; the parent gates Approve until all are
 * ticked and persists the result to the audit trail.
 */
export function ReviewerChecklist({
  items,
  checked,
  onChange,
  disabled,
}: ReviewerChecklistProps) {
  const passedCount = items.filter((i) => checked[i.key]).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Reviewer checklist
        </span>
        <span className="text-muted-foreground text-xs">
          {passedCount}/{items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-start gap-2.5">
            <Checkbox
              id={`chk-${item.key}`}
              checked={!!checked[item.key]}
              onCheckedChange={(v) => onChange(item.key, v === true)}
              disabled={disabled}
              className="mt-0.5"
            />
            <Label
              htmlFor={`chk-${item.key}`}
              className="cursor-pointer text-sm leading-snug font-normal"
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
