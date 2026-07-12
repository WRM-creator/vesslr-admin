import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { CreateProviderDrainDto, ProviderDrainDto } from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { PlusIcon } from "lucide-react";
import { DRAIN_STATUS, errorMessage, formatProvider } from "../lib/format";

type Provider = CreateProviderDrainDto["provider"];

/** Typed against the generated union so a new provider fails compile here. */
const PROVIDERS: Provider[] = ["busha", "flutterwave", "mock", "mock_b"];

/**
 * Provider drains: one row per decommissioning, newest first. A drain moves
 * every org's balances off a provider (fees platform-paid), retires the
 * wallets org by org, and records what it cost. The detail page runs it.
 */
export default function ProviderDrainListPage() {
  const { data, isLoading } = api.admin.providerDrain.list.useQuery({});
  const drains = data?.data ?? [];
  const [creating, setCreating] = useState(false);

  return (
    <Page>
      <PageHeader
        title="Provider Drain"
        description="Decommission a payment provider: freeze intake, check coverage and cost, sweep balances to surviving wallets, retire."
        endContent={
          <Button size="sm" onClick={() => setCreating(true)}>
            <PlusIcon className="size-4" />
            New drain
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : drains.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
          No drains yet. A drain starts as a draft; nothing changes until you
          freeze intake.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Needs attention</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drains.map((drain) => (
              <DrainRow key={drain.id} drain={drain} />
            ))}
          </TableBody>
        </Table>
      )}

      <CreateDrainDialog open={creating} onOpenChange={setCreating} />
    </Page>
  );
}

function DrainRow({ drain }: { drain: ProviderDrainDto }) {
  const c = drain.itemCounts;
  const total =
    c.blocked + c.pending + c.transferring + c.compensating + c.done + c.failed + c.stuck;
  const attention = c.blocked + c.failed + c.stuck;
  const status = DRAIN_STATUS[drain.status];

  return (
    <TableRow className="relative">
      <TableCell className="font-medium">
        <Link
          to={`/provider-drain/${drain.id}`}
          className="hover:underline after:absolute after:inset-0"
        >
          {formatProvider(drain.provider)}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-medium", status.tint)}>
          {status.label}
        </Badge>
      </TableCell>
      <TableCell className="text-sm tabular-nums">
        {total === 0 ? (
          <span className="text-muted-foreground">Not scanned</span>
        ) : (
          `${c.done} / ${total} done`
        )}
      </TableCell>
      <TableCell className="text-sm">
        {attention > 0 ? (
          <span className="text-destructive font-medium tabular-nums">
            {attention}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDistanceToNowStrict(new Date(drain.createdAt), {
          addSuffix: true,
        })}
      </TableCell>
    </TableRow>
  );
}

function CreateDrainDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | "">("");
  const [pace, setPace] = useState("10");
  const { mutate: createDrain, isPending } =
    api.admin.providerDrain.create.useMutation();

  const paceNumber = Number(pace);
  const paceValid =
    Number.isInteger(paceNumber) && paceNumber >= 1 && paceNumber <= 100;

  const submit = () => {
    if (!provider) return;
    createDrain(
      { body: { provider, pacePerTick: paceNumber } },
      {
        onSuccess: (res) => {
          toast.success(`Drain created for ${formatProvider(provider)}`);
          onOpenChange(false);
          setProvider("");
          if (res?.data?.id) navigate(`/provider-drain/${res.data.id}`);
        },
        onError: (err) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New provider drain</DialogTitle>
          <DialogDescription>
            Creates a draft. Nothing changes until you freeze intake from the
            drain page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Provider</Label>
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as Provider)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select the provider to drain" />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {formatProvider(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="drain-pace">Sweep pace (items per minute)</Label>
            <Input
              id="drain-pace"
              type="number"
              min={1}
              max={100}
              value={pace}
              onChange={(e) => setPace(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Transfers started per minute tick. Keep it conservative against
              the provider's rate limits.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!provider || !paceValid || isPending} onClick={submit}>
            Create drain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
