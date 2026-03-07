import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComplianceCase } from "./placeholder-data";

interface DeclarationsSectionProps {
  declarations: ComplianceCase["declarations"];
}

export function DeclarationsSection({ declarations }: DeclarationsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Declarations</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              PEP Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {declarations.isPep ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-600">PEP</p>
                {declarations.pepDetails && (
                  <p className="text-muted-foreground text-sm">{declarations.pepDetails}</p>
                )}
              </div>
            ) : (
              <p className="text-sm font-medium">Not a PEP</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Source of Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{declarations.sourceOfFunds}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Sanctions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {declarations.sanctionsDeclaration ? (
              <p className="text-sm font-medium">Declared none</p>
            ) : (
              <p className="text-sm font-medium text-red-600">Not declared</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
