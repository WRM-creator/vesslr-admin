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

type ArrayField = "allowedMeasurementTypes" | "allowedListingTypes" | "allowedConditions";

const MEASUREMENT_TYPES = [
  { value: "count" as const, label: "Count" },
  { value: "volume" as const, label: "Volume" },
  { value: "mass" as const, label: "Mass" },
  { value: "time" as const, label: "Time" },
];

const CONDITIONS = [
  { value: "New" as const, label: "New" },
  { value: "Used - Good" as const, label: "Used - Good" },
  { value: "Used - Fair" as const, label: "Used - Fair" },
  { value: "Refurbished" as const, label: "Refurbished" },
];

const LISTING_TYPES = [
  { value: "product" as const, label: "Product" },
  { value: "service" as const, label: "Service" },
  { value: "rental" as const, label: "Rental" },
  { value: "charter" as const, label: "Charter" },
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
          Configure which listing types, conditions, and measurement types are
          permitted for products in this category group.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OptionSection
          label="Allowed Listing Types"
          isPending={isFieldPending("allowedListingTypes")}
        >
          {LISTING_TYPES.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(categoryGroup.allowedListingTypes ?? []).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "allowedListingTypes",
                categoryGroup.allowedListingTypes ?? [],
                value,
              )}
            />
          ))}
        </OptionSection>
        <Separator />
        <OptionSection
          label="Allowed Conditions"
          isPending={isFieldPending("allowedConditions")}
        >
          {CONDITIONS.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(categoryGroup.allowedConditions ?? []).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "allowedConditions",
                categoryGroup.allowedConditions ?? [],
                value,
              )}
            />
          ))}
        </OptionSection>
        <Separator />
        <OptionSection
          label="Allowed Measurement Types"
          isPending={isFieldPending("allowedMeasurementTypes")}
        >
          {MEASUREMENT_TYPES.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(categoryGroup.allowedMeasurementTypes ?? []).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "allowedMeasurementTypes",
                categoryGroup.allowedMeasurementTypes ?? [],
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
