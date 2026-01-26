// import { api } from "@/lib/api";
import { MerchantUsersTable } from "./merchant-users-table";

interface MerchantTeamTabProps {
  merchantId: string;
}

export function MerchantTeamTab({ merchantId }: MerchantTeamTabProps) {
  // TODO: Implement API endpoint for fetching organization users
  // const { data, isLoading } = api.admin.users.list.useQuery(...)

  // const users = ...
  const users: any[] = [];
  const isLoading = false;

  return <MerchantUsersTable data={users} isLoading={isLoading} />;
}
