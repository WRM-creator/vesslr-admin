import { CheckCircle2, XCircle } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface TransactionConfigCardProps {
  data: Category["transactionConfig"];
}

export function TransactionConfigCard({ data }: TransactionConfigCardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="space-y-4">
        <h4 className="text-muted-foreground text-sm font-medium">
          Transaction Types
        </h4>
        <div className="flex flex-col gap-2">
          {data.allowedTransactionTypes.map((type) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <span className="text-muted-foreground block text-sm font-medium">
            Trading Type
          </span>
          <span className="text-sm capitalize">{data.tradingType}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-muted-foreground text-sm font-medium">
          Value Limits
        </h4>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between border-b pb-1">
            <span className="text-sm">Minimum Value</span>
            <span className="font-mono font-medium">
              ${data.minValue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-b pb-1">
            <span className="text-sm">Maximum Value</span>
            <span className="font-mono font-medium">
              ${data.maxValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-muted-foreground text-sm font-medium">
          Escrow Requirements
        </h4>
        <div
          className={`rounded-md border p-4 ${data.escrow.required ? "border-blue-100 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/10" : "border-gray-100 bg-gray-50"}`}
        >
          <div className="mb-2 flex items-center gap-2">
            {data.escrow.required ? (
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
            <span className="text-sm font-semibold">
              Escrow {data.escrow.required ? "Required" : "Optional"}
            </span>
          </div>
          {data.escrow.required && (
            <div className="ml-7">
              <span className="text-muted-foreground text-xs">Structure: </span>
              <span className="text-xs font-medium capitalize">
                {data.escrow.structure}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
