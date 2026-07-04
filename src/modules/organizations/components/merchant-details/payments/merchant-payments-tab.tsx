import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { AdminProvisionResultDto } from "@/lib/api/generated";
import { format } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  InfoIcon,
  Loader2Icon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PaymentsActivity } from "./payments-activity";
import { derivePaymentsVerdict } from "./payments-verdict";
import { PayoutDestinations } from "./payout-destinations";
import { ProviderVerdictPanel } from "./provider-verdict-panel";
import { RailsTable } from "./rails-table";
import { RequirementsPanel } from "./requirements-panel";

interface MerchantPaymentsTabProps {
  organizationId: string;
}

const TONE_ICONS = {
  healthy: CheckCircle2Icon,
  progress: ClockIcon,
  blocked: TriangleAlertIcon,
  inactive: InfoIcon,
} as const;

const TONE_CLASSES = {
  healthy: "text-green-600 dark:text-green-400",
  progress: "text-amber-600 dark:text-amber-400",
  blocked: "text-amber-600 dark:text-amber-400",
  inactive: "text-muted-foreground",
} as const;

function provisionToast(result: AdminProvisionResultDto) {
  const { outcome } = result;
  if (outcome.status === "onboarded") {
    toast.success("Provisioning ran", {
      description: `Provider verification is ${outcome.bindingStatus ?? "in progress"}.`,
    });
  } else if (outcome.status === "incomplete") {
    toast.warning("Provisioning deferred", {
      description: `Missing: ${(outcome.missing ?? [])
        .map((m) => m.field)
        .join(", ")}. Use "Request missing info" to close the gaps.`,
    });
  } else {
    toast.info("Nothing to do", { description: outcome.reason });
  }
}

export function MerchantPaymentsTab({
  organizationId,
}: MerchantPaymentsTabProps) {
  const { data, isLoading } = api.admin.payments.profile.useQuery(
    { path: { id: organizationId } },
    { enabled: !!organizationId },
  );
  const { mutate: provision, isPending: isProvisioning } =
    api.admin.payments.provision.useMutation();

  const profile = data?.data;

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full max-w-xl" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const verdict = derivePaymentsVerdict(profile);
  const ToneIcon = TONE_ICONS[verdict.tone];

  const retryButton = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={verdict.retryPrimary ? "default" : "outline"}
          size="sm"
          disabled={isProvisioning}
        >
          {isProvisioning ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCwIcon className="h-4 w-4" />
          )}
          {profile.bindings.length === 0 ? "Run provisioning" : "Retry provisioning"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run provider provisioning?</AlertDialogTitle>
          <AlertDialogDescription>
            This re-runs the same provisioning the system performs automatically:
            it creates or refreshes the provider customer and resubmits
            verification where possible. The attempt is recorded on the
            organization's audit trail.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              provision(
                { path: { id: organizationId } },
                {
                  onSuccess: (res) => res && provisionToast(res.data),
                  onError: () =>
                    toast.error("Provisioning failed", {
                      description: "See the activity log or server logs for details.",
                    }),
                },
              )
            }
          >
            Run provisioning
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="space-y-6">
      {/* Verdict: the tab's answer, as a sentence */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ToneIcon
            className={`mt-0.5 h-5 w-5 shrink-0 ${TONE_CLASSES[verdict.tone]}`}
          />
          <div>
            <h2 className="text-lg font-semibold">{verdict.headline}</h2>
            {verdict.detail && (
              <p className="text-muted-foreground max-w-2xl text-sm">
                {verdict.detail}
              </p>
            )}
            {verdict.lastChangedAt && (
              <p className="text-muted-foreground mt-1 text-xs">
                Last change{" "}
                {format(new Date(verdict.lastChangedAt), "dd MMM yyyy, HH:mm")}
              </p>
            )}
          </div>
        </div>
        {verdict.canRetry && retryButton}
      </div>

      {/* Guidance: at most one next step, only when someone must act */}
      {verdict.ownership === "applicant" && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>The applicant's move</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Request the corrections through the compliance case so the
              customer gets one clear, white-labeled message.
            </span>
            <Button asChild variant="outline" size="sm">
              <Link to={`/organizations/${organizationId}/compliance`}>
                Open compliance case
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {verdict.tone === "inactive" && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Review and approve the business verification first; provisioning
              then runs automatically.
            </span>
            <Button asChild variant="outline" size="sm">
              <Link to={`/organizations/${organizationId}/compliance`}>
                Open compliance case
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* What's missing and how each gap resolves — read-only; the ask
          action lives on the compliance case (Data completeness panel) */}
      <RequirementsPanel
        requirements={profile.requirements}
        outstandingAsks={profile.outstandingAsks}
      />

      {/* The facts */}
      <RailsTable bindings={profile.bindings} />

      {/* Provider decline detail, only when one exists */}
      {profile.providerVerification && (
        <ProviderVerdictPanel
          verification={profile.providerVerification}
          organizationId={organizationId}
          pending={profile.providerReviewPending}
        />
      )}

      <PayoutDestinations
        bankDetails={profile.bankDetails}
        cryptoPayoutDetails={profile.cryptoPayoutDetails}
      />

      <PaymentsActivity events={profile.events} />
    </div>
  );
}
