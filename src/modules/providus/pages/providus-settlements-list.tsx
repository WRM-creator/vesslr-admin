import { useState } from "react";
import { Link } from "react-router-dom";

import { DataPagination } from "@/components/shared/data-pagination";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { AdminProvidusSettlementDto } from "@/lib/api/generated";
import { cn, formatDateTime } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import {
  RESULT,
  RESULT_ORDER,
  STATUS,
  formatNaira,
  type ResultFilter,
} from "../lib/format";

const PAGE_SIZE = 25;

type StatusFilter = AdminProvidusSettlementDto["status"] | "all";

/**
 * Every settlement Providus notified us of, newest first, with what
 * Providus's own lookup says about it. Reading this page changes nothing.
 */
export default function ProvidusSettlementsListPage() {
  const [result, setResult] = useState<ResultFilter | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = api.admin.providus.settlements.useQuery({
    query: {
      ...(result !== "all" && { result }),
      ...(status !== "all" && { status }),
      ...(search.trim() && { search: search.trim() }),
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    },
  });

  const items = data?.items ?? [];
  const counts = data?.counts;
  const total = Object.values(counts ?? {}).reduce((a, b) => a + b, 0);

  const pickResult = (value: ResultFilter | "all") => {
    setResult(value);
    setPage(1);
  };

  return (
    <Page>
      <PageHeader
        title="Providus Settlements"
        description={
          data && !data.scheduledReconciliationEnabled
            ? "Inflows Providus notified us of, checked against Providus's own lookup. Scheduled checks are off on this environment; re-verify one from its page."
            : "Inflows Providus notified us of, checked hourly against Providus's own lookup."
        }
      />

      <div className="flex flex-wrap gap-2">
        <ResultChip
          label="All"
          count={total}
          active={result === "all"}
          onClick={() => pickResult("all")}
        />
        {RESULT_ORDER.map((key) => (
          <ResultChip
            key={key}
            label={RESULT[key].label}
            count={counts?.[key] ?? 0}
            tint={RESULT[key].tint}
            active={result === key}
            onClick={() => pickResult(key)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative sm:max-w-sm sm:flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Settlement ID, session ID or account"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as StatusFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(STATUS).map(([value, s]) => (
              <SelectItem key={value} value={value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
          No settlements match these filters.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Sender bank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reconciliation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <SettlementRow key={s.id} settlement={s} />
              ))}
            </TableBody>
          </Table>
          {(data?.total ?? 0) > PAGE_SIZE && (
            <DataPagination
              currentPage={page}
              totalItems={data?.total ?? 0}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </Page>
  );
}

function ResultChip({
  label,
  count,
  tint,
  active,
  onClick,
}: {
  label: string;
  count: number;
  tint?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
        active
          ? "border-foreground bg-accent font-medium"
          : "hover:bg-accent/60",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded border px-1.5 text-xs tabular-nums",
          count > 0 && tint ? tint : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function SettlementRow({
  settlement: s,
}: {
  settlement: AdminProvidusSettlementDto;
}) {
  const status = STATUS[s.status];
  const result = RESULT[s.reconciliation?.result ?? "unchecked"];

  return (
    <TableRow className="relative">
      <TableCell className="text-sm whitespace-nowrap">
        <Link
          to={`/providus-settlements/${s.id}`}
          className="hover:underline after:absolute after:inset-0"
        >
          {formatDateTime(s.tranDateTime ?? s.createdAt)}
        </Link>
      </TableCell>
      <TableCell className="text-right font-medium whitespace-nowrap tabular-nums">
        {formatNaira(s.settledAmount, s.currency)}
      </TableCell>
      <TableCell className="font-mono text-sm tabular-nums">
        {s.accountNumber ?? "-"}
      </TableCell>
      <TableCell className="text-sm">{s.sourceBankName ?? "-"}</TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-medium", status.tint)}>
          {status.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-medium", result.tint)}>
          {result.label}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
