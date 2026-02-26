import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface CategoryGroupAllowedOptionsCardProps {
  categoryGroup: CategoryGroupDto;
}

type ArrayField = "measurementType" | "transactionTypes" | "conditions";

const MEASUREMENT_TYPES = [
  { value: "count" as const, label: "Count" },
  { value: "volume" as const, label: "Volume" },
  { value: "mass" as const, label: "Mass" },
  { value: "time" as const, label: "Time" },
];

const TRANSACTION_TYPES = [
  { value: "Purchase", label: "Purchase" },
  { value: "Lease", label: "Lease" },
  { value: "Charter", label: "Charter" },
  { value: "Bulk Supply", label: "Bulk Supply" },
  { value: "Spot Trade", label: "Spot Trade" },
];

const CONDITIONS = [
  { value: "New", label: "New" },
  { value: "Used - Good", label: "Used - Good" },
  { value: "Used - Fair", label: "Used - Fair" },
  { value: "Refurbished", label: "Refurbished" },
];

export function CategoryGroupAllowedOptionsCard({
  categoryGroup,
}: CategoryGroupAllowedOptionsCardProps) {
  const {
    mutate: updateGroup,
    isPending,
    variables,
  } = api.categoryGroups.update.useMutation();

  const isFieldPending = (field: ArrayField) =>
    isPending && !!variables?.body && field in variables.body;

  const handleToggle =
    <T extends string>(field: ArrayField, current: T[], value: T) =>
    () => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      updateGroup(
        { path: { id: categoryGroup._id }, body: { [field]: next } },
        {
          onSuccess: () => toast.success("Options updated"),
          onError: (error: any) =>
            toast.error(error.message || "Failed to update options"),
        },
      );
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allowed Options</CardTitle>
        <CardDescription>
          Configure which measurement types, transaction types, and conditions
          are permitted for products in this category group.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OptionSection
          label="Measurement Types"
          isPending={isFieldPending("measurementType")}
        >
          {MEASUREMENT_TYPES.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={categoryGroup.measurementType.includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "measurementType",
                categoryGroup.measurementType,
                value,
              )}
            />
          ))}
        </OptionSection>
        <Separator />
        <OptionSection
          label="Transaction Types"
          isPending={isFieldPending("transactionTypes")}
        >
          {TRANSACTION_TYPES.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(categoryGroup.transactionTypes as string[]).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "transactionTypes",
                categoryGroup.transactionTypes,
                value,
              )}
            />
          ))}
        </OptionSection>
        <Separator />
        <OptionSection
          label="Conditions"
          isPending={isFieldPending("conditions")}
        >
          {CONDITIONS.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(categoryGroup.conditions as string[]).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "conditions",
                categoryGroup.conditions,
                value,
              )}
            />
          ))}
        </OptionSection>
      </CardContent>
    </Card>
  );
}

function OptionSection({
  label,
  isPending,
  children,
}: {
  label: string;
  isPending: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-base">{label}</Label>
        {isPending && (
          <Loader2 className="text-muted-foreground h-3.5 w-3.5 animate-spin" />
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function OptionPill({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {label}
    </button>
  );
}
