import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TransactionDocumentSlotDto } from "@/lib/api/generated";
import { Eye, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteDocumentRequirementDialog } from "./delete-document-requirement-dialog";
import { TransactionDocumentStatusBadge } from "./transaction-document-status-badge";

interface TransactionDocumentsTableProps {
  transactionId: string;
  documents: TransactionDocumentSlotDto[];
  emptyMessage?: string;
  onEdit?: (document: TransactionDocumentSlotDto) => void;
  onDelete?: (document: TransactionDocumentSlotDto) => void;
  onReview?: (document: TransactionDocumentSlotDto) => void;
}

export function TransactionDocumentsTable({
  transactionId,
  documents,
  emptyMessage = "No documents required.",
  onEdit,
  onDelete,
  onReview,
}: TransactionDocumentsTableProps) {
  const [documentToDelete, setDocumentToDelete] =
    useState<TransactionDocumentSlotDto | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground py-8 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    {doc.submission ? (
                      <a
                        href={doc.submission.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        {doc.name}
                        <span className="sr-only">View file</span>
                      </a>
                    ) : (
                      <span>{doc.name}</span>
                    )}
                    {doc.isMandatory && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Mandatory
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell className="text-right">
                  <TransactionDocumentStatusBadge status={doc.status} />
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2">
                  {doc.status === "SUBMITTED" && onReview && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => onReview(doc)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(doc)}>
                        <Pencil
                          strokeWidth={1.5}
                          className="text-muted-foreground mr-2 h-4 w-4"
                        />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDocumentToDelete(doc)}
                      >
                        <Trash2
                          strokeWidth={1.5}
                          className="text-destructive mr-2 h-4 w-4"
                        />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteDocumentRequirementDialog
        transactionId={transactionId}
        document={documentToDelete}
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
        onSuccess={() => {
          if (documentToDelete) {
            onDelete?.(documentToDelete);
          }
        }}
      />
    </>
  );
}
