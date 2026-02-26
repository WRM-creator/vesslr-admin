import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-file-upload";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { AlertCircle, Building2, CheckCircle, FileCheck, Upload, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TransactionQQDocuments } from "./transaction-qq-documents";

interface TransactionQQTabProps {
  transaction: TransactionResponseDto;
}

function UploadInspectionDialog({
  open,
  onOpenChange,
  transactionId,
  stageId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  stageId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadFiles, isUploading } = useFileUpload();

  const { mutate: submitInspection, isPending: isSubmitting } =
    api.admin.transactions.submitInspection.useMutation();

  const isBusy = isUploading || isSubmitting;

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setSelectedFiles([]);
    onOpenChange(isOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles((prev) => [...prev, ...files]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    let uploaded;
    try {
      uploaded = await uploadFiles(selectedFiles);
    } catch {
      toast.error("Failed to upload files. Please try again.");
      return;
    }

    submitInspection(
      {
        path: { id: transactionId, stageId },
        body: { documents: uploaded.map((f) => ({ name: f.name, url: f.url })) },
      },
      {
        onSuccess: () => {
          toast.success("Inspection documents submitted. Awaiting admin review.");
          setSelectedFiles([]);
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error("Failed to submit", { description: error.message });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Inspection Documents</DialogTitle>
          <DialogDescription>
            Upload Q&amp;Q certification documents on behalf of the buyer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => inputRef.current?.click()}
            disabled={isBusy}
          >
            <Upload className="size-4" />
            Select Files
          </Button>

          {selectedFiles.length > 0 && (
            <ul className="space-y-1 rounded-md border p-2">
              {selectedFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-1 py-0 text-xs"
                    onClick={() => handleRemove(i)}
                    disabled={isBusy}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => handleClose(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0 || isBusy}
          >
            {isUploading
              ? "Uploading..."
              : isSubmitting
                ? "Submitting..."
                : "Submit Documents"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectInspectionDialog({
  open,
  onOpenChange,
  transactionId,
  stageId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  stageId: string;
}) {
  const [reason, setReason] = useState("");

  const { mutate: reviewInspection, isPending } =
    api.admin.transactions.reviewInspection.useMutation();

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setReason("");
    onOpenChange(isOpen);
  };

  const handleReject = () => {
    if (!reason.trim()) return;

    reviewInspection(
      {
        path: { id: transactionId, stageId },
        body: { decision: "REJECTED", rejectionReason: reason.trim() },
      },
      {
        onSuccess: () => {
          toast.success("Inspection rejected. Buyer has been notified to re-upload.");
          setReason("");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error("Failed to reject inspection", { description: error.message });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Inspection Documents</DialogTitle>
          <DialogDescription>
            Provide a reason for rejection. The buyer will be notified and
            asked to re-upload corrected documents.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="e.g. Sulfur content certificate is missing. Please upload the ASTM D4294 report."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          disabled={isPending}
        />

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!reason.trim() || isPending}
          >
            {isPending ? "Rejecting..." : "Reject & Notify Buyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TransactionQQTab({ transaction }: TransactionQQTabProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { mutate: reviewInspection, isPending: isApproving } =
    api.admin.transactions.reviewInspection.useMutation();

  const inspectionStage = transaction.stages?.find(
    (s: any) => s.type === "INSPECTION",
  );

  if (!inspectionStage) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No Q&amp;Q inspection stage for this transaction.
      </div>
    );
  }

  const metadata = inspectionStage.metadata as Record<string, any> | undefined;
  const qqCompany = metadata?.qqCompany as string | null | undefined;
  const qqCriteria = (metadata?.qqCriteria as Record<string, any>[]) ?? [];
  const submittedDocuments =
    (metadata?.submittedDocuments as { name: string; url: string }[]) ?? [];
  const inspectionReview = metadata?.inspectionReview as
    | { status: string; rejectionReason?: string | null }
    | undefined;
  const reviewStatus = inspectionReview?.status;

  const isCompleted = inspectionStage.status === "COMPLETED";
  const isActive = inspectionStage.status === "ACTIVE";
  const isAwaitingReview = isActive && reviewStatus === "AWAITING_REVIEW";
  const isRejected = isActive && reviewStatus === "REJECTED";
  const isAwaitingDocs = isActive && !reviewStatus;

  const handleApprove = () => {
    if (!transaction._id || !inspectionStage._id) return;
    reviewInspection(
      {
        path: { id: transaction._id, stageId: inspectionStage._id },
        body: { decision: "APPROVED" },
      },
      {
        onSuccess: () => {
          toast.success("Inspection approved. Transaction is advancing to the next stage.");
        },
        onError: (error: any) => {
          toast.error("Failed to approve inspection", { description: error.message });
        },
      },
    );
  };

  const statusBadge = isCompleted ? (
    <Badge
      variant="outline"
      className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    >
      Completed
    </Badge>
  ) : isAwaitingReview ? (
    <Badge
      variant="outline"
      className="border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    >
      Under Review
    </Badge>
  ) : isRejected ? (
    <Badge
      variant="outline"
      className="border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      Rejected
    </Badge>
  ) : isAwaitingDocs ? (
    <Badge
      variant="outline"
      className="border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
    >
      Awaiting Documents
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Pending
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-medium">
            Quality &amp; Quantity Inspection
          </h3>
          {inspectionStage.completedAt && (
            <p className="text-muted-foreground text-sm">
              Completed{" "}
              {new Date(inspectionStage.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {statusBadge}
          {/* Upload: only when awaiting docs or rejected (not while under review) */}
          {(isAwaitingDocs || isRejected) && transaction._id && inspectionStage._id && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          )}
        </div>
      </div>

      {/* Rejection reason banner */}
      {isRejected && inspectionReview?.rejectionReason && (
        <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Documents Rejected
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {inspectionReview.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Approve / Reject actions when under review */}
      {isAwaitingReview && transaction._id && inspectionStage._id && (
        <div className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Review the submitted documents against the Q&amp;Q criteria below.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
              onClick={() => setIsRejectOpen(true)}
            >
              <XCircle className="size-4" />
              Reject
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
              disabled={isApproving}
            >
              <CheckCircle className="size-4" />
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      )}

      {/* Inspection company */}
      {qqCompany && (
        <div className="bg-muted/50 flex items-center gap-3 rounded-md border p-3">
          <Building2 className="text-muted-foreground size-4 shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Inspection Company
            </p>
            <p className="text-sm font-medium">{qqCompany}</p>
          </div>
        </div>
      )}

      {/* Acceptance criteria */}
      {qqCriteria.length > 0 && (
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Acceptance Criteria
          </p>
          <ul className="space-y-1">
            {qqCriteria.map((criterion: Record<string, any>) => (
              <li
                key={criterion.id}
                className="flex items-center gap-2 text-sm"
              >
                <FileCheck className="text-muted-foreground size-3.5 shrink-0" />
                <span className="font-medium">{criterion.label}</span>
                {criterion.unit && (
                  <span className="text-muted-foreground text-xs">
                    ({criterion.unit})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submitted documents */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Submitted Documents
        </p>
        <TransactionQQDocuments documents={submittedDocuments} />
      </div>

      {/* Dialogs */}
      {transaction._id && inspectionStage._id && (
        <>
          <UploadInspectionDialog
            open={isUploadOpen}
            onOpenChange={setIsUploadOpen}
            transactionId={transaction._id}
            stageId={inspectionStage._id}
          />
          <RejectInspectionDialog
            open={isRejectOpen}
            onOpenChange={setIsRejectOpen}
            transactionId={transaction._id}
            stageId={inspectionStage._id}
          />
        </>
      )}
    </div>
  );
}
