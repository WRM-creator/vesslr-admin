import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/lib/api";
import * as React from "react";
import { toast } from "sonner";
import { PlatformBalancesCard } from "../components/platform-balances-card";
import { AccountsTable } from "../components/accounts-table";
import { JournalEntriesTable } from "../components/journal-entries-table";
import { ReconciliationTab } from "../components/reconciliation-tab";
import type {
  JournalEntry,
  LedgerAccount,
  ReconciliationRun,
} from "../types";

export default function LedgerPage() {
  const [activeTab, setActiveTab] = React.useState("accounts");

  // ── Real API queries ─────────────────────────────────────────────
  const {
    data: rawAccounts,
    isLoading: isLoadingAccounts,
  } = api.admin.ledger.accounts.useQuery({});

  const {
    data: rawEntries,
    isLoading: isLoadingEntries,
  } = api.admin.ledger.entries.useQuery({});

  const {
    data: rawRuns,
    isLoading: isLoadingRuns,
  } = api.admin.ledger.reconciliationRuns.useQuery({});

  // Cast API responses to local types (shapes match by design)
  const accounts = (rawAccounts ?? []) as unknown as LedgerAccount[];
  const entries = (rawEntries ?? []) as unknown as JournalEntry[];
  const runs = (rawRuns ?? []) as unknown as ReconciliationRun[];

  // ── Mutations ────────────────────────────────────────────────────
  const { mutate: reverseEntry } =
    api.admin.ledger.reverseEntry.useMutation();

  const { mutate: triggerInternal, isPending: isRunningInternal } =
    api.admin.ledger.triggerInternal.useMutation();

  const { mutate: triggerExternal, isPending: isRunningExternal } =
    api.admin.ledger.triggerExternal.useMutation();

  const handleReverse = (entryId: string) => {
    const reason = window.prompt("Reason for reversal:");
    if (!reason) return;

    reverseEntry(
      { path: { id: entryId }, body: { reason } },
      {
        onSuccess: () => toast.success("Entry reversed successfully"),
        onError: (err) =>
          toast.error("Failed to reverse entry", {
            description: err instanceof Error ? err.message : "Unknown error",
          }),
      },
    );
  };

  const handleRunInternal = () => {
    triggerInternal(
      {},
      {
        onSuccess: () => toast.success("Internal reconciliation started"),
        onError: (err) =>
          toast.error("Failed to start reconciliation", {
            description: err instanceof Error ? err.message : "Unknown error",
          }),
      },
    );
  };

  const handleRunExternal = () => {
    triggerExternal(
      {},
      {
        onSuccess: () => toast.success("External reconciliation started"),
        onError: (err) =>
          toast.error("Failed to start reconciliation", {
            description: err instanceof Error ? err.message : "Unknown error",
          }),
      },
    );
  };

  return (
    <Page>
      <PageHeader
        title="Platform Ledger"
        description="Double-entry accounting ledger and reconciliation"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <PlatformBalancesCard
            accounts={accounts}
            isLoading={isLoadingAccounts}
          />
          <AccountsTable data={accounts} isLoading={isLoadingAccounts} />
        </TabsContent>

        <TabsContent value="journal">
          <JournalEntriesTable
            data={entries}
            isLoading={isLoadingEntries}
            onReverse={handleReverse}
          />
        </TabsContent>

        <TabsContent value="reconciliation">
          <ReconciliationTab
            runs={runs}
            isLoading={isLoadingRuns}
            onRunInternal={handleRunInternal}
            onRunExternal={handleRunExternal}
          />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
