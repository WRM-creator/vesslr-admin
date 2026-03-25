import { DataTable } from "@/components/shared/data-table";
import type { MemberResponseDto } from "@/lib/api/generated/types.gen";
import { merchantUserColumns } from "./columns";

interface MerchantUsersTableProps {
  data: MemberResponseDto[];
  isLoading?: boolean;
}

export function MerchantUsersTable({
  data,
  isLoading = false,
}: MerchantUsersTableProps) {
  return (
    <div>
      <DataTable
        columns={merchantUserColumns}
        data={data}
        isLoading={isLoading}
        emptyContent={
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No team members found.</p>
          </div>
        }
      />
    </div>
  );
}
