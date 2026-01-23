import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, FileText, Layers } from "lucide-react";
import type { ProductDetails } from "../lib/product-details-model";

interface CategoryComplianceCardProps {
  data: ProductDetails["compliance"];
}

export function CategoryComplianceCard({ data }: CategoryComplianceCardProps) {
  return (
    <div className="space-y-6">
      {/* Category Info */}
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">{data.categoryName}</h4>
          <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
            {data.categoryPath.join(" › ")}
          </div>
        </div>
      </div>

      {/* Rules */}
      {data.rules.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Compliance Rules</h4>
          <div className="space-y-2">
            {data.rules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-muted/50 flex items-start gap-3 rounded-md p-3 text-sm"
              >
                <AlertCircle
                  className={`mt-0.5 h-4 w-4 ${
                    rule.criticality === "high"
                      ? "text-red-500"
                      : rule.criticality === "medium"
                        ? "text-amber-500"
                        : "text-blue-500"
                  }`}
                />
                <div className="space-y-1">
                  <div className="leading-none font-medium">{rule.name}</div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    {rule.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Required Documents</h4>
          <span className="text-muted-foreground text-xs">
            {data.documents.filter((d) => d.status === "approved").length} /{" "}
            {data.documents.length} approved
          </span>
        </div>

        <div className="space-y-2">
          {data.documents.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div className="text-sm font-medium">
                  {doc.name}{" "}
                  {doc.required && (
                    <span className="text-destructive ml-1 text-xs">*</span>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  doc.status === "approved"
                    ? "outline" // success isn't a variant, usually green outline or custom class
                    : doc.status === "missing" || doc.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
                className={
                  doc.status === "approved"
                    ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20"
                    : "capitalize"
                }
              >
                {doc.status === "approved" && (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                {doc.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
