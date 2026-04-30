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
            <DetailRow label="Origin" value={commoditySpecs.origin} />
            <DetailRow label="API Gravity" value={commoditySpecs.apiGravity} />
            <DetailRow
              label="Sulphur Content (%)"
              value={commoditySpecs.sulphurContent}
            />
            <DetailRow label="Density" value={commoditySpecs.density} />
            <DetailRow
              label="Pricing Basis"
              value={commoditySpecs.pricingBasis}
            />
            <DetailRow
              label="Loading Port"
              value={commoditySpecs.loadingPort}
            />
            <DetailRow
              label="Discharge Port"
              value={commoditySpecs.dischargePort}
            />
            <DetailRow label="Terminal" value={commoditySpecs.terminal} />
            <DetailRow
              label="Inspection Company"
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
            <DetailRow label="Condition" value={equipmentSpecs.condition} />
            <DetailRow label="Warranty" value={equipmentSpecs.warranty} />
            <DetailRow
              label="Datasheet URL"
              value={equipmentSpecs.datasheetUrl}
            />
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
            <DetailRow label="Location" value={serviceSpecs.location} />
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
            <DetailRow label="Rate" value={rentalSpecs.rate} />
            <DetailRow label="Rate Unit" value={rentalSpecs.rateUnit} />
            <DetailRow label="Duration" value={rentalSpecs.duration} />
            <DetailRow
              label="Duration Unit"
              value={rentalSpecs.durationUnit}
            />
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
            <DetailRow label="Duration" value={charterSpecs.duration} />
            <DetailRow
              label="Duration Unit"
              value={charterSpecs.durationUnit}
            />
            <DetailRow label="Day Rate" value={charterSpecs.dayRate} />
            <DetailRow
              label="Lump Sum Rate"
              value={charterSpecs.lumpSumRate}
            />
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
            {charterSpecs.ports?.length ? (
              <DetailRow
                label="Ports"
                value={
                  <div className="flex flex-wrap gap-1">
                    {charterSpecs.ports.map((p, i) => (
                      <Badge key={i} variant="outline">
                        {p}
                      </Badge>
                    ))}
                  </div>
                }
              />
            ) : null}
          </CardContent>
        </Card>
      )}
    </>
  );
}
