import type { Category } from "../lib/category-details-model";

interface TradeEligibilityCardProps {
  data: Category["eligibility"];
}

export function TradeEligibilityCard({ data }: TradeEligibilityCardProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Seller Rules Column */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Seller Rules</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Allowed Seller Types
            </h4>
            <ul className="grid grid-cols-1 gap-1">
              {data.allowedSellerTypes.map((type) => (
                <li key={type} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Allowed Seller Countries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {data.geographicConstraints.allowedSellerCountries.map(
                (country) => (
                  <span
                    key={country}
                    className="bg-secondary text-secondary-foreground rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    {country}
                  </span>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
              Minimum Trust Score
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {data.minSellerTrustScore}
              </span>
              <span className="text-muted-foreground text-xs">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Rules Column */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Buyer Rules</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Allowed Buyer Types
            </h4>
            <ul className="grid grid-cols-1 gap-1">
              {data.allowedBuyerTypes.map((type) => (
                <li key={type} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Allowed Buyer Countries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {data.geographicConstraints.allowedBuyerCountries.map(
                (country) => (
                  <span
                    key={country}
                    className="bg-secondary text-secondary-foreground rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    {country}
                  </span>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
              Minimum Trust Score
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {data.minBuyerTrustScore}
              </span>
              <span className="text-muted-foreground text-xs">/ 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
