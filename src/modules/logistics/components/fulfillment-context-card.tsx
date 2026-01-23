import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, FileText, Package, User } from "lucide-react";
import { Link } from "react-router-dom";
import type {
  FulfillmentDetails,
  PartyInfo,
} from "../lib/fulfillment-details-model";

interface FulfillmentContextCardProps {
  data: FulfillmentDetails;
}

function PartyDetails({
  label,
  party,
  address,
}: {
  label: string;
  party: PartyInfo;
  address: FulfillmentDetails["origin"];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        <User className="h-3.5 w-3.5" /> {label}
      </h4>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 rounded-full border">
          <AvatarFallback className="text-xs">
            {party.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <div className="text-sm font-medium">{party.name}</div>
          <div className="text-muted-foreground text-xs">
            {party.companyName}
          </div>
          <div className="text-muted-foreground mt-2 font-mono text-xs">
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
            <br />
            {address.country}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FulfillmentContextCard({ data }: FulfillmentContextCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Shipment Context</CardTitle>
        <Package className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Contents */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <BoxIcon className="h-3.5 w-3.5" /> Contents
          </h4>
          <div className="bg-muted/40 flex items-start gap-3 rounded-lg border p-3">
            <div className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-md border">
              <Package className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {data.productName}
              </div>
              <div className="text-muted-foreground mt-1 flex gap-3 text-xs">
                <span>Qty: {data.quantity}</span>
                <span>Weight: {data.weight}</span>
                {data.dimensions && <span>Dims: {data.dimensions}</span>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              asChild
            >
              <Link to={`/products/${data.productId}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Parties */}
        <div className="space-y-6">
          <PartyDetails
            label="From (Sender)"
            party={data.sender}
            address={data.origin}
          />
          <PartyDetails
            label="To (Recipient)"
            party={data.recipient}
            address={data.destination}
          />
        </div>

        <Separator />

        {/* Transaction Link */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            <span>Transaction Reference</span>
          </div>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link to={`/transactions/${data.transactionId}`}>
              {data.transactionId} <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
