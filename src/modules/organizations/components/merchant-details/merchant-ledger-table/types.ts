export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  entryType: string;
  debit: number | null;
  credit: number | null;
  currency: string;
  status: "POSTED" | "REVERSED";
}

export interface JournalEntryResponse {
  _id: string;
  entryDate: string;
  entryType: string;
  description: string;
  lines: Array<{
    accountCode: string;
    debit: number;
    credit: number;
    currency: string;
  }>;
  status: "POSTED" | "REVERSED";
  metadata: {
    transactionId?: string | null;
    escrowId?: string | null;
    orderId?: string | null;
    invoiceId?: string | null;
  };
}

/**
 * Maps a raw journal entry to the display model, extracting the
 * debit/credit line relevant to the given account code.
 */
export function toLedgerEntry(
  entry: JournalEntryResponse,
  accountCode: string,
): LedgerEntry {
  const line = entry.lines.find((l) => l.accountCode === accountCode);
  return {
    id: entry._id,
    date: entry.entryDate,
    description: entry.description,
    entryType: entry.entryType,
    debit: line && line.debit > 0 ? line.debit : null,
    credit: line && line.credit > 0 ? line.credit : null,
    currency: line?.currency ?? "NGN",
    status: entry.status,
  };
}
