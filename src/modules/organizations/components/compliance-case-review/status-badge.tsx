import { Badge } from "@/components/ui/badge";

function statusLabel(status: string) {
  if (status === "pending_review") return "Pending Review";
  if (status === "approved") return "Approved";
  if (status === "action_required") return "Action Required";
  return status;
}

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "approved"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : status === "action_required"
        ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
        : "bg-blue-100 text-blue-700 hover:bg-blue-100";
  return <Badge className={variant}>{statusLabel(status)}</Badge>;
}
