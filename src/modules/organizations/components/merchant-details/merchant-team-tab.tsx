import { api } from "@/lib/api";
import { MerchantUsersTable } from "./merchant-users-table";

interface MerchantTeamTabProps {
  merchantId: string;
}

export function MerchantTeamTab({ merchantId }: MerchantTeamTabProps) {
  const { data, isLoading } = api.admin.organizations.members.useQuery(
    { path: { id: merchantId } },
    { enabled: !!merchantId },
  );

  return <MerchantUsersTable data={data ?? []} isLoading={isLoading} />;
}
