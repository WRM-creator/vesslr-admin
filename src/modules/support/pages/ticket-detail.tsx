import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CALLOUT } from "@/lib/tint";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { AdminSummaryDto } from "@/lib/api/generated";
import { cn, formatDateTime } from "@/lib/utils";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "../components/ticket-status-badge";

interface TicketMessage {
  _id: string;
  body: string;
  sender?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
  };
  senderType: "user" | "admin" | "system";
  isInternal?: boolean;
  createdAt: string;
}

interface TicketDetail {
  _id: string;
  displayId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  organization?: {
    _id: string;
    name: string;
    displayId?: string;
  };
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
  };
  messages: TicketMessage[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [replyBody, setReplyBody] = React.useState("");
  const [isInternal, setIsInternal] = React.useState(false);
  const [resolveNote, setResolveNote] = React.useState("");
  const [resolveDialogOpen, setResolveDialogOpen] = React.useState(false);

  const { data: ticketData, isLoading } = api.support.detail.useQuery({
    path: { id: id! },
  });
  const { data: adminsData } = api.support.adminSummary.useQuery(
    undefined as never,
  );

  const ticket = ((ticketData as any)?.data ?? null) as TicketDetail | null;

  const admins = ((adminsData as any)?.data ??
    []) as unknown as AdminSummaryDto[];

  const updateMutation = api.support.update.useMutation({
    onSuccess: () => {
      toast.success("Ticket updated");
    },
    onError: () => {
      toast.error("Failed to update ticket");
    },
  });

  const addMessageMutation = api.support.addMessage.useMutation({
    onSuccess: () => {
      setReplyBody("");
      setIsInternal(false);
      toast.success(isInternal ? "Internal note added" : "Reply sent");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  const resolveMutation = api.support.resolve.useMutation({
    onSuccess: () => {
      setResolveDialogOpen(false);
      setResolveNote("");
      toast.success("Ticket resolved");
    },
    onError: () => {
      toast.error("Failed to resolve ticket");
    },
  });

  const handleUpdate = (field: string, value: string) => {
    if (!id) return;
    updateMutation.mutate({
      path: { id },
      body: { [field]: value },
    } as never);
  };

  const handleSendMessage = () => {
    if (!id || !replyBody.trim()) return;
    addMessageMutation.mutate({
      path: { id },
      body: {
        body: replyBody.trim(),
        isInternal,
      },
    } as never);
  };

  const handleResolve = () => {
    if (!id || !resolveNote.trim()) return;
    resolveMutation.mutate({
      path: { id },
      body: { note: resolveNote.trim() },
    } as never);
  };

  const formattedDisplayId = ticket?.displayId
    ? `TKT-${String(ticket.displayId).padStart(5, "0")}`
    : (id?.slice(-6).toUpperCase() ?? "");

  if (isLoading) {
    return (
      <Page>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/support")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-muted-foreground py-12 text-center">
          Loading ticket...
        </div>
      </Page>
    );
  }

  if (!ticket) {
    return (
      <Page>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/support")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-muted-foreground py-12 text-center">
          Ticket not found
        </div>
      </Page>
    );
  }

  const getSenderName = (message: TicketMessage) => {
    if (!message.sender) return "System";
    if (message.sender.name) return message.sender.name;
    if (message.sender.firstName) {
      return `${message.sender.firstName} ${message.sender.lastName ?? ""}`.trim();
    }
    return message.sender.email ?? "Unknown";
  };

  return (
    <Page>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/support")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>

      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg">{formattedDisplayId}</span>
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            <TicketCategoryBadge category={ticket.category} />
          </div>
        }
        description={ticket.subject}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content - Messages */}
        <div className="space-y-4">
          {/* Ticket info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    Organization
                  </p>
                  <p className="text-sm font-medium">
                    {ticket.organization?.name ?? "N/A"}
                    {ticket.organization?.displayId && (
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({ticket.organization.displayId})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    Created By
                  </p>
                  <p className="text-sm font-medium">
                    {ticket.createdBy
                      ? `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}`
                      : "N/A"}
                  </p>
                  {ticket.createdBy?.email && (
                    <p className="text-muted-foreground text-xs">
                      {ticket.createdBy.email}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    Created
                  </p>
                  <p className="text-sm">{formatDateTime(ticket.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    Last Updated
                  </p>
                  <p className="text-sm">{formatDateTime(ticket.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message thread */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messages?.length > 0 ? (
                ticket.messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "rounded-lg border p-4",
                      message.isInternal && CALLOUT.amber,
                      message.senderType === "admin" &&
                        !message.isInternal &&
                        CALLOUT.blue,
                      message.senderType === "system" &&
                        "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {getSenderName(message)}
                        </span>
                        {message.isInternal && (
                          <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 uppercase dark:bg-amber-800 dark:text-amber-200">
                            Internal Note
                          </span>
                        )}
                        {message.senderType === "admin" &&
                          !message.isInternal && (
                            <span className="rounded bg-blue-200 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800 uppercase dark:bg-blue-800 dark:text-blue-200">
                              Admin
                            </span>
                          )}
                        {message.senderType === "system" && (
                          <span className="text-muted-foreground rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase dark:bg-gray-700">
                            System
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {formatDateTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.body}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No messages yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reply box */}
          {ticket.status !== "closed" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Textarea
                    placeholder={
                      isInternal
                        ? "Write an internal note..."
                        : "Type your reply..."
                    }
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={4}
                    className={cn(
                      isInternal &&
                        "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="internal-note"
                        checked={isInternal}
                        onCheckedChange={(checked) =>
                          setIsInternal(checked === true)
                        }
                      />
                      <Label
                        htmlFor="internal-note"
                        className="text-sm font-normal"
                      >
                        Internal note (only visible to admins)
                      </Label>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        !replyBody.trim() || addMessageMutation.isPending
                      }
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {addMessageMutation.isPending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Admin actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase">
                  Assign To
                </Label>
                <Select
                  value={ticket.assignedTo?._id ?? "unassigned"}
                  onValueChange={(value) =>
                    handleUpdate(
                      "assignedTo",
                      value === "unassigned" ? "" : value,
                    )
                  }
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {admins.map((admin) => (
                      <SelectItem key={admin._id} value={admin._id}>
                        {admin.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase">
                  Priority
                </Label>
                <Select
                  value={ticket.priority}
                  onValueChange={(value) => handleUpdate("priority", value)}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase">Status</Label>
                <Select
                  value={ticket.status}
                  onValueChange={(value) => handleUpdate("status", value)}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="awaiting_admin">
                      Awaiting Admin
                    </SelectItem>
                    <SelectItem value="awaiting_user">Awaiting User</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Dialog
                open={resolveDialogOpen}
                onOpenChange={setResolveDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    disabled={
                      ticket.status === "resolved" || ticket.status === "closed"
                    }
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Resolve Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resolve Ticket</DialogTitle>
                    <DialogDescription>
                      Add a resolution note. This will be visible to the user.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Describe the resolution..."
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                    rows={4}
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setResolveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleResolve}
                      disabled={
                        !resolveNote.trim() || resolveMutation.isPending
                      }
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {resolveMutation.isPending ? "Resolving..." : "Resolve"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {ticket.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{ticket.assignedTo.name}</p>
              </CardContent>
            </Card>
          )}

          {ticket.tags && ticket.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {ticket.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted rounded px-2 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
