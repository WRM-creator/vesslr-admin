import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductListingCardProps {
  listingType?: string;
  conditions?: string[];
}

export function ProductListingCard({
  listingType,
  conditions,
}: ProductListingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Type & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {listingType && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase">
              Listing Type
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{listingType}</Badge>
            </div>
          </div>
        )}
        {conditions && conditions.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase">
              Condition
            </p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <Badge key={c} variant="outline">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
