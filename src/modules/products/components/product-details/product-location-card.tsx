import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ProductLocationCardProps {
  address?: string;
  state?: string;
  region?: string;
  country?: string;
}

export function ProductLocationCard({
  address,
  state,
  region,
  country,
}: ProductLocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-muted-foreground">
            {[address, state, region, country].filter(Boolean).join(", ")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
