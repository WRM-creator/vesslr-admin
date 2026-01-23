import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { PartyInfo } from "../lib/transaction-details-model";

interface CounterpartiesCardProps {
  buyer: PartyInfo;
  seller: PartyInfo;
}

function PartyProfile({
  party,
  role,
}: {
  party: PartyInfo;
  role: "Customer" | "Merchant";
}) {
  return (
    <div className="bg-muted/30 flex-1 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Building2 className="text-primary h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">{party.companyName}</span>
              {party.verificationStatus === "verified" && (
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            <span className="text-muted-foreground text-xs">{role}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
          <Link to={party.profileUrl} className="flex items-center gap-1">
            View <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Trust Score</span>
          <div className="flex items-center gap-1.5">
            <div className="bg-secondary h-1.5 w-16 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${party.trustScore > 80 ? "bg-emerald-500" : party.trustScore > 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${party.trustScore}%` }}
              />
            </div>
            <span className="font-medium">{party.trustScore}</span>
          </div>
        </div>
        <div className="bg-border h-3 w-px" />
        <span className="text-muted-foreground">
          {party.verificationStatus === "verified"
            ? "Verified"
            : party.verificationStatus === "pending"
              ? "Pending"
              : "Unverified"}
        </span>
      </div>
    </div>
  );
}

export function CounterpartiesCard({ buyer, seller }: CounterpartiesCardProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <PartyProfile party={buyer} role="Customer" />
      <PartyProfile party={seller} role="Merchant" />
    </div>
  );
}
