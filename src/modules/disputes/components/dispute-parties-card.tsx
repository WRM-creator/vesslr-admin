import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Gavel, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { PartyInfo } from "../lib/dispute-details-model";

interface DisputePartiesCardProps {
  claimant: PartyInfo;
  respondent: PartyInfo;
}

function PartyProfile({
  party,
  label,
  roleColor,
}: {
  party: PartyInfo;
  label: string;
  roleColor: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`mb-4 rounded-full px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${roleColor}`}
      >
        {label}
      </div>
      <Avatar className="border-background h-16 w-16 border-2 shadow-sm">
        <AvatarImage src={party.avatar} alt={party.name} />
        <AvatarFallback>
          {party.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="mt-3">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="text-lg font-semibold">{party.name}</h3>
          {party.verificationStatus === "verified" && (
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          )}
        </div>
        <p className="text-muted-foreground text-sm">{party.companyName}</p>
      </div>

      <div className="mt-4 flex w-full max-w-[140px] flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Trust Score</span>
          <span className="font-semibold">{party.trustScore}/100</span>
        </div>
        <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${party.trustScore > 80 ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${party.trustScore}%` }}
          />
        </div>
      </div>

      <Button
        variant="link"
        size="sm"
        className="mt-2 h-auto p-0 text-xs"
        asChild
      >
        <Link to={party.profileUrl} className="flex items-center gap-1">
          View Profile <ExternalLink className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}

export function DisputePartiesCard({
  claimant,
  respondent,
}: DisputePartiesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Parties Involved</CardTitle>
        <Gavel className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="relative pt-6">
          <div className="grid grid-cols-[1fr,auto,1fr] items-start gap-4">
            <PartyProfile
              party={claimant}
              label="Claimant"
              roleColor="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            />

            {/* VS Separator */}
            <div className="flex h-full flex-col items-center justify-center pt-8">
              <div className="bg-muted text-muted-foreground rounded-full p-2 text-xs font-black">
                VS
              </div>
            </div>

            <PartyProfile
              party={respondent}
              label="Respondent"
              roleColor="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
