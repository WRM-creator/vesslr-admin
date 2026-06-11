import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { StructuredReasonDto } from "@/lib/api/generated";
import { useEffect, useState } from "react";
import { REASON_GROUPS, reasonKey, type ReasonOption } from "./reason-options";

const REQUEST_ACTION_COPY = {
  KYB: "Request Action — Business Verification",
  KYC: "Request Action — Identity Verification",
};

interface RequestActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reasons: StructuredReasonDto[], message?: string) => void;
  isSubmitting: boolean;
  reviewType: "KYB" | "KYC";
  /**
   * Optional editable draft to seed the customer message — e.g. derived from a
   * provider's decline reason. The admin must edit it into white-labeled copy
   * before sending; provider names must not reach the customer.
   */
  defaultMessage?: string;
}

export function RequestActionDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  reviewType,
  defaultMessage,
}: RequestActionDialogProps) {
  const [selected, setSelected] = useState<ReasonOption[]>([]);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  // Seed the message draft when the dialog opens. Only prefill an untouched field
  // so we never clobber what the admin has already typed.
  useEffect(() => {
    if (open) setMessage(defaultMessage ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const groups = REASON_GROUPS[reviewType];

  const toggle = (option: ReasonOption) => {
    const key = reasonKey(option);
    setSelected((prev) =>
      prev.some((o) => reasonKey(o) === key)
        ? prev.filter((o) => reasonKey(o) !== key)
        : [...prev, option],
    );
  };

  const isSelected = (option: ReasonOption) =>
    selected.some((o) => reasonKey(o) === reasonKey(option));

  const reset = () => {
    setSelected([]);
    setNote("");
    setMessage("");
  };

  const handleConfirm = () => {
    const reasons: StructuredReasonDto[] = selected.map((o, i) => ({
      target: o.target,
      issue: o.issue,
      ...(i === selected.length - 1 && note.trim()
        ? { note: note.trim() }
        : {}),
    }));
    onConfirm(reasons, message.trim() || undefined);
    reset();
  };

  const handleCancel = () => {
    reset();
  };

  const canSubmit = selected.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-w-md"
        onInteractOutside={() => onOpenChange(false)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{REQUEST_ACTION_COPY[reviewType]}</AlertDialogTitle>
          <AlertDialogDescription>
            Select all items that need attention. These will be sent to the
            applicant.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-80 space-y-5 overflow-y-auto py-1 pr-1">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {group.heading}
              </p>
              <div className="space-y-2">
                {group.options.map((option) => {
                  const key = reasonKey(option);
                  return (
                    <div key={key} className="flex items-start gap-3">
                      <Checkbox
                        id={key}
                        checked={isSelected(option)}
                        onCheckedChange={() => toggle(option)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={key}
                        className="cursor-pointer text-sm leading-snug font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <Label htmlFor="action-message" className="mb-1.5 block text-sm">
              Message to customer (optional)
            </Label>
            <Textarea
              id="action-message"
              placeholder="Explain what the customer needs to add or update..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Shown to the customer. White-labeled — do not name any payment
              provider.
            </p>
          </div>

          <div>
            <Label htmlFor="action-note" className="mb-1.5 block text-sm">
              Additional notes (optional)
            </Label>
            <Textarea
              id="action-note"
              placeholder="Any other details for the organization..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Send Request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
