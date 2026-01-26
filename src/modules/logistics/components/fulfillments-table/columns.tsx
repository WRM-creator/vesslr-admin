"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow, isPast, isToday } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  ShieldQuestion,
  ShipIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import type {
  AlertType,
  ComplianceStatus,
  EscrowState,
  Fulfillment,
  LogisticsState,
} from "../../lib/fulfillment-model";

// Logistics state styling
const logisticsStateStyles: Record<
  LogisticsState,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  }
> = {
  pending: { variant: "secondary", label: "Pending" },
  picked_up: { variant: "outline", label: "Picked Up" },
  in_transit: { variant: "default", label: "In Transit" },
  out_for_delivery: { variant: "default", label: "Out for Delivery" },
  delivered: { variant: "outline", label: "Delivered" },
  failed: { variant: "destructive", label: "Failed" },
};

// Escrow state styling
const escrowStateStyles: Record<
  EscrowState,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  }
> = {
  held: { variant: "secondary", label: "Held" },
  pending_release: { variant: "default", label: "Pending Release" },
  released: { variant: "outline", label: "Released" },
  refunded: { variant: "outline", label: "Refunded" },
  disputed: { variant: "destructive", label: "Disputed" },
};

// Risk level styling
const riskLevelStyles: Record<
  "low" | "medium" | "high",
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  low: { variant: "outline", className: "border-green-500 text-green-600" },
  medium: {
    variant: "outline",
    className: "border-yellow-500 text-yellow-600",
  },
  high: { variant: "outline", className: "border-red-500 text-red-600" },
};

// Alert labels
const alertLabels: Record<AlertType, string> = {
  delay: "Delay",
  damage_reported: "Damage Reported",
  customs_hold: "Customs Hold",
  address_issue: "Address Issue",
  high_value: "High Value",
};

// Compliance icons
function ComplianceIcon({ status }: { status: ComplianceStatus }) {
  switch (status) {
    case "compliant":
      return <Shield className="h-4 w-4 text-green-500" />;
    case "review_required":
      return <ShieldQuestion className="h-4 w-4 text-yellow-500" />;
    case "flagged":
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
  }
}

export const fulfillmentsColumns: ColumnDef<Fulfillment>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <Link
        to={`/logistics/${row.original.transactionId}`}
        className="text-muted-foreground hover:text-primary font-mono text-xs hover:underline"
      >
        {row.original.transactionId}
      </Link>
    ),
  },
  {
    id: "buyerSeller",
    header: "Buyer / Seller",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{row.original.buyer.name}</span>
        <span className="text-muted-foreground text-xs">
          {row.original.seller.name}
        </span>
      </div>
    ),
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const { name, riskLevel } = row.original.category;
      const riskStyle = riskLevelStyles[riskLevel];
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{name}</span>
          <Badge
            variant={riskStyle.variant}
            className={`h-5 text-[10px] uppercase ${riskStyle.className}`}
          >
            {riskLevel}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "logisticsState",
    header: "Logistics State",
    cell: ({ row }) => {
      const state = row.original.logisticsState;
      const style = logisticsStateStyles[state];
      return (
        <div className="flex items-center gap-2">
          <ShipIcon className="text-muted-foreground h-4 w-4" />
          <Badge variant={style.variant}>{style.label}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "carrier",
    header: "Carrier",
    cell: ({ row }) => <span className="text-sm">{row.original.carrier}</span>,
  },
  {
    id: "etaVsActual",
    header: "ETA vs Actual",
    cell: ({ row }) => {
      const { eta, actualDelivery, logisticsState } = row.original;
      const etaDate = new Date(eta);
      const actualDate = actualDelivery ? new Date(actualDelivery) : null;

      if (actualDate) {
        // Delivered - show comparison
        const isLate = actualDate > etaDate;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              ETA: {format(etaDate, "MMM d")}
            </span>
            <span
              className={`text-xs font-medium ${isLate ? "text-red-500" : "text-green-500"}`}
            >
              {isLate ? "Late: " : "Early: "}
              {format(actualDate, "MMM d")}
            </span>
          </div>
        );
      }

      if (logisticsState === "failed") {
        return (
          <span className="text-muted-foreground text-xs">
            ETA was {format(etaDate, "MMM d")}
          </span>
        );
      }

      // Not yet delivered - show ETA status
      const isOverdue = isPast(etaDate) && !isToday(etaDate);
      return (
        <div className="flex items-center gap-1.5">
          {isOverdue ? (
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <Clock className="text-muted-foreground h-3.5 w-3.5" />
          )}
          <span
            className={`text-xs ${isOverdue ? "font-medium text-red-500" : ""}`}
          >
            {isToday(etaDate)
              ? "Today"
              : isOverdue
                ? `Overdue (${formatDistanceToNow(etaDate)} ago)`
                : formatDistanceToNow(etaDate, { addSuffix: true })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "escrowState",
    header: "Escrow State",
    cell: ({ row }) => {
      const state = row.original.escrowState;
      const style = escrowStateStyles[state];
      return <Badge variant={style.variant}>{style.label}</Badge>;
    },
  },
  {
    accessorKey: "complianceStatus",
    header: "Compliance",
    cell: ({ row }) => {
      const status = row.original.complianceStatus;
      const labels: Record<ComplianceStatus, string> = {
        compliant: "Compliant",
        review_required: "Review Required",
        flagged: "Flagged",
      };
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <ComplianceIcon status={status} />
              <span className="text-xs">{labels[status]}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compliance: {labels[status]}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "alerts",
    header: "Alerts",
    cell: ({ row }) => {
      const alerts = row.original.alerts;
      if (alerts.length === 0) {
        return (
          <span className="text-muted-foreground text-xs">
            <CheckCircle2 className="inline h-4 w-4 text-green-500" />
          </span>
        );
      }
      return (
        <div className="flex flex-wrap gap-1">
          {alerts.map((alert) => (
            <Badge
              key={alert}
              variant="destructive"
              className="h-5 text-[10px]"
            >
              {alertLabels[alert]}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`/logistics/${row.original.transactionId}`}>
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Track shipment</DropdownMenuItem>
            <DropdownMenuItem>Contact carrier</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Flag for review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
