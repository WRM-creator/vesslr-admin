import { Activity, AlertTriangle, Eye, MessageSquare } from "lucide-react";
import type { ProductDetails } from "../lib/product-details-model";

interface ProductActivityCardProps {
  data: ProductDetails["activity"];
}

export function ProductActivityCard({ data }: ProductActivityCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg border p-3">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
            <Eye className="h-3 w-3" />
            Total Views
          </div>
          <div className="mt-1 text-2xl font-bold">{data.views}</div>
          <div className="text-muted-foreground text-[10px]">
            Last viewed {new Date(data.lastViewed).toLocaleDateString()}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg border p-3">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
            <MessageSquare className="h-3 w-3" />
            Inquiries
          </div>
          <div className="mt-1 text-2xl font-bold">{data.inquiries}</div>
        </div>
      </div>

      {data.riskSignals.length > 0 ? (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4" />
            Risk Signals
          </h4>
          <div className="space-y-2">
            {data.riskSignals.map((signal, idx) => (
              <div
                key={idx}
                className="bg-muted/50 flex items-start gap-3 rounded-md p-3 text-sm"
              >
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 ${
                    signal.severity === "high"
                      ? "text-red-500"
                      : signal.severity === "medium"
                        ? "text-amber-500"
                        : "text-blue-500"
                  }`}
                />
                <div className="space-y-1">
                  <div className="leading-none font-medium capitalize">
                    {signal.type.replace(/_/g, " ")}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Detected {new Date(signal.detectedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Activity className="h-4 w-4" />
          No risk signals detected
        </div>
      )}
    </div>
  );
}
