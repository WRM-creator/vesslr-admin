import { Badge } from "@/components/ui/badge";
import { FileText, ShieldCheck } from "lucide-react";
import type { Category } from "../lib/category-details-model";

interface ComplianceRequirementsCardProps {
  data: Category["compliance"];
}

export function ComplianceRequirementsCard({
  data,
}: ComplianceRequirementsCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-muted-foreground mb-3 text-sm font-medium">
            Required Documents
          </h4>
          <div className="space-y-3">
            {data.documents.map((doc, idx) => (
              <div
                key={idx}
                className="bg-secondary/50 border-border/50 flex items-start gap-3 rounded-md border p-3"
              >
                <FileText className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="outline" className="h-5 text-[10px]">
                      {doc.level}
                    </Badge>
                    {doc.required && (
                      <Badge className="h-5 border-0 bg-red-100 text-[10px] text-red-800 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/40">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-muted-foreground mb-3 text-sm font-medium">
              Validation Rules
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b py-2">
                <span>Expiry Enforced</span>
                <span
                  className={
                    data.validation.expiryEnforced
                      ? "font-medium text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  {data.validation.expiryEnforced ? "Yes" : "No"}
                </span>
              </div>
              {data.validation.requiredIssuer && (
                <div className="flex justify-between border-b py-2">
                  <span>Required Issuer</span>
                  <span className="font-medium">
                    {data.validation.requiredIssuer}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-3 text-sm font-medium">
              Review Flow
            </h4>
            <div className="flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/10">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <div>
                <span className="text-sm font-semibold capitalize">
                  {data.reviewFlow} Review
                </span>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {data.reviewFlow === "automated"
                    ? "System validates using AI/OCR."
                    : data.reviewFlow === "manual"
                      ? "Requires admin approval."
                      : "System checks first, then admin review."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
