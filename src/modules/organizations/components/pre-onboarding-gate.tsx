import { onboardingStageLabel } from "../lib/onboarding-stage";

interface PreOnboardingGateProps {
  /** Section name shown in the overlay, e.g. "Products". */
  section: string;
  onboardingStep?: string;
}

/**
 * Ghost state for post-approval sections on an org that never submitted
 * onboarding: a blurred placeholder of the section's active self with the
 * status and next step overlaid, so the surface teaches what it becomes
 * instead of rendering an empty table that reads as a bug.
 */
export function PreOnboardingGate({
  section,
  onboardingStep,
}: PreOnboardingGateProps) {
  return (
    <div className="bg-card relative overflow-hidden rounded-xl border">
      <div
        aria-hidden
        className="pointer-events-none space-y-4 p-6 opacity-40 blur-[5px] select-none"
      >
        <div className="bg-muted h-5 w-40 rounded" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="bg-muted h-4 w-1/4 rounded" />
            <div className="bg-muted h-4 w-1/6 rounded" />
            <div className="bg-muted h-4 w-1/5 rounded" />
            <div className="bg-muted h-4 w-1/6 rounded" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center">
        <span className="text-sm font-medium">
          {section} activates after onboarding
        </span>
        <span className="text-muted-foreground max-w-md text-sm">
          This organization is still onboarding, currently at{" "}
          {onboardingStageLabel(onboardingStep)}. This section fills in once
          they submit for review and are approved.
        </span>
      </div>
    </div>
  );
}
