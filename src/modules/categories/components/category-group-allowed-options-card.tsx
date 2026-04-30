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
import {
  ALL_TRADE_TERM_VALUES,
  TRADE_TERMS,
  type TradeTermType,
} from "@/types/trade-term";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface CategoryGroupAllowedOptionsCardProps {
  categoryGroup: CategoryGroupDto;
}

type ArrayField = "allowedListingTypes" | "allowedConditions" | "allowedTradeTerms";

const LISTING_TYPES = [
  { value: "product", label: "Product" },
  { value: "service", label: "Service" },
  { value: "rental", label: "Rental" },
  { value: "lease", label: "Lease" },
  { value: "charter", label: "Charter" },
  { value: "rfq", label: "RFQ" },
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
          Configure which listing types, conditions, and trade terms are
          permitted for this category group.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OptionSection
          label="Listing Types"
          isPending={isFieldPending("allowedListingTypes")}
        >
          {LISTING_TYPES.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(
                categoryGroup.allowedListingTypes as string[]
              ).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "allowedListingTypes",
                categoryGroup.allowedListingTypes as string[],
                value,
              )}
            />
          ))}
        </OptionSection>
        <Separator />
        <OptionSection
          label="Conditions"
          isPending={isFieldPending("allowedConditions")}
        >
          {CONDITIONS.map(({ value, label }) => (
            <OptionPill
              key={value}
              label={label}
              selected={(
                categoryGroup.allowedConditions as string[]
              ).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "allowedConditions",
                categoryGroup.allowedConditions as string[],
                value,
              )}
            />
          ))}
        </OptionSection>
        <Separator />
        <OptionSection
          label="Trade Terms"
          isPending={isFieldPending("allowedTradeTerms")}
        >
          {ALL_TRADE_TERM_VALUES.map((value) => (
            <OptionPill
              key={value}
              label={TRADE_TERMS[value as TradeTermType]?.label ?? value}
              selected={(
                categoryGroup.allowedTradeTerms as string[]
              ).includes(value)}
              disabled={isPending}
              onClick={handleToggle(
                "allowedTradeTerms",
                categoryGroup.allowedTradeTerms as string[],
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
