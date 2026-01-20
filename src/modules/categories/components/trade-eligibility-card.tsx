import { ShieldAlert } from "lucide-react";
import type { Category } from "../../lib/category-details-model";

interface TradeEligibilityCardProps {
  data: Category["eligibility"];
}

export function TradeEligibilityCard({ data }: TradeEligibilityCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Seller Rules Column */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base">Seller Rules</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Allowed Seller Types</h4>
            <ul className="grid grid-cols-1 gap-1">
              {data.allowedSellerTypes.map((type) => (
                <li key={type} className="text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {type}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Allowed Seller Countries</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.geographicConstraints.allowedSellerCountries.map((country) => (
                <span key={country} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md border">
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div>
             <h4 className="text-sm font-medium text-muted-foreground mb-1">Minimum Trust Score</h4>
             <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold">{data.minTrustScore}</span>
                 <span className="text-xs text-muted-foreground">/ 100</span>
             </div>
          </div>
        </div>
      </div>

      {/* Buyer Rules Column */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base">Buyer Rules</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Allowed Buyer Types</h4>
             <ul className="grid grid-cols-1 gap-1">
              {data.allowedBuyerTypes.map((type) => (
                <li key={type} className="text-sm flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {type}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Allowed Buyer Countries</h4>
             <div className="flex flex-wrap gap-1.5">
              {data.geographicConstraints.allowedBuyerCountries.map((country) => (
                <span key={country} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md border">
                  {country}
                </span>
              ))}
            </div>
          </div>

          {data.geographicConstraints.restrictedDeliveryCountries.length > 0 && (
              <div>
                 <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                     <ShieldAlert className="h-3.5 w-3.5" />
                     Restricted Delivery
                 </h4>
                 <div className="flex flex-wrap gap-1.5">
                  {data.geographicConstraints.restrictedDeliveryCountries.map((country) => (
                    <span key={country} className="px-2.5 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-md border border-red-200 dark:border-red-900">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
