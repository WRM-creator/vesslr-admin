import { Thumbnail } from "@/components/shared/thumbnail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import type { CategoryGroupDto } from "@/lib/api/generated/types.gen";
import {
  MEASUREMENT_TYPES,
  MEASUREMENT_TYPE_LABELS,
  UNITS,
  unitsByCategory,
  type MeasurementType,
} from "@/types/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  categoryFormSchema,
  defaultCategoryFormValues,
  DOCUMENT_TYPES,
  DOCUMENT_REQUIRED_FROM,
  RISK_LEVELS,
  ESCROW_STRUCTURES,
  type CategoryFormSchema,
} from "./schema";

// ── Display label maps ──────────────────────────────────────

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  INVOICE: "Invoice",
  PACKING_LIST: "Packing List",
  CERTIFICATE_OF_ORIGIN: "Certificate of Origin",
  SAFETY_DATA_SHEET: "Safety Data Sheet",
  BILL_OF_LADING: "Bill of Lading",
  CONTRACT: "Contract",
  INSPECTION_CERTIFICATE: "Inspection Certificate",
  OTHER: "Other",
};

const REQUIRED_FROM_LABELS: Record<string, string> = {
  BUYER: "Buyer",
  SELLER: "Seller",
};

const RISK_LEVEL_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

// ── Main Form ───────────────────────────────────────────────

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormSchema>;
  onSubmit?: (data: CategoryFormSchema) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  parentGroup?: CategoryGroupDto;
}

