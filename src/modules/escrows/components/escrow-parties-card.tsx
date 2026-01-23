import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ExternalLink, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { PartyInfo } from "../lib/escrow-details-model";

interface EscrowPartiesCardProps {
  merchant: PartyInfo;
  customer: PartyInfo;
}

function PartyProfile({
  party,
  role,
}: {
  party: PartyInfo;
  role: "Buyer" | "Seller";
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
        {role}
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

export function EscrowPartiesCard({
  merchant,
  customer,
}: EscrowPartiesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Counterparties</CardTitle>
        <Users className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="relative pt-6">
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
            <PartyProfile party={customer} role="Buyer" />

            {/* Connection Arrow */}
            <div className="text-muted-foreground flex flex-col items-center justify-center px-4">
              <div className="bg-border absolute top-1/2 left-0 z-0 hidden h-px w-full md:block" />
              <div className="bg-card z-10 rounded-full border p-2 shadow-sm">
                <ArrowRight className="h-5 w-5" />
              </div>
              <span className="bg-card z-10 mt-2 px-2 text-[10px] font-medium">
                Flow of Funds
              </span>
            </div>

            <PartyProfile party={merchant} role="Seller" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
