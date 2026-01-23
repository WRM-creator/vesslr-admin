import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AlertTriangle, Lock, ShieldAlert } from "lucide-react";
import type { EscrowDetails } from "../lib/escrow-details-model";

interface EscrowAdminCardProps {
  data: EscrowDetails;
}

export function EscrowAdminCard({ data }: EscrowAdminCardProps) {
  return (
    <Card className="border-amber-200 dark:border-amber-900/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Admin & Risk</CardTitle>
        <ShieldAlert className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Risk Score */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Risk Score</span>
            <span
              className={`text-lg font-bold ${
                data.riskScore > 75
                  ? "text-red-600"
                  : data.riskScore > 30
                    ? "text-amber-600"
                    : "text-emerald-600"
              }`}
            >
              {data.riskScore}/100
            </span>
          </div>
          <div className="bg-secondary h-2.5 w-full overflow-hidden rounded-full">
            <div
              className={`h-full rounded-full transition-all ${
                data.riskScore > 75
                  ? "bg-red-500"
                  : data.riskScore > 30
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${data.riskScore}%` }}
            />
          </div>
        </div>

        <Separator />

        {/* Admin Notes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Admin Notes</h4>
          {data.adminNotes.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">
              No notes added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {data.adminNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-muted/50 rounded-lg p-3 text-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{note.author}</span>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(note.date), "MMM d, HH:mm")}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{note.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 pt-2">
            <Textarea
              placeholder="Add an internal note..."
              className="min-h-[80px] text-sm"
            />
            <Button size="sm" className="w-full">
              Add Note
            </Button>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Dangerous Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
            >
              <Lock className="mr-2 h-4 w-4" />
              Force Release Funds
            </Button>
            <Button
              variant="outline"
              className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Put on Admin Hold
            </Button>
          </div>
        </div>

        {data.overrides.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Override History
            </h4>
            <div className="space-y-2">
              {data.overrides.map((override, i) => (
                <div
                  key={i}
                  className="border-l-2 border-amber-300 bg-amber-50/50 p-1 pl-2 text-xs"
                >
                  <div className="flex justify-between font-medium">
                    <span>{override.action}</span>
                    <span>{format(new Date(override.date), "MMM d")}</span>
                  </div>
                  <p className="text-muted-foreground">
                    {override.reason} - {override.admin}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
