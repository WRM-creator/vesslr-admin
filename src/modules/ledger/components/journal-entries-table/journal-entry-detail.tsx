import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TINT } from "@/lib/tint";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency";
import { ExternalLinkIcon, RotateCcwIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { JournalEntry } from "../../types";
import { formatAccountCode } from "../../utils";

interface JournalEntryDetailProps {
  entry: JournalEntry;
  onReverse?: (entryId: string) => void;
}

export function JournalEntryDetail({
  entry,
  onReverse,
}: JournalEntryDetailProps) {
  const { transactionId, escrowId, providerRef } = entry.metadata;
  const hasMetadata = transactionId || escrowId || providerRef;

  return (
    <div className="space-y-4 px-4 py-3">
      {/* Lines table */}
      <div className="bg-muted/40 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-3 text-xs font-medium uppercase">
                Account
              </TableHead>
              <TableHead className="px-3 text-right text-xs font-medium uppercase">
                Debit
              </TableHead>
              <TableHead className="px-3 text-right text-xs font-medium uppercase">
                Credit
              </TableHead>
              <TableHead className="px-3 text-right text-xs font-medium uppercase">
                Currency
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entry.lines.map((line, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="px-3 py-2">
                  <Link
                    to={`/ledger/accounts/${encodeURIComponent(line.accountCode)}`}
                    className="text-primary hover:underline font-mono text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatAccountCode(line.accountCode)}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-2 text-right font-mono text-sm">
                  {line.debit > 0
                    ? formatCurrency(line.debit, line.currency, {
                        maximumFractionDigits: 2,
                      })
                    : "—"}
                </TableCell>
                <TableCell className="px-3 py-2 text-right font-mono text-sm text-green-600 dark:text-green-400">
                  {line.credit > 0
                    ? formatCurrency(line.credit, line.currency, {
                        maximumFractionDigits: 2,
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground px-3 py-2 text-right text-sm">
                  {line.currency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Metadata + actions row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Metadata links */}
        <div className="flex flex-wrap items-center gap-3">
          {transactionId && (
            <Link
              to={`/transactions/${transactionId}`}
              className="text-primary hover:underline inline-flex items-center gap-1 text-xs font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon className="h-3 w-3" />
              Transaction {transactionId.replace("txn_", "#")}
            </Link>
          )}
          {escrowId && (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              Escrow: {escrowId}
            </span>
          )}
          {providerRef && (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              Ref: {providerRef}
            </span>
          )}
          {entry.reversalOf && (
            <Badge
              variant="outline"
              className={`${TINT.amber} text-xs`}
            >
              Reversal of {entry.reversalOf}
            </Badge>
          )}
          {entry.reversedBy && (
            <Badge
              variant="outline"
              className={`${TINT.amber} text-xs`}
            >
              Reversed by {entry.reversedBy}
            </Badge>
          )}
          {!hasMetadata && !entry.reversalOf && !entry.reversedBy && (
            <span className="text-muted-foreground text-xs">
              No linked entities
            </span>
          )}
        </div>

        {/* Actions */}
        {entry.status === "POSTED" && !entry.reversedBy && onReverse && (
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onReverse(entry._id);
            }}
          >
            <RotateCcwIcon className="mr-1.5 h-3.5 w-3.5" />
            Reverse Entry
          </Button>
        )}
      </div>

      {/* Idempotency key */}
      <div className="text-muted-foreground border-t pt-2 text-xs">
        Key: <span className="font-mono">{entry.idempotencyKey}</span>
      </div>
    </div>
  );
}
