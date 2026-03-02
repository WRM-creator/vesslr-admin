import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, ChevronDown, Settings2, Undo2 } from "lucide-react";

type ActionKey = "RELEASE" | "REFUND" | "ESCALATE" | "CUSTOM";

interface DisputeActionMenuProps {
  onSelect: (action: ActionKey) => void;
}

export function DisputeActionMenu({ onSelect }: DisputeActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Take Action
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        <DropdownMenuItem
          onClick={() => onSelect("RELEASE")}
          className="flex-col items-start gap-0.5"
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Resolve {"&"} Resume Transaction
          </div>
          <p className="text-muted-foreground pl-6 text-xs">
            Proceed with the transaction.
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSelect("REFUND")}
          className="flex-col items-start gap-0.5"
        >
          <div className="flex items-center gap-2 font-medium">
            <Undo2 className="h-4 w-4" />
            Cancel & Refund Buyer
          </div>
          <p className="text-muted-foreground pl-6 text-xs">
            Dispute ruled in buyer's favour — return full amount
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onSelect("CUSTOM")}
          className="flex-col items-start gap-0.5"
        >
          <div className="flex items-center gap-2 font-medium">
            <Settings2 className="h-4 w-4" />
            Custom Resolution
          </div>
          <p className="text-muted-foreground pl-6 text-xs">
            Partial refund with proceed or cancel
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
