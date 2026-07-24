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

export function CategoryGroupServiceFeeCard({
  categoryGroup,
}: CategoryGroupServiceFeeCardProps) {
  const config = categoryGroup.serviceFeeConfig as
    | Partial<ServiceFeeConfigDto>
    | undefined;

  const { mutate: updateGroup, isPending } =
    api.categoryGroups.update.useMutation();

  const save = (updated: ServiceFeeConfigDto) => {
    updateGroup(
      {
        path: { id: categoryGroup._id },
        body: { serviceFeeConfig: updated },
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
          The default platform fee for this category group. Categories can
          override it individually. Changes apply to new orders only — every
          order snapshots its fee config at creation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ServiceFeeConfigEditor
          value={config}
          onSave={save}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
}
