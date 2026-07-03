import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  RequestedDocumentDto,
  StructuredReasonDto,
} from "@/lib/api/generated";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ISSUE_PICKER_GROUPS,
  reasonIssueLabel,
  reasonKey,
  reasonTargetLabel,
  type ReasonOption,
} from "./reason-options";
import {
  REQUESTABLE_DOCUMENT_GROUPS,
  customDocumentCode,
} from "./document-options";
import type { CaseFlag } from "./use-case-flags";

export interface RequestChangesPayload {
  reasons: StructuredReasonDto[];
  documents: RequestedDocumentDto[];
  message?: string;
}

interface RequestChangesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Issues pre-selected from the reviewer's inline flags. */
  initialFlags: CaseFlag[];
  /** Documents pre-selected from inline document flags, with a composed note. */
  initialDocuments?: { type: string; label: string; note?: string }[];
  /** Optional message draft (e.g. from a provider decline) to seed the message. */
  defaultMessage?: string;
  onSubmit: (payload: RequestChangesPayload) => void;
  isSubmitting: boolean;
}

interface IssueEntry {
  option: ReasonOption;
  note: string;
}
interface DocEntry {
  type: string;
  label?: string;
  note: string;
}

/** Optional, collapse-to-label note field: hidden until the reviewer adds one. */
function NoteField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(value.trim().length > 0);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground ml-6 w-fit text-[11px] font-medium underline-offset-2 hover:underline"
      >
        Add a note
      </button>
    );
  }
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="ml-6 w-[calc(100%-1.5rem)] text-xs"
    />
  );
}

