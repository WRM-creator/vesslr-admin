import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
