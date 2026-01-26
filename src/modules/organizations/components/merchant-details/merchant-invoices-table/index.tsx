import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { merchantInvoicesColumns } from "./columns";
import type { InvoiceItem } from "./types";

interface MerchantInvoicesTableProps {
  data: InvoiceItem[];
  isLoading?: boolean;
}

export function MerchantInvoicesTable({
  data,
  isLoading,
}: MerchantInvoicesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={merchantInvoicesColumns}
          data={data}
          isLoading={isLoading}
          emptyContent="No invoices found."
        />
      </CardContent>
    </Card>
  );
}
