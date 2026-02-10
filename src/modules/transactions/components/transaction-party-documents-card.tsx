import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TransactionDocumentSlotDto } from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { TransactionDocumentsTable } from "./transaction-documents-table";

interface TransactionPartyDocumentsCardProps {
  transactionId: string;
  title: string;
  description: string;
  documents: TransactionDocumentSlotDto[];
  emptyMessage?: string;
  onAdd?: () => void;
  onEdit?: (document: TransactionDocumentSlotDto) => void;
  onDelete?: (document: TransactionDocumentSlotDto) => void;
  onReview?: (document: TransactionDocumentSlotDto) => void;
  className?: string;
}

export function TransactionPartyDocumentsCard({
  transactionId,
  title,
  description,
  documents,
  emptyMessage,
  onAdd,
  onEdit,
  onDelete,
  onReview,
  className,
}: TransactionPartyDocumentsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus /> Add
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <TransactionDocumentsTable
          transactionId={transactionId}
          documents={documents}
          emptyMessage={emptyMessage}
          onEdit={onEdit}
          onDelete={onDelete}
          onReview={onReview}
        />
      </CardContent>
    </Card>
  );
}
