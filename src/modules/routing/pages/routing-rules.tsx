import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { RoutingRuleDto } from "@/lib/api/generated";
import { PencilIcon, PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { ResolvePreviewCard } from "../components/resolve-preview-card";
import { RuleFormDialog } from "../components/rule-form-dialog";
import { formatProvider, matchLabel } from "../lib/format";

export default function RoutingRulesPage() {
  const { data, isLoading } = api.admin.routing.rules.useQuery({});
  const rules: RoutingRuleDto[] = data?.data ?? [];

  const { mutate: updateRule, isPending: isToggling } =
    api.admin.routing.update.useMutation();
  const { mutate: removeRule, isPending: isDeleting } =
    api.admin.routing.remove.useMutation();
  const { mutate: reload, isPending: isReloading } =
    api.admin.routing.reload.useMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RoutingRuleDto | null>(null);
  const [deleting, setDeleting] = useState<RoutingRuleDto | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (rule: RoutingRuleDto) => {
    setEditing(rule);
    setFormOpen(true);
  };

  const handleToggle = (rule: RoutingRuleDto, enabled: boolean) => {
    updateRule(
      { path: { id: rule._id }, body: { enabled } },
      {
        onSuccess: () =>
          toast.success(
            enabled
              ? `Rule ${matchLabel(rule)} enabled`
              : `Rule ${matchLabel(rule)} disabled; the router now ignores it`,
          ),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    removeRule(
      { path: { id: deleting._id } },
      {
        onSuccess: () => {
          toast.success(`Rule ${matchLabel(deleting)} deleted`);
          setDeleting(null);
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  const handleReload = () => {
    reload(
      {},
      {
        onSuccess: (res) =>
          toast.success(
            `Routing table reloaded: ${res?.data.rulesLoaded ?? 0} enabled rule(s) in memory`,
          ),
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <Page>
      <PageHeader
        title="Payment Routing"
        description="Which provider custodies each corridor. Most specific rule wins; an unrouted corridor fails loudly by design."
        endContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReload}
              disabled={isReloading}
            >
              <RefreshCwIcon
                className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`}
              />
              Reload table
            </Button>
            <Button onClick={openCreate}>
              <PlusIcon className="h-4 w-4" />
              New rule
            </Button>
          </div>
        }
      />

      <ResolvePreviewCard />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : rules.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
          The routing table is empty. Every payment corridor will fail with
          "no route" until a rule is created.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Custodian</TableHead>
              <TableHead>Lookup overrides</TableHead>
              <TableHead className="text-center">Specificity</TableHead>
              <TableHead className="text-center">Enabled</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow
                key={rule._id}
                className={rule.enabled ? "" : "opacity-50"}
              >
                <TableCell>
                  <MatchCell rule={rule} />
                </TableCell>
                <TableCell className="font-medium">
                  {formatProvider(rule.custodian)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  <OverridesCell rule={rule} />
                </TableCell>
                <TableCell className="text-center">
                  {rule.specificity}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={rule.enabled}
                    disabled={isToggling}
                    onCheckedChange={(next) => handleToggle(rule, next)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(rule)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleting(rule)}
                    >
                      <Trash2Icon className="text-destructive h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <RuleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rule={editing}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this routing rule?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `${matchLabel(deleting)} -> ${formatProvider(deleting.custodian)}. ` +
                  "Corridors it served fall through to a less specific rule, or fail with no route if none exists. Consider disabling instead if this is temporary."
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Delete rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}

function MatchCell({ rule }: { rule: RoutingRuleDto }) {
  const dims = [
    { label: "Currency", value: rule.matchCurrency },
    { label: "Country", value: rule.matchCountry },
    { label: "Region", value: rule.matchRegion },
  ].filter((d) => d.value);

  if (dims.length === 0) {
    return <Badge variant="outline">Catch-all</Badge>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {dims.map((d) => (
        <Badge key={d.label} variant="secondary">
          {d.label}: {d.value}
        </Badge>
      ))}
    </div>
  );
}

function OverridesCell({ rule }: { rule: RoutingRuleDto }) {
  const overrides = [
    rule.bankDirectoryProvider
      ? `Bank directory: ${formatProvider(rule.bankDirectoryProvider)}`
      : null,
    rule.accountResolutionProvider
      ? `Account resolution: ${formatProvider(rule.accountResolutionProvider)}`
      : null,
  ].filter(Boolean);
  if (overrides.length === 0) return <span>Same as custodian</span>;
  return (
    <div className="flex flex-col gap-0.5">
      {overrides.map((o) => (
        <span key={o}>{o}</span>
      ))}
    </div>
  );
}

function errorMessage(err: unknown): string {
  const message = (err as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message.join("; ");
  return message || "Request failed";
}
