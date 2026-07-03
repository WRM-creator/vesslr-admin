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
import type {
  BusinessRegistrationReviewDto,
  ReviewChecklistItemDto,
} from "@/lib/api/generated";
import { useEffect, useMemo, useState } from "react";
import { ReviewerChecklist } from "./reviewer-checklist";
import {
  KYB_REVIEW_CHECKLIST,
  KYC_REVIEW_CHECKLIST,
  type ChecklistItemDefinition,
} from "./review-checklist";

/** Which verification tracks this approval covers (whatever is still pending). */
export interface ApproveScope {
  kyb: boolean;
  kyc: boolean;
}

export interface ApproveResult {
  businessRegistration?: BusinessRegistrationReviewDto;
  kybChecklist?: ReviewChecklistItemDto[];
  kycChecklist?: ReviewChecklistItemDto[];
}

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: ApproveResult) => void;
  isSubmitting: boolean;
  scope: ApproveScope;
  /** Manual corridors gate approval on a reviewer checklist per covered track. */
  manual: boolean;
  /** Heuristic + saved KYB registration classification to prefill (KYB only). */
  businessRegistrationPrefill?: BusinessRegistrationReviewDto;
}

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

function titleFor(scope: ApproveScope): string {
  if (scope.kyb && scope.kyc) return "Approve business & identity";
  if (scope.kyb) return "Approve business verification";
  return "Approve identity verification";
}

function descriptionFor(scope: ApproveScope): string {
  if (scope.kyb) {
    return "Confirm the business registration classification below. It's prefilled from the registry and used for payment-provider onboarding. Approving also registers the organization with its payment provider.";
  }
  return "Confirm this applicant's identity is verified and matches the documents on file.";
}

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
      <Label className="text-muted-foreground text-xs">{label}</Label>
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

function ChecklistBlock({
  title,
  items,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  items: ChecklistItemDefinition[];
  checked: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wide">
        {title}
      </p>
      <ReviewerChecklist
        items={items}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * Case-level approval. Covers whatever tracks are still pending in one confirm:
 * the KYB registration classification (when business is pending) plus a reviewer
 * checklist per covered track on manual corridors. Blocks until the registration
 * date is set and every shown checklist item is ticked.
 */
export function ApproveDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  scope,
  manual,
  businessRegistrationPrefill,
}: ApproveDialogProps) {
  const [form, setForm] = useState<BusinessRegistrationReviewDto | undefined>(
    businessRegistrationPrefill,
  );
  const [kybChecked, setKybChecked] = useState<Record<string, boolean>>({});
  const [kycChecked, setKycChecked] = useState<Record<string, boolean>>({});

  // Reset to the prefilled values whenever the dialog (re)opens.
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
      setKybChecked({});
      setKycChecked({});
    }
  }, [open, businessRegistrationPrefill]);

  const showKybChecklist = manual && scope.kyb;
  const showKycChecklist = manual && scope.kyc;

  const canApprove = useMemo(() => {
    const dateOk = !scope.kyb || !!form?.incorporationDate;
    const kybOk =
      !showKybChecklist || KYB_REVIEW_CHECKLIST.every((i) => kybChecked[i.key]);
    const kycOk =
      !showKycChecklist || KYC_REVIEW_CHECKLIST.every((i) => kycChecked[i.key]);
    return dateOk && kybOk && kycOk;
  }, [scope.kyb, form, showKybChecklist, showKycChecklist, kybChecked, kycChecked]);

  const handleConfirm = () => {
    onConfirm({
      businessRegistration: scope.kyb ? form : undefined,
      kybChecklist: showKybChecklist
        ? KYB_REVIEW_CHECKLIST.map((i) => ({
            key: i.key,
            label: i.label,
            passed: !!kybChecked[i.key],
          }))
        : undefined,
      kycChecklist: showKycChecklist
        ? KYC_REVIEW_CHECKLIST.map((i) => ({
            key: i.key,
            label: i.label,
            passed: !!kycChecked[i.key],
          }))
        : undefined,
    });
  };

  // The Select emits a plain string; options are constrained to valid enum values,
  // so narrow to the generated DTO field types at this boundary.
  const set = (
    patch: Partial<Record<keyof BusinessRegistrationReviewDto, string>>,
  ) =>
    setForm((prev) => ({
      ...(prev as BusinessRegistrationReviewDto),
      ...(patch as Partial<BusinessRegistrationReviewDto>),
    }));

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-h-[85vh] overflow-y-auto"
        onInteractOutside={() => onOpenChange(false)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{titleFor(scope)}</AlertDialogTitle>
          <AlertDialogDescription>
            {descriptionFor(scope)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {scope.kyb && form && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label className="text-muted-foreground text-xs">
                Incorporation date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={form.incorporationDate ?? ""}
                onChange={(e) => set({ incorporationDate: e.target.value })}
              />
              {!form.incorporationDate && (
                <span className="text-destructive text-xs">
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
                <Label className="text-muted-foreground text-xs">
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

        {(showKybChecklist || showKycChecklist) && (
          <div className="space-y-3">
            {showKybChecklist && (
              <ChecklistBlock
                title="Business review"
                items={KYB_REVIEW_CHECKLIST}
                checked={kybChecked}
                onChange={(key, value) =>
                  setKybChecked((prev) => ({ ...prev, [key]: value }))
                }
                disabled={isSubmitting}
              />
            )}
            {showKycChecklist && (
              <ChecklistBlock
                title="Identity review"
                items={KYC_REVIEW_CHECKLIST}
                checked={kycChecked}
                onChange={(key, value) =>
                  setKycChecked((prev) => ({ ...prev, [key]: value }))
                }
                disabled={isSubmitting}
              />
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting || !canApprove}
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
