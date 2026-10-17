import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { CopyButton } from "@/components/shared/copy-button";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { AdminProvidusSettlementDetailDto } from "@/lib/api/generated";
import { cn, formatDateTime } from "@/lib/utils";
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import {
  FIELD_LABEL,
  RESULT,
  STATUS,
  errorMessage,
  formatNaira,
} from "../lib/format";

/**
 * One Providus settlement: what the webhook told us, what Providus's lookup
 * says now, and the raw payloads behind both. Re-verify refreshes only the
 * reconciliation result; it never changes the status or moves money.
 */
export default function ProvidusSettlementDetailPage() {
  const { settlementId = "" } = useParams<{ settlementId: string }>();
  const { data: settlement, isLoading } =
    api.admin.providus.settlement.useQuery({ path: { id: settlementId } });

  if (isLoading || !settlement) {
    return (
      <Page>
        <BackLink />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Page>
    );
  }

  const status = STATUS[settlement.status];
  const rec = settlement.reconciliation;
  const result = RESULT[rec?.result ?? "unchecked"];

  return (
    <Page>
      <BackLink />
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-2.5">
            {formatNaira(settlement.settledAmount, settlement.currency)}
            <Badge variant="outline" className={cn("font-medium", status.tint)}>
              {status.label}
            </Badge>
            <Badge variant="outline" className={cn("font-medium", result.tint)}>
              {result.label}
            </Badge>
          </span>
        }
        description={
          <>
            {result.description}
            {rec && (
              <>
                {" "}
                Last checked {formatDateTime(rec.checkedAt)}
                {rec.lookedUpBy === "session_id" && rec.provider && " by session ID"}, {rec.attempts}{" "}
                {rec.attempts === 1 ? "lookup" : "lookups"} so far.
              </>
            )}
          </>
        }
        endContent={<ReverifyButton id={settlement.id} />}
      />

      {rec?.error && (
        <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-md border px-4 py-3 text-sm">
          {rec.error}
        </div>
      )}

      <SummaryCard settlement={settlement} />
      <ComparisonCard settlement={settlement} />
      <RawPayloads settlement={settlement} />
    </Page>
  );
}

function BackLink() {
  return (
    <Link
      to="/providus-settlements"
      className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
    >
      <ArrowLeftIcon className="size-3.5" />
      All settlements
    </Link>
  );
}

function ReverifyButton({ id }: { id: string }) {
  const { mutate, isPending } = api.admin.providus.reverify.useMutation();
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        mutate(
          { path: { id } },
          {
            onSuccess: (res) =>
              toast.success(
                `Re-verified: ${RESULT[res?.reconciliation?.result ?? "unchecked"].label}`,
              ),
            onError: (err) => toast.error(errorMessage(err)),
          },
        )
      }
    >
      {isPending ? (
        <Spinner className="size-4" />
      ) : (
        <RefreshCwIcon className="size-4" />
      )}
      Re-verify with Providus
    </Button>
  );
}

function Field({
  label,
  value,
  mono,
  copy,
}: {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
  copy?: string;
}) {
  return (
    <div className="min-w-0 space-y-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd
        className={cn(
          "flex items-center gap-1 text-sm break-all",
          mono && "font-mono tabular-nums",
        )}
      >
        {value ?? "-"}
        {copy && <CopyButton value={copy} className="size-6" />}
      </dd>
    </div>
  );
}

