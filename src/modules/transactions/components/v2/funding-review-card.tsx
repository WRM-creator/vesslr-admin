import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type {
  ConfirmDepositFundingDto,
  FundingReviewDepositDto,
  FundingReviewDto,
  TransactionResponseDto,
} from "@/lib/api/generated";
import {
  formatCurrency,
  fromMinorUnit,
  getCurrencyDecimals,
  toMinorUnit,
} from "@/lib/currency";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  MessageCircleQuestion,
  RotateCcw,
  Wallet,
} from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

interface FundingReviewCardProps {
  transaction: TransactionResponseDto;
}

/**
 * The confirm endpoint 409s when held deposits do not cover
 * quantity x buyerUnitPrice; the response body carries the exact figures.
 * This shape is server-defined but not part of the generated success types,
 * so it is narrowed at runtime.
 */
interface ShortfallConflict {
  message?: string;
  heldTotal: number;
  confirmAmount: number;
  shortfall: number;
}

function isShortfallConflict(err: unknown): err is ShortfallConflict {
  if (typeof err !== "object" || err === null) return false;
  const record = err as Record<string, unknown>;
  return (
    typeof record.heldTotal === "number" &&
    typeof record.confirmAmount === "number" &&
    typeof record.shortfall === "number"
  );
}

function errorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "message" in err) {
    const message = (err as { message?: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  return err instanceof Error ? err.message : "Unknown error";
}

const STATE_BADGE: Record<
  FundingReviewDto["state"],
  { label: string; className: string }
> = {
  AWAITING_DEPOSIT: {
    label: "Awaiting deposit",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  },
  DEPOSIT_RECEIVED: {
    label: "Deposit under review",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  SHORTFALL_REPORTED: {
    label: "Shortfall reported",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    className:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
};

const DEPOSIT_STATUS_BADGE: Record<
  FundingReviewDepositDto["status"],
  { label: string; className: string }
> = {
  HELD: {
    label: "Held",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  CONFIRMED_INTO_ESCROW: {
    label: "In escrow",
    className:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
  REFUND_PENDING: {
    label: "Refund pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  REFUNDED: {
    label: "Refunded",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  },
  SWEPT_TO_PLATFORM: {
    label: "Swept to platform",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
};

function sourceLabel(deposit: FundingReviewDepositDto): string {
  if (deposit.source === "WALLET") {
    return deposit.sourceWallet
      ? `Wallet ${deposit.sourceWallet.walletIndex}`
      : "Wallet";
  }
  return "Bank transfer";
}

function SenderDetails({
  details,
}: {
  details: Record<string, unknown>;
}) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
      {Object.entries(details).map(([key, value]) => (
        <div key={key} className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground text-[11px] capitalize">
            {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toLowerCase()}
          </dt>
          <dd className="text-right font-mono text-[11px]">
            {typeof value === "object" && value !== null
              ? JSON.stringify(value)
              : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ─── Confirm funding dialog ────────────────────────────────────────
function ConfirmFundingDialog({
  open,
  onOpenChange,
  transactionId,
  review,
  onReportShortfall,
  onWaive,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  review: FundingReviewDto;
  onReportShortfall: (prefillMinor: number) => void;
  onWaive: (conflict: ShortfallConflict, body: ConfirmDepositFundingDto) => void;
}) {
  const [unitPriceMajor, setUnitPriceMajor] = useState("");
  const [fxRateInput, setFxRateInput] = useState("");
  const [referencePrice, setReferencePrice] = useState("");
  const [referenceSource, setReferenceSource] = useState("");
  const [excessAction, setExcessAction] = useState<"SWEEP" | "HOLD" | null>(
    null,
  );
  const [conflict, setConflict] = useState<ShortfallConflict | null>(null);

  const { mutate: confirmFunding, isPending } =
    api.admin.transactions.confirmDepositFunding.useMutation();

  const currency = review.currency;
  const unit = review.unitOfMeasurement || "unit";

  const parsedPrice = Number(unitPriceMajor);
  const priceValid = Number.isFinite(parsedPrice) && parsedPrice > 0;
  const priceMinor = priceValid ? toMinorUnit(parsedPrice, currency) : 0;

  // The spread rides on the formula, so it is quoted in the benchmark's
  // currency. When the deal settles elsewhere it crosses at the rate the
  // parties agreed. This mirrors convertSpreadToSettlement on the server.
  const parsedRate = Number(fxRateInput);
  const rateValid = Number.isFinite(parsedRate) && parsedRate > 0;
  const fxRateMicros = rateValid ? Math.round(parsedRate * 1_000_000) : 0;
  const spreadSettlement = review.requiresFxRate
    ? rateValid
      ? Math.round(
          (review.spreadPerUnit *
            fxRateMicros *
            10 **
              (getCurrencyDecimals(currency) -
                getCurrencyDecimals(review.formulaCurrency))) /
            1_000_000,
        )
      : 0
    : review.spreadPerUnit;

  const derivable = priceValid && (!review.requiresFxRate || rateValid);
  const escrowTotal = derivable ? Math.round(review.quantity * priceMinor) : 0;
  const sellerAmount = derivable
    ? Math.round(review.quantity * (priceMinor - spreadSettlement))
    : 0;
  const platformTake = escrowTotal - sellerAmount;
  const projectedExcess = derivable
    ? Math.max(0, review.heldTotal - escrowTotal)
    : 0;

  const canSubmit =
    derivable &&
    referenceSource.trim().length > 0 &&
    priceMinor > spreadSettlement;

  const buildBody = (): ConfirmDepositFundingDto => ({
    buyerUnitPrice: priceMinor,
    referencePrice: referencePrice.trim() || undefined,
    referenceSource: referenceSource.trim(),
    settlementFxRate: review.requiresFxRate ? fxRateMicros : undefined,
    excessAction: projectedExcess > 0 && excessAction ? excessAction : undefined,
  });

  const handleConfirm = () => {
    if (!canSubmit) return;
    setConflict(null);
    confirmFunding(
      { path: { id: transactionId }, body: buildBody() },
      {
        onSuccess: () => {
          toast.success("Funding confirmed", {
            description: "The escrow has been created from the held deposits.",
          });
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          if (isShortfallConflict(err)) {
            setConflict(err);
            return;
          }
          toast.error("Failed to confirm funding", {
            description: errorMessage(err),
          });
        },
      },
    );
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setConflict(null);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Escrow Funding</DialogTitle>
          <DialogDescription>
            Set the agreed buyer unit price. The escrow is created from the
            held deposits at quantity x price.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="buyer-unit-price">
              Buyer unit price ({currency} per {unit})
            </Label>
            <Input
              id="buyer-unit-price"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={unitPriceMajor}
              onChange={(e) => {
                setUnitPriceMajor(e.target.value);
                setConflict(null);
              }}
            />
            <p className="text-muted-foreground text-[11px]">
              Enter the price in major units, e.g. 850.50. It is applied per{" "}
              {unit} across {review.quantity.toLocaleString()}{" "}
              {review.unitOfMeasurement || "units"}.
            </p>
          </div>

          {review.requiresFxRate && (
            <div className="space-y-1.5">
              <Label htmlFor="settlement-fx-rate">
                Agreed exchange rate ({currency} per 1 {review.formulaCurrency})
              </Label>
              <Input
                id="settlement-fx-rate"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={fxRateInput}
                onChange={(e) => {
                  setFxRateInput(e.target.value);
                  setConflict(null);
                }}
              />
              <p className="text-muted-foreground text-[11px]">
                This deal is quoted in {review.formulaCurrency} and settles in{" "}
                {currency}. Enter the rate the parties agreed, from the
                contract. It converts the platform spread only; the escrow
                total comes from the buyer unit price above.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reference-price">Reference price (optional)</Label>
              <Input
                id="reference-price"
                placeholder="e.g. 812.30 USD/MT"
                value={referencePrice}
                onChange={(e) => setReferencePrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reference-source">Reference source</Label>
              <Input
                id="reference-source"
                placeholder="e.g. Platts CIF NWE, 18 Jul"
                value={referenceSource}
                onChange={(e) => setReferenceSource(e.target.value)}
              />
            </div>
          </div>

          {/* Computed preview */}
          <div className="bg-muted/40 rounded-md border p-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Escrow total ({review.quantity.toLocaleString()} x{" "}
                  {priceValid
                    ? formatCurrency(priceMinor, currency, {
                        maximumFractionDigits: 2,
                      })
                    : "price"}
                  )
                </span>
                <span className="font-medium">
                  {derivable ? formatCurrency(escrowTotal, currency) : "-"}
                </span>
              </div>
              {review.requiresFxRate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Spread per {unit} (
                    {formatCurrency(
                      review.spreadPerUnit,
                      review.formulaCurrency,
                    )}{" "}
                    converted)
                  </span>
                  <span className="font-medium">
                    {derivable
                      ? formatCurrency(spreadSettlement, currency)
                      : "-"}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Seller amount (price minus spread)
                </span>
                <span className="font-medium">
                  {derivable ? formatCurrency(sellerAmount, currency) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform take</span>
                <span className="font-medium">
                  {derivable ? formatCurrency(platformTake, currency) : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Held deposits</span>
                <span
                  className={cn(
                    "font-semibold",
                    derivable && review.heldTotal < escrowTotal
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-green-600",
                  )}
                >
                  {formatCurrency(review.heldTotal, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Excess handling */}
          {projectedExcess > 0 && !conflict && (
            <div className="space-y-2 rounded-md border p-3">
              <p className="text-sm font-medium">
                Excess of {formatCurrency(projectedExcess, currency)} on
                confirmation
              </p>
              <p className="text-muted-foreground text-[11px]">
                An excess at or below{" "}
                {formatCurrency(review.negligibleExcessThreshold, currency)}{" "}
                suggests sweeping to platform income. Larger excesses are
                usually held so they stay refundable to the buyer.
              </p>
              <RadioGroup
                value={excessAction ?? ""}
                onValueChange={(value) =>
                  setExcessAction(value === "SWEEP" ? "SWEEP" : "HOLD")
                }
                className="gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="SWEEP" id="excess-sweep" />
                  <Label htmlFor="excess-sweep" className="text-xs font-normal">
                    Sweep to platform income
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="HOLD" id="excess-hold" />
                  <Label htmlFor="excess-hold" className="text-xs font-normal">
                    Hold (refundable to buyer)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-muted-foreground text-[11px]">
                Leave unselected to accept the server suggestion for this
                currency.
              </p>
            </div>
          )}

          {/* 409 shortfall error state */}
          {conflict && (
            <div className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  The held deposits do not cover the confirmed amount. Report
                  the shortfall so the buyer tops up their deposit.
                </p>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Held deposits</span>
                  <span className="font-medium">
                    {formatCurrency(conflict.heldTotal, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confirm amount</span>
                  <span className="font-medium">
                    {formatCurrency(conflict.confirmAmount, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold text-amber-700 dark:text-amber-400">
                  <span>Shortfall</span>
                  <span>{formatCurrency(conflict.shortfall, currency)}</span>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  const shortfall = conflict.shortfall;
                  handleOpenChange(false);
                  onReportShortfall(shortfall);
                }}
              >
                <AlertTriangle className="size-3.5" />
                Report shortfall to buyer
              </Button>
              <Collapsible>
                <CollapsibleTrigger className="text-muted-foreground inline-flex items-center gap-1 text-[11px] hover:underline">
                  <ChevronRight className="size-3" />
                  Other options
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <button
                    type="button"
                    className="text-muted-foreground mt-1.5 text-[11px] underline underline-offset-2 hover:text-foreground"
                    onClick={() => {
                      const snapshot = conflict;
                      const body = buildBody();
                      handleOpenChange(false);
                      onWaive(snapshot, body);
                    }}
                  >
                    Confirm anyway (waive platform take)
                  </button>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canSubmit || isPending}>
            {isPending ? (
              <>
                <Spinner />
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle2 />
                Confirm Funding
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Waiver dialog ─────────────────────────────────────────────────
function WaiverDialog({
  data,
  onClose,
  transactionId,
  currency,
}: {
  data: { conflict: ShortfallConflict; body: ConfirmDepositFundingDto } | null;
  onClose: () => void;
  transactionId: string;
  currency: string;
}) {
  const [reason, setReason] = useState("");
  const [armed, setArmed] = useState(false);

  const { mutate: confirmWithWaiver, isPending } =
    api.admin.transactions.confirmDepositFundingWithWaiver.useMutation();

  const reasonValid = reason.trim().length >= 10;

  const handleClose = () => {
    setReason("");
    setArmed(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!data || !reasonValid) return;
    if (!armed) {
      setArmed(true);
      return;
    }
    confirmWithWaiver(
      {
        path: { id: transactionId },
        body: {
          ...data.body,
          waiverReason: reason.trim(),
          acknowledgedWaiverAmount: data.conflict.shortfall,
        },
      },
      {
        onSuccess: () => {
          toast.success("Funding confirmed with waiver", {
            description:
              "The escrow was created and the shortfall was absorbed from the platform take.",
          });
          handleClose();
        },
        onError: (err: unknown) => {
          setArmed(false);
          toast.error("Failed to confirm with waiver", {
            description: errorMessage(err),
          });
        },
      },
    );
  };

  if (!data) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Waive Platform Take and Confirm</DialogTitle>
          <DialogDescription>
            The deal closes short. The missing amount is absorbed out of the
            platform's own spread; the seller amount is untouched.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Held deposits</span>
              <span className="font-medium">
                {formatCurrency(data.conflict.heldTotal, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confirm amount</span>
              <span className="font-medium">
                {formatCurrency(data.conflict.confirmAmount, currency)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold text-red-700 dark:text-red-400">
              <span>Shortfall being waived</span>
              <span>{formatCurrency(data.conflict.shortfall, currency)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="waiver-reason">Reason for the waiver</Label>
          <Textarea
            id="waiver-reason"
            placeholder="Why is the business closing this deal below the confirmed amount? (min 10 characters)"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setArmed(false);
            }}
            rows={3}
          />
          <p className="text-muted-foreground text-[11px]">
            Recorded on the audit trail. At least 10 characters.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reasonValid || isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Confirming...
              </>
            ) : armed ? (
              "Click again to confirm the waiver"
            ) : (
              `Waive ${formatCurrency(data.conflict.shortfall, currency)} and confirm`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Report shortfall dialog ───────────────────────────────────────
function ReportShortfallDialog({
  open,
  onOpenChange,
  transactionId,
  currency,
  prefillMinor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  currency: string;
  prefillMinor: number | null;
}) {
  const [amountMajor, setAmountMajor] = useState("");
  const [touched, setTouched] = useState(false);

  const { mutate: reportShortfall, isPending } =
    api.admin.transactions.reportFundingShortfall.useMutation();

  // Prefill from a 409 conflict without clobbering user edits.
  const effectiveMajor =
    !touched && prefillMinor != null
      ? String(fromMinorUnit(prefillMinor, currency))
      : amountMajor;

  const parsed = Number(effectiveMajor);
  const valid = Number.isFinite(parsed) && parsed > 0;
  const outstandingMinor = valid ? toMinorUnit(parsed, currency) : 0;

  const handleClose = (next: boolean) => {
    if (!next) {
      setAmountMajor("");
      setTouched(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!valid) return;
    reportShortfall(
      {
        path: { id: transactionId },
        body: { outstandingAmount: outstandingMinor },
      },
      {
        onSuccess: () => {
          toast.success("Shortfall reported", {
            description: "The buyer has been sent a statement of deposits.",
          });
          handleClose(false);
        },
        onError: (err: unknown) =>
          toast.error("Failed to report shortfall", {
            description: errorMessage(err),
          }),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Shortfall</DialogTitle>
          <DialogDescription>
            The buyer receives a system-generated statement of their deposits
            received so far, plus the outstanding figure you enter here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="outstanding-amount">
            Outstanding amount ({currency}, major units)
          </Label>
          <Input
            id="outstanding-amount"
            type="number"
            min="0"
            step="any"
            placeholder="0.00"
            value={effectiveMajor}
            onChange={(e) => {
              setTouched(true);
              setAmountMajor(e.target.value);
            }}
          />
          {valid && (
            <p className="text-muted-foreground text-[11px]">
              The buyer will be asked to deposit{" "}
              {formatCurrency(outstandingMinor, currency)} more.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || isPending}>
            {isPending ? (
              <>
                <Spinner />
                Sending...
              </>
            ) : (
              <>
                <AlertTriangle />
                Report Shortfall
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Query proof dialog ────────────────────────────────────────────
function QueryProofDialog({
  open,
  onOpenChange,
  transactionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
}) {
  const [message, setMessage] = useState("");

  const { mutate: queryProof, isPending } =
    api.admin.transactions.queryFundingProof.useMutation();

  const valid = message.trim().length > 0;

  const handleClose = (next: boolean) => {
    if (!next) setMessage("");
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!valid) return;
    queryProof(
      { path: { id: transactionId }, body: { message: message.trim() } },
      {
        onSuccess: () => {
          toast.success("Query sent to the buyer");
          handleClose(false);
        },
        onError: (err: unknown) =>
          toast.error("Failed to send query", {
            description: errorMessage(err),
          }),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Query Proof of Payment</DialogTitle>
          <DialogDescription>
            Ask the buyer a question about their uploaded proof of payment.
            They are notified and can respond by uploading again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="query-message">Message to the buyer</Label>
          <Textarea
            id="query-message"
            placeholder="e.g. The receipt amount does not match the deposit we received. Please upload the full wire confirmation."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || isPending}>
            {isPending ? (
              <>
                <Spinner />
                Sending...
              </>
            ) : (
              <>
                <MessageCircleQuestion />
                Send Query
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Mark refunded offline dialog ──────────────────────────────────
function MarkRefundedOfflineDialog({
  deposit,
  onClose,
  transactionId,
  currency,
}: {
  deposit: FundingReviewDepositDto | null;
  onClose: () => void;
  transactionId: string;
  currency: string;
}) {
  const [confirmMajor, setConfirmMajor] = useState("");
  const [providerReference, setProviderReference] = useState("");
  const [note, setNote] = useState("");

  const { mutate: markRefunded, isPending } =
    api.admin.transactions.markDepositRefundedOffline.useMutation();

  const parsed = Number(confirmMajor);
  const amountMatches =
    deposit != null &&
    Number.isFinite(parsed) &&
    toMinorUnit(parsed, currency) === deposit.amount;
  const valid =
    amountMatches && providerReference.trim().length > 0 && note.trim().length > 0;

  const handleClose = () => {
    setConfirmMajor("");
    setProviderReference("");
    setNote("");
    onClose();
  };

  const handleSubmit = () => {
    if (!deposit || !valid) return;
    markRefunded(
      {
        path: { id: transactionId, depositId: deposit._id },
        body: {
          confirmAmount: deposit.amount,
          providerReference: providerReference.trim(),
          note: note.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Deposit marked as refunded offline");
          handleClose();
        },
        onError: (err: unknown) =>
          toast.error("Failed to mark deposit refunded", {
            description: errorMessage(err),
          }),
      },
    );
  };

  if (!deposit) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Refunded Offline</DialogTitle>
          <DialogDescription>
            Record a bank refund of{" "}
            {formatCurrency(deposit.amount, currency)} that you executed
            outside the platform. No money moves here.
          </DialogDescription>
        </DialogHeader>

        {deposit.senderDetails && (
          <div className="bg-muted/40 space-y-1.5 rounded-md border p-3">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Refund destination (originator on record)
            </p>
            <SenderDetails details={deposit.senderDetails} />
            <p className="text-muted-foreground text-[11px]">
              This is the only permissible refund destination for a bank
              deposit.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="offline-confirm-amount">
              Confirm the amount ({currency}, major units)
            </Label>
            <Input
              id="offline-confirm-amount"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={confirmMajor}
              onChange={(e) => setConfirmMajor(e.target.value)}
            />
            {confirmMajor.length > 0 && !amountMatches && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                Must match the deposit amount exactly:{" "}
                {formatCurrency(deposit.amount, currency, {
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="offline-provider-ref">Provider reference</Label>
            <Input
              id="offline-provider-ref"
              placeholder="Reference of the refund payout you executed"
              value={providerReference}
              onChange={(e) => setProviderReference(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="offline-note">Note</Label>
            <Textarea
              id="offline-note"
              placeholder="How and why the refund was executed (audit trail)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || isPending}>
            {isPending ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              <>
                <RotateCcw />
                Mark Refunded
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Refund section ────────────────────────────────────────────────
function RefundSection({
  transactionId,
  review,
  currency,
}: {
  transactionId: string;
  review: FundingReviewDto;
  currency: string;
}) {
  const [refundInputs, setRefundInputs] = useState<Record<string, string>>({});
  const [offlineDeposit, setOfflineDeposit] =
    useState<FundingReviewDepositDto | null>(null);

  const { mutate: refundDeposit, isPending: isRefunding } =
    api.admin.transactions.refundFundingDeposit.useMutation();

  const heldDeposits = review.deposits.filter((d) => d.status === "HELD");
  if (heldDeposits.length === 0) return null;

  const handleWalletRefund = (deposit: FundingReviewDepositDto) => {
    refundDeposit(
      {
        path: { id: transactionId, depositId: deposit._id },
        body: { confirmAmount: deposit.amount },
      },
      {
        onSuccess: () => {
          toast.success("Refund to wallet initiated");
          setRefundInputs((prev) => ({ ...prev, [deposit._id]: "" }));
        },
        onError: (err: unknown) =>
          toast.error("Failed to refund deposit", {
            description: errorMessage(err),
          }),
      },
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <RotateCcw className="text-muted-foreground size-3.5" />
        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Held deposits to refund
        </span>
      </div>
      <div className="space-y-2">
        {heldDeposits.map((deposit) => {
          const input = refundInputs[deposit._id] ?? "";
          const parsed = Number(input);
          const matches =
            Number.isFinite(parsed) &&
            input.length > 0 &&
            toMinorUnit(parsed, currency) === deposit.amount;

          return (
            <div
              key={deposit._id}
              className="bg-background/60 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-2.5">
                {deposit.source === "WALLET" ? (
                  <Wallet className="text-muted-foreground size-4 shrink-0" />
                ) : (
                  <Banknote className="text-muted-foreground size-4 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {formatCurrency(deposit.amount, currency, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    via {sourceLabel(deposit)}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {deposit.provider} · {deposit.providerRef} ·{" "}
                    {format(new Date(deposit.receivedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              {deposit.source === "WALLET" ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Confirm amount"
                    className="h-8 w-36 text-xs"
                    value={input}
                    onChange={(e) =>
                      setRefundInputs((prev) => ({
                        ...prev,
                        [deposit._id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    disabled={!matches || isRefunding}
                    onClick={() => handleWalletRefund(deposit)}
                  >
                    <RotateCcw className="size-3" />
                    Refund to wallet
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => setOfflineDeposit(deposit)}
                >
                  <Banknote className="size-3" />
                  Mark refunded offline
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-muted-foreground text-[11px]">
        Wallet deposits refund back to the source wallet. Bank deposits must be
        paid back to the originator manually, then recorded here.
      </p>

      <MarkRefundedOfflineDialog
        deposit={offlineDeposit}
        onClose={() => setOfflineDeposit(null)}
        transactionId={transactionId}
        currency={currency}
      />
    </div>
  );
}

// ─── Main card ─────────────────────────────────────────────────────
export function FundingReviewCard({ transaction }: FundingReviewCardProps) {
  const { data: review, isLoading } =
    api.admin.transactions.fundingReview.useQuery({
      path: { id: transaction._id },
    });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shortfallOpen, setShortfallOpen] = useState(false);
  const [shortfallPrefill, setShortfallPrefill] = useState<number | null>(null);
  const [queryProofOpen, setQueryProofOpen] = useState(false);
  const [waiverData, setWaiverData] = useState<{
    conflict: ShortfallConflict;
    body: ConfirmDepositFundingDto;
  } | null>(null);
  const [expandedDeposits, setExpandedDeposits] = useState<
    Record<string, boolean>
  >({});

  if (isLoading) {
    return (
      <Card id="funding-review-card">
        <CardHeader>
          <CardTitle className="text-sm">Escrow Funding Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!review) return null;

  const currency = review.currency;
  const unit = review.unitOfMeasurement || "units";
  const hasEscrow = !!transaction.escrow;
  const stateBadge = STATE_BADGE[review.state];

  const canAct =
    !hasEscrow &&
    (review.state === "DEPOSIT_RECEIVED" ||
      review.state === "SHORTFALL_REPORTED");
  const canQueryProof = !hasEscrow && review.state !== "CONFIRMED";
  const showRefunds = transaction.status === "CANCELLED" || hasEscrow;

  const receipts = transaction.fundingReceipts ?? [];

  return (
    <Card id="funding-review-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Escrow Funding Review</CardTitle>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                stateBadge.className,
              )}
            >
              {stateBadge.label}
            </span>
          </div>
          {canQueryProof && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => setQueryProofOpen(true)}
            >
              <MessageCircleQuestion className="size-3.5" />
              Query proof
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deal terms strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Quantity
            </p>
            <p className="text-sm font-medium">
              {review.quantity.toLocaleString()} {unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Seller differential
            </p>
            <p className="text-sm font-medium">
              {review.sellerDifferentialValue != null
                ? `${formatCurrency(review.sellerDifferentialValue, currency, {
                    maximumFractionDigits: 2,
                  })} / ${review.unitOfMeasurement || "unit"}`
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Platform spread
            </p>
            <p className="text-sm font-medium">
              {`${formatCurrency(review.spreadPerUnit, currency, {
                maximumFractionDigits: 2,
              })} / ${review.unitOfMeasurement || "unit"}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Buyer differential
            </p>
            <p className="text-sm font-medium">
              {review.buyerDifferentialValue != null
                ? `${formatCurrency(review.buyerDifferentialValue, currency, {
                    maximumFractionDigits: 2,
                  })} / ${review.unitOfMeasurement || "unit"}`
                : "-"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Held total */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Held deposits
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCurrency(review.heldTotal, currency, {
                maximumFractionDigits: 2,
              })}
            </p>
            {review.outstandingAmount != null &&
              review.outstandingAmount > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Outstanding reported to buyer:{" "}
                  {formatCurrency(review.outstandingAmount, currency, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}
          </div>

          {canAct && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setShortfallPrefill(null);
                  setShortfallOpen(true);
                }}
              >
                <AlertTriangle className="size-3.5" />
                Report Shortfall
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => setConfirmOpen(true)}
              >
                <CheckCircle2 className="size-3.5" />
                Confirm Funding
              </Button>
            </div>
          )}
        </div>

        {/* Deposits table */}
        {review.deposits.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Received</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {review.deposits.map((deposit) => {
                  const statusBadge = DEPOSIT_STATUS_BADGE[deposit.status];
                  const hasSender =
                    !!deposit.senderDetails &&
                    Object.keys(deposit.senderDetails).length > 0;
                  const expanded = !!expandedDeposits[deposit._id];

                  return (
                    <Fragment key={deposit._id}>
                      <TableRow>
                        <TableCell className="p-2">
                          {hasSender && (
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground"
                              aria-label={
                                expanded
                                  ? "Hide sender details"
                                  : "Show sender details"
                              }
                              onClick={() =>
                                setExpandedDeposits((prev) => ({
                                  ...prev,
                                  [deposit._id]: !prev[deposit._id],
                                }))
                              }
                            >
                              {expanded ? (
                                <ChevronDown className="size-3.5" />
                              ) : (
                                <ChevronRight className="size-3.5" />
                              )}
                            </button>
                          )}
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">
                          {format(
                            new Date(deposit.receivedAt),
                            "MMM d, yyyy HH:mm",
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {sourceLabel(deposit)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium whitespace-nowrap">
                          {formatCurrency(deposit.amount, deposit.currency, {
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-xs">
                          {deposit.provider}
                        </TableCell>
                        <TableCell className="max-w-32 truncate font-mono text-[11px]">
                          {deposit.providerRef}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                              statusBadge.className,
                            )}
                          >
                            {statusBadge.label}
                          </span>
                        </TableCell>
                      </TableRow>
                      {hasSender && expanded && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell />
                          <TableCell colSpan={6} className="py-2">
                            <p className="text-muted-foreground mb-1 text-[11px] font-medium tracking-wider uppercase">
                              Sender details (admin only)
                            </p>
                            <SenderDetails
                              details={deposit.senderDetails ?? {}}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            No deposits received yet.
          </p>
        )}

        {/* Proof of payment receipts */}
        {receipts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Proof of payment
            </p>
            <div className="flex flex-wrap gap-2">
              {receipts.map((receipt, i) => (
                <a
                  key={i}
                  href={receipt.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-background/60 hover:bg-background inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs transition-colors"
                >
                  <FileText className="size-3 shrink-0" />
                  {receipt.name}
                  <span className="text-muted-foreground text-[10px]">
                    {format(new Date(receipt.timestamp), "MMM d, yyyy")}
                  </span>
                  <ExternalLink className="size-2.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Refunds */}
        {showRefunds && (
          <>
            <Separator />
            <RefundSection
              transactionId={transaction._id}
              review={review}
              currency={currency}
            />
          </>
        )}
      </CardContent>

      {/* Dialogs */}
      <ConfirmFundingDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        transactionId={transaction._id}
        review={review}
        onReportShortfall={(prefill) => {
          setShortfallPrefill(prefill);
          setShortfallOpen(true);
        }}
        onWaive={(conflict, body) => setWaiverData({ conflict, body })}
      />
      <WaiverDialog
        data={waiverData}
        onClose={() => setWaiverData(null)}
        transactionId={transaction._id}
        currency={currency}
      />
      <ReportShortfallDialog
        open={shortfallOpen}
        onOpenChange={setShortfallOpen}
        transactionId={transaction._id}
        currency={currency}
        prefillMinor={shortfallPrefill}
      />
      <QueryProofDialog
        open={queryProofOpen}
        onOpenChange={setQueryProofOpen}
        transactionId={transaction._id}
      />
    </Card>
  );
}
