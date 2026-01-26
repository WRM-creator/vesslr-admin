import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowDownToLine, Calendar, CreditCard, FileText } from "lucide-react";

interface TransactionFinancialsInvoiceCardProps {
  data: any;
  type: "receivable" | "payable";
}

export function TransactionFinancialsInvoiceCard({
  data,
  type,
}: TransactionFinancialsInvoiceCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* LEFT COLUMN: Invoice Breakdown (2/3 width) */}
      <div className="space-y-6 lg:col-span-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-medium">
                {type === "receivable" ? "Commerical Invoice" : "Vendor Bill"}
              </CardTitle>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Issued: {formatDateTime(data.issuedDate)}
              </div>
            </div>
            <Badge
              variant={data.status === "paid" ? "default" : "outline"}
              className="capitalize"
            >
              {data.status.replace("_", " ")}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {item.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    Total {type === "receivable" ? "Due" : "Payable"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(data.total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Ledger & Details (1/3 width) */}
      <div className="space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              Payment & Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entity</span>
              <span className="font-medium">{data.entityName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                {data.id}
              </span>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="h-9 w-full justify-start gap-2"
              >
                <FileText className="text-muted-foreground h-3.5 w-3.5" />
                View Invoice
              </Button>
              {type === "receivable" && (
                <>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-start gap-2"
                  >
                    <ArrowDownToLine className="text-muted-foreground h-3.5 w-3.5" />
                    Download Proof of Payment
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-start gap-2"
                  >
                    <FileText className="text-muted-foreground h-3.5 w-3.5" />
                    View Proof of Funds
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
