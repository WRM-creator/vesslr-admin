import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useState } from "react";

export function CreateRequestDialog({
  open,
  onOpenChange,
  disputeId,
  raisedByRole,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disputeId: string;
  raisedByRole?: "BUYER" | "SELLER";
  onCreated: () => void;
}) {
  const [requestedFrom, setRequestedFrom] = useState<"BUYER" | "SELLER">(
    "BUYER",
  );
  const [message, setMessage] = useState("");
  const [requiresDocuments, setRequiresDocuments] = useState(false);
  const [documentDescription, setDocumentDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const { mutate: createRequest, isPending } =
    api.admin.disputes.createRequest.useMutation();

  const canSubmit = message.trim().length > 0 && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createRequest(
      {
        path: { id: disputeId },
        body: {
          requestedFrom,
          message: message.trim(),
          requiresDocuments,
          documentDescription: documentDescription.trim() || undefined,
          deadline: deadline || undefined,
        },
      },
      {
        onSuccess: () => {
          resetForm();
          onCreated();
          onOpenChange(false);
        },
      },
    );
  };

  const resetForm = () => {
    setRequestedFrom("BUYER");
    setMessage("");
    setRequiresDocuments(false);
    setDocumentDescription("");
    setDeadline("");
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) resetForm();
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Request Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Target party toggle */}
          <div className="space-y-1.5">
            <Label>Request from</Label>
            <ButtonGroup>
              {(["BUYER", "SELLER"] as const).map((role) => (
                <Button
                  key={role}
                  variant={requestedFrom === role ? "default" : "outline"}
                  size="sm"
                  className="flex-1 px-6"
                  onClick={() => setRequestedFrom(role)}
                >
                  {role === "BUYER" ? "Buyer" : "Seller"}
                  {raisedByRole === role && " (Raised)"}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label>What are you asking?</Label>
            <Textarea
              placeholder="Describe what information or documentation you need..."
              className="min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              disabled={isPending}
            />
            <p className="text-muted-foreground text-right text-xs">
              {message.length}/1000
            </p>
          </div>

          {/* Requires documents toggle */}
          <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Requires documents</p>
              <p className="text-muted-foreground text-xs">
                Party must upload at least one file
              </p>
            </div>
            <Switch
              checked={requiresDocuments}
              onCheckedChange={setRequiresDocuments}
              disabled={isPending}
            />
          </div>

          {/* Document guidance (conditional) */}
          {requiresDocuments && (
            <div className="space-y-1.5">
              <Label>
                Document guidance{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                placeholder="e.g. Commercial invoice, proof of delivery, inspection certificate..."
                className="min-h-[60px]"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                maxLength={500}
                disabled={isPending}
              />
            </div>
          )}

          {/* Deadline */}
          <div className="space-y-1.5">
            <Label>
              Response deadline{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <input
              type="date"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isPending ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
