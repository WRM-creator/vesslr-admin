import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dispute } from "@/lib/api/disputes";
import { ExternalLink, FileText, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface DisputeContextCardProps {
  data: Dispute;
}

export function DisputeContextCard({ data }: DisputeContextCardProps) {
  const product = data.transaction?.product;

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
                <div className="font-mono text-sm font-medium">
                  {data.transaction?._id || "N/A"}
                </div>
              </div>
            </div>
            {data.transaction?._id && (
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <Link to={`/transactions/${data.transaction._id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {/* Product Link */}
          {product && (
            <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-md border">
                  <AvatarImage src={product.thumbnail} alt={product.title} />
                  <AvatarFallback className="rounded-md">
                    <Package className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-muted-foreground text-xs">Product</div>
                  <div className="max-w-[180px] truncate text-sm font-medium">
                    {product.title}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <Link to={`/products/${product._id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
