import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpecificationsResponseDto } from "@/lib/api/generated";
import { DetailRow } from "./detail-row";

function boolDisplay(value?: boolean): string | undefined {
  if (value == null) return undefined;
  return value ? "Yes" : "No";
}

interface ProductSpecificationsCardsProps {
  specifications: SpecificationsResponseDto;
}

export function ProductSpecificationsCards({
  specifications,
}: ProductSpecificationsCardsProps) {
  const {
    commoditySpecs,
    equipmentSpecs,
    serviceSpecs,
    rentalSpecs,
    charterSpecs,
  } = specifications;

  return (
    <>
      {commoditySpecs && (
        <Card>
          <CardHeader>
            <CardTitle>Commodity Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow label="Grade" value={commoditySpecs.grade} />
            <DetailRow
              label="Pre-inspected by"
              value={commoditySpecs.inspectionCompany}
            />
          </CardContent>
        </Card>
      )}

      {equipmentSpecs && (
        <Card>
          <CardHeader>
            <CardTitle>Equipment Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow
              label="Manufacturer"
              value={equipmentSpecs.manufacturer}
            />
            <DetailRow label="Model" value={equipmentSpecs.model} />
            <DetailRow
              label="Serial Number"
              value={equipmentSpecs.serialNumber}
            />
            <DetailRow label="Year" value={equipmentSpecs.year} />
            <DetailRow label="Warranty" value={equipmentSpecs.warranty} />
            {equipmentSpecs.certifications?.length ? (
              <DetailRow
                label="Certifications"
                value={
                  <div className="flex flex-wrap gap-1">
                    {equipmentSpecs.certifications.map((c, i) => (
                      <Badge key={i} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                }
              />
            ) : null}
          </CardContent>
        </Card>
      )}

      {serviceSpecs && (
        <Card>
          <CardHeader>
            <CardTitle>Service / Project Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow
              label="Scope of Work"
              value={serviceSpecs.scopeOfWork}
            />
            <DetailRow label="Start Date" value={serviceSpecs.startDate} />
            <DetailRow label="End Date" value={serviceSpecs.endDate} />
            <DetailRow
              label="Mobilization Timeline"
              value={serviceSpecs.mobilizationTimeline}
            />
            <DetailRow
              label="Manpower Required"
              value={serviceSpecs.manpowerRequired}
            />
            <DetailRow
              label="Equipment Included"
              value={boolDisplay(serviceSpecs.equipmentIncluded)}
            />
            <DetailRow
              label="HSE Requirements"
              value={serviceSpecs.hseRequirement}
            />
          </CardContent>
        </Card>
      )}

      {rentalSpecs && (
        <Card>
          <CardHeader>
            <CardTitle>Rental / Lease Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow label="Asset Type" value={rentalSpecs.assetType} />
            <DetailRow
              label="Available From"
              value={rentalSpecs.availabilityStart}
            />
            <DetailRow
              label="Available Until"
              value={rentalSpecs.availabilityEnd}
            />
            <DetailRow
              label="Operator Included"
              value={boolDisplay(rentalSpecs.operatorIncluded)}
            />
            <DetailRow
              label="Maintenance Included"
              value={boolDisplay(rentalSpecs.maintenanceIncluded)}
            />
            <DetailRow
              label="Mobilization Included"
              value={boolDisplay(rentalSpecs.mobilizationIncluded)}
            />
            <DetailRow
              label="Deposit Required"
              value={boolDisplay(rentalSpecs.depositRequired)}
            />
          </CardContent>
        </Card>
      )}

      {charterSpecs && (
        <Card>
          <CardHeader>
            <CardTitle>Charter Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow label="Vessel Type" value={charterSpecs.vesselType} />
            <DetailRow label="Charter Type" value={charterSpecs.charterType} />
            <DetailRow
              label="Class Certificate"
              value={charterSpecs.classCertificate}
            />
            <DetailRow
              label="Crew Included"
              value={boolDisplay(charterSpecs.crewIncluded)}
            />
            <DetailRow
              label="Fuel Included"
              value={boolDisplay(charterSpecs.fuelIncluded)}
            />
            <DetailRow
              label="Mobilization Included"
              value={boolDisplay(charterSpecs.mobilizationIncluded)}
            />
            <DetailRow
              label="Demobilization Included"
              value={boolDisplay(charterSpecs.demobilizationIncluded)}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}
