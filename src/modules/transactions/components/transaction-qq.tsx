import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { TransactionQQDocuments } from "./transaction-qq-documents";
import { TransactionQQMedia } from "./transaction-qq-media";
import { TransactionQQStats } from "./transaction-qq-stats";

export function TransactionQQ() {
  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-medium">SGS Inspection Services</h3>
          <p className="text-muted-foreground text-sm">Oct 25, 2023</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            PASSED
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
        </div>
      </div>

      <TransactionQQStats />

      <TransactionQQDocuments />

      <TransactionQQMedia />
    </div>
  );
}
