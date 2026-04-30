import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryGroupPoliciesCardProps {
  categoryGroup: CategoryGroupDto;
}

export function CategoryGroupPoliciesCard({
  categoryGroup,
}: CategoryGroupPoliciesCardProps) {
  const {
    mutate: updateGroup,
    isPending,
    variables,
  } = api.categoryGroups.update.useMutation();

  const isFieldPending = (field: keyof CategoryGroupDto) => {
    return isPending && variables?.body && field in variables.body;
  };

  const handleToggle =
    (field: keyof CategoryGroupDto) => (checked: boolean) => {
      updateGroup(
        {
          path: { id: categoryGroup._id },
          body: { [field]: checked },
        },
        {
          onSuccess: () => {
            toast.success("Policy updated successfully");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update policy");
          },
        },
      );
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Policies</CardTitle>
        <CardDescription>
          Manage the rules and requirements for products and transactions in
          this category group.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="requires-logistics" className="text-base">
              Requires Logistics
            </Label>
            <span className="text-muted-foreground text-sm">
              Products in this group require shipping and logistics
              coordination.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("requiresLogistics") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="requires-logistics"
              checked={categoryGroup.requiresLogistics}
              onCheckedChange={handleToggle("requiresLogistics")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="allows-inspection" className="text-base">
              Allows Inspection
            </Label>
            <span className="text-muted-foreground text-sm">
              Products can be inspected by the buyer before delivery is
              finalized.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsInspection") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="allows-inspection"
              checked={categoryGroup.allowsInspection}
              onCheckedChange={handleToggle("allowsInspection")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="milestone-delivery" className="text-base">
              Milestone-Based Delivery
            </Label>
            <span className="text-muted-foreground text-sm">
              Services in this group can be delivered and paid for in
              milestones.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("milestoneDelivery") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="milestone-delivery"
              checked={categoryGroup.milestoneDelivery}
              onCheckedChange={handleToggle("milestoneDelivery")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="order-quantity-limits" className="text-base">
              Order Quantity Limits
            </Label>
            <span className="text-muted-foreground text-sm">
              Products in this group can define minimum and maximum order
              quantities.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsOrderQuantityLimits") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="order-quantity-limits"
              checked={categoryGroup.allowsOrderQuantityLimits}
              onCheckedChange={handleToggle("allowsOrderQuantityLimits")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="inventory-tracking" className="text-base">
              Inventory Tracking
            </Label>
            <span className="text-muted-foreground text-sm">
              Products in this group can track stock levels and manage
              availability.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsInventoryTracking") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="inventory-tracking"
              checked={categoryGroup.allowsInventoryTracking}
              onCheckedChange={handleToggle("allowsInventoryTracking")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Specification Types
        </p>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="allows-commodity-specs" className="text-base">
              Commodity Specifications
            </Label>
            <span className="text-muted-foreground text-sm">
              Show commodity spec fields (grade, origin, API gravity, sulphur content, etc.)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsCommoditySpecs") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="allows-commodity-specs"
              checked={categoryGroup.allowsCommoditySpecs}
              onCheckedChange={handleToggle("allowsCommoditySpecs")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="allows-equipment-specs" className="text-base">
              Equipment Specifications
            </Label>
            <span className="text-muted-foreground text-sm">
              Show equipment spec fields (manufacturer, model, serial number, year, etc.)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsEquipmentSpecs") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="allows-equipment-specs"
              checked={categoryGroup.allowsEquipmentSpecs}
              onCheckedChange={handleToggle("allowsEquipmentSpecs")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="allows-service-specs" className="text-base">
              Service / Project Specifications
            </Label>
            <span className="text-muted-foreground text-sm">
              Show service spec fields (scope of work, manpower, mobilization timeline, etc.)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsServiceSpecs") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="allows-service-specs"
              checked={categoryGroup.allowsServiceSpecs}
              onCheckedChange={handleToggle("allowsServiceSpecs")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="allows-rental-specs" className="text-base">
              Rental / Lease Specifications
            </Label>
            <span className="text-muted-foreground text-sm">
              Show rental spec fields (asset type, rate, availability, operator/maintenance included, etc.)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsRentalSpecs") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="allows-rental-specs"
              checked={categoryGroup.allowsRentalSpecs}
              onCheckedChange={handleToggle("allowsRentalSpecs")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="allows-charter-specs" className="text-base">
              Charter Specifications
            </Label>
            <span className="text-muted-foreground text-sm">
              Show charter spec fields (vessel type, charter type, day rate, crew/fuel included, etc.)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFieldPending("allowsCharterSpecs") && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
            <Switch
              id="allows-charter-specs"
              checked={categoryGroup.allowsCharterSpecs}
              onCheckedChange={handleToggle("allowsCharterSpecs")}
              disabled={isPending}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2 opacity-60">
          <div className="flex flex-col space-y-1">
            <Label
              htmlFor="requires-escrow"
              className="cursor-not-allowed text-base"
            >
              Requires Escrow
            </Label>
            <span className="text-muted-foreground text-sm">
              Transactions require funds to be held securely in escrow.
            </span>
          </div>
          <Switch
            id="requires-escrow"
            checked={categoryGroup.requiresEscrow}
            disabled={true}
          />
        </div>
        <Separator />
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Escrow Structure
        </p>
        <div className="space-y-3">
          <div className="flex flex-col space-y-1">
            <Label className="text-base">Allowed Structures</Label>
            <span className="text-muted-foreground text-sm">
              Which escrow funding structures are available for transactions in
              this group.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["full", "deposit", "milestone", "partial"] as const).map(
              (structure) => {
                const allowed =
                  ((categoryGroup as any).allowedEscrowStructures as string[]) ??
                  ["full"];
                const isAllowed = allowed.includes(structure);
                return (
                  <Badge
                    key={structure}
                    variant={isAllowed ? "default" : "outline"}
                    className="cursor-pointer select-none capitalize"
                    onClick={() => {
                      const next = isAllowed
                        ? allowed.filter((s) => s !== structure)
                        : [...allowed, structure];
                      if (next.length === 0) return; // must have at least one
                      updateGroup(
                        {
                          path: { id: categoryGroup._id },
                          body: { allowedEscrowStructures: next } as any,
                        },
                        {
                          onSuccess: () =>
                            toast.success("Allowed escrow structures updated"),
                          onError: (err: any) =>
                            toast.error(err.message || "Failed to update"),
                        },
                      );
                    }}
                  >
                    {structure}
                  </Badge>
                );
              },
            )}
            {isPending && (
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-base">Default Structure</Label>
          <Select
            value={
              (categoryGroup as any).defaultEscrowStructure ?? "full"
            }
            onValueChange={(v) => {
              updateGroup(
                {
                  path: { id: categoryGroup._id },
                  body: { defaultEscrowStructure: v } as any,
                },
                {
                  onSuccess: () =>
                    toast.success("Default escrow structure updated"),
                  onError: (err: any) =>
                    toast.error(err.message || "Failed to update"),
                },
              );
            }}
            disabled={isPending}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                ((categoryGroup as any).allowedEscrowStructures as string[]) ?? [
                  "full",
                ]
              ).map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="flex items-center justify-between space-x-2 opacity-60">
          <div className="flex flex-col space-y-1">
            <Label
              htmlFor="requires-compliance"
              className="cursor-not-allowed text-base"
            >
              Requires Compliance
            </Label>
            <span className="text-muted-foreground text-sm">
              Transactions are subject to additional compliance and regulatory
              checks.
            </span>
          </div>
          <Switch
            id="requires-compliance"
            checked={categoryGroup.requiresCompliance}
            disabled={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
