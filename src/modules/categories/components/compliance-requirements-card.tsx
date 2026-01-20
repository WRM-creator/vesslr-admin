import { Badge } from "@/components/ui/badge";
import { FileText, ShieldCheck } from "lucide-react";
import type { Category } from "../../lib/category-details-model";

interface ComplianceRequirementsCardProps {
  data: Category["compliance"];
}

export function ComplianceRequirementsCard({ data }: ComplianceRequirementsCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <h4 className="text-sm font-medium text-muted-foreground mb-3">Required Documents</h4>
           <div className="space-y-3">
            {data.documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50 border border-border/50">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] h-5">{doc.level}</Badge>
                            {doc.required && <Badge className="text-[10px] h-5 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 border-0">Required</Badge>}
                        </div>
                    </div>
                </div>
            ))}
           </div>
        </div>

        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Validation Rules</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span>Expiry Enforced</span>
                        <span className={data.validation.expiryEnforced ? "text-green-600 font-medium" : "text-muted-foreground"}>
                            {data.validation.expiryEnforced ? "Yes" : "No"}
                        </span>
                    </div>
                    {data.validation.requiredIssuer && (
                        <div className="flex justify-between py-2 border-b">
                            <span>Required Issuer</span>
                            <span className="font-medium">{data.validation.requiredIssuer}</span>
                        </div>
                    )}
                </div>
            </div>

            <div>
                 <h4 className="text-sm font-medium text-muted-foreground mb-3">Review Flow</h4>
                 <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-900">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <div>
                        <span className="text-sm font-semibold capitalize">{data.reviewFlow} Review</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {data.reviewFlow === 'automated' ? 'System validates using AI/OCR.' :
                             data.reviewFlow === 'manual' ? 'Requires admin approval.' :
                             'System checks first, then admin review.'}
                        </p>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
