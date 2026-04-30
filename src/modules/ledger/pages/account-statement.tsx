import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/utils";
import { useParams } from "react-router-dom";
import {
  statementColumns,
  type StatementEntry,
} from "../components/account-statement/columns";
import type { LedgerAccount } from "../types";
import { getAccountTypeStyle } from "../utils";

export default function AccountStatementPage() {
  const { code } = useParams<{ code: string }>();
  const accountCode = decodeURIComponent(code ?? "");

  const { data: rawAccount, isLoading: isLoadingAccount } =
    api.admin.ledger.account.useQuery(
      { path: { code: accountCode } },
      { enabled: !!accountCode },
    );

  const { data: rawStatement, isLoading: isLoadingStatement } =
    api.admin.ledger.statement.useQuery(
      { path: { code: accountCode }, query: {} },
      { enabled: !!accountCode },
    );

  const account = rawAccount as unknown as LedgerAccount | undefined;

  useAppBreadcrumbLabel(code!, account?.description);

  const statementData = (rawStatement ?? []) as unknown as Array<{
    _id: string;
    entryDate: string;
    description: string;
    entryType: string;
    lines: Array<{ accountCode: string; debit: number; credit: number; currency: string }>;
    status: string;
  }>;

  const entries: StatementEntry[] = statementData
    .filter((je) => je.lines?.some((l) => l.accountCode === accountCode))
    .map((je) => {
      const line = je.lines.find((l) => l.accountCode === accountCode);
      return {
        id: je._id,
        date: je.entryDate,
        description: je.description,
        entryType: je.entryType,
        debit: line && line.debit > 0 ? line.debit : null,
        credit: line && line.credit > 0 ? line.credit : null,
        currency: line?.currency ?? "NGN",
        status: je.status as "POSTED" | "REVERSED",
      };
    });

  if (isLoadingAccount) {
    return <PageLoader />;
  }

  if (!account) {
    return (
      <Page>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            Account not found: {accountCode}
          </p>
        </div>
      </Page>
    );
  }

  const typeStyle = getAccountTypeStyle(account.accountType);

  return (
    <Page>
      <PageHeader
        title={account.description}
        endContent={
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${typeStyle.bg} ${typeStyle.text} font-medium`}
            >
              {account.accountType}
            </Badge>
            <span className="text-2xl font-bold">
              {formatCurrency(account.balance, account.currency, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        }
      />

      {/* Account info card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Account Code
              </p>
              <p className="mt-1 font-mono text-sm">{account.accountCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Entity Type
              </p>
              <p className="mt-1 text-sm capitalize">
                {account.entityType.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Currency
              </p>
              <p className="mt-1 text-sm">{account.currency}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Status
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    account.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">
                  {account.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Last Internal Reconciliation
              </p>
              <p className="mt-1 text-sm">
                {account.internalReconciledUpTo
                  ? formatDateTime(account.internalReconciledUpTo)
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Last External Reconciliation
              </p>
              <p className="mt-1 text-sm">
                {account.externalReconciledUpTo
                  ? formatDateTime(account.externalReconciledUpTo)
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statement table */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={statementColumns}
            data={entries}
            isLoading={isLoadingStatement}
            emptyContent="No journal entries for this account."
          />
        </CardContent>
      </Card>
    </Page>
  );
}
