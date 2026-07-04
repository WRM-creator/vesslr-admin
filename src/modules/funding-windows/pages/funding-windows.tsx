import { useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { FundingWindowRowDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";

type WindowState = "open" | "overdue" | "expired";

export default function FundingWindowsPage() {
  const { data, isLoading } = api.admin.fundingWindows.queue.useQuery({});
  const rows = useMemo(() => data?.data?.rows ?? [], [data]);

  const [tab, setTab] = useState<WindowState>("open");
  const visible = rows.filter((r) => r.state === tab);

  const counts = {
    open: data?.data?.openCount ?? 0,
    overdue: data?.data?.overdueCount ?? 0,
    expired: data?.data?.expiredCount ?? 0,
  };

  const [extending, setExtending] = useState<FundingWindowRowDto | null>(null);
  const [reopening, setReopening] = useState<FundingWindowRowDto | null>(null);
  const [closing, setClosing] = useState<FundingWindowRowDto | null>(null);

  const { mutate: closeWindow, isPending: isClosing } =
    api.admin.fundingWindows.close.useMutation();
  const { mutate: extendWindow } =
    api.admin.fundingWindows.extend.useMutation();
  const { mutate: reopenWindow } =
    api.admin.fundingWindows.reopen.useMutation();

  const handleClose = () => {
    if (!closing) return;
    closeWindow(
      { path: { transactionId: closing.transactionId } },
      {
        onSuccess: () => {
          toast.success(
            `Order #${closing.orderDisplayId} cancelled; the window is closed`,
          );
          setClosing(null);
        },
        onError: (err) => {
          toast.error(errorMessage(err));
          setClosing(null);
        },
      },
    );
  };

  return (
    <Page>
      <PageHeader
        title="Funding Windows"
        description="Escrow funding deadlines after compliance approval. The hourly sweep reminds at 48h and auto-cancels past due; extend, close, or re-open here."
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as WindowState)}>
        <TabsList>
          <TabsTrigger value="open">Open ({counts.open})</TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({counts.overdue})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Closed ({counts.expired})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
          {tab === "open" && "No open funding windows."}
          {tab === "overdue" &&
            "Nothing overdue. Past-due windows appear here until the hourly sweep cancels them."}
          {tab === "expired" &&
            "No windows closed in the last 90 days. Re-openable cancellations appear here."}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Reminder</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.transactionId}>
                <TableCell>
                  <Link
                    to={`/transactions/${row.transactionId}`}
                    className="font-medium hover:underline"
                  >
                    #{row.orderDisplayId}
                  </Link>
                </TableCell>
                <TableCell>{row.buyer?.name || "-"}</TableCell>
                <TableCell>{row.seller?.name || "-"}</TableCell>
                <TableCell>
                  {typeof row.totalAmount === "number" && row.currency ? (
                    formatCurrency(row.totalAmount, row.currency, {
                      maximumFractionDigits: 2,
                    })
                  ) : (
                    <Badge variant="outline">Unpriced</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DeadlineCell row={row} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.state === "expired"
                    ? (row.cancellationReason === "funding_window_closed_by_admin"
                        ? "Closed by admin"
                        : "Expired")
                    : row.fundingReminderSentAt
                      ? "Sent"
                      : "Pending"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {row.state === "expired" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReopening(row)}
                      >
                        Re-open
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExtending(row)}
                        >
                          Extend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => setClosing(row)}
                        >
                          Close now
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DaysDialog
        row={extending}
        onOpenChange={(open) => !open && setExtending(null)}
        title="Extend funding window"
        description="Days are added from the later of now and the current deadline. The buyer is notified and the 48h reminder re-arms."
        confirmLabel="Extend"
        defaultDays={7}
        onSubmit={(row, days, done) => {
          extendWindow(
            { path: { transactionId: row.transactionId }, body: { days } },
            {
              onSuccess: (res) => {
                const due = res?.data?.fundingDueAt;
                toast.success(
                  `Window for order #${row.orderDisplayId} now closes ${due ? formatDistanceToNowStrict(new Date(due), { addSuffix: true }) : "later"}`,
                );
                done();
              },
              onError: (err) => {
                toast.error(errorMessage(err));
                done();
              },
            },
          );
        }}
      />

      <DaysDialog
        row={reopening}
        onOpenChange={(open) => !open && setReopening(null)}
        title="Re-open funding window"
        description="Restores the cancelled transaction and order with a fresh window, and re-claims the linked request for this seller. Refused if the request has moved on."
        confirmLabel="Re-open"
        defaultDays={7}
        onSubmit={(row, days, done) => {
          reopenWindow(
            { path: { transactionId: row.transactionId }, body: { days } },
            {
              onSuccess: () => {
                toast.success(
                  `Order #${row.orderDisplayId} restored with a ${days}-day window`,
                );
                done();
              },
              onError: (err) => {
                toast.error(errorMessage(err));
                done();
              },
            },
          );
        }}
      />

      <AlertDialog
        open={!!closing}
        onOpenChange={(open) => !open && setClosing(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this funding window now?</AlertDialogTitle>
            <AlertDialogDescription>
              {closing
                ? `Order #${closing.orderDisplayId} and its transaction are cancelled immediately, and both parties are notified. The window can be re-opened later from the Closed tab.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose} disabled={isClosing}>
              Close window
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}

function DeadlineCell({ row }: { row: FundingWindowRowDto }) {
  const due = new Date(row.fundingDueAt);
  const relative = formatDistanceToNowStrict(due, { addSuffix: true });
  if (row.state === "overdue") {
    return <span className="text-destructive font-medium">{relative}</span>;
  }
  if (row.state === "open") {
    const soon = due.getTime() - Date.now() < 48 * 60 * 60 * 1000;
    return (
      <span className={soon ? "font-medium text-amber-600" : ""}>
        {relative}
      </span>
    );
  }
  return <span className="text-muted-foreground">{relative}</span>;
}

function DaysDialog({
  row,
  onOpenChange,
  title,
  description,
  confirmLabel,
  defaultDays,
  onSubmit,
}: {
  row: FundingWindowRowDto | null;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  defaultDays: number;
  onSubmit: (row: FundingWindowRowDto, days: number, done: () => void) => void;
}) {
  const [days, setDays] = useState(defaultDays);
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={!!row} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-2">
          <Label htmlFor="fw-days">Days (1 to 30)</Label>
          <Input
            id="fw-days"
            type="number"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={busy || days < 1 || days > 30}
            onClick={() => {
              if (!row) return;
              setBusy(true);
              onSubmit(row, days, () => {
                setBusy(false);
                onOpenChange(false);
              });
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function errorMessage(err: unknown): string {
  const message = (err as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message.join("; ");
  return message || "Request failed";
}
