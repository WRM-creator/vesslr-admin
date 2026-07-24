import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ServiceFeeConfigDto } from "@/lib/api/generated/types.gen";
import { UNITS } from "@/types/unit";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const FEE_CURRENCIES = ["USD", "EUR", "NGN", "KES", "USDT", "USDC"] as const;
const UNSET = "__unset__";

type Payer = ServiceFeeConfigDto["payer"];
type FeeType = ServiceFeeConfigDto["feeType"];

interface ServiceFeeConfigEditorProps {
  /** The stored config to edit; undefined starts from the platform default. */
  value?: Partial<ServiceFeeConfigDto> | null;
  /** Persist the full config. The caller owns the mutation and its toasts. */
  onSave: (config: ServiceFeeConfigDto) => void;
  isPending: boolean;
  disabled?: boolean;
}

/**
 * Live-save editor for a ServiceFeeConfig (group default or category
 * override). Values not yet implemented by the fee engine — SPLIT payer,
 * TIERED type, non-settlement triggers — are shown but disabled: the backend
 * guard rejects them loudly, so the UI never offers what the engine cannot
 * price. Seller-paid per-unit is the disclosed commodity fee: deducted from
 * the seller's proceeds at settlement, never added to the buyer.
 */
export function ServiceFeeConfigEditor({
  value,
  onSave,
  isPending,
  disabled = false,
}: ServiceFeeConfigEditorProps) {
  const [payer, setPayer] = useState<Payer>(value?.payer ?? "buyer");
  const [feeType, setFeeType] = useState<FeeType>(
    value?.feeType ?? "percentage",
  );
  const [percentage, setPercentage] = useState<number>(
    (value?.percentage ?? 0.03) * 100,
  );
  const [fixedAmount, setFixedAmount] = useState<number>(
    value?.fixedAmount ?? 0,
  );
  const [perUnitAmount, setPerUnitAmount] = useState<number>(
    value?.perUnitAmount ?? 0,
  );
  const [currency, setCurrency] = useState<string>(value?.currency ?? UNSET);
  const [unit, setUnit] = useState<string>(value?.unit ?? UNSET);
  const [minFee, setMinFee] = useState<string>(
    value?.minFee != null ? String(value.minFee) : "",
  );
  const [maxFee, setMaxFee] = useState<string>(
    value?.maxFee != null ? String(value.maxFee) : "",
  );
  const [refundable, setRefundable] = useState(value?.refundable ?? false);

  const locked = disabled || isPending;

  const save = (overrides: Partial<ServiceFeeConfigDto> = {}) => {
    const parsedMin = minFee.trim() === "" ? undefined : Number(minFee);
    const parsedMax = maxFee.trim() === "" ? undefined : Number(maxFee);
    const config: ServiceFeeConfigDto = {
      payer,
      feeType,
      trigger: "settlement",
      refundable,
      ...(feeType === "percentage" ? { percentage: percentage / 100 } : {}),
      ...(feeType === "fixed" ? { fixedAmount } : {}),
      ...(feeType === "per_unit" ? { perUnitAmount } : {}),
      ...(currency !== UNSET
        ? { currency: currency as ServiceFeeConfigDto["currency"] }
        : {}),
      ...(feeType === "per_unit" && unit !== UNSET
        ? { unit: unit as ServiceFeeConfigDto["unit"] }
        : {}),
      ...(parsedMin != null ? { minFee: parsedMin } : {}),
      ...(parsedMax != null ? { maxFee: parsedMax } : {}),
      ...overrides,
    };
    onSave(config);
  };

  return (
    <div className="space-y-6">
      {/* Fee Payer */}
      <div className="space-y-2">
        <Label className="text-base">Fee Payer</Label>
        <Select
          value={payer}
          onValueChange={(v) => {
            setPayer(v as Payer);
            save({ payer: v as Payer });
          }}
          disabled={locked}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">Buyer (added on top)</SelectItem>
            <SelectItem value="seller">Seller (deducted)</SelectItem>
            <SelectItem value="split" disabled>
              Split — not yet available
            </SelectItem>
          </SelectContent>
        </Select>
        {payer === "seller" && (
          <p className="text-muted-foreground text-sm">
            The disclosed commodity fee: the buyer pays exactly the listed
            price, and this fee is deducted from the seller&apos;s proceeds at
            settlement. Sellers see it at every money surface.
          </p>
        )}
      </div>

      {/* Fee Type */}
      <div className="space-y-3">
        <Label className="text-base">Fee Type</Label>
        <RadioGroup
          value={feeType}
          onValueChange={(v) => {
            setFeeType(v as FeeType);
            save({ feeType: v as FeeType });
          }}
          disabled={locked}
          className="flex flex-wrap gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="fee-percentage" />
            <Label htmlFor="fee-percentage">Percentage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fee-fixed" />
            <Label htmlFor="fee-fixed">Fixed Amount</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="per_unit" id="fee-per-unit" />
            <Label htmlFor="fee-per-unit">Per Unit</Label>
          </div>
          <div className="flex items-center space-x-2 opacity-50">
            <RadioGroupItem value="tiered" id="fee-tiered" disabled />
            <Label htmlFor="fee-tiered">Tiered — not yet available</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Rate */}
      {feeType === "per_unit" ? (
        <div className="space-y-2">
          <Label htmlFor="fee-per-unit-input">Fee per unit (minor units)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="fee-per-unit-input"
              type="number"
              min={0}
              value={perUnitAmount}
              onChange={(e) => setPerUnitAmount(Number(e.target.value))}
              onBlur={() => save()}
              className="w-48"
              disabled={locked}
            />
            {isPending && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Differential listings only. Quoted in the fee currency below — the{" "}
            <span className="font-medium">benchmark&apos;s currency</span>, not
            the settlement one, because it rides on the quoted formula. For a
            USD benchmark, 50 means $0.50 per unit. Cross-currency deals convert
            it once, at the rate agreed when funding is confirmed.
          </p>
        </div>
      ) : feeType === "percentage" ? (
        <div className="space-y-2">
          <Label htmlFor="fee-percentage-input">Percentage (%)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="fee-percentage-input"
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              onBlur={() => save()}
              className="w-32"
              disabled={locked}
            />
            <span className="text-muted-foreground text-sm">%</span>
            {isPending && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="fee-fixed-input">Fixed Amount (minor units)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="fee-fixed-input"
              type="number"
              min={0}
              value={fixedAmount}
              onChange={(e) => setFixedAmount(Number(e.target.value))}
              onBlur={() => save()}
              className="w-48"
              disabled={locked}
            />
            {isPending && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
      )}

      {/* Fee currency + per-unit unit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Fee currency</Label>
          <Select
            value={currency}
            onValueChange={(v) => {
              setCurrency(v);
              save({
                currency:
                  v === UNSET
                    ? undefined
                    : (v as ServiceFeeConfigDto["currency"]),
              });
            }}
            disabled={locked}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Not set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNSET}>Not set</SelectItem>
              {FEE_CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            Required with min/max clamps. For commodity deals it must equal the
            benchmark&apos;s currency — a mismatch is rejected at funding, never
            silently applied.
          </p>
        </div>
        {feeType === "per_unit" && (
          <div className="space-y-2">
            <Label>Rate unit</Label>
            <Select
              value={unit}
              onValueChange={(v) => {
                setUnit(v);
                save({
                  unit:
                    v === UNSET
                      ? undefined
                      : (v as ServiceFeeConfigDto["unit"]),
                });
              }}
              disabled={locked}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(UNITS).map(([key, meta]) => (
                  <SelectItem key={key} value={key}>
                    {meta.label} ({meta.short})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              The unit the rate is quoted per; validated against each
              deal&apos;s unit of measurement.
            </p>
          </div>
        )}
      </div>

      {/* Clamps */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fee-min">Minimum fee (minor units)</Label>
          <Input
            id="fee-min"
            type="number"
            min={0}
            value={minFee}
            placeholder="No minimum"
            onChange={(e) => setMinFee(e.target.value)}
            onBlur={() => save()}
            disabled={locked}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fee-max">Maximum fee (minor units)</Label>
          <Input
            id="fee-max"
            type="number"
            min={0}
            value={maxFee}
            placeholder="No cap"
            onChange={(e) => setMaxFee(e.target.value)}
            onBlur={() => save()}
            disabled={locked}
          />
        </div>
        <p className="text-muted-foreground -mt-2 text-xs sm:col-span-2">
          Optional clamps on the computed per-deal fee, in minor units of the
          fee currency. A cap is how a fee ceiling arrives later as pure config.
        </p>
      </div>

      {/* Trigger */}
      <div className="space-y-2">
        <Label className="text-base">Charged</Label>
        <Select value="settlement" disabled>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="settlement">At settlement</SelectItem>
            <SelectItem value="funding" disabled>
              At funding — not yet available
            </SelectItem>
            <SelectItem value="delivery" disabled>
              At delivery — not yet available
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          Computed and frozen when funding is confirmed, realized when the
          escrow releases.
        </p>
      </div>

      {/* Refundable */}
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="fee-refundable" className="text-base">
            Refundable
          </Label>
          <span className="text-muted-foreground text-sm">
            Whether the service fee is refunded when an order is cancelled.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          )}
          <Switch
            id="fee-refundable"
            checked={refundable}
            onCheckedChange={(checked) => {
              setRefundable(checked);
              save({ refundable: checked });
            }}
            disabled={locked}
          />
        </div>
      </div>
    </div>
  );
}
