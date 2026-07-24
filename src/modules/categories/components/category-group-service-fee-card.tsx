import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import type {
  CategoryGroupDto,
  ServiceFeeConfigDto,
} from "@/lib/api/generated/types.gen";
import { toast } from "sonner";
import { ServiceFeeConfigEditor } from "./service-fee-config-editor";

interface CategoryGroupServiceFeeCardProps {
  categoryGroup: CategoryGroupDto;
}

/**
 * Two-fee-model group defaults: the escrow fee (buyer-paid percentage, added
 * on top; 0% = disabled) and the service charge (seller-paid deduction —
 * per-unit for commodity groups, percentage otherwise). Categories can
 * override each slot individually. The legacy single serviceFeeConfig keeps
 * governing live pricing until the cutover deploy; these slots are seeded
 * from it by migration and become authoritative then.
 */
export function CategoryGroupServiceFeeCard({
  categoryGroup,
}: CategoryGroupServiceFeeCardProps) {
  const escrowFee = categoryGroup.escrowFeeConfig as
    | Partial<ServiceFeeConfigDto>
    | undefined;
  const serviceCharge = categoryGroup.serviceChargeConfig as
    | Partial<ServiceFeeConfigDto>
    | undefined;

  const { mutate: updateGroup, isPending } =
    api.categoryGroups.update.useMutation();

  const save =
    (field: "escrowFeeConfig" | "serviceChargeConfig", message: string) =>
    (updated: ServiceFeeConfigDto) => {
      updateGroup(
        {
          path: { id: categoryGroup._id },
          body: { [field]: updated },
        },
        {
          onSuccess: () => toast.success(message),
          onError: (err: any) =>
            toast.error(err.message || "Failed to update the fee config"),
        },
      );
    };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Escrow Fee</CardTitle>
          <CardDescription>
            Buyer-paid percentage added on top of the payment as a visible
            line item. 0% disables it. Changes apply to new orders only —
            every order snapshots its fee config at creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceFeeConfigEditor
            slot="escrowFee"
            value={escrowFee}
            onSave={save("escrowFeeConfig", "Escrow fee updated")}
            isPending={isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Charge</CardTitle>
          <CardDescription>
            Seller-paid deduction from earnings, disclosed to the seller as
            the Vesslr fee: per-unit for commodity groups, percentage
            otherwise. Changes apply to new orders only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceFeeConfigEditor
            slot="serviceCharge"
            value={serviceCharge}
            onSave={save("serviceChargeConfig", "Service charge updated")}
            isPending={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
