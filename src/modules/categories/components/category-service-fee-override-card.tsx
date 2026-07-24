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
import {
  ServiceFeeConfigEditor,
  type FeeConfigSlot,
} from "./service-fee-config-editor";

interface CategoryFeeOverrideCardProps {
  categoryId: string;
  /** Which two-fee-model slot this card overrides. */
  slot: FeeConfigSlot;
  /** The stored override for this slot, when one exists. */
  override?: Partial<ServiceFeeConfigDto> | null;
  /** The parent group, for the inherited-default summary. */
  parentGroup?: CategoryGroupDto;
}

const SLOT_META: Record<
  FeeConfigSlot,
  {
    title: string;
    description: string;
    updateField: "escrowFeeOverride" | "serviceChargeOverride";
    groupField: "escrowFeeConfig" | "serviceChargeConfig";
    fallback: ServiceFeeConfigDto;
  }
> = {
  escrowFee: {
    title: "Escrow Fee Override",
    description:
      "Charge buyers in this category a different escrow fee than its group. Changes apply to new orders only.",
    updateField: "escrowFeeOverride",
    groupField: "escrowFeeConfig",
    fallback: {
      payer: "buyer",
      feeType: "percentage",
      percentage: 0.01,
      trigger: "settlement",
      refundable: false,
    },
  },
  serviceCharge: {
    title: "Service Charge Override",
    description:
      "Price this category's seller-paid Vesslr fee differently from its group (e.g. Crude Oil vs Refined Products). Changes apply to new orders only.",
    updateField: "serviceChargeOverride",
    groupField: "serviceChargeConfig",
    fallback: {
      payer: "seller",
      feeType: "percentage",
      percentage: 0,
      trigger: "settlement",
      refundable: false,
    },
  },
};

const describeConfig = (
  slot: FeeConfigSlot,
  c?: Partial<ServiceFeeConfigDto> | null,
): string => {
  if (!c) {
    return slot === "escrowFee"
      ? "Not configured (no escrow fee)"
      : "Not configured (no service charge)";
  }
  if (c.feeType === "per_unit") {
    return `per-unit: ${c.perUnitAmount ?? 0} minor units of ${
      c.currency ?? "?"
    } per ${c.unit ?? "unit"}`;
  }
  if (c.feeType === "percentage") {
    return `${((c.percentage ?? 0) * 100).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}%`;
  }
  return c.feeType ?? "unknown";
};

/**
 * Per-category override for one two-fee-model slot: off, the category
 * inherits the group default (shown read-only); on, it carries its own
 * config. Enabling seeds from the group default so the admin edits from a
 * real value; disabling clears it (null), falling back to the group at
 * resolution time.
 */
export function CategoryServiceFeeOverrideCard({
  categoryId,
  slot,
  override,
  parentGroup,
}: CategoryFeeOverrideCardProps) {
  const meta = SLOT_META[slot];
  const hasOverride = !!override;
  const { mutate: updateCategory, isPending } =
    api.categories.update.useMutation();

  const persist = (value: ServiceFeeConfigDto | null, message: string) => {
    updateCategory(
      { path: { id: categoryId }, body: { [meta.updateField]: value } },
      {
        onSuccess: () => toast.success(message),
        onError: (err: any) =>
          toast.error(err.message || "Failed to update the fee override"),
      },
    );
  };

  const toggle = (enabled: boolean) => {
    if (enabled) {
      // Seed from the group default (or the slot fallback) so the editor
      // opens on the value that currently governs this category.
      const seed = (parentGroup?.[meta.groupField] ??
        meta.fallback) as ServiceFeeConfigDto;
      persist(
        { ...seed, trigger: "settlement" },
        "Override enabled — this category now carries its own config",
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
            <CardTitle>{meta.title}</CardTitle>
            <CardDescription>{meta.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`fee-override-toggle-${slot}`}
              className="text-muted-foreground text-sm"
            >
              Override
            </Label>
            <Switch
              id={`fee-override-toggle-${slot}`}
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
            key={`${categoryId}-${slot}`}
            slot={slot}
            value={override}
            onSave={(config) => persist(config, "Fee override updated")}
            isPending={isPending}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Inheriting the group default:{" "}
            <span className="text-foreground font-medium">
              {describeConfig(slot, parentGroup?.[meta.groupField])}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
