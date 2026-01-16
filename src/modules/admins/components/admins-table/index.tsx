
import { DataTable } from "@/components/shared/data-table";
import { adminColumns } from "./columns";
import type { AdminUser } from "../../types";

interface AdminsTableProps {
  data: AdminUser[];
  isLoading?: boolean;
}

export function AdminsTable({ data, isLoading = false }: AdminsTableProps) {
  return (
    <DataTable
      columns={adminColumns}
      data={data}
      isLoading={isLoading}

      emptyContent={
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No admins found</p>
        </div>
      }
    />
  );
}
