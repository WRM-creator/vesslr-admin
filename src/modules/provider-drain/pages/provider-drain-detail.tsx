import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import type {
  DrainItemDto,
  DrainVaultDto,
  ProviderDrainDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ArrowLeftIcon, RotateCcwIcon } from "lucide-react";
import {
  DRAIN_STATUS,
  GAP_REASON,
  ITEM_STATUS,
  errorMessage,
  formatProvider,
} from "../lib/format";

/** While the engine works, keep the page fresh without a manual reload. */
const POLL_MS: Partial<Record<ProviderDrainDto["status"], number>> = {
  scanning: 1_500,
  sweeping: 4_000,
};

type ItemTab = "all" | DrainItemDto["status"];

/**
 * One drain, run end to end from this page: freeze intake, scan coverage and
 * cost, sweep (transfer + platform-paid fee reimbursement), watch orgs retire,
 * complete. Every action is guarded server-side; this page narrates state.
 */
export default function ProviderDrainDetailPage() {
  const { drainId = "" } = useParams<{ drainId: string }>();

  const { data, isLoading } = api.admin.providerDrain.detail.useQuery(
    { path: { id: drainId } },
    {
      refetchInterval: (query) => {
        const status = query.state.data?.data?.status;
        return (status && POLL_MS[status]) || false;
      },
    },
  );
  const drain = data?.data;

  if (isLoading || !drain) {
    return (
      <Page>
        <BackLink />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Page>
    );
  }

  const status = DRAIN_STATUS[drain.status];

  return (
    <Page>
      <BackLink />
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            Drain {formatProvider(drain.provider)}
            <Badge variant="outline" className={cn("font-medium", status.tint)}>
              {(drain.status === "scanning" || drain.status === "sweeping") && (
                <Spinner className="mr-1 size-3" />
              )}
              {status.label}
            </Badge>
          </span>
        }
        description={stageDescription(drain)}
        endContent={<DrainActions drain={drain} />}
      />

      <CostPanel drain={drain} />
      <VaultsPanel drain={drain} />
      <ItemsPanel drain={drain} />
      <EventsPanel drain={drain} />
    </Page>
  );
}

function BackLink() {
  return (
    <Link
      to="/provider-drain"
      className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
    >
      <ArrowLeftIcon className="size-3.5" />
      All drains
    </Link>
  );
}

