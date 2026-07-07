import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import type { CreateRoutingRuleDto, RoutingRuleDto } from "@/lib/api/generated";
import { formatProvider } from "../lib/format";

type Provider = CreateRoutingRuleDto["custodian"];

/** Typed against the generated union so a new provider fails compile here. */
const PROVIDERS: Provider[] = ["busha", "flutterwave"];

/** Sentinel for "no override" in the Selects (Radix disallows empty values). */
const NO_OVERRIDE = "__none__";

interface RuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this rule; otherwise it creates a new one. */
  rule: RoutingRuleDto | null;
}

interface FormState {
  matchCurrency: string;
  matchCountry: string;
  matchRegion: string;
  custodian: Provider | "";
  rank: string;
  bankDirectoryProvider: string;
  accountResolutionProvider: string;
  enabled: boolean;
}

const EMPTY: FormState = {
  matchCurrency: "",
  matchCountry: "",
  matchRegion: "",
  custodian: "",
  rank: "1",
  bankDirectoryProvider: NO_OVERRIDE,
  accountResolutionProvider: NO_OVERRIDE,
  enabled: true,
};

export function RuleFormDialog({ open, onOpenChange, rule }: RuleFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (!open) return;
    setForm(
      rule
        ? {
            matchCurrency: rule.matchCurrency ?? "",
            matchCountry: rule.matchCountry ?? "",
            matchRegion: rule.matchRegion ?? "",
            custodian: rule.custodian,
            rank: String(rule.rank ?? 1),
            bankDirectoryProvider: rule.bankDirectoryProvider ?? NO_OVERRIDE,
            accountResolutionProvider:
              rule.accountResolutionProvider ?? NO_OVERRIDE,
            enabled: rule.enabled,
          }
        : EMPTY,
    );
  }, [open, rule]);

  const { mutate: createRule, isPending: isCreating } =
    api.admin.routing.create.useMutation();
  const { mutate: updateRule, isPending: isUpdating } =
    api.admin.routing.update.useMutation();
  const isSaving = isCreating || isUpdating;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.custodian) {
      toast.error("Pick a custodian provider");
      return;
    }
    const rank = Number.parseInt(form.rank, 10);
    if (!Number.isInteger(rank) || rank < 1) {
      toast.error("Rank must be a whole number of 1 or more");
      return;
    }
    const onError = (err: unknown) => {
      const message = (err as { message?: string | string[] })?.message;
      toast.error(Array.isArray(message) ? message.join("; ") : message || "Save failed");
    };
    const onSuccess = () => {
      toast.success(rule ? "Rule updated" : "Rule created");
      onOpenChange(false);
    };

    if (rule) {
      // PATCH semantics: empty string clears a match dimension or an
      // override; undefined would mean "leave unchanged".
      updateRule(
        {
          path: { id: rule._id },
          body: {
            matchCurrency: form.matchCurrency.trim(),
            matchCountry: form.matchCountry.trim(),
            matchRegion: form.matchRegion.trim(),
            custodian: form.custodian,
            rank,
            bankDirectoryProvider:
              form.bankDirectoryProvider === NO_OVERRIDE
                ? ""
                : (form.bankDirectoryProvider as Provider),
            accountResolutionProvider:
              form.accountResolutionProvider === NO_OVERRIDE
                ? ""
                : (form.accountResolutionProvider as Provider),
            enabled: form.enabled,
          },
        },
        { onSuccess, onError },
      );
    } else {
      const body: CreateRoutingRuleDto = {
        custodian: form.custodian,
        rank,
        enabled: form.enabled,
      };
      if (form.matchCurrency.trim()) body.matchCurrency = form.matchCurrency.trim();
      if (form.matchCountry.trim()) body.matchCountry = form.matchCountry.trim();
      if (form.matchRegion.trim()) body.matchRegion = form.matchRegion.trim();
      if (form.bankDirectoryProvider !== NO_OVERRIDE) {
        body.bankDirectoryProvider = form.bankDirectoryProvider as Provider;
      }
      if (form.accountResolutionProvider !== NO_OVERRIDE) {
        body.accountResolutionProvider =
          form.accountResolutionProvider as Provider;
      }
      createRule({ body }, { onSuccess, onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit routing rule" : "New routing rule"}</DialogTitle>
          <DialogDescription>
            Leave a match field blank to match any value. The most specific
            enabled rule wins; the change takes effect on save.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rr-currency">Currency</Label>
              <Input
                id="rr-currency"
                placeholder="Any"
                value={form.matchCurrency}
                onChange={(e) =>
                  set("matchCurrency", e.target.value.toUpperCase())
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rr-country">Country</Label>
              <Input
                id="rr-country"
                placeholder="Any"
                maxLength={2}
                value={form.matchCountry}
                onChange={(e) =>
                  set("matchCountry", e.target.value.toUpperCase())
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rr-region">Region</Label>
              <Input
                id="rr-region"
                placeholder="Any"
                value={form.matchRegion}
                onChange={(e) => set("matchRegion", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_6rem] gap-3">
            <div className="space-y-1.5">
              <Label>Custodian</Label>
              <Select
                value={form.custodian}
                onValueChange={(v) => set("custodian", v as Provider)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
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
              <Label htmlFor="rr-rank">Rank</Label>
              <Input
                id="rr-rank"
                type="number"
                min={1}
                value={form.rank}
                onChange={(e) => set("rank", e.target.value)}
              />
            </div>
          </div>
          <p className="text-muted-foreground -mt-2 text-xs">
            A corridor may offer several custodians — one rule each. Rank 1 is
            the default for new work; each rank appears as another numbered
            wallet for orgs on the corridor.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Bank directory</Label>
              <Select
                value={form.bankDirectoryProvider}
                onValueChange={(v) => set("bankDirectoryProvider", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_OVERRIDE}>Same as custodian</SelectItem>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {formatProvider(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Account resolution</Label>
              <Select
                value={form.accountResolutionProvider}
                onValueChange={(v) => set("accountResolutionProvider", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_OVERRIDE}>Same as custodian</SelectItem>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {formatProvider(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="rr-enabled">Enabled</Label>
              <p className="text-muted-foreground text-xs">
                Disabled rules stay in the table but the router ignores them.
              </p>
            </div>
            <Switch
              id="rr-enabled"
              checked={form.enabled}
              onCheckedChange={(v) => set("enabled", v)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {rule ? "Save changes" : "Create rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
