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
import { useState } from "react";

const ACTION_REASONS = [
  "Document unreadable or expired",
  "Name mismatch between documents",
  "Missing required document",
  "Address inconsistency",
  "ID number not matching records",
];

interface RequestActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reasons: string[]) => void;
  isSubmitting: boolean;
}

export function RequestActionDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: RequestActionDialogProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    );
  };

  const handleCancel = () => {
    setSelectedReasons([]);
    setCustomReason("");
  };

  const handleConfirm = () => {
    onConfirm([...selectedReasons, customReason].filter(Boolean));
    setSelectedReasons([]);
    setCustomReason("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Request Action</AlertDialogTitle>
          <AlertDialogDescription>
            Select the reasons for requesting action. These will be sent to the
            applicant.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 py-2">
          {ACTION_REASONS.map((reason) => (
            <div key={reason} className="flex items-center gap-3">
              <Checkbox
                id={reason}
                checked={selectedReasons.includes(reason)}
                onCheckedChange={() => toggleReason(reason)}
              />
              <Label htmlFor={reason} className="cursor-pointer text-sm font-normal">
                {reason}
              </Label>
            </div>
          ))}
          <div className="pt-2">
            <Label htmlFor="custom-reason" className="mb-1.5 block text-sm">
              Additional notes (optional)
            </Label>
            <Textarea
              id="custom-reason"
              placeholder="Any other details..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
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
            disabled={(selectedReasons.length === 0 && !customReason.trim()) || isSubmitting}
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Send Request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
