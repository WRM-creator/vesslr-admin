import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon } from "lucide-react";
import { merchantLedgerColumns } from "./columns";
import type { LedgerItem } from "./types";

interface MerchantLedgerTableProps {
  data: LedgerItem[];
  isLoading?: boolean;
}

export function MerchantLedgerTable({
  data,
  isLoading,
}: MerchantLedgerTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ledger & Payment History</CardTitle>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={merchantLedgerColumns}
          data={data}
          isLoading={isLoading}
          emptyContent="No transactions found."
        />
      </CardContent>
    </Card>
  );
}
