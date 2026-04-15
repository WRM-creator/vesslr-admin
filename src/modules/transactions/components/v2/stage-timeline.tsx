import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { cn, formatDateTime } from "@/lib/utils";
import {
  AlertTriangle,
  Banknote,
  Check,
  ChevronDown,
  Circle,
  ClipboardCheck,
  Clock,
  FileText,
  ListChecks,
  Lock,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { StageComplianceContent } from "./stage-content/stage-compliance";
import { StageDocumentsContent } from "./stage-content/stage-documents";
import { StageEscrowContent } from "./stage-content/stage-escrow";
import { StageInspectionContent } from "./stage-content/stage-inspection";
import { StageLogisticsContent } from "./stage-content/stage-logistics";
import { StageMilestoneContent } from "./stage-content/stage-milestones";
import { StageSettlementContent } from "./stage-content/stage-settlement";
import { StageDisputeContent } from "./stage-content/stage-dispute";

interface StageTimelineProps {
  transaction: TransactionResponseDto;
}

// Per-stage icons matching the frontend's pattern
function stageIcon(type: string): ReactNode {
  switch (type) {
    case "DOCUMENT_SUBMISSION":
      return <FileText className="size-3.5" />;
    case "COMPLIANCE_REVIEW":
      return <ShieldCheck className="size-3.5" />;
    case "FUND_ESCROW":
      return <Lock className="size-3.5" />;
    case "LOGISTICS":
    case "IN_TRANSIT":
      return <Truck className="size-3.5" />;
    case "INSPECTION":
      return <ClipboardCheck className="size-3.5" />;
    case "DELIVERY_CONFIRMATION":
      return <PackageCheck className="size-3.5" />;
    case "MILESTONE_SUBMIT":
    case "MILESTONE_APPROVE":
      return <ListChecks className="size-3.5" />;
    case "SETTLEMENT":
      return <Banknote className="size-3.5" />;
    default:
      return null;
  }
}

// Map stage types to their summary lines for collapsed completed stages
function getStageSummary(
  stage: TransactionStageResponseDto,
  transaction: TransactionResponseDto,
): string {
  switch (stage.type) {
    case "DOCUMENT_SUBMISSION": {
      const docs = transaction.requiredDocuments ?? [];
      const submitted = docs.filter((d) => d.status !== "PENDING").length;
      return `${submitted} document${submitted !== 1 ? "s" : ""} submitted`;
    }
    case "COMPLIANCE_REVIEW": {
      const docs = transaction.requiredDocuments ?? [];
      const approved = docs.filter((d) => d.status === "APPROVED").length;
      return `${approved} document${approved !== 1 ? "s" : ""} approved`;
    }
    case "FUND_ESCROW":
      return transaction.escrow
        ? "Escrow funded"
        : "Escrow pending";
    case "LOGISTICS":
      return (transaction.assignedLogistics as any)?.carrierName
        ? `Shipped via ${(transaction.assignedLogistics as any).carrierName}`
        : "Logistics assigned";
    case "IN_TRANSIT":
      return "Goods in transit";
    case "INSPECTION":
      return "Inspection completed";
    case "DELIVERY_CONFIRMATION":
      return "Delivery confirmed by buyer";
    case "MILESTONE_SUBMIT":
      return "Milestone delivered";
    case "MILESTONE_APPROVE":
      return "Milestone approved";
    case "SETTLEMENT":
      return "Settlement released";
    default:
      return stage.description || "Completed";
  }
}

function StageContent({
  stage,
  transaction,
}: {
  stage: TransactionStageResponseDto;
  transaction: TransactionResponseDto;
}) {
  switch (stage.type) {
    case "DOCUMENT_SUBMISSION":
      return (
        <StageDocumentsContent transaction={transaction} stage={stage} />
      );
    case "COMPLIANCE_REVIEW":
      return (
        <StageComplianceContent transaction={transaction} stage={stage} />
      );
    case "FUND_ESCROW":
      return <StageEscrowContent transaction={transaction} stage={stage} />;
    case "LOGISTICS":
    case "IN_TRANSIT":
      return (
        <StageLogisticsContent transaction={transaction} stage={stage} />
      );
    case "INSPECTION":
      return (
        <StageInspectionContent transaction={transaction} stage={stage} />
      );
    case "DELIVERY_CONFIRMATION":
      return (
        <div className="text-muted-foreground text-sm">
          {stage.status === "COMPLETED"
            ? `Delivery confirmed${stage.completedAt ? ` on ${formatDateTime(stage.completedAt)}` : ""}.`
            : "Awaiting delivery confirmation from the buyer."}
        </div>
      );
    case "MILESTONE_SUBMIT":
    case "MILESTONE_APPROVE":
      return (
        <StageMilestoneContent transaction={transaction} stage={stage} />
      );
    case "SETTLEMENT":
      return (
        <StageSettlementContent transaction={transaction} stage={stage} />
      );
    default:
      return (
        <div className="text-muted-foreground text-sm">
          {stage.description}
        </div>
      );
  }
}

export function StageTimeline({ transaction }: StageTimelineProps) {
  const stages = transaction.stages ?? [];
  const isCancelled = ["REFUNDED", "CANCELLED", "PARTIALLY_REFUNDED"].includes(
    transaction.status,
  );
  const isDisputed = transaction.status === "DISPUTED";

  // Track which stages are manually toggled open
  const [openStages, setOpenStages] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Auto-expand active and disputed stages
    stages.forEach((s) => {
      if (s.status === "ACTIVE" || s.status === "DISPUTED") {
        initial.add(s._id);
      }
    });
    return initial;
  });

  const toggleStage = (stageId: string) => {
    setOpenStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  if (stages.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
        No workflow stages found for this transaction.
      </div>
    );
  }

  // Find the index after which to show cancellation break
  const breakAfterIndex = isCancelled
    ? stages.reduce((last, s, i) => (s.status !== "PENDING" ? i : last), -1)
    : -1;

  return (
    <div className="relative space-y-0">
      {stages.map((stage, index) => {
        const isCompleted = stage.status === "COMPLETED";
        const isActive = stage.status === "ACTIVE";
        const isStageDisputed = stage.status === "DISPUTED";
        const isPending = stage.status === "PENDING";
        const isLast = index === stages.length - 1;
        const isOpen = openStages.has(stage._id);

        // After the break, greyed-out stages that never ran
        const isAfterBreak = isCancelled && breakAfterIndex >= 0 && index > breakAfterIndex;

        return (
          <div key={stage._id}>
            <Collapsible open={isOpen} onOpenChange={() => toggleStage(stage._id)}>
              <div className="flex gap-4">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={cn(
                      "z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                      isAfterBreak
                        ? "border-muted-foreground/20 bg-muted text-muted-foreground/40"
                        : isStageDisputed
                          ? "border-destructive bg-destructive text-white"
                          : isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isActive
                              ? "border-primary bg-background text-primary ring-primary/20 ring-4"
                              : "border-muted-foreground/30 bg-muted text-muted-foreground/40",
                    )}
                  >
                    {isStageDisputed ? (
                      <AlertTriangle className="size-3.5" strokeWidth={2} />
                    ) : isCompleted ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : (
                      stageIcon(stage.type)
                    )}
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 flex-1",
                        isAfterBreak
                          ? "bg-muted-foreground/10"
                          : isCompleted
                            ? "bg-primary/40"
                            : isActive || isStageDisputed
                              ? "bg-gradient-to-b from-primary/40 to-border"
                              : "bg-border",
                      )}
                    />
                  )}
                </div>

                {/* Stage content */}
                <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "group flex w-full items-center justify-between rounded-md px-1 py-1 text-left transition-colors",
                        !isPending && !isAfterBreak && "hover:bg-muted/50",
                        isAfterBreak && "opacity-50",
                      )}
                      disabled={isPending && !isAfterBreak && !isCompleted}
                    >
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "text-sm font-medium",
                            isAfterBreak && "text-muted-foreground line-through",
                            isPending && !isAfterBreak && "text-muted-foreground",
                          )}
                        >
                          {stage.name}
                        </h3>
                        {isCompleted && stage.completedAt && (
                          <span className="text-muted-foreground text-[11px]">
                            {formatDateTime(stage.completedAt)}
                          </span>
                        )}
                        {isActive && (
                          <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-semibold">
                            Active
                          </span>
                        )}
                        {isStageDisputed && (
                          <span className="bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-[10px] font-semibold">
                            Disputed
                          </span>
                        )}
                      </div>
                      {(isCompleted || isActive || isStageDisputed) && (
                        <ChevronDown
                          className={cn(
                            "text-muted-foreground size-4 transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      )}
                    </button>
                  </CollapsibleTrigger>

                  {/* Collapsed summary / description */}
                  {isCompleted && !isOpen && (
                    <p className="text-muted-foreground mt-0.5 px-1 text-xs">
                      {getStageSummary(stage, transaction)}
                    </p>
                  )}
                  {(isActive || isPending) && !isOpen && stage.description && (
                    <p className="text-muted-foreground mt-0.5 px-1 text-xs">
                      {stage.description}
                    </p>
                  )}

                  {/* Expanded content */}
                  <CollapsibleContent>
                    <div className="mt-2 px-1">
                      <StageContent stage={stage} transaction={transaction} />
                    </div>
                  </CollapsibleContent>
                </div>
              </div>
            </Collapsible>

            {/* Cancellation break */}
            {isCancelled && index === breakAfterIndex && breakAfterIndex < stages.length - 1 && (
              <div className="flex gap-4 py-2">
                <div className="flex flex-col items-center">
                  <div className="bg-destructive/10 border-destructive/30 z-10 flex size-7 items-center justify-center rounded-full border-2">
                    <span className="text-destructive text-xs font-bold">✕</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-destructive text-xs font-medium">
                    {transaction.status === "PARTIALLY_REFUNDED"
                      ? "Split Settlement"
                      : transaction.status === "REFUNDED"
                        ? "Refunded"
                        : "Cancelled"}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Dispute section (shown inline at the bottom when disputed) */}
      {isDisputed && (
        <div className="mt-4">
          <StageDisputeContent transaction={transaction} />
        </div>
      )}
    </div>
  );
}
