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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { BusinessRegistrationReviewDto } from "@/lib/api/generated";
import { useEffect, useState } from "react";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (businessRegistration?: BusinessRegistrationReviewDto) => void;
  isSubmitting: boolean;
  reviewType: "KYB" | "KYC";
  /** Heuristic + saved KYB registration classification to prefill (KYB only). */
  businessRegistrationPrefill?: BusinessRegistrationReviewDto;
}

const APPROVE_COPY = {
  KYB: {
    title: "Approve Business Verification",
    description:
      "Confirm the business registration classification below — it's prefilled from the registry and used for payment-provider onboarding.",
  },
  KYC: {
    title: "Approve Identity Verification",
    description:
      "Are you sure you want to approve this user's identity verification?",
  },
};

const STRUCTURE_OPTIONS = [
  { value: "limited_liability_company", label: "Limited Liability Company" },
  { value: "public_limited_company", label: "Public Limited Company" },
  {
    value: "limited_liability_partnership",
    label: "Limited Liability Partnership",
  },
  {
    value: "registered_business_name",
    label: "Registered Business Name (sole proprietor)",
  },
  { value: "other", label: "Other" },
];

const REGULATION_OPTIONS = [
  { value: "unregulated", label: "Unregulated" },
  { value: "regulated", label: "Regulated" },
];

const GROUP_OPTIONS = [
  { value: "standalone_company", label: "Standalone Company" },
  { value: "subsidiary", label: "Subsidiary" },
  { value: "holding_company", label: "Holding Company" },
];

const LISTING_OPTIONS = [
  { value: "not_listed_on_exchange", label: "Not Listed on Exchange" },
  { value: "listed_on_exchange", label: "Listed on Exchange" },
  { value: "owned_by_listed_company", label: "Owned by Listed Company" },
];

type Options = { value: string; label: string }[];

/** Coerce a registry date (often an ISO timestamp) to a date-input value. */
const toDateInputValue = (s?: string) =>
  s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : "";

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: Options;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ApproveDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  reviewType,
  businessRegistrationPrefill,
}: ApproveDialogProps) {
  const copy = APPROVE_COPY[reviewType];
  const [form, setForm] = useState<BusinessRegistrationReviewDto | undefined>(
    businessRegistrationPrefill,
  );

  // Reset the form to the prefilled values whenever the dialog (re)opens. The
  // registry incorporation date is often an ISO timestamp — coerce to YYYY-MM-DD.
  useEffect(() => {
    if (open) {
      setForm(
        businessRegistrationPrefill
          ? {
              ...businessRegistrationPrefill,
              incorporationDate: toDateInputValue(
                businessRegistrationPrefill.incorporationDate,
              ),
            }
          : undefined,
      );
    }
  }, [open, businessRegistrationPrefill]);

  const isKyb = reviewType === "KYB";
  // Incorporation date is required by the payment provider; block KYB approval
  // until it's set (it has no other capture point if the registry lookup missed it).
  const canApprove = !isKyb || !!form?.incorporationDate;
  // The Select emits a plain string; options are constrained to valid enum values,
  // so narrow to the generated DTO field types at this boundary.
  const set = (patch: Partial<Record<keyof BusinessRegistrationReviewDto, string>>) =>
    setForm((prev) => ({
      ...(prev as BusinessRegistrationReviewDto),
      ...(patch as Partial<BusinessRegistrationReviewDto>),
    }));

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onInteractOutside={() => onOpenChange(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.description}</AlertDialogDescription>
        </AlertDialogHeader>

        {isKyb && form && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">
                Incorporation date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={form.incorporationDate ?? ""}
                onChange={(e) => set({ incorporationDate: e.target.value })}
              />
              {!form.incorporationDate && (
                <span className="text-xs text-destructive">
                  Required for payment onboarding (not found in the registry).
                </span>
              )}
            </div>
            <Field
              label="Business structure"
              value={form.businessStructure}
              options={STRUCTURE_OPTIONS}
              onChange={(v) => set({ businessStructure: v })}
            />
            <Field
              label="Regulation status"
              value={form.regulationStatus}
              options={REGULATION_OPTIONS}
              onChange={(v) =>
                set({
                  regulationStatus: v,
                  ...(v !== "regulated" ? { licenseNumber: undefined } : {}),
                })
              }
            />
            <Field
              label="Corporate group"
              value={form.corporateGroupStatus}
              options={GROUP_OPTIONS}
              onChange={(v) => set({ corporateGroupStatus: v })}
            />
            <Field
              label="Exchange listing"
              value={form.exchangeListingStatus}
              options={LISTING_OPTIONS}
              onChange={(v) => set({ exchangeListingStatus: v })}
            />
            {form.regulationStatus === "regulated" && (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  License number
                </Label>
                <Input
                  value={form.licenseNumber ?? ""}
                  onChange={(e) => set({ licenseNumber: e.target.value })}
                  placeholder="Regulatory license number"
                />
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(isKyb ? form : undefined)}
            disabled={isSubmitting || !canApprove}
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
