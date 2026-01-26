import { getDisputes } from "@/lib/api/disputes";
import { DisputesTable } from "@/modules/disputes/components/disputes-table";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";

export function MerchantDisputesTab() {
  const { organization } = useOutletContext<{
    organization: { _id: string };
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["disputes", "merchant", organization._id],
    queryFn: () =>
      getDisputes({
        page: 1,
        limit: 10,
        respondent: organization._id,
      }),
  });

  return (
    <div className="space-y-6">
      <DisputesTable data={data?.data.docs || []} isLoading={isLoading} />
    </div>
  );
}
