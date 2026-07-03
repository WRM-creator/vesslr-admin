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
import { DOCUMENT_ISSUES } from "./document-issues";
import type { DocRequestsApi } from "./use-doc-requests";

interface DocFlagButtonProps {
  doc: { type: string; label: string };
  docRequests: DocRequestsApi;
  className?: string;
}

/**
 * Inline "flag" control on a provided free-form document — the document
 * counterpart to {@link FlagButton}. Because these documents have no reason
 * target, the popover offers a generic issue vocabulary (unreadable, outdated, …)
 * plus an optional note; flagging any issue queues a fresh request for this exact
 * document type, whose note carries the issues to the applicant. Reads as active
 * once any issue (or a note) is set.
 */
export function DocFlagButton({
  doc,
  docRequests,
  className,
}: DocFlagButtonProps) {
  const [noteOpen, setNoteOpen] = useState(
    docRequests.noteFor(doc.type).trim().length > 0,
  );
  const count = docRequests.countForType(doc.type);
  const active = docRequests.isActive(doc.type);
  const note = docRequests.noteFor(doc.type);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={active}
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
          {active ? `Flagged${count > 1 ? ` (${count})` : ""}` : "Flag"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="border-b px-3 py-2">
          <p className="text-xs font-semibold">{doc.label}</p>
          <p className="text-muted-foreground text-[11px]">
            What is wrong with it? We'll ask for it again.
          </p>
        </div>
        <div className="max-h-72 space-y-1 overflow-y-auto p-2">
          {DOCUMENT_ISSUES.map((option) => (
            <label
              key={option.issue}
              className="hover:bg-accent flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5"
            >
              <Checkbox
                checked={docRequests.hasIssue(doc.type, option.issue)}
                onCheckedChange={() =>
                  docRequests.toggleIssue(doc, option.issue)
                }
                className="mt-0.5"
              />
              <span className="text-xs leading-snug">{option.label}</span>
            </label>
          ))}
          <div className="px-2 pt-1">
            {noteOpen ? (
              <Textarea
                autoFocus
                value={note}
                onChange={(e) => docRequests.setNote(doc, e.target.value)}
                placeholder="Optional: a note to the applicant about this"
                rows={2}
                className="text-xs"
              />
            ) : (
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="text-muted-foreground hover:text-foreground text-[11px] font-medium underline-offset-2 hover:underline"
              >
                Add a note
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
