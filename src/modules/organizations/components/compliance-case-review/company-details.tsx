import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RegistryCompanyInfoDto } from "@/lib/api/generated";

interface CompanyDetailsProps {
  info: RegistryCompanyInfoDto;
  registrySource: string;
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value || value === "N/A") return null;
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return undefined;
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatCurrency(value?: string) {
  if (!value || value === "N/A") return undefined;
  const n = Number(value);
  if (isNaN(n)) return value;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CompanyDetails({ info, registrySource }: CompanyDetailsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Registry Data</CardTitle>
          <span className="text-muted-foreground text-xs">
            Source: {registrySource}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <Field label="Legal name" value={info.legalName} />
          <Field label="Company type" value={info.companyType?.replace(/_/g, " ")} />
          <Field label="Status" value={info.status} />
          <Field label="Registration number" value={info.registrationNumber} />
          <Field label="Registration date" value={formatDate(info.registrationDate)} />
          <Field label="Industry" value={info.industry} />
          <Field label="Authorized share capital" value={formatCurrency(info.authorizedShareCapital)} />
          <Field label="Tax ID" value={info.taxId} />
          <Field label="Country" value={info.country} />
          <Field label="State" value={info.state} />
          <Field label="Registered address" value={info.address} />
        </div>
      </CardContent>
    </Card>
  );
}