/** One sentence telling the admin where the drain is and what happens next. */
function stageDescription(drain: ProviderDrainDto): string {
  const c = drain.itemCounts;
  switch (drain.status) {
    case "draft":
      return "Draft. Nothing has changed yet; freezing intake disables the provider's routing rules and refuses new deposits.";
    case "frozen":
      return "Intake is off. Run the coverage scan to plan the sweep and see what it will cost.";
    case "scanning":
      return "Walking every org with a balance at this provider. This page refreshes itself.";
    case "checked":
      return c.blocked > 0
        ? `Scan complete with ${c.blocked} blocked item(s) — fix the gaps and re-scan, or sweep what is coverable.`
        : "Scan complete. Review the plan and cost below, then start the sweep.";
    case "sweeping":
      return `Sweeping at ${drain.pacePerTick} item(s) per minute. Orgs retire automatically as their balances are verified zero.`;
    case "paused":
      return "Paused. In-flight items still settle; resume or re-scan when ready.";
    case "completed":
      return "Done. Every balance moved, every touched org retired. Routing rules stay disabled.";
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function DrainActions({ drain }: { drain: ProviderDrainDto }) {
  const id = drain.id;
  const [confirming, setConfirming] = useState<
    "freeze" | "sweep" | "migrate-vaults" | "complete" | null
  >(null);

  const { mutate: freeze, isPending: freezing } =
    api.admin.providerDrain.freeze.useMutation();
  const { mutate: scan, isPending: scanning } =
    api.admin.providerDrain.scan.useMutation();
  const { mutate: sweep, isPending: sweeping } =
    api.admin.providerDrain.sweep.useMutation();
  const { mutate: pause, isPending: pausing } =
    api.admin.providerDrain.pause.useMutation();
  const { mutate: migrateVaults, isPending: migrating } =
    api.admin.providerDrain.migrateVaults.useMutation();
  const { mutate: complete, isPending: completing } =
    api.admin.providerDrain.complete.useMutation();

  const act = (
    mutate: typeof freeze,
    success: string,
  ) =>
    mutate(
      { path: { id } },
      {
        onSuccess: () => {
          toast.success(success);
          setConfirming(null);
        },
        onError: (err) => {
          toast.error(errorMessage(err));
          setConfirming(null);
        },
      },
    );

  const c = drain.itemCounts;
  const inFlight = c.pending + c.transferring + c.compensating;
  const orgItemsDone = inFlight === 0 && c.blocked + c.failed + c.stuck === 0;
  const vaultsUnfinished = drain.vaults.filter(
    (v) => v.status !== "done",
  ).length;
  const vaultsInFlight = drain.vaults.some(
    (v) => v.status === "pending" || v.status === "transferring",
  );
  const allDone = orgItemsDone && vaultsUnfinished === 0;
  const estimate = drain.totals
    .map(
      (t) =>
        `${formatCurrency(t.estimatedFeeMinor, t.currency, { maximumFractionDigits: 2 })}${t.unquotableCount > 0 ? ` (+${t.unquotableCount} unquotable)` : ""}`,
    )
    .join(", ");

  return (
    <span className="flex items-center gap-2">
      {drain.status === "draft" && (
        <Button size="sm" onClick={() => setConfirming("freeze")}>
          Freeze intake
        </Button>
      )}
      {(drain.status === "frozen" ||
        drain.status === "checked" ||
        drain.status === "paused") && (
        <Button
          variant={drain.status === "frozen" ? "default" : "outline"}
          size="sm"
          disabled={scanning}
          onClick={() =>
            act(scan, "Coverage scan started")
          }
        >
          {drain.status === "frozen" ? "Run coverage scan" : "Re-scan"}
        </Button>
      )}
      {(drain.status === "checked" || drain.status === "paused") && (
        <Button
          size="sm"
          disabled={sweeping || c.pending === 0}
          onClick={() => setConfirming("sweep")}
        >
          {drain.status === "paused" ? "Resume sweep" : "Start sweep"}
        </Button>
      )}
      {drain.status === "sweeping" && (
        <Button
          variant="outline"
          size="sm"
          disabled={pausing}
          onClick={() => act(pause, "Sweep paused; in-flight items still settle")}
        >
          Pause
        </Button>
      )}
      {(drain.status === "sweeping" ||
        drain.status === "checked" ||
        drain.status === "paused") &&
        orgItemsDone &&
        !vaultsInFlight && (
          <Button
            variant={drain.vaults.length === 0 ? "default" : "outline"}
            size="sm"
            disabled={migrating}
            onClick={() => setConfirming("migrate-vaults")}
          >
            {drain.vaults.length > 0 ? "Re-run vault migration" : "Migrate vaults"}
          </Button>
        )}
      {(drain.status === "sweeping" ||
        drain.status === "checked" ||
        drain.status === "paused") &&
        allDone && (
          <Button size="sm" onClick={() => setConfirming("complete")}>
            Complete drain
          </Button>
        )}

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirming === "freeze" && "Freeze intake at this provider?"}
              {confirming === "sweep" &&
                (drain.status === "paused" ? "Resume the sweep?" : "Start the sweep?")}
              {confirming === "migrate-vaults" && "Migrate the escrow pots?"}
              {confirming === "complete" && "Complete this drain?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming === "freeze" &&
                `Every routing rule offering ${formatProvider(drain.provider)} is disabled and new deposits are refused platform-wide. Payouts and the sweep keep working. Customers keep seeing their wallet until it is drained and retired.`}
              {confirming === "sweep" &&
                `${drain.itemCounts.pending} item(s) will transfer to surviving wallets at ${drain.pacePerTick} per minute. The platform pays the fees${estimate ? ` — estimated ${estimate}` : ""} — and reimburses each org so it ends with exactly what it started with.`}
              {confirming === "migrate-vaults" &&
                `Escrows still holding money at ${formatProvider(drain.provider)} are re-stamped to a surviving custodian first, then each currency's platform pot moves in one transfer. The platform pays the transfer fees; a fee-margin residue becomes the next run.`}
              {confirming === "complete" &&
                "Marks the drain finished. Every item is done, every touched org's wallet is retired, and the escrow pots are migrated; routing rules stay disabled."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={freezing || sweeping || migrating || completing}
              onClick={() => {
                if (confirming === "freeze")
                  act(freeze, "Intake frozen; routing rules disabled");
                if (confirming === "sweep") act(sweep, "Sweep running");
                if (confirming === "migrate-vaults")
                  act(migrateVaults, "Vault migration running");
                if (confirming === "complete") act(complete, "Drain completed");
              }}
            >
              {confirming === "freeze" && "Freeze intake"}
              {confirming === "sweep" &&
                (drain.status === "paused" ? "Resume" : "Start sweep")}
              {confirming === "migrate-vaults" && "Migrate pots"}
              {confirming === "complete" && "Complete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </span>
  );
}

// ─── Cost / plan panel ───────────────────────────────────────────────────────

/**
 * The money view, per currency: what the scan found, what moving it was
 * estimated to cost the platform, and what it has actually cost so far.
 * Never summed across currencies.
 */
function CostPanel({ drain }: { drain: ProviderDrainDto }) {
  const currencies = [
    ...new Set([
      ...drain.totals.map((t) => t.currency),
      ...drain.actuals.map((a) => a.currency),
    ]),
  ].sort();
  if (currencies.length === 0) return null;

  const money = (v: number | null | undefined, currency: string) =>
    formatCurrency(v, currency, { maximumFractionDigits: 2 });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Balance to move</TableHead>
            <TableHead className="text-right">Estimated platform cost</TableHead>
            <TableHead className="text-right">Actual cost so far</TableHead>
            <TableHead className="text-right">Swept</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency) => {
            const total = drain.totals.find((t) => t.currency === currency);
            const actual = drain.actuals.find((a) => a.currency === currency);
            return (
              <TableRow key={currency}>
                <TableCell className="font-medium">{currency}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {total ? money(total.balanceMinor, currency) : "-"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {total ? (
                    <>
                      {money(total.estimatedFeeMinor, currency)}
                      {total.unquotableCount > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground ml-1.5 cursor-default text-xs">
                              +{total.unquotableCount} unquotable
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Items whose provider cannot quote fees up front —
                            their cost is NOT in this estimate. Actuals are
                            recorded as each item completes.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {actual ? money(actual.actualFeeMinor, currency) : "-"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {actual ? money(actual.sweptMinor, currency) : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Escrow pots (vault migration) ───────────────────────────────────────────

/**
 * The platform's escrow pots at the dying provider, one move per currency per
 * pass. Escrows are re-stamped to the survivor BEFORE each pot moves, so
 * disbursements never wait on the transfer. Empty until Migrate vaults runs.
 */
function VaultsPanel({ drain }: { drain: ProviderDrainDto }) {
  const { mutate: retryVault } = api.admin.providerDrain.retryVault.useMutation();
  if (drain.vaults.length === 0) return null;

  const retry = (vault: DrainVaultDto) =>
    retryVault(
      { path: { id: drain.id, vaultId: vault.id } },
      {
        onSuccess: () =>
          toast.success(`${vault.currency} pot move queued again`),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Escrow pots</h3>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Currency</TableHead>
              <TableHead>Moves to</TableHead>
              <TableHead className="text-right">Pot</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Residue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {drain.vaults.map((vault) => (
              <VaultRow key={vault.id} vault={vault} onRetry={retry} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function VaultRow({
  vault,
  onRetry,
}: {
  vault: DrainVaultDto;
  onRetry: (vault: DrainVaultDto) => void;
}) {
  const status = ITEM_STATUS[vault.status];
  const note =
    vault.status === "blocked" && vault.gapReason
      ? "No surviving custodian is routed for this currency."
      : vault.lastError;
  const money = (v: number | null | undefined) =>
    formatCurrency(v, vault.currency, { maximumFractionDigits: 2 });

  return (
    <TableRow>
      <TableCell className="font-medium">
        {vault.currency}
        {vault.pass > 1 && (
          <span className="text-muted-foreground ml-1.5 text-xs">
            pass {vault.pass}
          </span>
        )}
        {(vault.escrowsRestamped ?? 0) > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground ml-2 cursor-default text-xs">
                {vault.escrowsRestamped} escrow(s) re-stamped
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Open escrows now settle from the surviving custodian's pot —
              re-stamped before the money moved.
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        {vault.targetProvider ? formatProvider(vault.targetProvider) : "-"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {money(vault.balanceMinor)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {vault.receivedMinor != null ? money(vault.receivedMinor) : "-"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {vault.feeMinor != null ? (
          money(vault.feeMinor)
        ) : vault.estimatedFeeMinor != null ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground cursor-default">
                ≈ {money(vault.estimatedFeeMinor)}
              </span>
            </TooltipTrigger>
            <TooltipContent>Estimated; actuals record on completion.</TooltipContent>
          </Tooltip>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {vault.residualMinor != null && vault.residualMinor > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">{money(vault.residualMinor)}</span>
            </TooltipTrigger>
            <TooltipContent>
              Left behind by the fee margin — re-run Migrate vaults to sweep
              it, or recover it at provider account closure.
            </TooltipContent>
          </Tooltip>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <Badge
            variant="outline"
            className={cn("w-fit font-medium", status.tint)}
          >
            {status.label}
          </Badge>
          {note && (
            <span
              className="text-muted-foreground max-w-64 truncate text-xs"
              title={note}
            >
              {note}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {(vault.status === "failed" || vault.status === "stuck") && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onRetry(vault)}
          >
            <RotateCcwIcon className="size-3.5" />
            Retry
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

// ─── Items ───────────────────────────────────────────────────────────────────

function ItemsPanel({ drain }: { drain: ProviderDrainDto }) {
  const [tab, setTab] = useState<ItemTab>("all");
  const [page, setPage] = useState(1);
  const c = drain.itemCounts;
  const total =
    c.blocked + c.pending + c.transferring + c.compensating + c.done + c.failed + c.stuck;

  const { data, isLoading } = api.admin.providerDrain.items.useQuery(
    {
      path: { id: drain.id },
      query: {
        ...(tab !== "all" ? { status: tab } : {}),
        page,
        pageSize: 25,
      },
    },
    {
      refetchInterval: POLL_MS[drain.status] || false,
    },
  );
  const items = data?.data?.items ?? [];
  const itemsTotal = data?.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(itemsTotal / 25));

  const { mutate: retryItem } = api.admin.providerDrain.retryItem.useMutation();
  const retry = (item: DrainItemDto) =>
    retryItem(
      { path: { id: drain.id, itemId: item.id } },
      {
        onSuccess: () =>
          toast.success(
            `${item.orgName ?? item.orgId} / ${item.currency} queued again`,
          ),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );

  const tabs: Array<{ value: ItemTab; label: string; count?: number }> = [
    { value: "all", label: "All", count: total },
    { value: "pending", label: "Pending", count: c.pending },
    { value: "blocked", label: "Blocked", count: c.blocked },
    { value: "done", label: "Done", count: c.done },
    { value: "failed", label: "Failed", count: c.failed },
    { value: "stuck", label: "Stuck", count: c.stuck },
  ];

  if (total === 0) {
    return (
      <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
        {drain.status === "draft" || drain.status === "frozen"
          ? "No items yet — the coverage scan builds one per org and currency with a balance."
          : "The scan found no balances at this provider."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as ItemTab);
          setPage(1);
        }}
      >
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label} ({t.count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
          Nothing here right now.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Reimbursed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <ItemRow key={item.id} item={item} onRetry={retry} />
            ))}
          </TableBody>
        </Table>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground tabular-nums">
            {page} / {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  onRetry,
}: {
  item: DrainItemDto;
  onRetry: (item: DrainItemDto) => void;
}) {
  const status = ITEM_STATUS[item.status];
  const note =
    item.status === "blocked" && item.gapReason
      ? GAP_REASON[item.gapReason]
      : item.lastError;
  const money = (v: number | null | undefined) =>
    formatCurrency(v, item.currency, { maximumFractionDigits: 2 });

  return (
    <TableRow>
      <TableCell className="font-medium">
        {item.orgName ?? item.orgId}
        <span className="text-muted-foreground ml-2 text-xs">
          Wallet {item.sourceWalletIndex}
          {item.targetWalletIndex != null && ` → ${item.targetWalletIndex}`}
        </span>
      </TableCell>
      <TableCell>
        {item.currency}
        {item.pass > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground ml-1.5 cursor-default text-xs">
                pass {item.pass}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Fee margins can leave a small residue; a re-scan sweeps it as a
              new pass.
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {money(item.balanceMinor)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {item.amountMinor != null ? money(item.amountMinor) : "-"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {item.compensationDueMinor != null
          ? money(item.compensationDueMinor)
          : "-"}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <Badge
            variant="outline"
            className={cn("w-fit font-medium", status.tint)}
          >
            {status.label}
          </Badge>
          {note && (
            <span className="text-muted-foreground max-w-64 truncate text-xs" title={note}>
              {note}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {(item.status === "failed" || item.status === "stuck") && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onRetry(item)}
          >
            <RotateCcwIcon className="size-3.5" />
            Retry
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

// ─── Events ──────────────────────────────────────────────────────────────────

function EventsPanel({ drain }: { drain: ProviderDrainDto }) {
  if (drain.events.length === 0) return null;
  const events = [...drain.events].reverse();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Activity</h3>
      <div className="divide-y rounded-md border">
        {events.map((event, i) => (
          <div
            key={`${event.at}-${i}`}
            className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <span className="font-medium">
                {event.action.split("_").join(" ")}
              </span>
              {event.detail && (
                <span className="text-muted-foreground ml-2 break-words">
                  {event.detail}
                </span>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground shrink-0 cursor-default text-xs tabular-nums">
                  {formatDistanceToNowStrict(new Date(event.at), {
                    addSuffix: true,
                  })}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {format(new Date(event.at), "PPpp")}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
