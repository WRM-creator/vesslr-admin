import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import type { ComplianceCase } from "./placeholder-data";

interface AutomatedChecksProps {
  kyc: ComplianceCase["checks"]["kyc"];
  kyb: ComplianceCase["checks"]["kyb"];
}

function StatusBadge({ status }: { status: "passed" | "manual_review" | "failed" }) {
  if (status === "passed") {
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Passed</Badge>;
  }
  if (status === "manual_review") {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Manual Review</Badge>;
  }
  return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
}

function CheckRow({ label, value }: { label: string; value: boolean | string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-muted-foreground text-sm">{label}</span>
      {typeof value === "boolean" ? (
        value ? (
          <CheckIcon className="size-4 text-green-600" />
        ) : (
          <XIcon className="size-4 text-red-500" />
        )
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  );
}

export function AutomatedChecks({ kyc, kyb }: AutomatedChecksProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Identity KYC</CardTitle>
          <StatusBadge status={kyc.status} />
        </CardHeader>
        <CardContent className="divide-y">
          <CheckRow label="Selfie match" value={kyc.selfieMatch} />
          <CheckRow label="Liveness" value={kyc.liveness} />
          <CheckRow label="Document auth" value={kyc.documentAuth} />
          <CheckRow label="ID type" value={kyc.idType} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Business KYB</CardTitle>
          <StatusBadge status={kyb.status} />
        </CardHeader>
        <CardContent className="divide-y">
          <CheckRow label="RC Number" value={kyb.rcNumber} />
          <CheckRow label="Company name" value={kyb.companyName} />
          <CheckRow label="Directors found" value={String(kyb.directorsFound)} />
          <CheckRow label="Registry source" value={kyb.registrySource} />
        </CardContent>
      </Card>
    </div>
  );
}
