import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFileUpload } from "@/hooks/use-file-upload";
import { api } from "@/lib/api";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [".pdf", ".png", ".jpg", ".jpeg"];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  stageId: string;
}

export function UploadInspectionDialog({
  open,
  onOpenChange,
  transactionId,
  stageId,
}: UploadInspectionDialogProps) {
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
    const validFiles: File[] = [];
    for (const file of files) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!ALLOWED_TYPES.includes(ext)) {
        toast.error(
          `"${file.name}" is not a supported file type. Use PDF, PNG, or JPG.`,
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `"${file.name}" exceeds the 10 MB size limit (${formatFileSize(file.size)}).`,
        );
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
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
        body: {
          documents: uploaded.map((f) => ({ name: f.name, url: f.url })),
        },
      },
      {
        onSuccess: () => {
          toast.success(
            "Inspection documents submitted. Awaiting admin review.",
          );
          setSelectedFiles([]);
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to submit", { description: message });
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
                  <span className="truncate">
                    {file.name}
                    <span className="text-muted-foreground ml-1 text-xs">
                      ({formatFileSize(file.size)})
                    </span>
                  </span>
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
