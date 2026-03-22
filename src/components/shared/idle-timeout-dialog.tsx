import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IdleTimeoutDialogProps {
  open: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function IdleTimeoutDialog({
  open,
  remainingSeconds,
  onStayLoggedIn,
  onLogout,
}: IdleTimeoutDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Session timeout warning</DialogTitle>
          <DialogDescription>
            You've been inactive for a while. Your session will expire in{" "}
            <span className="font-semibold text-foreground">
              {formatCountdown(remainingSeconds)}
            </span>
            . Would you like to stay logged in?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onLogout}>
            Log out
          </Button>
          <Button onClick={onStayLoggedIn}>Stay logged in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