/** A picker popover of grouped, toggleable options (issues or documents). */
function AddPicker({
  label,
  groups,
  isSelected,
  onToggle,
  footer,
}: {
  label: string;
  groups: { heading: string; options: { key: string; label: string }[] }[];
  isSelected: (key: string) => boolean;
  onToggle: (key: string) => void;
  footer?: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="max-h-72 space-y-3 overflow-y-auto p-3">
          {groups.map((group) => (
            <div key={group.heading} className="space-y-1">
              <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                {group.heading}
              </p>
              {group.options.map((o) => (
                <label
                  key={o.key}
                  className="hover:bg-accent flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5"
                >
                  <Checkbox
                    checked={isSelected(o.key)}
                    onCheckedChange={() => onToggle(o.key)}
                    className="mt-0.5"
                  />
                  <span className="text-xs leading-snug">{o.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
        {footer && <div className="border-t p-3">{footer}</div>}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Unified "request changes" side sheet. Non-occluding (slides from the right so
 * the evidence stays visible), it merges the old Request-Action and
 * Request-Documents flows: flag-seeded issues to fix + documents to request, each
 * with an optional inline note (label carries the common case), plus one overall
 * message. Submits via the atomic request-changes endpoint.
 */
export function RequestChangesSheet({
  open,
  onOpenChange,
  initialFlags,
  initialDocuments,
  defaultMessage,
  onSubmit,
  isSubmitting,
}: RequestChangesSheetProps) {
  const [issues, setIssues] = useState<Record<string, IssueEntry>>({});
  const [docs, setDocs] = useState<Record<string, DocEntry>>({});
  const [message, setMessage] = useState("");
  const [customLabel, setCustomLabel] = useState("");

  // Seed the sheet from the inline flags + "Request again" toggles each time it opens.
  useEffect(() => {
    if (!open) return;
    const seeded: Record<string, IssueEntry> = {};
    for (const flag of initialFlags) {
      seeded[reasonKey(flag)] = { option: flag, note: flag.note ?? "" };
    }
    setIssues(seeded);
    const seededDocs: Record<string, DocEntry> = {};
    for (const doc of initialDocuments ?? []) {
      seededDocs[doc.type] = {
        type: doc.type,
        label: doc.label,
        note: doc.note ?? "",
      };
    }
    setDocs(seededDocs);
    setMessage(defaultMessage ?? "");
    setCustomLabel("");
  }, [open, initialFlags, initialDocuments, defaultMessage]);

  const toggleIssue = (option: ReasonOption) => {
    const key = reasonKey(option);
    setIssues((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { option, note: "" } };
    });
  };

  const toggleDoc = (type: string, label: string) => {
    setDocs((prev) => {
      if (prev[type]) {
        const next = { ...prev };
        delete next[type];
        return next;
      }
      return { ...prev, [type]: { type, label, note: "" } };
    });
  };

  const addCustomDoc = () => {
    const label = customLabel.trim();
    if (!label) return;
    const type = customDocumentCode(label);
    setDocs((prev) => ({ ...prev, [type]: { type, label, note: "" } }));
    setCustomLabel("");
  };

  const issueList = useMemo(() => Object.values(issues), [issues]);
  const docList = useMemo(() => Object.values(docs), [docs]);
  const canSubmit = issueList.length + docList.length > 0;

  // Grouped by document so each group heading names the document and the options
  // carry only the issue text (never repeating the document name).
  const issueGroups = ISSUE_PICKER_GROUPS.map((group) => ({
    heading: group.heading,
    options: group.options.map((o) => ({ key: reasonKey(o), label: o.label })),
  }));
  const allIssueOptions = useMemo(() => {
    const map: Record<string, ReasonOption> = {};
    for (const group of ISSUE_PICKER_GROUPS) {
      for (const o of group.options) map[reasonKey(o)] = o;
    }
    return map;
  }, []);

  const docGroups = REQUESTABLE_DOCUMENT_GROUPS.map((group) => ({
    heading: group.heading,
    options: group.options.map((o) => ({ key: o.type, label: o.label })),
  }));
  const docLabelByType = useMemo(() => {
    const map: Record<string, string> = {};
    for (const group of REQUESTABLE_DOCUMENT_GROUPS) {
      for (const o of group.options) map[o.type] = o.label;
    }
    return map;
  }, []);

  const handleSubmit = () => {
    onSubmit({
      reasons: issueList.map(({ option, note }) => ({
        target: option.target,
        issue: option.issue,
        note: note.trim() || undefined,
      })),
      documents: docList.map(({ type, label, note }) => ({
        type,
        label,
        note: note.trim() || undefined,
      })),
      message: message.trim() || undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-base">Request changes</SheetTitle>
          <SheetDescription className="text-xs">
            Flag issues and ask for documents in one message. Add a note only
            where the label is not enough. Never name a payment provider.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          {/* Issues to fix */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                Issues to fix
              </p>
              <AddPicker
                label="Add issue"
                groups={issueGroups}
                isSelected={(key) => Boolean(issues[key])}
                onToggle={(key) => toggleIssue(allIssueOptions[key])}
              />
            </div>
            {issueList.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                No issues flagged. Flag evidence on the case, or add one here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {issueList.map(({ option, note }) => {
                  const key = reasonKey(option);
                  return (
                    <div
                      key={key}
                      className="border-border/70 flex flex-col gap-1.5 rounded-lg border p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                            {reasonTargetLabel(option.target)}
                          </span>
                          <span className="text-xs font-medium leading-snug">
                            {reasonIssueLabel(option.target, option.issue)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleIssue(option)}
                          className="text-muted-foreground hover:text-foreground shrink-0"
                          aria-label="Remove issue"
                        >
                          <XIcon className="size-3.5" />
                        </button>
                      </div>
                      <NoteField
                        value={note}
                        placeholder="Optional: what specifically to fix"
                        onChange={(v) =>
                          setIssues((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], note: v },
                          }))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Documents to request */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                Documents to request
              </p>
              <AddPicker
                label="Request document"
                groups={docGroups}
                isSelected={(key) => Boolean(docs[key])}
                onToggle={(key) => toggleDoc(key, docLabelByType[key] ?? key)}
                footer={
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Custom document
                    </Label>
                    <div className="flex gap-1.5">
                      <Input
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        placeholder="e.g. Bank reference letter"
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomDoc();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={addCustomDoc}
                        disabled={!customLabel.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                }
              />
            </div>
            {docList.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                No documents requested.
              </p>
            ) : (
              <div className="space-y-2.5">
                {docList.map(({ type, label, note }) => (
                  <div
                    key={type}
                    className="border-border/70 flex flex-col gap-1.5 rounded-lg border p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium leading-snug">
                        {label ?? type}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleDoc(type, label ?? type)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                        aria-label="Remove document"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </div>
                    <NoteField
                      value={note}
                      placeholder="Optional: instructions for this document"
                      onChange={(v) =>
                        setDocs((prev) => ({
                          ...prev,
                          [type]: { ...prev[type], note: v },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Overall message */}
          <section className="space-y-1.5">
            <Label htmlFor="rc-message" className="text-xs font-medium">
              Message to applicant{" "}
              <span className="text-muted-foreground font-normal">
                (optional, encouraged)
              </span>
            </Label>
            <Textarea
              id="rc-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A short, friendly note framing what you need."
              rows={3}
              className="text-xs"
            />
          </section>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className={cn("gap-1.5")}
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting && <Spinner className="size-4" />}
            Send request
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
