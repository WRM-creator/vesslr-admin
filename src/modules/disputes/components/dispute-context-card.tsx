import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Package } from "lucide-react";
import { Link } from "react-router-dom";
import type { DisputeDetails } from "../lib/dispute-details-model";

interface DisputeContextCardProps {
  data: DisputeDetails;
}

export function DisputeContextCard({ data }: DisputeContextCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Context</CardTitle>
        <FileText className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Transaction Link */}
          <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Transaction</div>
                <div className="text-sm font-medium">{data.transactionId}</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link to={`/transactions/${data.transactionId}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Product Link */}
          <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 rounded-md border">
                <AvatarImage
                  src={data.productThumbnail}
                  alt={data.productName}
                />
                <AvatarFallback className="rounded-md">
                  <Package className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-muted-foreground text-xs">Product</div>
                <div className="max-w-[180px] truncate text-sm font-medium">
                  {data.productName}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link to={`/products/${data.productId}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
