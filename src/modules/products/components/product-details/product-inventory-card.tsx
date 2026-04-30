import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DetailRow } from "./detail-row";

interface ProductInventoryCardProps {
  availableQuantity?: number;
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;
  unitOfMeasurement?: string;
}

export function ProductInventoryCard({
  availableQuantity,
  minimumOrderQuantity,
  maximumOrderQuantity,
  unitOfMeasurement,
}: ProductInventoryCardProps) {
  const unit = unitOfMeasurement ?? "units";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        {availableQuantity != null && (
          <DetailRow
            label="Available quantity"
            value={`${availableQuantity} ${unit}`}
          />
        )}
        {minimumOrderQuantity != null && (
          <DetailRow
            label="Minimum order"
            value={`${minimumOrderQuantity} ${unit}`}
          />
        )}
        {maximumOrderQuantity != null && (
          <DetailRow
            label="Maximum order"
            value={`${maximumOrderQuantity} ${unit}`}
          />
        )}
        {unitOfMeasurement && (
          <DetailRow
            label="Unit of measurement"
            value={unitOfMeasurement}
          />
        )}
      </CardContent>
    </Card>
  );
}
