import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { api } from "@/lib/api";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CategoryGroupServiceFeeCardProps {
  categoryGroup: CategoryGroupDto;
}

const DEFAULT_CONFIG = {
  payer: "buyer" as const,
  feeType: "percentage" as const,
  percentage: 0.03,
  fixedAmount: undefined as number | undefined,
  refundable: false,
};

export function CategoryGroupServiceFeeCard({
  categoryGroup,
}: CategoryGroupServiceFeeCardProps) {
  const config = (categoryGroup as any).serviceFeeConfig ?? DEFAULT_CONFIG;

  const [payer, setPayer] = useState(config.payer ?? "buyer");
  const [feeType, setFeeType] = useState(config.feeType ?? "percentage");
  const [percentage, setPercentage] = useState<number>(
    (config.percentage ?? 0.03) * 100,
  );
  const [fixedAmount, setFixedAmount] = useState<number>(
    config.fixedAmount ?? 0,
  );
  const [refundable, setRefundable] = useState(config.refundable ?? false);

  const { mutate: updateGroup, isPending } =
    api.categoryGroups.update.useMutation();

  const save = (overrides: Record<string, any> = {}) => {
    const updated = {
      payer,
      feeType,
      percentage: feeType === "percentage" ? percentage / 100 : undefined,
      fixedAmount: feeType === "fixed" ? fixedAmount : undefined,
      refundable,
      ...overrides,
    };

    // Clean undefined
    if (updated.percentage === undefined) delete updated.percentage;
    if (updated.fixedAmount === undefined) delete updated.fixedAmount;

    updateGroup(
      {
        path: { id: categoryGroup._id },
        body: { serviceFeeConfig: updated } as any,
      },
      {
        onSuccess: () => toast.success("Service fee config updated"),
        onError: (err: any) =>
          toast.error(err.message || "Failed to update service fee config"),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Fee Configuration</CardTitle>
        <CardDescription>
          Configure the platform service fee for transactions in this category
          group. Changes apply to new orders only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fee Payer */}
        <div className="space-y-2">
          <Label className="text-base">Fee Payer</Label>
          <Select
            value={payer}
            onValueChange={(v) => {
              setPayer(v);
              save({ payer: v });
            }}
            disabled={isPending}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="split">Split</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fee Type */}
        <div className="space-y-3">
          <Label className="text-base">Fee Type</Label>
          <RadioGroup
            value={feeType}
            onValueChange={(v) => {
              setFeeType(v);
              save({ feeType: v });
            }}
            disabled={isPending}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="fee-percentage" />
              <Label htmlFor="fee-percentage">Percentage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fee-fixed" />
              <Label htmlFor="fee-fixed">Fixed Amount</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Percentage / Fixed Amount */}
        {feeType === "percentage" ? (
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
                disabled={isPending}
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
                disabled={isPending}
              />
              {isPending && (
                <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
              )}
            </div>
          </div>
        )}

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
              disabled={isPending}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
