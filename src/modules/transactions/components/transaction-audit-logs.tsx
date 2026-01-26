import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { AlertCircle, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";

interface AuditLogEvent {
  id: string;
  title: string;
  actor: string;
  timestamp: Date;
  type: "admin" | "user" | "system";
  metadata?: {
    reason?: string;
    documentName?: string;
    [key: string]: any;
  };
}

const MOCK_EVENTS: AuditLogEvent[] = [
  {
    id: "0",
    title: "Compliance Document Rejected",
    actor: "Compliance Officer",
    timestamp: new Date(),
    type: "admin",
    metadata: {
      reason:
        "The uploaded document is expired. Please upload a valid certificate.",
      documentName: "Certificate of Incorporation",
    },
  },
  {
    id: "1",
    title: "Admin overrode status",
    actor: "Admin User",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    type: "admin",
  },
  {
    id: "2",
    title: "Seller uploaded Invoice",
    actor: "Dangote Refinery",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    type: "user",
  },
  {
    id: "3",
    title: "Buyer funded escrow",
    actor: "Total Energies",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    type: "user",
  },
];

export function TransactionAuditLogs() {
  const [selectedEvent, setSelectedEvent] = useState<AuditLogEvent | null>(
    null,
  );

  return (
    <>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_EVENTS.map((event, index) => (
            <div key={event.id} className="flex items-start gap-3 text-sm">
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  index === 0 ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div
                      className={`font-medium ${
                        index !== 0 ? "text-muted-foreground" : ""
                      }`}
                    >
                      {event.title}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {event.actor}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDateTime(event.timestamp)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1 text-xs"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Action performed by {selectedEvent?.actor} on{" "}
              {selectedEvent && formatDateTime(selectedEvent.timestamp)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Specialized view for Compliance Rejection */}
            {selectedEvent?.metadata?.documentName &&
            selectedEvent?.metadata?.reason ? (
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4" />
                  {selectedEvent.metadata.documentName}
                </div>
                <div className="text-muted-foreground mt-2 text-sm">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium tracking-wide text-red-500 uppercase">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Rejection Reason
                  </div>
                  <p className="pl-5">{selectedEvent.metadata.reason}</p>
                </div>
              </div>
            ) : selectedEvent?.metadata ? (
              /* Generic Metadata View (fallback or additional info) */
              <div className="bg-muted rounded-md p-4 font-mono text-xs">
                <pre>{JSON.stringify(selectedEvent.metadata, null, 2)}</pre>
              </div>
            ) : (
              /* No Metadata View */
              <div className="text-muted-foreground text-center text-sm italic">
                No additional details available for this event.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
