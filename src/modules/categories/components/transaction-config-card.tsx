import { CheckCircle2 } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface TransactionConfigCardProps {
  data: Category["transactionConfig"];
}

export function TransactionConfigCard({ data }: TransactionConfigCardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-muted-foreground mb-3 text-sm font-medium">
          Allowed Transaction Types
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.allowedTransactionTypes.map((type) => (
            <div
              key={type}
              className="bg-secondary text-secondary-foreground flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="capitalize">{type.replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-muted/30 rounded-lg border p-3">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Minimum Value
          </span>
          <div className="mt-1 font-mono text-xl font-semibold">
            ${data.minValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg border p-3">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Maximum Value
          </span>
          <div className="mt-1 font-mono text-xl font-semibold">
            ${data.maxValue.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
