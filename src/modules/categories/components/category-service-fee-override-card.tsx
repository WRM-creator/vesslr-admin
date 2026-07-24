import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import type {
  CategoryGroupDto,
  ServiceFeeConfigDto,
} from "@/lib/api/generated/types.gen";
import { toast } from "sonner";
import { ServiceFeeConfigEditor } from "./service-fee-config-editor";

interface CategoryServiceFeeOverrideCardProps {
  categoryId: string;
  /** The stored override, when one exists. */
  override?: Partial<ServiceFeeConfigDto> | null;
  /** The parent group, for the inherited-default summary. */
  parentGroup?: CategoryGroupDto;
}

const describeConfig = (c?: Partial<ServiceFeeConfigDto> | null): string => {
  if (!c) return "Platform default (3% buyer-paid)";
  const payer = c.payer === "seller" ? "seller-paid" : `${c.payer}-paid`;
  if (c.feeType === "per_unit") {
    return `${payer} per-unit: ${c.perUnitAmount ?? 0} minor units of ${
      c.currency ?? "?"
    } per ${c.unit ?? "unit"}`;
  }
  if (c.feeType === "percentage") {
    return `${payer} ${((c.percentage ?? 0) * 100).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}%`;
  }
  return `${payer} ${c.feeType}`;
};

/**
 * Per-category fee override: off, the category inherits the group default
 * (shown read-only); on, it carries its own ServiceFeeConfig. Enabling seeds
 * the override from the group default so the admin edits from a real value;
 * disabling clears it (null), falling back to the group at resolution time.
 */
export function CategoryServiceFeeOverrideCard({
  categoryId,
  override,
  parentGroup,
}: CategoryServiceFeeOverrideCardProps) {
  const hasOverride = !!override;
  const { mutate: updateCategory, isPending } =
    api.categories.update.useMutation();

  const persist = (value: ServiceFeeConfigDto | null, message: string) => {
    updateCategory(
      { path: { id: categoryId }, body: { serviceFeeOverride: value } },
      {
        onSuccess: () => toast.success(message),
        onError: (err: any) =>
          toast.error(err.message || "Failed to update the fee override"),
      },
    );
  };

  const toggle = (enabled: boolean) => {
    if (enabled) {
      // Seed from the group default (or the platform default) so the editor
      // opens on the value that currently governs this category.
      const seed = (parentGroup?.serviceFeeConfig ?? {
        payer: "buyer",
        feeType: "percentage",
        percentage: 0.03,
        refundable: false,
      }) as ServiceFeeConfigDto;
      persist(
        { ...seed, trigger: "settlement" },
        "Override enabled — this category now carries its own fee config",
      );
    } else {
      persist(null, "Override cleared — the group default applies again");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Service Fee Override</CardTitle>
            <CardDescription>
              Price this category differently from its group (e.g. Crude Oil vs
              Refined Products). Changes apply to new orders only.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="fee-override-toggle"
              className="text-muted-foreground text-sm"
            >
              Override
            </Label>
            <Switch
              id="fee-override-toggle"
              checked={hasOverride}
              onCheckedChange={toggle}
              disabled={isPending}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasOverride ? (
          <ServiceFeeConfigEditor
            key={categoryId}
            value={override}
            onSave={(config) => persist(config, "Fee override updated")}
            isPending={isPending}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Inheriting the group default:{" "}
            <span className="text-foreground font-medium">
              {describeConfig(parentGroup?.serviceFeeConfig)}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