export function CategoryForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Create Category",
  loadingLabel = "Creating...",
  parentGroup,
}: CategoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialValues?.image || null,
  );
  const { uploadFiles, isUploading } = useFileUpload();

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { ...defaultCategoryFormValues, ...initialValues },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requiredDocuments",
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultCategoryFormValues, ...initialValues });
      setImageUrl(initialValues.image || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [uploaded] = await uploadFiles([file]);
      setImageUrl(uploaded.url);
    } catch {
      toast.error("Failed to upload image");
    }
  }

  function handleRemoveImage() {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (data: CategoryFormSchema) => {
    onSubmit?.({ ...data, image: imageUrl || undefined });
  };

  const isBusy = isLoading || isUploading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-3xl space-y-6"
      >
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Image */}
            <div className="space-y-2">
              <FormLabel>Category Image</FormLabel>
              <div className="flex items-center gap-4">
                <Thumbnail src={imageUrl} className="size-16" />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading
                      ? "Uploading..."
                      : imageUrl
                        ? "Change image"
                        : "Add image"}
                  </Button>
                  {imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="mr-1 size-3" />
                      Remove
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for this category (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of what this category represents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Allowed Units */}
        <FormField
          control={form.control}
          name="allowedUnits"
          render={({ field }) => (
            <Card>
              <CardHeader>
                <CardTitle>Allowed Units</CardTitle>
                <CardDescription>
                  Select which units are available for listings in this category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {MEASUREMENT_TYPES.map((cat) => (
                    <UnitCategoryGroup
                      key={cat}
                      category={cat}
                      selectedUnits={field.value ?? []}
                      onToggleUnit={(unit) => {
                        const current = field.value ?? [];
                        field.onChange(
                          current.includes(unit)
                            ? current.filter((u) => u !== unit)
                            : [...current, unit],
                        );
                      }}
                      onToggleCategory={(units, allSelected) => {
                        const current = field.value ?? [];
                        if (allSelected) {
                          field.onChange(
                            current.filter((u) => !units.includes(u)),
                          );
                        } else {
                          const merged = new Set([...current, ...units]);
                          field.onChange([...merged]);
                        }
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </CardContent>
            </Card>
          )}
        />

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>
              Define which documents are required for transactions in this
              category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No document requirements configured. Add one below.
              </p>
            )}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">
                    Document {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`requiredDocuments.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DOCUMENT_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {DOCUMENT_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`requiredDocuments.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Commercial Invoice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`requiredDocuments.${index}.requiredFrom`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required From</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select party" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DOCUMENT_REQUIRED_FROM.map((v) => (
                              <SelectItem key={v} value={v}>
                                {REQUIRED_FROM_LABELS[v]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`requiredDocuments.${index}.isMandatory`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 pt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Mandatory</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  type: "INVOICE",
                  name: "",
                  requiredFrom: "SELLER",
                  isMandatory: true,
                })
              }
            >
              <Plus className="mr-1 size-4" />
              Add Document Requirement
            </Button>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
            <CardDescription>
              Set compliance flags and risk level for this category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="compliance.isHazardous"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-base">Hazardous</Label>
                    <span className="text-muted-foreground text-sm">
                      Products in this category are classified as hazardous
                      materials.
                    </span>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="compliance.isRegulated"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-base">Regulated</Label>
                    <span className="text-muted-foreground text-sm">
                      Products in this category are subject to regulatory
                      requirements.
                    </span>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="compliance.riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Level</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RISK_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {RISK_LEVEL_LABELS[level]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Policy Overrides */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Overrides</CardTitle>
            <CardDescription>
              Optionally override group-level policies for this specific
              category. Leave as "Inherit" to use the group default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PolicyOverrideField
              form={form}
              name="policyOverrides.requiresLogistics"
              label="Requires Logistics"
              description="Whether products require shipping and logistics coordination."
              groupValue={parentGroup?.requiresLogistics}
            />
            <Separator />
            <PolicyOverrideField
              form={form}
              name="policyOverrides.allowsInspection"
              label="Allows Inspection"
              description="Whether products can be inspected before delivery."
              groupValue={parentGroup?.allowsInspection}
            />
            <Separator />
            <PolicyOverrideField
              form={form}
              name="policyOverrides.milestoneDelivery"
              label="Milestone-Based Delivery"
              description="Whether services can be delivered in milestones."
              groupValue={parentGroup?.milestoneDelivery}
            />
            <Separator />
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <Label className="text-base">Escrow Structure Override</Label>
                <span className="text-muted-foreground text-sm">
                  Override the allowed escrow structures for this category.
                  {parentGroup && (
                    <> Group default: {((parentGroup as Record<string, unknown>).allowedEscrowStructures as string[])?.join(", ") || "full"}</>
                  )}
                </span>
              </div>
              <FormField
                control={form.control}
                name="policyOverrides.allowedEscrowStructures"
                render={({ field }) => {
                  const value = field.value ?? null;
                  const isOverridden = value !== null;
                  return (
                    <div className="space-y-2">
                      <Select
                        value={isOverridden ? "override" : "inherit"}
                        onValueChange={(v) => {
                          if (v === "inherit") {
                            field.onChange(null);
                            form.setValue(
                              "policyOverrides.defaultEscrowStructure",
                              null,
                            );
                          } else {
                            field.onChange(["full"]);
                          }
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inherit">
                            Inherit from group
                          </SelectItem>
                          <SelectItem value="override">Override</SelectItem>
                        </SelectContent>
                      </Select>
                      {isOverridden && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {ESCROW_STRUCTURES.map((structure) => {
                              const selected = (value as string[]).includes(
                                structure,
                              );
                              return (
                                <button
                                  key={structure}
                                  type="button"
                                  className={cn(
                                    "rounded-full border px-3 py-1 text-sm font-medium capitalize transition-colors",
                                    selected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background text-muted-foreground hover:bg-accent",
                                  )}
                                  onClick={() => {
                                    const next = selected
                                      ? (value as string[]).filter(
                                          (s) => s !== structure,
                                        )
                                      : [...(value as string[]), structure];
                                    if (next.length === 0) return;
                                    field.onChange(next);
                                  }}
                                >
                                  {structure}
                                </button>
                              );
                            })}
                          </div>
                          <FormField
                            control={form.control}
                            name="policyOverrides.defaultEscrowStructure"
                            render={({ field: defaultField }) => (
                              <FormItem>
                                <FormLabel>Default Structure</FormLabel>
                                <Select
                                  value={defaultField.value ?? "full"}
                                  onValueChange={defaultField.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-48">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {(value as string[]).map((s) => (
                                      <SelectItem
                                        key={s}
                                        value={s}
                                        className="capitalize"
                                      >
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isBusy || !form.formState.isDirty}
          >
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ── Policy Override Field (tri-state) ───────────────────────

function PolicyOverrideField({
  form,
  name,
  label,
  description,
  groupValue,
}: {
  form: ReturnType<typeof useForm<CategoryFormSchema>>;
  name:
    | "policyOverrides.requiresLogistics"
    | "policyOverrides.allowsInspection"
    | "policyOverrides.milestoneDelivery";
  label: string;
  description: string;
  groupValue?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const current = field.value as boolean | null | undefined;
        const selectValue =
          current === null || current === undefined
            ? "inherit"
            : current
              ? "yes"
              : "no";
        return (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col space-y-1">
              <Label className="text-base">{label}</Label>
              <span className="text-muted-foreground text-sm">
                {description}
                {groupValue !== undefined && (
                  <> (Group default: {groupValue ? "Yes" : "No"})</>
                )}
              </span>
            </div>
            <Select
              value={selectValue}
              onValueChange={(v) => {
                if (v === "inherit") field.onChange(null);
                else if (v === "yes") field.onChange(true);
                else field.onChange(false);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">Inherit</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }}
    />
  );
}

// ── Collapsible unit category group ──────────────────────────

interface UnitCategoryGroupProps {
  category: MeasurementType;
  selectedUnits: string[];
  onToggleUnit: (unit: string) => void;
  onToggleCategory: (units: string[], allSelected: boolean) => void;
}

function UnitCategoryGroup({
  category,
  selectedUnits,
  onToggleUnit,
  onToggleCategory,
}: UnitCategoryGroupProps) {
  const units = unitsByCategory(category);
  const selectedCount = units.filter((u) => selectedUnits.includes(u)).length;
  const allSelected = selectedCount === units.length;
  const someSelected = selectedCount > 0 && !allSelected;

  // Auto-expand categories that have selections
  const [open, setOpen] = useState(selectedCount > 0);

  // Sync open state when initialValues load
  useEffect(() => {
    if (selectedCount > 0) setOpen(true);
  }, [selectedCount]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "rounded-lg border transition-colors",
          selectedCount > 0
            ? "border-primary/30 bg-primary/[0.02]"
            : "border-border",
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3"
          >
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={() => {
                onToggleCategory(units, allSelected);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="flex-1 text-left text-sm font-medium">
              {MEASUREMENT_TYPE_LABELS[category]}
            </span>
            <span className="text-muted-foreground text-xs">
              {selectedCount} of {units.length}
            </span>
            <ChevronDown
              className={cn(
                "text-muted-foreground size-4 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-4 py-2">
            <div className="space-y-1">
              {units.map((unit) => {
                const meta = UNITS[unit];
                const isSelected = selectedUnits.includes(unit);

                return (
                  <label
                    key={unit}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleUnit(unit)}
                    />
                    <span className="text-sm">
                      {meta?.label ?? unit}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({meta?.short ?? unit})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
