import { api } from "@/lib/api";
import { MerchantUsersTable } from "./merchant-users-table";
import type { MerchantUser } from "./merchant-users-table/columns";

interface MerchantTeamTabProps {
  merchantId: string;
}

export function MerchantTeamTab({ merchantId }: MerchantTeamTabProps) {
  const { data, isLoading } = api.admin.organizations.members.useQuery(
    { path: { id: merchantId } },
    { enabled: !!merchantId },
  );

  const users = (data as unknown as MerchantUser[]) ?? [];

  return <MerchantUsersTable data={users} isLoading={isLoading} />;
}
