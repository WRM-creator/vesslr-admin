import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLinkIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

interface MerchantComplianceTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
}

export function MerchantComplianceTab({
  organization,
}: MerchantComplianceTabProps) {
  const documents = organization.additionalDocuments || [];

  // Mock history for demonstration
  if (!organization.verificationHistory) {
    organization.verificationHistory = [
      {
        action: "rejected",
        date: new Date(Date.now() - 86400000).toISOString(),
        reason: "Invalid tax ID document provided.",
        actor: "Admin User",
      },
    ];
  }
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = () => {
    // Stub for approval logic
    console.log("Approving organization", organization._id);
    setIsApproveDialogOpen(false);
  };

  const handleReject = () => {
    // Stub for rejection logic
    console.log(
      "Rejecting organization",
      organization._id,
      "Reason:",
      rejectionReason,
    );
    setIsRejectDialogOpen(false);
  };

  const isPending = organization.verificationStatus === "pending";

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Legal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Tax ID
              </span>
              <p className="mt-1">{organization.taxId || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                RC Number
              </span>
              <p className="mt-1">{organization.rcNumber || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {documents.map(
                (doc: { name: string; url: string; _id?: string }) => (
                  <Item
                    key={doc._id || doc.name}
                    variant="outline"
                    className="overflow-hidden"
                  >
                    <ItemMedia variant="icon" className="size-10">
                      <FileTextIcon className="size-5" strokeWidth={1.2} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="capitalize">{doc.name}</ItemTitle>
                      <ItemDescription>PDF Document</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      </Button>
                    </ItemActions>
                  </Item>
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
              <div className="bg-muted rounded-full p-3">
                <FileTextIcon className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
                This merchant hasn't uploaded any additional documents yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {(isPending || (organization.verificationHistory?.length ?? 0) > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Application Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* History Section */}
            {(organization.verificationHistory?.length ?? 0) > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Decision History</h4>
                <div className="rounded-md border">
                  {organization.verificationHistory.map(
                    (entry: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1 border-b p-3 text-sm last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={
                              entry.action === "approved"
                                ? "font-medium text-green-600 capitalize"
                                : "font-medium text-red-600 capitalize"
                            }
                          >
                            {entry.action}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(entry.date).toLocaleString()}
                          </span>
                        </div>
                        {entry.reason && (
                          <div className="text-muted-foreground">
                            Reason: {entry.reason}
                          </div>
                        )}
                        <div className="text-muted-foreground text-xs">
                          By: {entry.actor}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
            {isPending && (
              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="default"
                  onClick={() => setIsApproveDialogOpen(true)}
                >
                  Approve Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(true)}
                >
                  Reject Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this organization? They will gain
              full access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this organization. This will
              be sent to the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason" className="mb-2 block text-sm font-medium">
              Rejection Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g. Invalid documents..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
