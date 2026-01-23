import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Circle,
  LayoutList,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import type { ReleaseCondition } from "../lib/escrow-details-model";

interface EscrowReleaseConditionsCardProps {
  conditions: ReleaseCondition[];
}

export function EscrowReleaseConditionsCard({
  conditions,
}: EscrowReleaseConditionsCardProps) {
  const metCount = conditions.filter((c) => c.status !== "pending").length;
  const progress = Math.round((metCount / conditions.length) * 100);

  const getStatusIcon = (status: ReleaseCondition["status"]) => {
    switch (status) {
      case "met":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "waived":
        return <Zap className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="text-muted-foreground h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Release Conditions
        </CardTitle>
        <LayoutList className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {metCount}/{conditions.length} Met
            </span>
          </div>
          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {conditions.map((condition) => (
            <div
              key={condition.id}
              className="group hover:bg-muted/50 flex flex-col gap-2 rounded-lg border p-3 text-sm transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getStatusIcon(condition.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="leading-none font-medium">
                      {condition.description}
                    </p>
                    {condition.metAt && (
                      <p className="text-muted-foreground text-xs">
                        Met on {new Date(condition.metAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {condition.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {condition.status === "pending" && (
                <div className="flex gap-2 pl-8">
                  <Button variant="outline" className="h-7 px-2 text-xs">
                    Force Meet
                  </Button>
                  <Button variant="outline" className="h-7 px-2 text-xs">
                    Waive
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
