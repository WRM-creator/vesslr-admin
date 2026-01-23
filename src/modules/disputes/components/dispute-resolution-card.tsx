import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CheckCircle2, Gavel, Shield, XCircle } from "lucide-react";
import type { DisputeDetails } from "../lib/dispute-details-model";

interface DisputeResolutionCardProps {
  data: DisputeDetails;
}

export function DisputeResolutionCard({ data }: DisputeResolutionCardProps) {
  const isResolved = data.status === "resolved" || data.status === "closed";

  if (isResolved && data.resolution) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
            Case Resolved
          </CardTitle>
          <Gavel className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Badge outcome={data.resolution.outcome} />
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Admin Judgment
            </span>
            <p className="bg-background/50 rounded-md border border-emerald-100 p-3 text-sm dark:border-emerald-800/50">
              {data.resolution.adminNotes}
            </p>
          </div>
          <div className="text-muted-foreground flex justify-between pt-2 text-xs">
            <span>By {data.resolution.resolvedBy}</span>
            <span>{format(new Date(data.resolution.resolvedAt), "PPP p")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 border-b pb-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Gavel className="h-5 w-5" />
            Admin Resolution
          </CardTitle>
          <span className="text-muted-foreground text-xs">Case #{data.id}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Judgment Notes (Required)
          </label>
          <Textarea
            placeholder="Explain the reason for this decision..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Verdict</label>
          <div className="grid grid-cols-1 gap-2">
            <Button className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Rule in Favor of Claimant
              <span className="ml-auto text-xs opacity-80">Full Refund</span>
            </Button>

            <Button className="w-full justify-start bg-orange-600 text-white hover:bg-orange-700">
              <Shield className="mr-2 h-4 w-4" />
              Rule in Favor of Respondent
              <span className="ml-auto text-xs opacity-80">Release Funds</span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">⚖️</span> Split
              </Button>
              <Button
                variant="outline"
                className="text-muted-foreground w-full justify-start"
              >
                <XCircle className="mr-2 h-4 w-4" /> Dismiss
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <p className="text-muted-foreground text-center text-xs">
          This action is final and will trigger immediate fund updates.
        </p>
      </CardContent>
    </Card>
  );
}

function Badge({ outcome }: { outcome: string }) {
  const styles = {
    favor_claimant: "bg-blue-100 text-blue-800 border-blue-200",
    favor_respondent: "bg-orange-100 text-orange-800 border-orange-200",
    split: "bg-purple-100 text-purple-800 border-purple-200",
    dismissed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labels = {
    favor_claimant: "Ruled for Claimant",
    favor_respondent: "Ruled for Respondent",
    split: "Split Decision",
    dismissed: "Case Dismissed",
  };

  // @ts-ignore
  const style = styles[outcome] || styles.dismissed;
  // @ts-ignore
  const label = labels[outcome] || outcome;

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
