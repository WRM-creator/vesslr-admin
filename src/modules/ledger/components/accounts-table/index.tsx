import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table/data-table";
import { useNavigate } from "react-router-dom";
import type { LedgerAccount } from "../../types";
import { accountsColumns } from "./columns";

interface AccountsTableProps {
  data: LedgerAccount[];
  isLoading?: boolean;
}

export function AccountsTable({ data, isLoading }: AccountsTableProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={accountsColumns}
          data={data}
          isLoading={isLoading}
          emptyContent="No ledger accounts found."
          onRowClick={(row) =>
            navigate(
              `/ledger/accounts/${encodeURIComponent(row.original.accountCode)}`,
            )
          }
        />
      </CardContent>
    </Card>
  );
}
