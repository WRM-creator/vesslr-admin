import { PageLoader } from "@/components/shared/page-loader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { NegotiationThread } from "./negotiation-thread";

interface AdminNegotiationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  negotiationId?: string;
}

export function AdminNegotiationSheet({
  open,
  onOpenChange,
  negotiationId,
}: AdminNegotiationSheetProps) {
  const { data: negotiationWrapper, isLoading } =
    api.admin.negotiations.detail.useQuery(
      { path: { id: negotiationId! } },
      { enabled: !!negotiationId },
    );

  const negotiation = (negotiationWrapper as any)?.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg lg:max-w-xl">
        <SheetHeader className="flex-row items-center justify-between border-b px-6 py-4">
          <SheetTitle className="text-lg">Negotiation Details</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col overflow-hidden">
          {isLoading ? (
            <PageLoader />
          ) : !negotiation ? (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              Negotiation not found
            </div>
          ) : (
            <NegotiationThread negotiation={negotiation} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
