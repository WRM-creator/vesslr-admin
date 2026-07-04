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
import { api } from "@/lib/api";
import type { AdminBenchmarkDto, CreateBenchmarkDto } from "@/lib/api/generated";

type BenchmarkCurrency = CreateBenchmarkDto["benchmarkCurrency"];
type BenchmarkUnit = CreateBenchmarkDto["defaultUnit"];

/** Typed against the generated unions so enum drift fails compile here. */
const CURRENCIES: BenchmarkCurrency[] = ["USD", "EUR", "NGN", "KES", "USDT"];
/** Only the units that make sense as commodity benchmark quote units. */
const UNITS: BenchmarkUnit[] = [
  "bbl",
  "liter",
  "gallon",
  "m3",
  "mt",
  "kg",
  "ton",
  "lb",
  "scf",
  "sm3",
  "nm3",
  "mmbtu",
  "kwh",
  "mwh",
];

interface BenchmarkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this benchmark; otherwise it creates one. */
  benchmark: AdminBenchmarkDto | null;
}

interface FormState {
  code: string;
  name: string;
  benchmarkCurrency: BenchmarkCurrency | "";
  defaultUnit: BenchmarkUnit | "";
}

const EMPTY: FormState = {
  code: "",
  name: "",
  benchmarkCurrency: "",
  defaultUnit: "",
};

export function BenchmarkFormDialog({
  open,
  onOpenChange,
  benchmark,
}: BenchmarkFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const isReferenced = (benchmark?.usageCount ?? 0) > 0;

  useEffect(() => {
    if (!open) return;
    setForm(
      benchmark
        ? {
            code: benchmark.code,
            name: benchmark.name,
            benchmarkCurrency: benchmark.benchmarkCurrency,
            defaultUnit: benchmark.defaultUnit,
          }
        : EMPTY,
    );
  }, [open, benchmark]);

  const { mutate: createBenchmark, isPending: isCreating } =
    api.admin.benchmarks.create.useMutation();
  const { mutate: updateBenchmark, isPending: isUpdating } =
    api.admin.benchmarks.update.useMutation();
  const isSaving = isCreating || isUpdating;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Code and name are required");
      return;
    }
    if (!form.benchmarkCurrency || !form.defaultUnit) {
      toast.error("Pick a currency and a quote unit");
      return;
    }
    const onError = (err: unknown) => {
      const message = (err as { message?: string | string[] })?.message;
      toast.error(
        Array.isArray(message) ? message.join("; ") : message || "Save failed",
      );
    };
    const onSuccess = () => {
      toast.success(benchmark ? "Benchmark updated" : "Benchmark created");
      onOpenChange(false);
    };

    if (benchmark) {
      updateBenchmark(
        {
          path: { id: benchmark._id },
          body: {
            name: form.name.trim(),
            // Frozen fields are sent only while unreferenced; the backend
            // rejects them otherwise, so the UI does not offer the edit.
            ...(isReferenced
              ? {}
              : {
                  code: form.code.trim(),
                  benchmarkCurrency: form.benchmarkCurrency,
                  defaultUnit: form.defaultUnit,
                }),
          },
        },
        { onSuccess, onError },
      );
    } else {
      createBenchmark(
        {
          body: {
            code: form.code.trim(),
            name: form.name.trim(),
            benchmarkCurrency: form.benchmarkCurrency,
            defaultUnit: form.defaultUnit,
          },
        },
        { onSuccess, onError },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {benchmark ? "Edit benchmark" : "New benchmark"}
          </DialogTitle>
          <DialogDescription>
            {isReferenced
              ? "This benchmark is referenced by existing deals: its code, currency, and unit are frozen. Only the display name can change."
              : "A differential deal settles in the benchmark's currency, quoted per its unit."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bm-code">Code</Label>
              <Input
                id="bm-code"
                placeholder="DATED_BRENT"
                value={form.code}
                disabled={isReferenced}
                onChange={(e) =>
                  set("code", e.target.value.toUpperCase().replace(/\s+/g, "_"))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bm-name">Name</Label>
              <Input
                id="bm-name"
                placeholder="Dated Brent"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Quote currency</Label>
              <Select
                value={form.benchmarkCurrency}
                disabled={isReferenced}
                onValueChange={(v) =>
                  set("benchmarkCurrency", v as BenchmarkCurrency)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quote unit</Label>
              <Select
                value={form.defaultUnit}
                disabled={isReferenced}
                onValueChange={(v) => set("defaultUnit", v as BenchmarkUnit)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {benchmark ? "Save changes" : "Create benchmark"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
