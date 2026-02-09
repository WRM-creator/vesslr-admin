import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ExternalLink, Mail } from "lucide-react";
import type { Dispute, DisputeParty } from "./dispute-types";

interface DisputePartiesProps {
  dispute: Dispute;
}

export function DisputeParties({ dispute }: DisputePartiesProps) {
  return (
    <Card>
      <CardHeader className="mb-2 max-h-5">
        <CardTitle className="text-base font-medium">Parties</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <PartyCard party={dispute.claimant} label="Claimant" />
        <PartyCard party={dispute.respondent} label="Respondent" />
      </CardContent>
    </Card>
  );
}

function PartyCard({ party, label }: { party: DisputeParty; label: string }) {
  const isClaimant = label === "Claimant";

  // Trust score color logic
  const getTrustColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={cn(
        "bg-card flex flex-col justify-between rounded-lg border p-4 transition-all",
        {
          "border-primary": isClaimant,
        },
      )}
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <Badge
            variant={isClaimant ? "default" : "secondary"}
            className="capitalize"
          >
            {label}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {party.side}
          </Badge>
        </div>

        <div className="mb-2 flex items-start gap-4">
          <div className="space-y-1">
            <h4 className="leading-none font-semibold tracking-tight">
              {party.subtext}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs">Trust Score:</span>
              <span className="text-sm font-medium">{party.trustScore}</span>
              <Progress
                value={party.trustScore}
                className="h-1 w-16"
                indicatorClassName={getTrustColor(party.trustScore)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
        <Button
          variant="link"
          size="sm"
          className="text-foreground size-fit justify-start px-0!"
        >
          <ExternalLink className="text-muted-foreground size-3.5" />
          <span className="text-xs">View</span>
        </Button>
        <Button
          variant="link"
          size="sm"
          className="text-foreground size-fit justify-start px-0!"
        >
          <Mail className="text-muted-foreground size-3.5" />
          <span className="text-xs">Contact</span>
        </Button>
      </div>
    </div>
  );
}
