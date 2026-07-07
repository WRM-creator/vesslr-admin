import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { SearchIcon } from "lucide-react";
import { formatProvider, matchLabel } from "../lib/format";

/**
 * Dry-run a corridor against the live routing table: shows the winning rule
 * and resulting providers, or an explicit "no route" warning. Read-only.
 */
export function ResolvePreviewCard() {
  const [currency, setCurrency] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [submitted, setSubmitted] = useState<{
    currency: string;
    country: string;
    region?: string;
  } | null>(null);

  const { data, isFetching } = api.admin.routing.resolve.useQuery(
    {
      query: submitted
        ? {
            currency: submitted.currency,
            country: submitted.country,
            ...(submitted.region ? { region: submitted.region } : {}),
          }
        : { currency: "", country: "" },
    },
    { enabled: !!submitted },
  );
  const result = submitted ? data?.data : undefined;

  const canResolve = currency.trim() !== "" && country.trim() !== "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Resolve a corridor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="rp-currency">Currency</Label>
            <Input
              id="rp-currency"
              className="w-28"
              placeholder="NGN"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rp-country">Country</Label>
            <Input
              id="rp-country"
              className="w-24"
              placeholder="NG"
              maxLength={2}
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rp-region">Region (optional)</Label>
            <Input
              id="rp-region"
              className="w-32"
              placeholder="Any"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            disabled={!canResolve || isFetching}
            onClick={() =>
              setSubmitted({
                currency: currency.trim(),
                country: country.trim(),
                region: region.trim() || undefined,
              })
            }
          >
            <SearchIcon className="h-4 w-4" />
            Resolve
          </Button>
        </div>

        {result && (
          <div className="text-sm">
            {result.routed ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    Custodian:{" "}
                    <span className="font-medium">
                      {result.custodian ? formatProvider(result.custodian) : "-"}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Bank directory:{" "}
                    {result.bankDirectoryProvider
                      ? formatProvider(result.bankDirectoryProvider)
                      : "-"}
                  </span>
                  <span className="text-muted-foreground">
                    Account resolution:{" "}
                    {result.accountResolutionProvider
                      ? formatProvider(result.accountResolutionProvider)
                      : "-"}
                  </span>
                  {result.rule && (
                    <Badge variant="secondary">
                      via rule: {matchLabel(result.rule)}
                    </Badge>
                  )}
                </div>
                {(result.offeredCustodians?.length ?? 0) > 1 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">
                      Offered wallets:
                    </span>
                    {result.offeredCustodians?.map((p, i) => (
                      <Badge key={p} variant={i === 0 ? "default" : "outline"}>
                        {formatProvider(p)}
                        {i === 0 ? " · default" : ""}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-destructive">
                No route: payments on this corridor fail with
                NoRouteForCorridorError until a matching rule exists.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
