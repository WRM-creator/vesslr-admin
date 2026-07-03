import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FlagIcon } from "lucide-react";
import { useState } from "react";
import {
  ISSUES_BY_TARGET,
  TARGET_LABEL,
  reasonKey,
  type ReasonOption,
} from "./reason-options";
import type { CaseFlagsApi } from "./use-case-flags";

interface FlagButtonProps {
  target: string;
  flags: CaseFlagsApi;
  /** Compact icon-only trigger (for dense rows); default shows a label. */
  compact?: boolean;
  className?: string;
}

/**
 * One flaggable issue: a checkbox plus, once ticked, an optional free-text note
 * so the reviewer can write a custom message right at the moment of flagging. The
 * note lives on the flag and seeds the Request-changes sheet.
 */
function IssueRow({
  option,
  flags,
}: {
  option: ReasonOption;
  flags: CaseFlagsApi;
}) {
  const flagged = flags.has(option);
  const note = flags.get(option)?.note ?? "";
  const [noteOpen, setNoteOpen] = useState(note.trim().length > 0);

  return (
    <div className="rounded-md px-1 py-0.5">
      <label className="hover:bg-accent flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5">
        <Checkbox
          checked={flagged}
          onCheckedChange={() => flags.toggle(option)}
          className="mt-0.5"
        />
        <span className="text-xs leading-snug">{option.label}</span>
      </label>
      {flagged &&
        (noteOpen ? (
          <Textarea
            autoFocus
            value={note}
            onChange={(e) => flags.setNote(option, e.target.value)}
            placeholder="Optional: a note to the applicant about this"
            rows={2}
            className="mt-1 ml-7 w-[calc(100%-2rem)] text-xs"
          />
        ) : (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="text-muted-foreground hover:text-foreground mt-0.5 ml-7 text-[11px] font-medium underline-offset-2 hover:underline"
          >
            Add a note
          </button>
        ))}
    </div>
  );
}

/**
 * Inline "flag this" control on a piece of evidence. Opens a popover of the
 * curated issues for the evidence's reason target; ticking one adds it to the
 * case flag store, which seeds the Request-changes sheet. Each ticked issue can
 * carry a free-text note. Reads as active once any issue on this target is
 * flagged.
 */
export function FlagButton({
  target,
  flags,
  compact = false,
  className,
}: FlagButtonProps) {
  const options = ISSUES_BY_TARGET[target] ?? [];
  if (options.length === 0) return null;

  const count = flags.countForTarget(target);
  const active = count > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "bg-background h-6 gap-1 rounded-full px-2 text-[11px] font-semibold shadow-sm",
            active
              ? "border-amber-400 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              : "border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800/70 dark:text-amber-400 dark:hover:bg-amber-500/10",
            className,
          )}
        >
          <FlagIcon
            className="size-3.5"
            fill={active ? "currentColor" : "none"}
          />
          {compact
            ? active
              ? count
              : null
            : active
              ? `Flagged${count > 1 ? ` (${count})` : ""}`
              : "Flag"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="border-b px-3 py-2">
          <p className="text-xs font-semibold">
            {TARGET_LABEL[target] ?? target.replace(/_/g, " ")}
          </p>
          <p className="text-muted-foreground text-[11px]">
            What is wrong with it?
          </p>
        </div>
        <div className="max-h-72 space-y-1 overflow-y-auto p-2">
          {options.map((option) => (
            <IssueRow key={reasonKey(option)} option={option} flags={flags} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
