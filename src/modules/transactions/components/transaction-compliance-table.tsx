import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, FileText } from "lucide-react";
import { useState } from "react";
import { TransactionComplianceActionDialog } from "./transaction-compliance-action-dialog";
import {
  TransactionComplianceBadge,
  type ComplianceDocumentStatus,
} from "./transaction-compliance-badge";

export type DocumentParty = "seller" | "buyer";

export interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  requiredFor: string;
  party: DocumentParty;
  status: ComplianceDocumentStatus;
  uploadedDate?: Date;
  uploadedBy?: string;
  fileUrl?: string;
}

interface TransactionComplianceTableProps {
  documents: ComplianceDocument[];
  party: DocumentParty;
  onStatusChange: (
    id: string,
    newStatus: ComplianceDocumentStatus,
    comment?: string,
  ) => void;
}

export function TransactionComplianceTable({
  documents,
  party,
  onStatusChange,
}: TransactionComplianceTableProps) {
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDocument | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const partyDocs = documents.filter((doc) => doc.party === party);

  if (partyDocs.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No documents required for {party}.
      </div>
    );
  }

  const handleRowClick = (doc: ComplianceDocument) => {
    setSelectedDoc(doc);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="bg-card overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partyDocs.map((doc) => (
              <TableRow
                key={doc.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(doc)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {doc.requiredFor}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-xs font-normal"
                  >
                    {doc.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TransactionComplianceBadge status={doc.status} />
                </TableCell>
                <TableCell>
                  {doc.uploadedDate ? (
                    <div className="text-sm">
                      <div>{doc.uploadedDate.toLocaleDateString()}</div>
                      <div className="text-muted-foreground text-xs">
                        by {doc.uploadedBy}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <ChevronRight className="text-muted-foreground/50 h-4 w-4" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TransactionComplianceActionDialog
        document={selectedDoc}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