function SummaryCard({
  settlement: s,
}: {
  settlement: AdminProvidusSettlementDetailDto;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Settlement</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Settlement ID"
            value={s.settlementId}
            mono
            copy={s.settlementId}
          />
          <Field
            label="Session ID"
            value={s.sessionId}
            mono
            copy={s.sessionId}
          />
          <Field label="Account" value={s.accountNumber} mono />
          <Field
            label="Transaction amount"
            value={formatNaira(s.transactionAmount, s.currency)}
          />
          <Field
            label="Fee + VAT"
            value={`${formatNaira(s.feeAmount ?? 0, s.currency)} + ${formatNaira(s.vatAmount ?? 0, s.currency)}`}
          />
          <Field label="Settled amount" value={formatNaira(s.settledAmount, s.currency)} />
          <Field label="Sender" value={s.sourceAccountName} />
          <Field label="Sender account" value={s.sourceAccountNumber} mono />
          <Field
            label="Sender bank"
            value={
              s.reconciliation?.provider?.sourceBankCode
                ? `${s.sourceBankName ?? "-"} (${s.reconciliation.provider.sourceBankCode})`
                : s.sourceBankName
            }
          />
          <Field label="Transaction time" value={formatDateTime(s.tranDateTime)} />
          <Field label="Received" value={formatDateTime(s.createdAt)} />
          {s.processedAt && (
            <Field label="Processed" value={formatDateTime(s.processedAt)} />
          )}
          {s.rejectionReason && (
            <Field label="Rejection reason" value={s.rejectionReason} />
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

const flag = (value: number | undefined) =>
  value == null ? "-" : value === 1 ? "Yes" : "No";

function ComparisonCard({
  settlement: s,
}: {
  settlement: AdminProvidusSettlementDetailDto;
}) {
  const p = s.reconciliation?.provider;
  const mismatches = new Set(s.reconciliation?.mismatches ?? []);

  const rows: { key: string; ours: string; theirs: string }[] = [
    { key: "settlementId", ours: s.settlementId, theirs: p?.settlementId ?? "-" },
    { key: "sessionId", ours: s.sessionId ?? "-", theirs: p?.sessionId ?? "-" },
    { key: "accountNumber", ours: s.accountNumber ?? "-", theirs: p?.accountNumber ?? "-" },
    {
      key: "transactionAmount",
      ours: formatNaira(s.transactionAmount, s.currency),
      theirs: formatNaira(p?.transactionAmount, p?.currency ?? s.currency),
    },
    {
      key: "settledAmount",
      ours: formatNaira(s.settledAmount, s.currency),
      theirs: formatNaira(p?.settledAmount, p?.currency ?? s.currency),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Webhook vs Providus lookup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!p ? (
          <p className="text-muted-foreground text-sm">
            No lookup result yet.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Webhook</TableHead>
                  <TableHead>Providus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const differs = mismatches.has(row.key);
                  return (
                    <TableRow
                      key={row.key}
                      className={cn(differs && "bg-destructive/5")}
                    >
                      <TableCell className="text-sm whitespace-normal">
                        {FIELD_LABEL[row.key]}
                        {differs && (
                          <span className="text-destructive ml-2 text-xs font-medium">
                            Differs
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm break-all whitespace-normal tabular-nums">
                        {row.ours}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-mono text-sm break-all whitespace-normal tabular-nums",
                          differs && "text-destructive font-medium",
                        )}
                      >
                        {row.theirs}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Posted at Providus" value={flag(p.postFlag)} />
              <Field
                label="Our acknowledgement seen"
                value={flag(p.notificationAcknowledgement)}
              />
              <Field
                label="Providus transaction time"
                value={formatDateTime(p.tranDateTime)}
              />
              <Field
                label="Providus settlement time"
                value={formatDateTime(p.settlementDateTime)}
              />
            </dl>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RawPayloads({
  settlement: s,
}: {
  settlement: AdminProvidusSettlementDetailDto;
}) {
  const [open, setOpen] = useState(false);
  const lookup = s.reconciliation?.raw;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">Raw payloads</CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide raw payload" : "Show raw payload"}
        </Button>
      </CardHeader>
      {open && (
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <RawBlock title="Webhook" value={s.raw} />
          <RawBlock title="Last Providus lookup" value={lookup} />
        </CardContent>
      )}
    </Card>
  );
}

function RawBlock({ title, value }: { title: string; value?: unknown }) {
  const text = value ? JSON.stringify(value, null, 2) : "";
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {text && <CopyButton value={text} className="size-7" />}
      </div>
      {text ? (
        <pre className="bg-muted max-h-96 overflow-auto rounded-md p-3 text-xs">
          {text}
        </pre>
      ) : (
        <p className="text-muted-foreground text-sm">None stored.</p>
      )}
    </div>
  );
}
